# AI Creative Factory - Windsurf Workflows

This directory contains Windsurf-compatible workflows for building the AI Creative Factory application with image upload capabilities.

## 🚀 Quick Start

### Core Application Workflows (Original):
1. **01-project-setup-configuration.wf.md** - Initialize Vite project, install dependencies
2. **02-services-state-management.wf.md** - Create API services and Zustand store
3. **03-ui-components-part1.wf.md** - Build form, cards, and list components
4. **04-ui-components-part2-final.wf.md** - Complete dashboard, header, and deployment

### Image Upload Enhancement Workflows (NEW):
5. **05-image-upload-backend-services.wf.md** - Backend services for image upload functionality
6. **06-image-upload-ui-components.wf.md** - UI components for drag-and-drop image upload
7. **07-image-upload-integration-final.wf.md** - Final integration, testing, and deployment

## 📋 Workflow Structure

Each workflow file (`.wf.md`) contains:
- ✅ Clear task breakdowns
- ✅ Complete code examples
- ✅ Verification steps
- ✅ Troubleshooting guides
- ✅ Under 12,000 character limit

## 🆕 Image Upload Enhancement

### New Features Added:
- **Drag-and-Drop Upload:** Intuitive file upload zone with visual feedback
- **Multiple File Support:** Upload up to 5 product photos at once
- **Reference Image Generation:** Transform actual product photos into professional ads
- **Dual-Mode Generation:** Automatic endpoint selection (text-only vs reference images)
- **Enhanced Statistics:** Track reference image usage and generation modes
- **Comprehensive Testing:** Built-in test suite for validation

### Technical Implementation:
- **Backend:** Extended Fal.ai service with image upload and editing endpoints
- **Storage:** Images hosted on Fal.ai CDN (no local storage costs)
- **UI:** React components with drag-and-drop, previews, and validation
- **Cost:** Same pricing structure ($0.039/image) - no additional cost for uploads

## 🔧 Prerequisites

Before starting:
- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- Groq API key (https://console.groq.com/)
- Fal.ai API key (https://fal.ai/dashboard)

## 💡 What You're Building

A complete React + Vite application that:
- **Manages products** with Zustand + localStorage
- **Generates creative text** with Groq API (openai/gpt-oss-120b)
- **Creates images** with Fal.ai (fal-ai/nano-banana)
- **Uploads reference photos** for enhanced generation
- **Uses Tailwind CSS** for modern UI
- **Runs entirely locally** (no backend required)

## 💰 Cost Estimate

- **Per Product:** ~$0.20 (5 images)
- **Per Image:** $0.04
- **Groq:** $0.0005 per product
- **Fal.ai:** $0.039 per image
- **Image Upload:** FREE (Fal.ai storage)

## 📂 Final Project Structure

```
ai-creative-factory/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── StatsDashboard.tsx
│   │   ├── ProductForm.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductList.tsx
│   │   ├── ImageUploadZone.tsx      # NEW
│   │   ├── ImagePreview.tsx         # NEW
│   │   └── ImageUploadTest.tsx      # NEW
│   ├── services/
│   │   ├── groqService.ts
│   │   └── falService.ts            # Enhanced
│   ├── store/
│   │   └── productStore.ts          # Enhanced
│   ├── utils/
│   │   └── helpers.ts               # Enhanced
│   ├── App.tsx                      # Enhanced
│   ├── main.tsx
│   └── index.css
├── .env
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## ⚡ Key Features

### Core Features:
- **Engineered Prompts** - Professional ad copy generation
- **5 Creative Angles** - Multiple concepts per product
- **Square Format (1:1)** - Optimized for social media
- **localStorage Persistence** - Data survives page refresh
- **Image Downloads** - One-click download functionality
- **Real-time Stats** - Track costs and usage
- **Responsive Design** - Works on mobile and desktop

### Image Upload Features:
- **Drag-and-Drop Zone** - Modern file upload experience
- **Image Validation** - File type, size, and count limits
- **Thumbnail Previews** - Local preview before upload
- **Upload Progress** - Real-time status indicators
- **Reference Generation** - Transform product photos
- **Automatic Mode Selection** - Smart endpoint routing
- **Enhanced Analytics** - Track upload and generation usage

## 🎯 Execution Tips

### For Core Application:
1. **Follow in order** - Each phase builds on the previous
2. **Check off tasks** - Use completion checklists
3. **Test as you go** - Verify each phase before moving on
4. **Read troubleshooting** - Common issues addressed in each workflow

### For Image Upload Enhancement:
1. **Complete core application first** - Phases 1-4 required
2. **Backend first** - Complete Phase 5 before UI components
3. **Test thoroughly** - Use built-in test suite in Phase 7
4. **Verify API keys** - Ensure both Groq and Fal.ai keys work

## 🔗 Phase Cross-References

### Core Application:
- Phase 1 → Phase 2 (services)
- Phase 2 → Phase 3 (UI part 1)
- Phase 3 → Phase 4 (UI part 2 + deployment)

### Image Upload Enhancement:
- Phase 4 → Phase 5 (backend services)
- Phase 5 → Phase 6 (UI components)
- Phase 6 → Phase 7 (integration + testing)

## 📚 Documentation Reference

See root directory files for additional context:
- `implementation_guide.md` - Python version (for reference)
- `AI Creative Factory: React + Vite Local Application.md` - Architecture overview
- `research_findings.md` - API specifications
- `docs/Image Upload Solution for AI Creative Factory.md` - Technical details

## 🧪 Testing

### Built-in Test Suite:
Phase 7 includes a comprehensive test component that validates:
- API key configuration
- Service connectivity
- Image upload functionality
- Reference image generation
- Error handling

### Manual Testing:
1. Add product with reference images
2. Generate creatives using reference photos
3. Verify image transformation quality
4. Test data persistence
5. Validate responsive design

## ✨ After Completion

You'll have a fully functional AI Creative Factory that:
- **Generates professional product ads** from text descriptions
- **Transforms actual product photos** into professional creatives
- **Costs ~$0.04 per image** with no additional upload fees
- **Runs entirely in your browser** with no backend required
- **Stores data locally** with automatic persistence
- **Provides dual generation modes** for maximum flexibility

Total development time: **3-4 hours** (including image upload enhancement)

---

## 🚀 Ready to Start?

**New to the project?** Start with Phase 1: `01-project-setup-configuration.wf.md` 🚀

**Already have the core app?** Jump to Phase 5: `05-image-upload-backend-services.wf.md` 🆕

**Need to test existing setup?** Check the test suite in Phase 7: `07-image-upload-integration-final.wf.md` 🧪
