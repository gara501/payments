# Design Document
## Overview

This document defines the architectural and component-level design for the Subscription Dashboard application. The system is built using React for the frontend and SQLite for local data persistence. The dashboard will render subscription cards, support progressive loading, handle CRUD operations, and compute dynamic metadata such as remaining days until expiration.

The design focuses on modularity, maintainability, and alignment with best practices for modern React applications.

## Architecture

The system consists of three main layers:

1. **UI Layer (React components)**
   - Dashboard
   - SubscriptionCard
   - AddSubscriptionModal
   - MetricsPage
   - CategorySelector
   - MetricCard
   - ChartComponents (using Recharts)

2. **State & Data Management**
   - SubscriptionStore (Zustand or Context)
   - Pagination logic
   - Derived/computed state (days remaining)

3. **Data Persistence Layer (Supabase)**
   - Repository abstraction (DatabaseAdapter)
   - Cloud PostgreSQL database
   - CRUD operations via Supabase client

The frontend communicates with Supabase through the DatabaseAdapter, which uses the Supabase JavaScript client to interact with the cloud PostgreSQL database.

**Note:** The application was migrated from SQLite WASM to Supabase. See `.kiro/specs/supabase-migration/` for migration details.

# Component Design
## Dashboard Component

**Responsibilities:**
- Fetch and display subscription data
- Render up to 10 items at load
- Handle "View more" logic (+5 items each click)
- Trigger AddSubscriptionModal
- Display loading/error states
- Pass props to SubscriptionCard

**Key Interactions:**
- Calls SubscriptionStore to retrieve subscriptions
- Handles incremental pagination logic
- Opens and closes modal state

**Props:**
- None

**State:**
- visibleCount: number of items currently displayed (initial: 10, increment: +5)
- isModalOpen: bool

## SubscriptionCard Component

**Responsibilities:**
- Display subscription information in a styled card
- Compute remaining days until expiration
- Render image, name, price, date, active flag
- Provide deletion functionality with user confirmation

**Key Interactions:**
- Calls SubscriptionStore.delete(id)
- Computes remaining days using helper functions

**Props:**
- subscription: { id, name, subscription_date, value, is_active, background_image, category }

**Internal Logic:**
- daysRemaining = max(0, (subscription_date + 30 days) - today)

## AddSubscriptionModal Component

**Responsibilities:**
- Render a form for creating a subscription
- Validate input fields
- Submit the new subscription to the store/database
- Close on success

**Key Interactions:**
- Calls SubscriptionStore.create(subscription)

**Props:**
- isOpen: boolean
- onClose: function

**Form Fields:**
- name: string (required)
- subscription_date: date (required)
- value: number (required)
- is_active: boolean (default: true)
- background_image: string (optional)
- category: string (required, default: 'General')

## MetricsPage Component

**Responsibilities:**
- Display comprehensive subscription analytics
- Render three key metrics with visual charts
- Calculate and show total subscription value
- Display monthly spending totals
- Show category-based spending breakdown

**Key Interactions:**
- Calls SubscriptionStore to retrieve all subscription data
- Computes metrics from subscription data
- Renders Recharts components for data visualization

**Props:**
- None

**State:**
- metrics: computed metrics object
- loading: boolean for data fetching state

## CategorySelector Component

**Responsibilities:**
- Provide category selection interface for subscriptions
- Display predefined category options
- Allow custom category input

**Key Interactions:**
- Used within AddSubscriptionModal and EditSubscriptionModal
- Passes selected category to parent component

**Props:**
- value: string (current category)
- onChange: function to handle category changes
- categories: array of predefined categories

## MetricCard Component

**Responsibilities:**
- Display individual metric with title, value, and optional chart
- Provide consistent styling for metric presentation

**Props:**
- title: string
- value: number or string
- chart: optional React component (Recharts chart)
- format: optional formatting function


## Data Persistence Design (Supabase)
### Database Schema

### Table: subscriptions
| Column            | Type         | Constraints               |
| ----------------- | ------------ | ------------------------- |
| id                | UUID         | PRIMARY KEY DEFAULT gen_random_uuid() |
| name              | TEXT         | NOT NULL                  |
| subscription_date | TIMESTAMPTZ  | NOT NULL                  |
| value             | NUMERIC(10,2)| NOT NULL                  |
| is_active         | BOOLEAN      | NOT NULL DEFAULT true     |
| background_image  | TEXT         | NULL                      |
| category          | TEXT         | DEFAULT 'General'         |
| created_at        | TIMESTAMPTZ  | DEFAULT NOW()             |

### Indexes
- **idx_subscriptions_date** on subscription_date (DESC)
- **idx_subscriptions_category** on category

### Row Level Security
- RLS enabled with permissive policy (allows all operations)
- Prepared for future user-specific policies

## CRUD Operations
### create
```typescript
await supabase
  .from('subscriptions')
  .insert({ name, subscription_date, value, is_active, background_image, category })
  .select()
  .single();
```
### read
```typescript
await supabase
  .from('subscriptions')
  .select('*')
  .order('subscription_date', { ascending: false });
```
### delete
```typescript
await supabase
  .from('subscriptions')
  .delete()
  .eq('id', id);
```

**Note:** Migrated from SQLite to Supabase. See `.kiro/specs/supabase-migration/` for details.

## Metrics Calculation Logic

### Total Subscription Value
```typescript
const calculateTotalValue = (subscriptions: Subscription[]): number => {
  return subscriptions
    .filter(sub => sub.is_active)
    .reduce((total, sub) => total + sub.value, 0);
};
```

### Monthly Spending Total
```typescript
const calculateMonthlyTotal = (subscriptions: Subscription[]): number => {
  return subscriptions
    .filter(sub => sub.is_active)
    .reduce((total, sub) => total + sub.value, 0);
};
```

### Category Breakdown
```typescript
const calculateCategoryBreakdown = (subscriptions: Subscription[]): CategoryMetric[] => {
  const activeSubscriptions = subscriptions.filter(sub => sub.is_active);
  const categoryTotals = activeSubscriptions.reduce((acc, sub) => {
    acc[sub.category] = (acc[sub.category] || 0) + sub.value;
    return acc;
  }, {} as Record<string, number>);
  
  const total = Object.values(categoryTotals).reduce((sum, value) => sum + value, 0);
  
  return Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
    percentage: (amount / total) * 100
  }));
};
```

## Category System Design

### Predefined Categories
- **Entertainment**: Netflix, Spotify, Disney+, YouTube Premium
- **Productivity**: Microsoft 365, Adobe Creative Suite, Notion
- **Health**: Fitness apps, meditation apps, health tracking
- **Finance**: Banking services, investment platforms, budgeting tools
- **General**: Default category for uncategorized subscriptions

### Category Color Coding
- Entertainment: Blue (#3B82F6)
- Productivity: Green (#10B981)
- Health: Red (#EF4444)
- Finance: Yellow (#F59E0B)
- General: Gray (#6B7280)

## Flow Diagrams
1. Subscription Loading Flow
```scss
Dashboard mounts
    ↓
SubscriptionStore.loadAll()
    ↓
SQLite query (SELECT ...)
    ↓
Store updates subscriptions[]
    ↓
Dashboard renders first 10 items
```

2. Add Subscription Flow
```scss
User clicks "Add Subscription"
    ↓
Modal opens
    ↓
User submits form
    ↓
Validate input
    ↓
SubscriptionStore.create()
    ↓
SQLite INSERT
    ↓
Store reloads all subscriptions
    ↓
Modal closes + Dashboard updates
```

3. Delete Subscription Flow
```scss
User clicks "Delete"
    ↓
Show confirmation dialog
    ↓
User confirms
    ↓
SubscriptionStore.delete(id)
    ↓
SQLite DELETE
    ↓
Store reloads
    ↓
Dashboard updates
```

4. Metrics Page Navigation Flow
```scss
User clicks "View Metrics" on Dashboard
    ↓
Navigate to /metrics route
    ↓
MetricsPage component mounts
    ↓
Load all subscriptions from store
    ↓
Calculate metrics (total, monthly, categories)
    ↓
Render metric cards with charts
    ↓
Display interactive charts using Recharts
```

5. Category Selection Flow
```scss
User opens Add Subscription modal
    ↓
CategorySelector renders with predefined options
    ↓
User selects category or enters custom category
    ↓
Form validates category field
    ↓
Subscription saved with category
    ↓
SubscriptionCard displays category badge
```

## UI/UX Design

### Design System

**Color Palette:**
- Primary: Blue (#3B82F6) for main actions and accents
- Success: Green (#10B981) for active subscriptions
- Warning: Yellow (#F59E0B) for expiring subscriptions  
- Danger: Red (#EF4444) for expired/delete actions
- Neutral: Gray scale (#F9FAFB to #111827) for text and backgrounds

**Typography:**
- Font Family: Raleway (Google Fonts) with system font fallbacks
- Headings: Font weight 600-700, appropriate sizing hierarchy
- Body text: Font weight 400-500, readable line heights
- Labels: Font weight 500-600 for emphasis

**Spacing System:**
- Base unit: 4px (0.25rem)
- Common spacing: 4px, 8px, 12px, 16px, 24px, 32px, 48px

### Dashboard Layout

1. **Header Section:**
   - Large title with professional typography
   - Descriptive subtitle in muted color
   - Prominent "Add Subscription" button with icon
   - Proper spacing and alignment

2. **Content Area:**
   - Responsive grid layout (1-3 columns based on screen size)
   - Consistent card spacing and alignment
   - Clean background with subtle texture or solid color

3. **Empty State:**
   - Centered layout with helpful illustration
   - Clear messaging and call-to-action
   - Professional but friendly tone

4. **Loading States:**
   - Smooth spinner animations
   - Proper centering and sizing

### SubscriptionCard Design

1. **Card Structure:**
   - Clean white background with subtle shadow
   - Rounded corners (8px border radius)
   - Hover effects with smooth transitions

2. **Header Section:**
   - Background image or modern gradient fallback
   - Delete button positioned in top-right corner
   - Proper aspect ratio and image handling

3. **Content Section:**
   - Clear typography hierarchy
   - Proper spacing between elements
   - Currency formatting with emphasis
   - Status indicators with color coding

4. **Visual States:**
   - Active: Green status indicator
   - Expiring: Yellow status indicator  
   - Expired: Red status indicator
   - Inactive: Gray status indicator

### Modal Design

1. **Overlay:**
   - Semi-transparent dark background
   - Smooth fade-in animation
   - Click-outside-to-close functionality

2. **Modal Content:**
   - Clean white background
   - Rounded corners and proper padding
   - Responsive sizing with max-width constraints
   - Smooth scale-in animation

3. **Form Layout:**
   - Consistent input styling
   - Proper label positioning
   - Validation feedback with appropriate colors
   - Action buttons with clear hierarchy

### Interactive Elements

1. **Buttons (FlyonUI):**
   - Primary buttons for main actions (Add Subscription, View Metrics)
   - Secondary buttons for navigation and less critical actions
   - Danger buttons for delete operations
   - Consistent padding, border radius, and typography
   - Hover, focus, and active states
   - Loading states with spinners for async actions

2. **Form Inputs (FlyonUI):**
   - Modern input styling with subtle borders
   - Focus states with accent colors and shadows
   - Proper label positioning and typography
   - Error states with red accents and validation messages
   - Dropdown/select styling for category selection

3. **Status Indicators:**
   - Category badges with rounded corners and appropriate colors
   - Subscription status dots with color coding
   - Consistent sizing and positioning across components

### Metrics Page Design

1. **Page Layout:**
   - Header with page title and navigation back to dashboard
   - Three-column grid layout for metric cards (responsive to single column on mobile)
   - Consistent spacing and alignment with dashboard

2. **Metric Cards:**
   - Clean white background with subtle shadows (FlyonUI card component)
   - Header section with metric title and value
   - Chart section with Recharts visualization
   - Consistent padding and typography hierarchy

3. **Chart Design:**
   - **Total Value**: Large display number with currency formatting
   - **Monthly Total**: Bar chart showing monthly spending trends
   - **Category Breakdown**: Pie chart with category colors and percentages
   - Responsive design that adapts to card size
   - Accessible color palette with sufficient contrast

### Category System Design

1. **Category Selector:**
   - Dropdown with predefined categories
   - Search/filter functionality for large category lists
   - Option to add custom categories
   - Visual indicators (icons or colors) for each category

2. **Category Display:**
   - Small badges on subscription cards
   - Color-coded based on category type
   - Consistent typography and sizing
   - Hover effects for interactive elements

3. **Category Colors:**
   - Entertainment: Blue (#3B82F6)
   - Productivity: Green (#10B981)
   - Health: Red (#EF4444)
   - Finance: Yellow (#F59E0B)
   - General: Gray (#6B7280)


## Accessibility Design

1. All buttons include ARIA labels.
2. Subscription cards fully keyboard-navigable.
3. Modal traps focus.
4. Color contrast meets WCAG AA.
5. Delete action includes accessible confirmation dialog.

## Error Handling
### UI-level errors:
- Toast or inline banners for:
  - DB failures
  - Validation failures
  - Network/file access issues (if applicable)

### DB-level errors:
- Wrapped in safe error messages returned to UI
- Prevent UI crashes

## Performance Considerations

- Only load visible subscriptions
- Pagination reduces initial render load
- Memoize computed fields when possible
- SQLite queries optimized with date index

## Technology Stack Updates

### UI Framework Integration
- **FlyonUI**: Modern UI component library for consistent styling
  - Button components with modern design
  - Form elements with improved accessibility
  - Card components with enhanced visual appeal
  - Navigation components for page routing

### Data Visualization
- **Recharts**: React charting library for metrics visualization
  - PieChart for category breakdown
  - BarChart for monthly comparisons
  - LineChart for trend analysis
  - Responsive design for mobile compatibility

### Metrics Calculations
- **Total Value**: Sum of all active subscription values
- **Monthly Total**: Total monthly spending (assuming 30-day cycles)
- **Category Breakdown**: Aggregated spending by subscription category

## Navigation Design

### Routing Structure
- `/` - Dashboard (main subscription list)
- `/metrics` - Analytics and metrics page
- Modal overlays for add/edit subscription forms

### Navigation Components
- Header with navigation buttons
- Breadcrumb navigation for context
- Mobile-responsive navigation menu

## Authentication System Design

### Login Component

**Responsibilities:**
- Display login form with username/email and password fields
- Validate form inputs before submission
- Send authentication request to backend/auth service
- Handle authentication errors and display appropriate messages
- Redirect to dashboard on successful login

**Key Interactions:**
- Calls AuthService.login(credentials)
- Updates AuthContext with user session
- Stores authentication token in secure storage

**Props:**
- onLoginSuccess: callback function for successful login

**Form Fields:**
- email/username: string (required)
- password: string (required)

**Validation Rules:**
- Email/username must not be empty
- Password must not be empty
- Display error messages for invalid credentials

### Registration Component

**Responsibilities:**
- Display registration form with required user information
- Validate all form fields before submission
- Submit new user data to backend/auth service
- Handle registration errors and display appropriate messages
- Redirect to login or dashboard on successful registration

**Key Interactions:**
- Calls AuthService.register(userData)
- Validates form data client-side
- Stores user data in database

**Props:**
- onRegistrationSuccess: callback function for successful registration

**Form Fields:**
- email: string (required, must be valid email format)
- username: string (required)
- password: string (required, minimum length requirements)
- confirmPassword: string (required, must match password)

**Validation Rules:**
- All fields must be filled
- Email must be valid format
- Password must meet security requirements (length, complexity)
- Confirm password must match password field

### Profile Menu Component

**Responsibilities:**
- Display user profile image in application header
- Show dropdown menu on profile icon click
- Provide navigation to profile page
- Provide logout functionality
- Close menu when clicking outside

**Key Interactions:**
- Calls AuthService.logout()
- Navigates to profile page
- Updates UI state on menu open/close

**Props:**
- user: User object with profile information
- onLogout: callback function for logout action

**Menu Options:**
- Profile: Navigate to user profile page
- Logout: End user session and redirect to login

**UI Behavior:**
- Menu opens on profile icon click
- Menu closes on outside click
- Menu closes on option selection
- Smooth animation for menu open/close

### Authentication Flow

1. **Login Flow:**
```scss
User enters credentials
    ↓
Validate form fields
    ↓
AuthService.login(credentials)
    ↓
Backend validates credentials
    ↓
Store auth token and user data
    ↓
Update AuthContext
    ↓
Redirect to dashboard
```

2. **Registration Flow:**
```scss
User fills registration form
    ↓
Validate all form fields
    ↓
AuthService.register(userData)
    ↓
Backend creates user account
    ↓
Store user data in database
    ↓
Auto-login or redirect to login page
```

3. **Profile Menu Flow:**
```scss
User clicks profile icon
    ↓
Display dropdown menu
    ↓
User selects option (Profile/Logout)
    ↓
If Logout: Clear auth data and redirect to login
If Profile: Navigate to profile page
    ↓
Close menu
```

### Authentication Data Models

**User Interface:**
```typescript
interface User {
  id: number;
  email: string;
  username: string;
  profileImage?: string;
  createdAt: string;
}
```

**AuthCredentials Interface:**
```typescript
interface AuthCredentials {
  email: string;
  password: string;
}
```

**RegistrationData Interface:**
```typescript
interface RegistrationData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}
```

### Database Schema Updates

**Table: users**
| Column        | Type       | Constraints               |
| ------------- | ---------- | ------------------------- |
| id            | INTEGER    | PRIMARY KEY AUTOINCREMENT |
| email         | TEXT       | NOT NULL UNIQUE           |
| username      | TEXT       | NOT NULL UNIQUE           |
| password_hash | TEXT       | NOT NULL                  |
| profile_image | TEXT       | NULL                      |
| created_at    | TEXT (ISO) | NOT NULL                  |

**Table: sessions**
| Column     | Type       | Constraints               |
| ---------- | ---------- | ------------------------- |
| id         | INTEGER    | PRIMARY KEY AUTOINCREMENT |
| user_id    | INTEGER    | NOT NULL FOREIGN KEY      |
| token      | TEXT       | NOT NULL UNIQUE           |
| expires_at | TEXT (ISO) | NOT NULL                  |
| created_at | TEXT (ISO) | NOT NULL                  |

### Security Considerations

1. **Password Storage:**
   - Never store plain text passwords
   - Use bcrypt or similar hashing algorithm
   - Implement salt for additional security

2. **Session Management:**
   - Use secure, httpOnly cookies for session tokens
   - Implement token expiration
   - Provide token refresh mechanism

3. **Input Validation:**
   - Sanitize all user inputs
   - Validate email format
   - Enforce password complexity requirements
   - Prevent SQL injection with parameterized queries

4. **Error Handling:**
   - Don't reveal whether email exists during login
   - Use generic error messages for security
   - Log authentication attempts for monitoring

## Future Enhancements (Out of Scope)

- Custom renewal periods
- Cloud sync or backend API
- Advanced analytics (trends, predictions)
- Subscription notifications and reminders
- Two-factor authentication
- Social login integration
- Password reset functionality
