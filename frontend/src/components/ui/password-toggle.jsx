import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function PasswordToggle({ showPassword, setShowPassword }) {
  return (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
    >
      {showPassword ? (
        <EyeOff className="w-5 h-5" />
      ) : (
        <Eye className="w-5 h-5" />
      )}
    </button>
  );
}
