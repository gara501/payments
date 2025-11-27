# Design Document

## Overview

This document outlines the design for automatically using service-specific images as backgrounds for subscription cards. The system will intelligently match subscription names to available service logos and images from the `/assets/subscriptions` directories, providing a more polished visual experience while maintaining fallback mechanisms for unknown services.

## Architecture

The enhancement builds on the existing subscription dashboard architecture by adding:

1. **Service Image Mapping Layer**
   - ServiceImageMapper utility class
   - Image discovery and caching system
   - Fuzzy matching algorithm

2. **Enhanced Background Resolution**
   - Priority-based image selection
   - Fallback chain: Custom URL → Service Image → Gradient
   - Image loading and error handling

3. **Visual Optimization Layer**
   - Image processing for readability
   - Overlay and filter application
   - Responsive image handling

## Components and Interfaces

### ServiceImageMapper

**Responsibilities:**
- Discover available service images from both asset directories
- Create and maintain service name to image path mappings
- Provide fuzzy matching for subscription names
- Handle image format preferences (PNG vs SVG)

**Key Methods:**
```typescript
interface ServiceImageMapper {
  getServiceImage(subscriptionName: string): string | null;
  getAllAvailableServices(): ServiceImageInfo[];
  refreshImageMappings(): void;
}

interface ServiceImageInfo {
  serviceName: string;
  imagePath: string;
  format: 'png' | 'svg';
  source: 'src' | 'public';
}
```

**Implementation Details:**
- Scans both `src/assets/subscriptions` and `public/assets/subscriptions`
- Creates normalized service name mappings (lowercase, no spaces)
- Implements fuzzy matching using string similarity algorithms
- Caches mappings for performance

### Enhanced SubscriptionCard

**Background Resolution Logic:**
```typescript
function resolveBackgroundImage(subscription: Subscription): string {
  // Priority 1: Custom user-provided image
  if (subscription.background_image && subscription.background_image.startsWith('http')) {
    return subscription.background_image;
  }
  
  // Priority 2: Service-specific image
  const serviceImage = ServiceImageMapper.getServiceImage(subscription.name);
  if (serviceImage) {
    return serviceImage;
  }
  
  // Priority 3: Gradient fallback
  return generateGradientBackground(subscription.name);
}
```

**Visual Optimization:**
- Apply semi-transparent overlay for text readability
- Implement consistent image positioning and scaling
- Add subtle filters for busy images

### Image Loading Component

**Responsibilities:**
- Handle progressive image loading
- Manage loading states and error fallbacks
- Optimize image display for different card sizes

**Implementation:**
```typescript
interface ImageWithFallback {
  src: string;
  fallbackSrc?: string;
  onError: () => void;
  className: string;
}
```

## Data Models

### Enhanced Subscription Type

```typescript
interface Subscription {
  id: number;
  name: string;
  subscription_date: string;
  value: number;
  is_active: boolean;
  background_image?: string; // Custom URL or null for auto-detection
  resolved_background?: string; // Computed background (not stored)
}
```

### Service Image Mapping

```typescript
interface ServiceMapping {
  [normalizedName: string]: {
    originalName: string;
    imagePath: string;
    format: 'png' | 'svg';
    confidence: number; // For fuzzy matching
  };
}
```

## Image Discovery Algorithm

### Directory Scanning
1. Scan `src/assets/subscriptions` for PNG files
2. Scan `public/assets/subscriptions` for SVG files
3. Create normalized mappings (remove extensions, convert to lowercase)
4. Handle duplicates with format preference (SVG preferred for scalability)

### Fuzzy Matching Strategy
```typescript
function findBestMatch(subscriptionName: string, availableServices: string[]): string | null {
  const normalized = normalizeServiceName(subscriptionName);
  
  // Exact match
  if (availableServices.includes(normalized)) {
    return normalized;
  }
  
  // Partial match (contains)
  const partialMatch = availableServices.find(service => 
    normalized.includes(service) || service.includes(normalized)
  );
  
  if (partialMatch) {
    return partialMatch;
  }
  
  // Fuzzy match using string similarity
  const fuzzyMatches = availableServices
    .map(service => ({
      service,
      similarity: calculateSimilarity(normalized, service)
    }))
    .filter(match => match.similarity > 0.7)
    .sort((a, b) => b.similarity - a.similarity);
    
  return fuzzyMatches.length > 0 ? fuzzyMatches[0].service : null;
}
```

## Visual Design Enhancements

### Background Image Optimization

**Image Positioning:**
- Use `background-size: cover` for consistent scaling
- Center images with `background-position: center`
- Maintain aspect ratios across different card sizes

**Readability Improvements:**
```css
.subscription-card-with-image {
  position: relative;
}

.subscription-card-with-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.2) 100%
  );
  border-radius: inherit;
}

.subscription-card-content {
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}
```

### Responsive Image Handling

**Different Card Sizes:**
- Desktop: Full resolution images
- Tablet: Medium resolution with proper scaling
- Mobile: Optimized smaller images

**Loading States:**
- Skeleton placeholder while images load
- Smooth transition from placeholder to image
- Graceful fallback on load errors

## Error Handling

### Image Loading Failures
1. **Service Image Fails:** Fall back to gradient background
2. **Custom Image Fails:** Attempt service image matching, then gradient
3. **Network Issues:** Use cached mappings when possible

### Service Mapping Errors
1. **Directory Access Issues:** Log warning, continue with available mappings
2. **Invalid Image Files:** Skip corrupted files, log for debugging
3. **Performance Issues:** Implement lazy loading and caching

## Performance Considerations

### Image Optimization
- Lazy load images as cards come into view
- Cache service mappings in memory
- Preload common service images

### Bundle Size Management
- Import images dynamically to avoid large bundle sizes
- Use appropriate image formats (SVG for logos, PNG for complex images)
- Implement image compression for better loading times

### Caching Strategy
```typescript
class ServiceImageCache {
  private static cache = new Map<string, string>();
  private static mappings: ServiceMapping | null = null;
  
  static async getServiceImage(name: string): Promise<string | null> {
    if (this.cache.has(name)) {
      return this.cache.get(name)!;
    }
    
    if (!this.mappings) {
      this.mappings = await this.buildMappings();
    }
    
    const result = this.findMatch(name, this.mappings);
    this.cache.set(name, result);
    return result;
  }
}
```

## Testing Strategy

### Unit Tests
- Service name matching algorithm accuracy
- Image path resolution logic
- Fallback behavior verification
- Cache performance and correctness

### Integration Tests
- End-to-end image loading and display
- Error handling scenarios
- Performance under various conditions

### Visual Regression Tests
- Card appearance with different service images
- Text readability over various backgrounds
- Responsive behavior across screen sizes

## Migration Strategy

### Existing Data Compatibility
- Existing subscriptions with custom `background_image` URLs remain unchanged
- Subscriptions without background images automatically get service matching
- No database schema changes required

### Rollout Plan
1. Deploy service image mapping system
2. Update SubscriptionCard component to use new resolution logic
3. Add UI controls for custom image override
4. Monitor performance and user feedback

## Future Enhancements

### Advanced Features (Out of Scope)
- User-uploadable custom service images
- Dynamic image generation for unknown services
- AI-powered service recognition from subscription names
- Image color analysis for automatic text color optimization
- CDN integration for faster image loading