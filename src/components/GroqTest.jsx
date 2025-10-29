import { useState } from 'react';
import { TestTube, Play } from 'lucide-react';
import { testGroqConnection } from '../services/groqService';

export function GroqTest() {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      console.log('🧪 GROQ TEST: Starting test...');
      const result = await testGroqConnection();
      console.log('🧪 GROQ TEST: Result:', result);
      setTestResult(result);
    } catch (error) {
      console.log('🧪 GROQ TEST: Error:', error);
      setTestResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <TestTube size={24} />Groq Connection Test
        </h2>
        <button
          onClick={runTest}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
        >
          <Play size={16} />
          {loading ? 'Testing...' : 'Test Groq'}
        </button>
      </div>
      
      {testResult && (
        <div className={`mt-4 p-4 rounded-lg ${
          testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <h3 className={`font-medium mb-2 ${
            testResult.success ? 'text-green-900' : 'text-red-900'
          }`}>
            {testResult.success ? '✅ Connection Successful' : '❌ Connection Failed'}
          </h3>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        Check the browser console for detailed debug logs.
      </div>
    </div>
  );
}
