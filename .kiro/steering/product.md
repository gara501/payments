# Product Overview

A modern subscription management application built with React that helps users track and manage their recurring subscriptions. The app provides a comprehensive dashboard for monitoring subscription costs, renewal dates, and categories.

## Key Features

- **Subscription Tracking**: Add, edit, and delete subscriptions with detailed information
- **Visual Dashboard**: Card-based interface showing subscription status and renewal indicators
- **Category Management**: Organize subscriptions by type (Entertainment, Productivity, Health, Finance, General)
- **Cloud Storage**: Supabase-powered PostgreSQL database with automatic data seeding
- **Multi-Device Sync**: Access your subscriptions from any device
- **Real-time Updates**: Live status indicators showing days until renewal
- **Image Support**: Custom background images for subscription cards
- **Responsive Design**: Mobile-friendly interface with TailwindCSS

## Target Users

Individuals who want to track and manage their recurring subscription services to better understand their monthly/yearly spending and avoid unwanted renewals.

## Data Model

The core entity is a `Subscription` with properties:
- Basic info: id (UUID), name, value, subscription_date, is_active
- Visual: background_image, category
- Metadata: created_at timestamp
- Computed: days until renewal, status indicators