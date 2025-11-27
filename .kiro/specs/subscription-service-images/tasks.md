# Implementation Plan

- [ ] 1. Create service image mapping utility
  - Create `src/utils/serviceImageMapper.ts` with core mapping functionality
  - Implement service name normalization and fuzzy matching algorithms
  - Add methods to discover and cache available service images from both asset directories
  - Write unit tests for service name matching accuracy and edge cases
  - _Requirements: 1.1, 1.2, 3.1, 3.2, 3.4_

- [ ] 2. Implement image discovery system
  - Create function to scan `src/assets/subscriptions` directory for PNG files
  - Create function to scan `public/assets/subscriptions` directory for SVG files
  - Implement image format preference logic (SVG over PNG when both exist)
  - Add error handling for directory access and invalid image files
  - Write tests for directory scanning and image format detection
  - _Requirements: 2.1, 2.2, 3.1, 3.3_

- [ ] 3. Create background image resolution logic
  - Implement `resolveBackgroundImage` function with priority-based selection
  - Add fallback chain: Custom URL → Service Image → Gradient background
  - Create image loading component with error handling and fallback mechanisms
  - Implement caching system for resolved background images
  - Write tests for background resolution priority and fallback behavior
  - _Requirements: 1.3, 2.5, 5.2, 5.4_

- [ ] 4. Enhance SubscriptionCard component
  - Update SubscriptionCard to use new background image resolution system
  - Add visual overlay for improved text readability over service images
  - Implement responsive image scaling and positioning
  - Add loading states and smooth transitions for background images
  - Write tests for card rendering with different background image types
  - _Requirements: 1.4, 1.5, 4.1, 4.3, 4.4_

- [ ] 5. Update AddSubscriptionForm for custom image override
  - Add optional background image URL input field to the form
  - Implement image preview functionality for custom URLs
  - Add validation for custom image URLs and format support
  - Update form submission to handle custom background image data
  - Write tests for form functionality with custom image inputs
  - _Requirements: 5.1, 5.3, 5.5_

- [ ] 6. Implement visual optimization features
  - Add CSS classes and styles for image overlays and text shadows
  - Implement image filters for busy backgrounds to improve readability
  - Create consistent image positioning and aspect ratio handling
  - Add responsive image optimization for different screen sizes
  - Write visual regression tests for text readability over various backgrounds
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 7. Add performance optimizations
  - Implement lazy loading for subscription card background images
  - Create in-memory caching system for service image mappings
  - Add image preloading for common service images
  - Optimize bundle size by using dynamic imports for image assets
  - Write performance tests for image loading and caching efficiency
  - _Requirements: 2.3, 2.4, 3.5_

- [x] 8. Update existing components integration
  - Modify useSubscriptions hook to work with enhanced background image system
  - Update Dashboard component to handle new image loading states
  - Ensure backward compatibility with existing subscription data
  - Add error logging and debugging information for image matching
  - Write integration tests for complete subscription card rendering flow
  - _Requirements: 1.1, 1.2, 3.5, 5.2_