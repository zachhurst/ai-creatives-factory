import { useState } from 'react';
import { generateMultipleImagesWithReference } from '../services/falService';
import { ImageGenerationProgress } from '../utils/imageGeneration';

export function ParallelGenerationTest() {
  const [testProgress, setTestProgress] = useState(null);
  const [testResults, setTestResults] = useState([]);

  const runParallelTest = async () => {
    const prompts = [
      'A red apple on a wooden table',
      'A blue car driving on a highway', 
      'A green tree in a sunny park',
      'A yellow flower in a garden',
      'A purple sunset over mountains'
    ];

    const progress = new ImageGenerationProgress(prompts.length);
    setTestProgress(progress);

    const onProgress = (index, status, data) => {
      progress.updateImage(index, status, { 
        prompt: prompts[index],
        url: data,
        error: data 
      });
      setTestProgress({ ...progress });
    };

    try {
      const results = await generateMultipleImagesWithReference(
        prompts, 
        [], 
        { aspectRatio: '1:1' },
        onProgress
      );
      
      setTestResults(results);
    } catch (error) {
      console.error('Test failed:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Parallel Generation Test</h3>
      
      <button 
        onClick={runParallelTest}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Test Parallel Generation
      </button>

      {testProgress && (
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">
            Progress: {testProgress.getProgress().percentage}%
          </div>
          <div className="space-y-2">
            {testProgress.images.map((img, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="w-20">Image {index + 1}:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  img.status === 'success' ? 'bg-green-100 text-green-800' :
                  img.status === 'error' ? 'bg-red-100 text-red-800' :
                  img.status === 'generating' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {img.status}
                </span>
                {img.url && (
                  <img src={img.url} className="w-8 h-8 object-cover rounded" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {testResults.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h4 className="font-medium mb-2">Results:</h4>
          <div className="text-sm text-gray-700">
            <p>Successful: {testResults.filter(r => r.success).length}/{testResults.length}</p>
            <p>Failed: {testResults.filter(r => !r.success).length}</p>
          </div>
        </div>
      )}
    </div>
  );
}
