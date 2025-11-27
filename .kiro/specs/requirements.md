# Introduction

This feature involves creating a subscription management dashboard built with React. The application will display subscription cards, allow users to create and delete subscriptions, and load data progressively. All data will be persisted using a local SQLite database. The goal is to provide a clean, efficient interface for managing subscriptions with computed metadata such as remaining days until expiration.

## Requirements
### Requirement 1

**User Story:** As a user, I want to view my subscriptions in an organized dashboard layout, so that I can quickly review the services I’m subscribed to.

### Acceptance Criteria

1. WHEN the dashboard loads THEN the system SHALL display up to 10 subscription cards.
2. WHEN more than 10 subscriptions exist THEN the system SHALL display a "View more" button.
3. WHEN the user clicks the “View more” button THEN the system SHALL load 5 additional subscriptions at a time.
4. WHEN displaying subscriptions THEN the system SHALL sort them by subscription_date (newest first).
5. WHEN rendering subscription cards THEN each card SHALL include name, background image, subscription date, value, is_active, and computed remaining days.

### Requirement 2

**User Story:**  As a user, I want to add new subscriptions through a form, so that I can track new services easily.

### Acceptance Criteria

1. WHEN the user clicks the "Add subscription" button THEN the system SHALL open a form in a modal/dialog.
2. WHEN filling the form THEN the system SHALL require the fields: name, subscription_date, and value.
3. WHEN submitting the form THEN the system SHALL validate required inputs.
4. WHEN validation passes THEN the system SHALL save the subscription into the SQLite database.
5. WHEN the subscription is saved THEN the dashboard SHALL refresh and the modal SHALL close.
6. WHEN optional fields (such as background_image) are empty THEN the system SHALL apply fallback values.

### Requirement 3

**User Story:** As a user, I want each subscription card to clearly display key information with modern styling, so that I can easily see the status of my subscriptions.

### Acceptance Criteria

1. WHEN viewing a subscription card THEN the system SHALL display:
    - background_image (or modern gradient fallback)
    - name with clear typography
    - subscription_date with readable formatting
    - value (currency formatted) with emphasis
    - is_active with visual status indicators
    - days_remaining (computed field) with contextual styling
2. WHEN subscription data is displayed THEN dates SHALL be formatted in a user-friendly format (e.g., "Jan 15, 2024").
3. WHEN rendering remaining days THEN the system SHALL compute the value dynamically based on the current date.
4. WHEN a subscription is expired THEN the days_remaining value SHALL be shown as 0.
5. WHEN displaying subscription cards THEN each card SHALL have consistent spacing, typography, and visual hierarchy.
6. WHEN showing status indicators THEN the system SHALL use color-coded badges or dots for quick visual recognition.

### Requirement 4

**User Story:** As a user, I want the system to calculate how many days remain before a subscription expires, so that I can keep track of upcoming renewals.

### Acceptance Criteria

1. WHEN computing remaining days THEN the system SHALL calculate: subscription_date + 30 days – current_date (unless business rules are updated).
2. WHEN the remaining days result is negative THEN the system SHALL return 0.
3. WHEN the dashboard re-renders THEN computed values SHALL update accordingly.
4. WHEN calculating expiration THEN the system SHALL ensure timezone-safe logic to avoid off-by-one errors.

### Requirement 5

**User Story:** As a user, I want the ability to delete subscriptions, so that I can remove services I no longer use.

### Acceptance Criteria

1. WHEN viewing a subscription card THEN the system SHALL display a "Delete" button.
2. WHEN clicking the delete button THEN the system SHALL show a confirmation prompt.
3. WHEN the user confirms deletion THEN the system SHALL remove the subscription from SQLite.
4. WHEN deletion succeeds THEN the dashboard SHALL refresh automatically.
5. WHEN deletion fails THEN the system SHALL show an error message.

### Requirement 6

**User Story:** As a user, I want the dashboard to have a modern, professional design with clean aesthetics, so that I can enjoy using the application.

### Acceptance Criteria

1. WHEN viewing the dashboard THEN the system SHALL use a modern card-based layout with subtle shadows and rounded corners.
2. WHEN displaying the main interface THEN the system SHALL use a light background with proper contrast and spacing.
3. WHEN rendering subscription cards THEN each card SHALL have a clean white background with subtle elevation effects.
4. WHEN displaying the header THEN the system SHALL include a professional title, subtitle, and prominent action button.
5. WHEN showing empty states THEN the system SHALL display helpful illustrations and clear call-to-action messaging.
6. WHEN using the dashboard on different screen sizes THEN the layout SHALL adapt between desktop and mobile views.
7. WHEN viewing on mobile THEN subscription cards SHALL stack vertically with proper spacing.
8. WHEN opening the add subscription modal on mobile THEN the modal SHALL adapt to full-screen or mobile-friendly layout.
9. WHEN using assistive technologies THEN all interactive components SHALL be keyboard accessible.
10. WHEN interacting with buttons THEN the system SHALL provide focus rings and ARIA labels for accessibility.

### Requirement 7

**User Story:** As a user, I want the application to have a cohesive visual design system, so that the interface feels polished and professional.

### Acceptance Criteria

1. WHEN viewing any part of the application THEN the system SHALL use consistent color schemes, typography, and spacing.
2. WHEN displaying interactive elements THEN buttons SHALL have hover states, proper padding, and consistent styling.
3. WHEN showing loading states THEN the system SHALL display smooth animations and clear feedback.
4. WHEN rendering the layout THEN the system SHALL use proper visual hierarchy with appropriate font sizes and weights.
5. WHEN displaying content THEN the system SHALL maintain consistent margins, padding, and alignment throughout.
6. WHEN showing form elements THEN inputs SHALL have modern styling with proper focus states and validation feedback.

### Requirement 8

**User Story:** As a developer, I want subscription data to be persisted in a cloud database, so that information remains available between sessions and across devices.

### Acceptance Criteria

1. WHEN the application initializes THEN the system SHALL connect to Supabase using configured environment variables.
2. WHEN inserting, reading, or deleting subscriptions THEN all operations SHALL execute via Supabase client methods.
3. WHEN retrieving data THEN the system SHALL return objects in a normalized format suitable for the React components.
4. WHEN data operations fail THEN the system SHALL handle errors gracefully with meaningful messages.
5. WHEN the application restarts THEN subscriptions SHALL persist exactly as before.

**Note:** This requirement was updated as part of the Supabase migration. See `.kiro/specs/supabase-migration/` for migration details.

### Requirement 9

**User Story:** As a user, I want to categorize my subscriptions, so that I can organize them by type of service (e.g., Entertainment, Productivity, Health).

### Acceptance Criteria

1. WHEN adding a new subscription THEN the system SHALL allow me to select or enter a category.
2. WHEN viewing subscription cards THEN each card SHALL display the assigned category.
3. WHEN no category is specified THEN the system SHALL assign a default "General" category.
4. WHEN displaying categories THEN the system SHALL show predefined options like Entertainment, Productivity, Health, Finance, and General.
5. WHEN storing subscription data THEN the category SHALL be persisted in the database.

### Requirement 10

**User Story:** As a user, I want to view metrics about my subscriptions, so that I can understand my spending patterns and subscription distribution.

### Acceptance Criteria

1. WHEN accessing the metrics page THEN the system SHALL display three key metrics:
   - Total value of all active subscriptions
   - Total monthly spending on subscriptions
   - Total spending breakdown by category
2. WHEN displaying metrics THEN the system SHALL use charts and visual representations for better understanding.
3. WHEN calculating totals THEN the system SHALL only include active subscriptions.
4. WHEN showing category breakdown THEN the system SHALL display both amounts and percentages.
5. WHEN no subscriptions exist THEN the metrics page SHALL show appropriate empty states.

### Requirement 11

**User Story:** As a user, I want easy access to the metrics page from the dashboard, so that I can quickly view my subscription analytics.

### Acceptance Criteria

1. WHEN viewing the dashboard THEN the system SHALL display a "View Metrics" or "Analytics" button.
2. WHEN clicking the metrics button THEN the system SHALL navigate to the metrics page.
3. WHEN on the metrics page THEN the system SHALL provide a way to return to the dashboard.
4. WHEN navigating between pages THEN the system SHALL maintain a consistent header and navigation structure.

### Requirement 12

**User Story:** As a developer, I want the application to use modern UI components and charting libraries, so that the interface is visually appealing and data is presented effectively.

### Acceptance Criteria

1. WHEN displaying charts THEN the system SHALL use Recharts library for data visualization.
2. WHEN rendering UI components THEN the system SHALL use FlyonUI for consistent modern styling.
3. WHEN updating existing components THEN the system SHALL migrate to FlyonUI button styles and components.
4. WHEN displaying metrics THEN charts SHALL be responsive and accessible.
5. WHEN using FlyonUI THEN the system SHALL maintain design consistency across all components.

### Requirement 13

**User Story:** As a user, I want to log into the application, so that I can access my personal subscription data securely.

### Acceptance Criteria

1. WHEN the user clicks on the login button THEN the system SHALL verify the user and password fields to be filled.
2. WHEN the user clicks on the login button THEN the system SHALL send the request to verify the user data.

### Requirement 14

**User Story:** As a new user, I want to register for an account, so that I can start tracking my subscriptions.

### Acceptance Criteria

1. WHEN the user fills the register form and clicks on submit THEN the system SHALL verify all the form fields.
2. WHEN the user fills the register form and clicks on submit THEN the system SHALL save the data in the database.

### Requirement 15

**User Story:** As a logged-in user, I want to access my profile through a user menu, so that I can manage my account settings and log out when needed.

### Acceptance Criteria

1. WHEN viewing the application header THEN the system SHALL display a profile image for the logged-in user.
2. WHEN the user clicks on the profile icon THEN the system SHALL display a menu with two options: "Profile" and "Logout".
3. WHEN the user clicks outside the profile menu THEN the system SHALL close the menu.

