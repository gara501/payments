# Subscription Management App

A modern, full-featured subscription management application built with React 19, TypeScript, and Supabase. Track your recurring subscriptions, visualize spending patterns, and never miss a renewal date.

## ✨ Features

### Core Functionality
- 📊 **Subscription Tracking** - Add, edit, and delete subscriptions with detailed information
- 💰 **Financial Analytics** - View total value, active subscriptions, and average costs
- 📈 **Data Visualization** - Interactive charts showing spending trends and category breakdowns
- 🏷️ **Category Management** - Organize subscriptions by type (Entertainment, Productivity, Health, Finance, General)
- ⏰ **Renewal Tracking** - Visual indicators showing days until renewal with color-coded status
- 🖼️ **Custom Images** - Add personalized background images to subscription cards

### Technical Features
- 🎨 **Modern Design System** - Built with TailwindCSS 4 and FlyonUI components
- ☁️ **Supabase Backend** - Cloud-based PostgreSQL database with real-time capabilities
- ✅ **Comprehensive Testing** - 189+ tests with Vitest and Testing Library
- 📱 **Responsive Design** - Mobile-first design that works on all screen sizes
- 🚀 **Production Ready** - Automated deployment with GitHub Actions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- A Supabase account (free tier available at [supabase.com](https://supabase.com))

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd payments

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your Supabase credentials

# Start development server
npm run dev
```

### Environment Configuration

Create a `.env` file with the following variables:

```bash
# Supabase Configuration (Required)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Jira Configuration (Optional, for MCP integration)
JIRA_HOST=your_jira_host
JIRA_EMAIL=your_email
JIRA_API_TOKEN=your_api_token
```

See [`docs/ENV_SETUP.md`](./docs/ENV_SETUP.md) for detailed setup instructions and [`docs/DATABASE_SETUP.md`](./docs/DATABASE_SETUP.md) for database configuration.

## 📚 Documentation

All detailed documentation has been organized in the [`docs/`](./docs/) folder:

### Setup & Configuration
- **[DATABASE_SETUP.md](./docs/DATABASE_SETUP.md)** - Database schema and setup guide
- **[ENV_SETUP.md](./docs/ENV_SETUP.md)** - Environment variables configuration
- **[ENV_IMPLEMENTATION_SUMMARY.md](./docs/ENV_IMPLEMENTATION_SUMMARY.md)** - Environment setup implementation details
- **[JIRA_SETUP.md](./docs/JIRA_SETUP.md)** - Jira MCP integration setup

### Deployment
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Production deployment guide for multiple platforms

### Implementation Guides
- **[METRICS_PAGE_IMPLEMENTATION.md](./docs/METRICS_PAGE_IMPLEMENTATION.md)** - Metrics page implementation
- **[METRIC_CARD_IMPLEMENTATION.md](./docs/METRIC_CARD_IMPLEMENTATION.md)** - Metric card component documentation
- **[BAR_CHART_IMPLEMENTATION.md](./docs/BAR_CHART_IMPLEMENTATION.md)** - Bar chart implementation guide
- **[PIE_CHART_IMPLEMENTATION.md](./docs/PIE_CHART_IMPLEMENTATION.md)** - Pie chart implementation guide
- **[SUMMARY_CARDS_IMPLEMENTATION.md](./docs/SUMMARY_CARDS_IMPLEMENTATION.md)** - Summary cards documentation
- **[LOADING_ANIMATIONS_IMPLEMENTATION.md](./docs/LOADING_ANIMATIONS_IMPLEMENTATION.md)** - Loading states implementation

### Design & Styling
- **[STYLING_GUIDE.md](./docs/STYLING_GUIDE.md)** - Design system and styling guidelines
- **[STYLING_CONSISTENCY_SUMMARY.md](./docs/STYLING_CONSISTENCY_SUMMARY.md)** - Styling consistency documentation

### Quick Reference
- **[QUICK_ENV_REFERENCE.md](./docs/QUICK_ENV_REFERENCE.md)** - Quick environment setup reference

## 🛠️ Development

### Available Commands

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production (TypeScript + Vite)
npm run preview      # Preview production build locally

# Testing
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once and exit

# Quality
npm run lint         # Run ESLint on all files

# Production
npm run verify-production  # Verify production build works correctly
```

### Project Structure

```
payments/
├── src/
│   ├── components/          # React components
│   │   ├── charts/          # Chart components (Recharts wrappers)
│   │   └── __tests__/       # Component tests
│   ├── db/                  # Database layer (Supabase adapter)
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   └── config/              # Configuration (env, Supabase)
├── docs/                    # Documentation
├── htmltests/               # Manual HTML test files
├── public/                  # Static assets
├── scripts/                 # Build and utility scripts
└── .kiro/                   # Kiro IDE configuration
```

## 🔧 Technology Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **TypeScript 5.9** - Type-safe development
- **Vite 7** - Fast build tool with ES modules
- **TailwindCSS 4** - Utility-first CSS framework
- **FlyonUI** - Modern UI component library
- **Recharts** - Data visualization library

### Backend & Database
- **Supabase** - Cloud PostgreSQL database
- **@supabase/supabase-js** - Supabase client library

### Testing & Quality
- **Vitest** - Fast unit test framework
- **@testing-library/react** - React component testing
- **ESLint 9** - Code linting
- **TypeScript** - Static type checking

## 🚀 Deployment

The app can be deployed to multiple platforms. See [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) for platform-specific instructions.

### GitHub Pages (Automated)

The repository includes a GitHub Actions workflow that automatically builds and deploys to GitHub Pages:

1. Enable GitHub Pages in repository settings (Source: "GitHub Actions")
2. Push to the main branch
3. The app will be automatically built and deployed

### Other Platforms
- **Netlify** - With custom headers configuration
- **Vercel** - With vercel.json configuration
- **Cloudflare Pages** - With _headers file

## 🎨 Design System

The application uses a consistent design system built on:

- **TailwindCSS 4** - Utility-first CSS framework
- **FlyonUI** - Modern UI component library
- **Raleway Font** - Clean, professional typography
- **Color Palette** - Carefully selected colors for accessibility and visual hierarchy
- **Responsive Grid** - Mobile-first, adaptive layouts

See [`docs/STYLING_GUIDE.md`](./docs/STYLING_GUIDE.md) for detailed design guidelines.

## 📊 Features in Detail

### Dashboard
- View all subscriptions in a card-based layout
- Status indicators (Active, Expiring Soon, Expired)
- Pagination with "View More" functionality
- Category filtering and organization

### Metrics & Analytics
- **Total Value** - Sum of all active subscriptions
- **Monthly Spending** - Trend visualization with bar charts
- **Category Breakdown** - Pie chart showing spending by category
- **Summary Cards** - Quick stats (total, active, inactive, average cost)
- **Interactive Charts** - Hover for detailed info

### Subscription Management
- Add subscriptions with custom images
- Set renewal dates and track days remaining
- Categorize by type (Entertainment, Productivity, etc.)
- Toggle active/inactive status
- Visual status indicators with color coding

## 🧪 Testing

The project includes comprehensive test coverage with 189+ tests:

- **Unit Tests** - Component and utility function tests
- **Integration Tests** - Database operations and hook interactions
- **Chart Tests** - Data visualization and responsive behavior
- **Accessibility Tests** - ARIA labels, keyboard navigation, screen reader support

Run tests with:

```bash
npm run test         # Watch mode
npm run test:run     # Single run
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Write tests for new features
- Follow the existing code style
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Use meaningful commit messages

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Built with [Kiro IDE](https://kiro.ai) - AI-powered development environment
- UI components from [FlyonUI](https://flyonui.com)
- Charts powered by [Recharts](https://recharts.org)
- Database by [Supabase](https://supabase.com)

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check the [`docs/`](./docs/) folder for detailed documentation
- Review existing issues before creating new ones

---

**Built with ❤️ using React, TypeScript, and Supabase**