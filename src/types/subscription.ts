export interface Subscription {
  id: number;
  name: string;
  subscription_date: string; // ISO date format (YYYY-MM-DD)
  value: number;
  is_active: boolean;
  background_image?: string; // Optional field
  category?: string; // Subscription category (Entertainment, Productivity, Health, Finance, General)
}

export interface CreateSubscriptionInput {
  name: string;
  subscription_date: string;
  value: number;
  is_active: boolean;
  background_image?: string;
  category?: string; // Optional, defaults to 'General'
}

// Predefined subscription categories
export const SUBSCRIPTION_CATEGORIES = [
  'Entertainment',
  'Productivity', 
  'Health',
  'Finance',
  'General'
] as const;

export type SubscriptionCategory = typeof SUBSCRIPTION_CATEGORIES[number];