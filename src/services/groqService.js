/**
 * Groq API Service
 * Model: openai/gpt-oss-120b | Cost: $0.0005/request | Time: 2-3 seconds
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function generateCreativeAngles(productName, productDescription, numAngles = 5, hasReferenceImages = false) {
  console.log('🔍 GROQ DEBUG: Function called with:', { productName, productDescription, numAngles, hasReferenceImages });
  
  if (!GROQ_API_KEY) {
    console.log('🔍 GROQ DEBUG: No API key found!');
    throw new Error('VITE_GROQ_API_KEY is not set in environment variables');
  }
  
  console.log('🔍 GROQ DEBUG: API key exists, length:', GROQ_API_KEY.length);

  const systemPrompt = `You are an expert advertising creative director specializing in product photography and social media ad design. Generate detailed image prompts for professional product advertisements that look like they were created by a top agency. Focus on clean composition, bold typography, vibrant colors, and commercial appeal.`;

  const userPrompt = `Create ${numAngles} professional advertising concepts for this product. ${hasReferenceImages ? 'Reference product images are provided - transform them into professional ad creatives while maintaining the product\'s appearance. Focus on background, lighting, styling, and text overlays.' : 'Generate from scratch based on product description.'} Each concept should be a detailed, single-paragraph description for an AI image generator.

PRODUCT: ${productName}
DESCRIPTION: ${productDescription}
${hasReferenceImages ? 'REFERENCE IMAGES: Product photos provided for transformation' : ''}

For each concept, describe:
- Product placement and angle (centered, three-quarter view, lifestyle shot)
- Background (solid color, gradient, minimal scene)
- Lighting (studio-lit, bright, warm, dramatic)
- Color palette (2-3 dominant colors)
- Text overlay (product name, tagline, or key benefit - keep punchy)
- Overall aesthetic (minimalist, vibrant, elegant, bold)

CREATIVE ANGLES TO EXPLORE:
1. Clean studio shot with bold typography on vibrant solid background
2. Lifestyle shot with hand holding product, bright and energetic
3. Elegant minimalist composition with premium feel
4. Bold graphic design with dynamic colors and large text
5. Product on geometric platform with modern aesthetic

FORMAT: Start each with "Concept 1:", "Concept 2:", etc. Make each description detailed and specific for image generation.

STYLE: Professional product photography, square format (1:1), social media ready, scroll-stopping appeal.`;

  try {
    console.log('🔍 GROQ DEBUG: Making API call to:', GROQ_API_URL);
    
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 2000
      })
    });

    console.log('🔍 GROQ DEBUG: Response status:', response.status);
    console.log('🔍 GROQ DEBUG: Response ok:', response.ok);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('🔍 GROQ DEBUG: Error response:', errorData);
      throw new Error(`Groq API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('🔍 GROQ DEBUG: Success response data:', data);
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.log('🔍 GROQ DEBUG: Invalid response structure:', data);
      throw new Error('Invalid response structure from Groq API');
    }
    
    const content = data.choices[0].message.content;
    console.log('🔍 GROQ DEBUG: Response content:', content);
    console.log('🔍 GROQ DEBUG: Content length:', content.length);
    console.log('🔍 GROQ DEBUG: First 200 chars:', content.substring(0, 200));
    
    // Parse concepts from numbered format (handles both "Concept 1:" and "**Concept 1:**")
    let angles = content
      .split(/\*?\*?Concept \d+:\*?\*?/)
      .slice(1)
      .map(text => text.trim())
      .filter(text => text.length > 0);
    
    console.log('🔍 GROQ DEBUG: Split result:', content.split(/\*?\*?Concept \d+:\*?\*?/));
    console.log('🔍 GROQ DEBUG: Parsed angles:', angles);
    console.log('🔍 GROQ DEBUG: Number of angles:', angles.length);
    
    // Fallback: if no angles found, return the whole content as one angle
    if (angles.length === 0 && content.trim().length > 0) {
      console.log('🔍 GROQ DEBUG: No angles parsed, using content as single angle');
      angles = [content.trim()];
    }
    
    return { angles };
  } catch (error) {
    console.error('🔍 GROQ DEBUG: Error in generateCreativeAngles:', error);
    console.error('🔍 GROQ DEBUG: Error stack:', error.stack);
    throw new Error(`Failed to generate creative angles: ${error.message}`);
  }
}

export async function testGroqConnection() {
  console.log('🔍 GROQ DEBUG: Testing connection...');
  try {
    const result = await generateCreativeAngles('Test Product', 'This is a test product for connection testing', 2);
    console.log('🔍 GROQ DEBUG: Test successful:', result);
    return { success: true, result };
  } catch (error) {
    console.log('🔍 GROQ DEBUG: Test failed:', error);
    return { success: false, error: error.message };
  }
}