# Tasks
## 1. Project Setup
- [x] Initialize project with React + Vite + TypeScript
- [X] Configure TailwindCSS in the project
- [x] Create base folder structure (components, hooks, db, types)
- [x] Create global Subscription type in /src/types
- [x] ~~Configure SQLite (WASM or local backend)~~ **Migrated to Supabase** - See `.kiro/specs/supabase-migration/`

## 2. State Management & Data Logic

- [x] Create useSubscriptions hook with methods: getAll, add, delete
- [x] Implement local state for pagination (limit = 10)
- [x] Add loadMore() function to increase limit by +5
- [x] Create getDaysLeft(subscription_date) helper function

## 3. UI Components
### 3.1 SubscriptionCard

- [x] Create <SubscriptionCard> component
- [x] Render: background image, name, date, value, active status
- [x] Display calculated "days left" field
- [x] Add Delete button with delete handler

### 3.2 Dashboard

- [x] Create <Dashboard> component
- [x] Render initial list of up to 10 subscriptions
- [x] Implement View more button to load +5 items
- [x] Add Add subscription button

### 3.3 AddSubscriptionForm

- [x] Create form with fields:
  - [x] background_image
  - [x] name
  - [x] subscription_date
  - [x] value
  - [x] is_active
- [x] Add basic validation
- [x] Connect form to addSubscription() logic

## 4. Database Integration

- [x] ~~Create initial subscriptions table~~ **Migrated to Supabase**
- [x] ~~Implement automatic table check/migration~~ **Migrated to Supabase**
- [x] Create database adapters:
  - [x] db.getAll()
  - [x] db.insert()
  - [x] db.delete()

**Note:** Database implementation migrated from SQLite to Supabase. See `.kiro/specs/supabase-migration/` for migration tasks.

## 5. UX Enhancements

- [x] Implement modal for "Add subscription"
- [x] Add smooth open/close animations
- [x] Add status colors:
  - [x] Green = Active
  - [x] Yellow = Expiring soon (<10 days)
  - [x] Red = Expired
- [x] Add success/error toasts

## 6. Testing

- [x] Write tests for useSubscriptions (add/delete/pagination)
- [x] Dashboard tests:
  - [x] Renders 10 items on initial load
  - [x] "View more" loads +5 items
- [x] SubscriptionCard tests:
  - [x] Correct days-left calculation

## 7. Modern UI Styling
- [x] 7.1 Update Dashboard component with modern layout and styling
- [x] Implement professional header design with improved typography
- [x] Add modern card grid layout with proper spacing
- [x] Update empty state with better visual design
- [x] Enhance loading states with smooth animations
  - _Requirements: 6.1, 6.4, 6.5, 7.1, 7.4_

- [x] 7.2 Redesign SubscriptionCard with modern aesthetics
  - [x] Update card structure with clean white background and subtle shadows
  - [ ] Improve header section with better image handling and gradient fallbacks
  - [ ] Enhance content layout with better typography hierarchy
  - [ ] Implement modern status indicators with color-coded badges
  - [ ] Add smooth hover effects and transitions
  - _Requirements: 3.5, 3.6, 6.1, 6.2, 7.1, 7.2_

- [x] 7.3 Enhance AddSubscriptionForm modal design
  - Update modal overlay with smooth animations
  - Improve form layout with modern input styling
  - Add better validation feedback with appropriate colors
  - Enhance button styling and states
  - _Requirements: 6.8, 7.2, 7.6_

- [x] 7.4 Implement design system consistency
  - Create consistent color palette throughout the application
  - Standardize typography scales and weights
  - Implement consistent spacing system
  - Ensure proper visual hierarchy across all components
  - _Requirements: 7.1, 7.2, 7.4, 7.5_

- [x] 7.5 Update component tests for new styling
  - Update Dashboard tests to verify new layout elements
  - Modify SubscriptionCard tests for new visual elements
  - Add tests for new styling classes and interactions
  - Ensure accessibility features are properly tested
  - _Requirements: 6.9, 6.10_

## 8. Deployment

- [x] Configure Vite for production (including SQLite WASM if used)
- [x] Add GitHub Action for automatic deployment to GitHub Pages

## 9. Category System Implementation

- [x] 9.1 Add category field to subscription database schema
  - Update database migration to add category column with default 'General'
  - Modify existing subscription type to include category field
  - Update seed data to include categories for test subscriptions
  - _Requirements: 9.5, 8.2_

- [x] 9.2 Create CategorySelector component
  - Implement dropdown/select component for category selection
  - Add predefined categories: Entertainment, Productivity, Health, Finance, General
  - Allow custom category input option
  - Style component using FlyonUI design system
  - _Requirements: 9.1, 9.4, 12.3_

- [x] 9.3 Update AddSubscriptionForm to include category selection
  - Integrate CategorySelector component into the form
  - Update form validation to handle category field
  - Modify form submission to include category data
  - Update database insert operations to store category
  - _Requirements: 9.1, 9.2, 9.5_

- [x] 9.4 Update SubscriptionCard to display category
  - Add category badge or label to subscription card design
  - Style category display with appropriate colors and typography
  - Ensure category is visible but doesn't clutter the card layout
  - _Requirements: 9.2, 12.3_

## 10. Metrics Page Development

- [ ] 10.1 Install and configure Recharts library
  - [x] Install recharts package via npm
  - [x] Configure TypeScript types for recharts components
  - [x] Create base chart wrapper components for consistent styling
  - _Requirements: 12.1, 12.4_

- [ ] 10.2 Create metrics calculation utilities
  - [x] Implement function to calculate total subscription value
  - [x] Create function to calculate monthly spending totals
  - [x] Build function to aggregate spending by category
  - [x] Add utility to format currency and percentage values
  - _Requirements: 10.1, 10.3, 10.4_

- [ ] 10.3 Build MetricCard component
  - [x] Create reusable component for displaying individual metrics
  - [x] Support title, value, and optional chart display
  - [x] Implement responsive design for mobile and desktop
  - [x] Style using FlyonUI components for consistency
  - _Requirements: 10.1, 12.3, 12.4_

- [ ] 10.4 Implement MetricsPage component
  - [x] Create main metrics page layout with three metric sections
  - [x] Integrate total value metric with appropriate visualization
  - [x] Add monthly spending metric with trend chart
  - [x] Implement category breakdown with pie chart
  - [x] Handle empty states when no subscriptions exist
  - _Requirements: 10.1, 10.2, 10.4, 10.5_

- [ ] 10.5 Add charts for data visualization
  - [x] Implement PieChart for category spending breakdown
  - [x] Create BarChart for monthly spending comparison
  - [x] Add summary cards for key metrics display
  - [x] Ensure charts are responsive and accessible
  - _Requirements: 10.2, 12.1, 12.4_

## 11. Navigation and UI Updates
- [x] Install and configure FlyonUI
- [x] Install flyonui package as dev dependency
- [x] Configure Tailwind CSS to use FlyonUI components
- [x] Update existing component imports to use FlyonUI
- [x] Ensure consistent styling across all components
  - _Requirements: 12.2, 12.5_

- [ ] 11.2 Add metrics navigation to Dashboard
  - [x] Add "View Metrics" button to dashboard header
  - [x] Implement navigation routing to metrics page
  - [x] Style button using FlyonUI button components
  - [x] Ensure button is accessible and properly labeled
  - [x] Add navigation header with page links
  - [x] Implement breadcrumb navigation for better UX
  - [x] Create a folder to include all the html tests, and move the current to it (folder name: htmltests)
  - _Requirements: 11.1, 11.2, 12.3_


## 12. Testing and Quality Assurance

- [ ] 12.1 Write tests for category functionality
  - Test CategorySelector component behavior
  - Verify category storage and retrieval from database
  - Test category display in SubscriptionCard
  - Ensure category validation in forms
  - _Requirements: 9.1, 9.2, 9.4_

- [ ] 12.2 Create tests for metrics calculations
  - Test total value calculation accuracy
  - Verify monthly spending calculations
  - Test category breakdown aggregation
  - Ensure proper handling of edge cases (no subscriptions, inactive subscriptions)
  - _Requirements: 10.1, 10.3, 10.4_

- [ ] 12.3 Test MetricsPage component functionality
  - Verify correct rendering of all three metrics
  - Test chart components display properly
  - Ensure responsive behavior on different screen sizes
  - Test empty state handling
  - _Requirements: 10.1, 10.2, 10.5_

- [ ] 12.4 Update existing tests for FlyonUI migration
  - Update component tests to work with new FlyonUI components
  - Verify accessibility features are maintained
  - Test button interactions and form submissions
  - Ensure visual regression testing passes
  - _Requirements: 12.3, 12.5_

## 13. Final Integration and Polish

- [ ] 13.1 Update seed data with categories
  - Modify existing seed data to include realistic categories
  - Ensure good distribution of categories for testing metrics
  - Add additional test subscriptions if needed for comprehensive testing
  - _Requirements: 9.5, 10.1_

- [ ] 13.2 Perform end-to-end testing
  - Test complete user flow from dashboard to metrics
  - Verify category selection and display works correctly
  - Test metrics calculations with real data
  - Ensure navigation between pages works smoothly
  - _Requirements: 10.1, 11.2, 11.4_

- [ ] 13.3 Optimize performance and accessibility
  - Ensure charts render efficiently with large datasets
  - Verify all components meet accessibility standards
  - Test keyboard navigation throughout the application
  - Optimize bundle size with proper tree shaking
  - _Requirements: 12.4, 12.5_

## 14. Authentication System Implementation

- [ ] 14.1 Create database schema for users and sessions
  - Create users table with email, username, password_hash, profile_image fields
  - Create sessions table for managing user authentication tokens
  - Add database migrations for new tables
  - Update database adapter to handle user operations
  - _Requirements: 13.1, 13.2_

- [ ] 14.2 Implement authentication service
  - Create AuthService with login, register, and logout methods
  - Implement password hashing using bcrypt or similar
  - Create session token generation and validation
  - Add secure token storage mechanism
  - _Requirements: 13.1, 13.2_

- [ ] 14.3 Build Login component
  - Create login form with email/username and password fields
  - Implement form validation for required fields
  - Add error handling and display for authentication failures
  - Style component using FlyonUI design system
  - Connect to AuthService for authentication
  - _Requirements: 13.1_

- [ ] 14.4 Build Registration component
  - Create registration form with all required fields
  - Implement comprehensive form validation
  - Add password strength indicator
  - Handle registration errors and display appropriate messages
  - Style component using FlyonUI design system
  - Connect to AuthService for user creation
  - _Requirements: 14.1, 14.2_

- [ ] 14.5 Create AuthContext for state management
  - Implement React Context for authentication state
  - Provide user session data throughout application
  - Handle authentication state changes
  - Implement protected route logic
  - _Requirements: 13.1, 13.2_

- [ ] 14.6 Build Profile Menu component
  - Create profile icon component for header
  - Implement dropdown menu with Profile and Logout options
  - Add click-outside-to-close functionality
  - Style menu using FlyonUI components
  - Connect logout action to AuthService
  - _Requirements: 15.1, 15.2, 15.3_

- [ ] 14.7 Integrate authentication with existing app
  - Add authentication check to Dashboard component
  - Redirect unauthenticated users to login page
  - Update navigation to include profile menu
  - Ensure subscriptions are user-specific
  - _Requirements: 13.1, 15.1_

- [ ] 14.8 Implement routing for authentication pages
  - Create routes for login and registration pages
  - Add protected routes for authenticated pages
  - Implement redirect logic after login/logout
  - Add navigation between login and registration
  - _Requirements: 13.1, 14.1_

## 15. Authentication Testing and Security

- [ ] 15.1 Write tests for authentication components
  - Test Login component form validation and submission
  - Test Registration component validation and user creation
  - Test Profile Menu component interactions
  - Verify error handling for authentication failures
  - _Requirements: 13.1, 14.1, 15.1, 15.2, 15.3_

- [ ] 15.2 Test authentication service
  - Test password hashing and verification
  - Test session token generation and validation
  - Test user creation and retrieval
  - Verify secure storage of credentials
  - _Requirements: 13.1, 13.2, 14.1, 14.2_

- [ ] 15.3 Implement security best practices
  - Ensure passwords are never stored in plain text
  - Implement secure session management
  - Add input sanitization for all user inputs
  - Test for common security vulnerabilities
  - _Requirements: 13.1, 13.2, 14.1, 14.2_

- [ ] 15.4 Test authentication flow end-to-end
  - Test complete registration to login flow
  - Verify protected routes work correctly
  - Test logout and session cleanup
  - Ensure profile menu functions properly
  - _Requirements: 13.1, 14.1, 15.1, 15.2, 15.3_


## 16. Supabase implementation
- [x] Implement supabase as a database, install the library
- [x] Create configuration file for supabase and use the current .env variables defined
- [x] Replace all the CRUD functions that are using sqlite with supabase logic
- [x] Test add, delete, modify subscription against supabase data
- [x] Modify tests to support supabase connection
