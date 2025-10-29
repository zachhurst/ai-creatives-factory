import { useState } from 'react';
import { testGroqConnection } from '../services/groqService';
import { testFalConnection } from '../services/falService';
import { validateApiKeys } from '../utils/helpers';

export function ApiTest() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    
    const apiKeyValidation = validateApiKeys();
    const groqTest = await testGroqConnection();
    const falTest = await testFalConnection();
    
    setResults({
      apiKeys: apiKeyValidation,
      groq: groqTest,
      fal: falTest
    });
    
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">API Connection Test</h2>
      <button
        onClick={runTests}
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
      >
        {loading ? 'Testing...' : 'Run API Tests'}
      </button>
      
      {results && (
        <div className="mt-6 space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">API Keys Status</h3>
            <p className={results.apiKeys.isValid ? 'text-green-600' : 'text-red-600'}>
              {results.apiKeys.isValid ? '✅ Valid' : '❌ Invalid'}
            </p>
            {results.apiKeys.errors.length > 0 && (
              <ul className="text-red-600 text-sm mt-2">
                {results.apiKeys.errors.map((err, i) => <li key={i}>• {err}</li>)}
              </ul>
            )}
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Groq API</h3>
            <p className={results.groq.success ? 'text-green-600' : 'text-red-600'}>
              {results.groq.success ? '✅ Connected' : '❌ Failed'}
            </p>
            {!results.groq.success && (
              <p className="text-red-600 text-sm mt-1">{results.groq.error}</p>
            )}
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Fal.ai API</h3>
            <p className={results.fal.success ? 'text-green-600' : 'text-red-600'}>
              {results.fal.success ? '✅ Connected' : '❌ Failed'}
            </p>
            {!results.fal.success && (
              <p className="text-red-600 text-sm mt-1">{results.fal.error}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
