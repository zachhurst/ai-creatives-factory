// Image generation status types
export const ImageGenerationStatus = {
  PENDING: 'pending',
  GENERATING: 'generating',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Progress tracking class
export class ImageGenerationProgress {
  constructor(totalImages) {
    this.totalImages = totalImages;
    this.images = Array(totalImages).fill(null).map((_, index) => ({
      index,
      status: ImageGenerationStatus.PENDING,
      url: null,
      error: null,
      prompt: null
    }));
    this.startTime = Date.now();
  }

  updateImage(index, status, data = null) {
    if (index >= 0 && index < this.images.length) {
      this.images[index] = {
        ...this.images[index],
        status,
        url: data?.url || null,
        error: data?.error || null,
        prompt: data?.prompt || this.images[index].prompt
      };
    }
  }

  getProgress() {
    const completed = this.images.filter(img => 
      img.status === ImageGenerationStatus.SUCCESS || 
      img.status === ImageGenerationStatus.ERROR
    ).length;
    
    const successful = this.images.filter(img => 
      img.status === ImageGenerationStatus.SUCCESS
    ).length;

    return {
      total: this.totalImages,
      completed,
      successful,
      failed: completed - successful,
      percentage: Math.round((completed / this.totalImages) * 100),
      elapsedTime: Date.now() - this.startTime
    };
  }

  isComplete() {
    return this.getProgress().completed === this.totalImages;
  }
}
