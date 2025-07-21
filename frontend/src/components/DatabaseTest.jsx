import { useState } from 'react';
import { supabase } from '../lib/supabase';

const DatabaseTest = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      // Test basic connection by checking auth session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        setResult({ success: false, message: `Auth error: ${error.message}` });
        return;
      }

      // Test database connection with a simple query that doesn't require auth
      const { error: dbError } = await supabase
        .from('users')
        .select('id')
        .limit(0); // This will test the connection without returning data

      if (dbError) {
        // If it's an RLS error, that actually means the connection is working
        if (dbError.code === 'PGRST301' || dbError.message.includes('row-level security')) {
          setResult({ 
            success: true, 
            message: 'Database connection successful! (RLS is working correctly)' 
          });
        } else {
          setResult({ success: false, message: `Database error: ${dbError.message}` });
        }
      } else {
        setResult({ success: true, message: 'Database connection successful!' });
      }

      // If user is logged in, test authenticated query
      if (session?.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('username')
          .eq('id', session.user.id)
          .single();

        if (!userError && userData) {
          setResult({ 
            success: true, 
            message: `Database connection successful! Logged in as: ${userData.username}` 
          });
        }
      }
    } catch (error) {
      setResult({ success: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-800 border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Database Connection Test</h3>
      
      <button
        onClick={testConnection}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Database Connection'}
      </button>

      {result && (
        <div className={`mt-4 p-3 rounded-lg ${
          result.success 
            ? 'bg-green-900/50 text-green-200 border border-green-700' 
            : 'bg-red-900/50 text-red-200 border border-red-700'
        }`}>
          <p className="font-medium">
            {result.success ? '✅ Success' : '❌ Error'}
          </p>
          <p className="text-sm mt-1">{result.message}</p>
        </div>
      )}
    </div>
  );
};

export default DatabaseTest;
