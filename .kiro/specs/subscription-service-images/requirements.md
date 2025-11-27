# Requirements Document

## Introduction

This feature enhances the existing subscription management dashboard by automatically using service-specific images from the `/assets/subscriptions` directory as background images for subscription cards. Instead of relying on user-provided background images or generic gradients, the system will intelligently match subscription names to available service logos and images, providing a more polished and recognizable visual experience.

## Requirements

### Requirement 1

**User Story:** As a user, I want subscription cards to automatically display the correct service logo/image based on the subscription name, so that I can quickly identify services at a glance.

#### Acceptance Criteria

1. WHEN creating a new subscription THEN the system SHALL automatically match the subscription name to available service images
2. WHEN a subscription name matches a service (case-insensitive) THEN the system SHALL use the corresponding image from `/assets/subscriptions` or `/public/assets/subscriptions`
3. WHEN no matching service image is found THEN the system SHALL fall back to the existing gradient background system
4. WHEN displaying subscription cards THEN service images SHALL be properly sized and positioned as card backgrounds
5. WHEN service images are used THEN they SHALL maintain proper aspect ratios and visual quality

### Requirement 2

**User Story:** As a user, I want the system to support both PNG and SVG service images, so that the application can use the best available image format for each service.

#### Acceptance Criteria

1. WHEN loading service images THEN the system SHALL support both PNG and SVG formats
2. WHEN multiple formats exist for the same service THEN the system SHALL prioritize based on a defined preference order
3. WHEN rendering SVG images THEN they SHALL scale properly without pixelation
4. WHEN rendering PNG images THEN they SHALL maintain quality at different card sizes
5. WHEN images fail to load THEN the system SHALL gracefully fall back to gradient backgrounds

### Requirement 3

**User Story:** As a developer, I want a centralized service image mapping system, so that adding new service images is straightforward and maintainable.

#### Acceptance Criteria

1. WHEN the application initializes THEN the system SHALL create a mapping of available service images
2. WHEN matching subscription names THEN the system SHALL use fuzzy matching to handle variations (e.g., "Netflix", "netflix", "Netflix Premium")
3. WHEN new service images are added to the assets directory THEN they SHALL be automatically available without code changes
4. WHEN service names don't match exactly THEN the system SHALL attempt partial matching (e.g., "spotify" matches "Spotify Premium")
5. WHEN debugging image matching THEN the system SHALL provide clear logging of match attempts and results

### Requirement 4

**User Story:** As a user, I want service images to be visually optimized for subscription cards, so that the text and information remain readable over the background images.

#### Acceptance Criteria

1. WHEN service images are used as backgrounds THEN text SHALL remain readable with proper contrast
2. WHEN images are too bright or busy THEN the system SHALL apply a subtle overlay or filter to improve readability
3. WHEN displaying card content over images THEN the system SHALL ensure proper text shadows or background overlays
4. WHEN images have varying aspect ratios THEN they SHALL be cropped or positioned consistently across all cards
5. WHEN cards are resized THEN background images SHALL scale appropriately without distortion

### Requirement 5

**User Story:** As a user, I want the option to override automatic service image selection, so that I can customize the appearance if needed.

#### Acceptance Criteria

1. WHEN creating or editing a subscription THEN users SHALL have the option to provide a custom background image URL
2. WHEN a custom background image is provided THEN it SHALL take priority over automatic service image matching
3. WHEN users clear a custom background image THEN the system SHALL revert to automatic service image matching
4. WHEN custom images fail to load THEN the system SHALL fall back to automatic service matching, then to gradients
5. WHEN displaying the add/edit form THEN users SHALL see a preview of the selected background image