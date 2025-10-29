# AI Creative Factory

🎨 **Transform your products into professional advertisements with AI-powered creativity**

A modern React application that combines Groq's language model with Fal.ai's image generation to create stunning product advertisements from simple descriptions.

---

## ✨ Features

### 🚀 Core Functionality
- **Product Management**: Add products with names and descriptions
- **AI-Powered Creatives**: Generate 5 unique creative angles per product
- **Image Generation**: Create professional advertisement images using Fal.ai
- **Cost Tracking**: Real-time cost estimation for all generations

### 🆕 Image Upload Enhancement
- **Drag-and-Drop Upload**: Modern file upload interface with visual feedback
- **Reference Image Generation**: Transform actual product photos into professional ads
- **Dual-Mode Generation**: Smart endpoint selection (text-only vs reference images)
- **Image Previews**: Real-time thumbnails with hover effects
- **Upload Validation**: File type, size, and count checking

### 📊 Analytics & Insights
- **Usage Statistics**: Track products, angles, and generated images
- **Reference Metrics**: Monitor image upload adoption
- **Generation Analytics**: Success rates and completion tracking
- **Cost Monitoring**: Real-time cost breakdown

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Modern UI**: Built with Tailwind CSS and Lucide React icons
- **Real-time Progress**: Live progress bars and individual image status tracking
- **Custom Dialogs**: Beautiful, styled dialogs for success, error, and confirmation messages
- **Parallel Generation**: 5x faster image generation with simultaneous processing
- **Error Handling**: Comprehensive error messages and recovery

---

## 🛠️ Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Icons**: Lucide React
- **AI Services**: 
  - Groq (text generation - creative angles)
  - Fal.ai (image generation - nano-banana model)
- **File Upload**: @fal-ai/client library
- **Package Manager**: pnpm

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm package manager
- API keys for Groq and Fal.ai

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:zachhurst/ai-creatives-factory.git
   cd ai-creatives-factory
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_GROQ_API_KEY=your_groq_api_key_here
   VITE_FAL_API_KEY=your_fal_api_key_here
   ```

4. **Start development server**
   ```bash
   pnpm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

---

## 🔑 API Setup

### Groq API Key
1. Visit [Groq Console](https://console.groq.com/)
2. Create an account and generate an API key
3. Add to `.env` as `VITE_GROQ_API_KEY`

### Fal.ai API Key
1. Visit [Fal.ai Console](https://fal.ai/)
2. Create an account and generate an API key
3. Add to `.env` as `VITE_FAL_API_KEY`

---

## 💰 Pricing

### Cost Breakdown
- **Creative Angles**: $0.0005 per product (Groq)
- **Image Generation**: $0.039 per image (Fal.ai)
- **Total per Product**: ~$0.20 (5 images + creative angles)
- **Reference Images**: FREE upload and storage

### Example Usage
- 10 products with 5 images each: ~$2.00 total
- 50 products with 5 images each: ~$10.00 total

---

## 🎯 Usage Guide

### Basic Workflow
1. **Add Product**: Enter product name and description
2. **Upload References** (Optional): Add product photos for better results
3. **Generate Creatives**: Click to generate 5 creative angles and images with real-time progress
4. **Monitor Progress**: Watch individual images appear as they complete (3-7 seconds total)
5. **Download Results**: Save generated images for your campaigns

### Reference Image Benefits
- **Better Quality**: Transform actual product photos
- **Brand Consistency**: Maintain product appearance
- **Professional Results**: Studio-quality transformations
- **Same Cost**: No additional charges for enhanced quality

### Tips for Best Results
- **Detailed Descriptions**: Include colors, features, and target audience
- **Reference Photos**: Use high-quality product images
- **Multiple Products**: Compare different creative approaches
- **Cost Monitoring**: Check stats dashboard for usage tracking
- **Performance**: Images now generate in parallel (5x faster than before)

---

## 🧪 Testing

### Development Testing
The app includes a comprehensive test suite (development only):

1. Start development server
2. Scroll to "Image Upload Test Suite" at bottom
3. Click "Run All Tests" to validate:
   - API key configuration
   - Service connectivity
   - Image upload functionality
   - Reference generation capability

### Build Testing
```bash
# Test production build
pnpm run build

# Preview production build
pnpm run preview
```

---

## 📱 Responsive Design

- **Mobile** (< 640px): 2-column image grids, touch-friendly
- **Tablet** (640px - 1024px): 3-4 column grids, optimized spacing
- **Desktop** (> 1024px): 4-5 column grids, maximum preview size

---

## 🔧 Configuration

### Customization Options
Edit `src/services/falService.js` to modify:
- Image aspect ratios
- Output formats
- Generation parameters
- Cost calculations

### Environment Variables
```env
# Required
VITE_GROQ_API_KEY=your_groq_api_key
VITE_FAL_API_KEY=your_fal_api_key

# Optional (for development)
VITE_DEV_MODE=true
```

---

## 📦 Deployment

### Netlify
1. Connect repository to Netlify
2. Add environment variables in site settings
3. Build command: `pnpm run build`
4. Publish directory: `dist`

### Vercel
1. Import project from GitHub
2. Add environment variables in project settings
3. Build command: `pnpm run build`
4. Output directory: `dist`

### Static Hosting
```bash
# Build for production
pnpm run build

# Upload dist folder to your hosting provider
```

---

## 🏗️ Project Structure

```
ai-creative-factory/
├── src/
│   ├── components/          # React components
│   │   ├── ProductForm.jsx     # Product creation form
│   │   ├── ProductCard.jsx     # Product display card
│   │   ├── GenerationProgress.jsx # Real-time progress UI
│   │   ├── ImageUploadZone.jsx # Drag-drop image upload
│   │   ├── StatsDashboard.jsx  # Analytics dashboard
│   │   ├── ui/                  # UI components
│   │   │   └── DialogProvider.jsx # Custom dialog system
│   │   └── ...
│   ├── services/           # API services
│   │   ├── groqService.js      # Groq API integration
│   │   ├── falService.js       # Fal.ai API integration (parallel)
│   │   └── ...
│   ├── store/              # State management
│   │   └── productStore.js     # Zustand store
│   ├── utils/              # Utility functions
│   │   ├── helpers.js          # Helper functions
│   │   └── imageGeneration.js  # Progress tracking classes
│   └── App.tsx             # Main application
├── docs/                  # Documentation
├── public/                # Static assets
└── dist/                  # Build output
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit changes: `git commit -m "Add feature description"`
5. Push to branch: `git push origin feature-name`
6. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

### Common Issues

**API Key Errors**
- Verify keys are correctly set in `.env`
- Check for typos in variable names
- Ensure keys have proper permissions

**Upload Failures**
- Check file size (max 10MB per image)
- Verify file format (JPEG, PNG, WebP)
- Ensure stable internet connection

**Generation Errors**
- Monitor API service status
- Check credit balance on Fal.ai
- Verify prompt content isn't empty

### Getting Help
- Check browser console for detailed error messages
- Review the test suite results
- Open an issue on GitHub with details

---

## 🎉 Acknowledgments

- **Groq** - For fast, reliable text generation
- **Fal.ai** - For high-quality image generation
- **Vite** - For lightning-fast development experience
- **Tailwind CSS** - For utility-first styling
- **Lucide** - For beautiful icon sets

---

## 📈 Roadmap

### Upcoming Features
- [x] Real-time progress tracking with parallel generation
- [ ] Batch product creation
- [ ] Advanced image editing tools
- [ ] Custom branding options
- [ ] API endpoint for programmatic access
- [ ] Team collaboration features
- [ ] Export to multiple formats
- [ ] A/B testing capabilities

### Version History
- **v1.0.0** - Core functionality with text-to-image generation
- **v1.1.0** - Image upload and reference generation
- **v1.2.0** - Enhanced analytics and testing suite
- **v1.3.0** - Real-time progress tracking and parallel generation

---

**Transform your product marketing with AI-powered creativity! 🚀**

Made with ❤️ by [Zach Hurst](https://github.com/zachhurst)
