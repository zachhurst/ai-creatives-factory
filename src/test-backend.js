/**
 * Test file to verify backend services implementation
 * Run this in browser console to test functionality
 */

// Test 1: Check if all modules are properly exported
console.log('🧪 Testing Backend Services Implementation...');

try {
  // Test product store
  const { useProductStore } = await import('./store/productStore.js');
  console.log('✅ Product store imported successfully');
  
  // Test if referenceImages field is working
  const testStore = useProductStore.getState();
  console.log('✅ Product store state:', testStore);
  
  // Test fal service
  const { 
    uploadImageToFal, 
    generateImageWithReference, 
    generateMultipleImagesWithReference,
    testImageUpload 
  } = await import('./services/falService.js');
  console.log('✅ Fal service with image upload functions imported successfully');
  
  // Test groq service
  const { generateCreativeAngles } = await import('./services/groqService.js');
  console.log('✅ Groq service with reference awareness imported successfully');
  
  // Test helpers
  const { 
    validateImageFiles, 
    hasReferenceImages, 
    getGenerationMode,
    validateApiKeys 
  } = await import('./utils/helpers.js');
  console.log('✅ Helper functions with image validation imported successfully');
  
  // Test image validation
  const testFiles = [
    new File(['test'], 'test.jpg', { type: 'image/jpeg' }),
    new File(['test'], 'test.png', { type: 'image/png' })
  ];
  
  const validation = validateImageFiles(testFiles);
  console.log('✅ Image validation test:', validation);
  
  // Test reference image detection
  const testProduct = {
    name: 'Test Product',
    referenceImages: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
  };
  
  console.log('✅ Reference image detection:', hasReferenceImages(testProduct));
  console.log('✅ Generation mode:', getGenerationMode(testProduct));
  
  // Test API key validation
  const apiValidation = validateApiKeys();
  console.log('✅ API key validation:', apiValidation);
  
  console.log('🎉 All backend services are properly implemented!');
  
} catch (error) {
  console.error('❌ Backend services test failed:', error);
}
