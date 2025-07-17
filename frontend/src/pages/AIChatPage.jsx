import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// System prompt to guide the AI's behavior
const systemPrompt = `You are CodeChan AI, a technical assistant. Focus on coding and technical questions only.
- Keep responses short and technical (1-2 sentences max)
- No general chit-chat or personal questions
- Answer only programming/tech questions
- If asked off-topic, respond with: "I'm here to help with coding questions. What do you need help with?"
- For code, show only what's needed`;

const AIChatPage = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm your AI assistant. How can I help you today?", 
      sender: 'ai',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const keepAliveIntervalRef = useRef(null);

  // Keep-alive function to prevent shutdown
  const sendKeepAlive = async () => {
    try {
      await fetch(OPENROUTER_API_URL, {
        method: 'OPTIONS', // Lightweight request
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        }
      });
    } catch (err) {
      console.log('Keep-alive ping failed (normal if not using websockets)');
    }
  };

  // Set up keep-alive interval when component mounts
  useEffect(() => {
    // Ping every 6 hours (21600000 ms) to maintain connection
    keepAliveIntervalRef.current = setInterval(sendKeepAlive, 21600000);
    
    return () => {
      // Clean up interval on unmount
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    // Focus input when messages change
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInput = input.trim();
    if (!userInput || isLoading) return;
    
    setError(null);

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: userInput,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      if (!import.meta.env.VITE_OPENROUTER_API_KEY) {
        throw new Error('OpenRouter API key is not configured. Please add VITE_OPENROUTER_API_KEY to your .env file.');
      }

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.href,
          'X-Title': 'CodeChan AI'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1-0528:free',
          messages: [
            { role: 'system', content: systemPrompt },
            ...updatedMessages.slice(-6).map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            }))
          ],
          temperature: 0.7,
          max_tokens: 1000,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || 
          `API request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from API');
      }
      
      const aiResponse = data.choices[0].message;

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: aiResponse.content,
          sender: 'ai',
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (err) {
      console.error('Error getting AI response:', err);
      setError(err.message || 'Failed to get response from AI');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "San Francisco", sans-serif', paddingTop: '0' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: '#610094' }}>
          CodeChan AI Assistant
        </h1>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 rounded-lg text-sm" style={{ backgroundColor: '#3F0071', borderColor: '#610094' }}>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        <div className="rounded-xl shadow-xl overflow-hidden flex flex-col" style={{ 
          height: '80vh',
          backgroundColor: '#150050',
          border: '1px solid #3F0071'
        }}>
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs sm:max-w-md md:max-w-lg rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'rounded-br-none'
                      : 'rounded-bl-none'
                  }`}
                  style={{
                    backgroundColor: message.sender === 'user' ? '#3F0071' : '#610094'
                  }}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs opacity-60 text-right mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-none px-4 py-2" style={{ backgroundColor: '#610094' }}>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ 
                      backgroundColor: '#FFFFFF', 
                      animationDelay: '0ms' 
                    }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ 
                      backgroundColor: '#FFFFFF', 
                      animationDelay: '150ms' 
                    }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ 
                      backgroundColor: '#FFFFFF', 
                      animationDelay: '300ms' 
                    }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-4" style={{ borderTop: '1px solid #3F0071' }}>
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about coding..."
                className="flex-1 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-70"
                style={{
                  backgroundColor: '#150050',
                  border: '1px solid #3F0071',
                  color: 'white'
                }}
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
                style={{
                  backgroundColor: '#3F0071',
                  ':hover': {
                    backgroundColor: '#610094'
                  }
                }}
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 transform rotate-90 -ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                )}
                <span className="ml-1">{isLoading ? 'Sending...' : 'Send'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;
