/**
 * Groq API Service - Engineered for Professional Ad Generation
 * Model: openai/gpt-oss-120b | Speed: ~500 tokens/sec | Cost: $0.15/1M input
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function generateCreativeAngles(productName, productDescription, numAngles = 5) {
  if (!GROQ_API_KEY) {
    throw new Error('VITE_GROQ_API_KEY is not set in environment variables');
  }

  const systemPrompt = `You are an expert advertising creative director specializing in product photography and social media ad design. Generate detailed image prompts for professional product advertisements that look like they were created by a top agency. Focus on clean composition, bold typography, vibrant colors, and commercial appeal.`;

  const userPrompt = `Create ${numAngles} professional advertising concepts for this product. Each concept should be a detailed, single-paragraph description for an AI image generator.

PRODUCT: ${productName}
DESCRIPTION: ${productDescription}

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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Groq API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse concepts from numbered format
    const angles = content
      .split(/Concept \d+:/)
      .slice(1)
      .map(text => text.trim())
      .filter(text => text.length > 0);
    
    return angles;
  } catch (error) {
    console.error('Error generating creative angles:', error);
    throw new Error(`Failed to generate creative angles: ${error.message}`);
  }
}

export async function testGroqConnection() {
  try {
    const angles = await generateCreativeAngles('Test Product', 'A simple test product', 2);
    return { success: true, angles };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
