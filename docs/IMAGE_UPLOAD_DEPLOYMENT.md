# Image Upload Feature - Deployment Guide

## Overview

The AI Creative Factory now supports image upload functionality with reference image generation. This guide covers deployment considerations for the enhanced version.

## New Features

- **Image Upload:** Drag-and-drop file upload with validation
- **Reference Generation:** Transform product photos using fal-ai/nano-banana/edit
- **Dual Mode:** Automatic endpoint selection based on reference images
- **Enhanced Stats:** Track reference image usage and generation modes

## Deployment Checklist

### 1. Environment Variables

Ensure these are set in your hosting platform:

```bash
VITE_GROQ_API_KEY=your_groq_api_key
VITE_FAL_API_KEY=your_fal_api_key
```

### 2. Build Configuration

The build process remains unchanged:

```bash
pnpm run build
```

### 3. File Upload Considerations

**Fal.ai Storage:**
- Images are uploaded to Fal.ai's CDN (no local storage required)
- Automatic cleanup after generation
- No additional storage costs

**File Limits:**
- Max file size: 10MB per image
- Max files: 5 per product (configurable)
- Supported formats: JPEG, PNG, WebP

### 4. API Rate Limits

- Image upload: No additional rate limits
- Generation: Same as existing ($0.039/image)
- Storage: Included with Fal.ai subscription

### 5. Browser Compatibility

**Required Features:**
- File API (IE10+)
- Drag and Drop API (IE10+)
- Fetch API (Modern browsers)
- ES2020+ (for async/await)

**Fallbacks:**
- Click upload works if drag-and-drop not supported
- Error handling for unsupported features

## Hosting Platform Setup

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

For static hosting without server functions:

1. Build locally: `pnpm run build`
2. Upload `dist` folder
3. Ensure environment variables are set if needed

## Testing Before Deployment

Run the test suite in development:

1. Start dev server: `pnpm run dev`
2. Navigate to http://localhost:5173/
3. Run "Image Upload Test Suite" at bottom of page
4. Verify all tests pass before deploying

## Performance Considerations

### Image Optimization

- Images are compressed during upload
- Thumbnails generated for preview
- Lazy loading for image grids

### Caching

- Fal.ai CDN handles image caching
- Browser cache for static assets
- Service worker optional for offline support

### Bundle Size

- Additional components: ~15KB gzipped
- Total bundle size: ~230KB gzipped
- No additional runtime dependencies

## Security Considerations

### File Upload Security

- File type validation on client side
- File size limits enforced
- Fal.ai handles server-side validation

### API Key Security

- Keys stored in environment variables
- Not exposed in client-side code
- Same security as existing implementation

## Monitoring

### Error Tracking

- Upload errors logged to console
- Generation failures tracked
- Performance metrics available

### Usage Analytics

- Reference image usage tracked
- Generation mode statistics
- Cost monitoring unchanged

## Rollback Plan

If issues arise:

1. Remove image upload components from App.tsx
2. Revert ProductForm to previous version
3. Deploy without image upload features
4. Investigate issues separately

## Support

For deployment issues:

1. Check browser console for errors
2. Verify API keys are correct
3. Test with small images first
4. Check Fal.ai service status

## Future Enhancements

Potential improvements:

- Image editing capabilities
- Bulk upload functionality
- Advanced image validation
- Custom styling options
- Integration with cloud storage
