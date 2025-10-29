export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export async function downloadImage(url, filename) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
}

export function calculateEstimatedCost(numProducts, numAnglesPerProduct = 5) {
  const groqCostPerProduct = 0.0005;
  const falCostPerImage = 0.039;
  
  const groqTotal = numProducts * groqCostPerProduct;
  const falTotal = numProducts * numAnglesPerProduct * falCostPerImage;
  
  return {
    groqCost: groqTotal,
    falCost: falTotal,
    totalCost: groqTotal + falTotal,
    perProductCost: (groqTotal + falTotal) / numProducts
  };
}

export function validateApiKeys() {
  const errors = [];
  
  if (!import.meta.env.VITE_GROQ_API_KEY) {
    errors.push('VITE_GROQ_API_KEY is not set');
  }
  
  if (!import.meta.env.VITE_FAL_API_KEY) {
    errors.push('VITE_FAL_API_KEY is not set');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
