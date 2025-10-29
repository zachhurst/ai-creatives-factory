import { useState } from 'react';
import { TestTube, Play } from 'lucide-react';
import { generateMultipleImagesWithReference } from '../services/falService';
import { ImageGenerationProgress } from '../utils/imageGeneration';
import { GenerationProgress } from './GenerationProgress';

export function FalGenerationTest() {
  const [testProgress, setTestProgress] = useState(null);
  const [testResults, setTestResults] = useState(null);

  const runTest = async () => {
    const prompts = ['A red sports car', 'A blue ocean', 'A green forest', 'A golden sunset', 'A purple nebula'];
    const start = Date.now();
    const progress = new ImageGenerationProgress(prompts.length);
    setTestProgress(progress);

    const onProgress = (index, status, data) => {
      progress.updateImage(index, status, { prompt: prompts[index], url: data, error: data });
      setTestProgress({ ...progress });
    };

    try {
      const results = await generateMultipleImagesWithReference(prompts, [], { aspectRatio: '1:1' }, onProgress);
      const end = Date.now();
      setTestResults({
        totalTime: end - start,
        successful: results.filter(r => r.success).length,
        failed: prompts.length - results.filter(r => r.success).length,
        avgTime: Math.round((end - start) / prompts.length)
      });
    } catch (error) {
      setTestResults({ error: error.message });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <TestTube size={24} />Fal.ai Test
        </h2>
        <button
          onClick={runTest}
          disabled={testProgress !== null}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
        >
          <Play size={16} />Test
        </button>
      </div>
      {testProgress && <GenerationProgress progress={testProgress} onCancel={() => setTestProgress(null)} />}
      {testResults && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Results:</h3>
          <pre className="text-sm">{JSON.stringify(testResults, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
