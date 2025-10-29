/**
 * Fal.ai API Service
 * Model: fal-ai/nano-banana | Cost: $0.039/image | Time: 3-5 seconds
 */

const FAL_API_URL = 'https://queue.fal.run/fal-ai/nano-banana';
const FAL_API_KEY = import.meta.env.VITE_FAL_API_KEY;

export async function generateImage(prompt, options = {}) {
  if (!FAL_API_KEY) {
    throw new Error('VITE_FAL_API_KEY is not set in environment variables');
  }

  const {
    aspectRatio = '1:1',
    outputFormat = 'jpeg',
    numImages = 1
  } = options;

  try {
    const submitResponse = await fetch(FAL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        num_images: numImages,
        aspect_ratio: aspectRatio,
        output_format: outputFormat
      })
    });

    if (!submitResponse.ok) {
      const errorData = await submitResponse.json().catch(() => ({}));
      throw new Error(`Fal.ai API error: ${submitResponse.status} - ${errorData.message || 'Unknown error'}`);
    }

    const submitData = await submitResponse.json();
    return await pollForResult(submitData.request_id);
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}

async function pollForResult(requestId, maxAttempts = 60) {
  let attempts = 0;

  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const statusResponse = await fetch(
        `${FAL_API_URL}/requests/${requestId}`,
        { headers: { 'Authorization': `Key ${FAL_API_KEY}` } }
      );

      if (!statusResponse.ok) {
        throw new Error(`Status check failed: ${statusResponse.status}`);
      }

      const statusData = await statusResponse.json();

      if (statusData.status === 'COMPLETED') {
        return {
          url: statusData.images[0].url,
          description: statusData.description || ''
        };
      }

      if (statusData.status === 'FAILED') {
        throw new Error('Image generation failed');
      }
      
      attempts++;
    } catch (error) {
      console.error('Polling error:', error);
      attempts++;
    }
  }

  throw new Error('Image generation timed out after 60 seconds');
}

/**
 * Generate multiple images in PARALLEL with progress callbacks
 * @param prompts - Array of image prompts
 * @param options - Generation options
 * @param onProgress - Optional callback: (index, status, data) => void
 */
export async function generateMultipleImages(
  prompts, 
  options = {},
  onProgress = null
) {
  // Create array of promises for parallel execution
  const imagePromises = prompts.map(async (prompt, index) => {
    try {
      // Notify start
      onProgress?.(index, 'generating', { prompt });
      
      // Generate image
      const result = await generateImage(prompt, options);
      
      // Notify success
      onProgress?.(index, 'success', { url: result.url, prompt });
      
      return { 
        prompt, 
        url: result.url, 
        success: true,
        index 
      };
    } catch (error) {
      // Notify error
      onProgress?.(index, 'error', { error: error.message, prompt });
      
      return { 
        prompt, 
        error: error.message, 
        success: false,
        index 
      };
    }
  });

  // Execute all in parallel and wait for completion
  const results = await Promise.all(imagePromises);
  
  // Sort by original index to maintain order
  return results.sort((a, b) => a.index - b.index);
}

export async function testFalConnection() {
  try {
    const result = await generateImage('A simple test image of a red apple', { aspectRatio: '1:1' });
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
