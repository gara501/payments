import { DatabaseAdapter } from './adapter';
import type { Subscription } from '../types/subscription';

export const sampleSubscriptions: Omit<Subscription, 'id'>[] = [
  {
    name: 'Netflix',
    subscription_date: '2024-01-15',
    value: 15.99,
    is_active: true,
    background_image: '/assets/subscriptions/netflix.svg',
    category: 'Entertainment',
  },
  {
    name: 'Spotify Premium',
    subscription_date: '2024-02-01',
    value: 9.99,
    is_active: true,
    background_image: '/assets/subscriptions/spotify.svg',
    category: 'Entertainment',
  },
  {
    name: 'Adobe Creative Cloud',
    subscription_date: '2024-01-01',
    value: 52.99,
    is_active: true,
    background_image: '/assets/subscriptions/adobe.svg',
    category: 'Productivity',
  },
  {
    name: 'GitHub Pro',
    subscription_date: '2024-03-01',
    value: 4.00,
    is_active: false,
    category: 'Productivity',
  },
  {
    name: 'Microsoft 365',
    subscription_date: '2024-04-01',
    value: 12.99,
    is_active: true,
    category: 'Productivity',
  },
  {
    name: 'Dropbox Plus',
    subscription_date: '2024-05-01',
    value: 9.99,
    is_active: true,
    category: 'Productivity',
  },
  {
    name: 'Figma Professional',
    subscription_date: '2024-06-01',
    value: 12.00,
    is_active: true,
    category: 'Productivity',
  },
  {
    name: 'Notion Pro',
    subscription_date: '2024-07-01',
    value: 8.00,
    is_active: true,
    category: 'Productivity',
  },
  {
    name: 'Slack Pro',
    subscription_date: '2024-08-01',
    value: 6.67,
    is_active: true,
    category: 'Productivity',
  },
  {
    name: 'Zoom Pro',
    subscription_date: '2024-09-01',
    value: 14.99,
    is_active: true,
    category: 'Productivity',
  },
  {
    name: 'Canva Pro',
    subscription_date: '2024-10-01',
    value: 12.99,
    is_active: true,
    category: 'Productivity',
  },
  {
    name: 'LastPass Premium',
    subscription_date: '2024-11-01',
    value: 3.00,
    is_active: false,
    category: 'Finance',
  },
  {
    name: 'Disney Plus',
    subscription_date: '2024-12-01',
    value: 7.99,
    is_active: true,
    background_image: '/assets/subscriptions/disney.png',
    category: 'Entertainment',
  },
  {
    name: 'Amazon Prime',
    subscription_date: '2025-01-01',
    value: 14.98,
    is_active: true,
    background_image: '/assets/subscriptions/prime.png',
    category: 'General',
  },
  {
    name: 'YouTube Premium',
    subscription_date: '2025-02-01',
    value: 11.99,
    is_active: true,
    background_image: '/assets/subscriptions/youtube.png',
    category: 'Entertainment',
  },
];

export async function seedDatabase(adapter: DatabaseAdapter): Promise<void> {
  try {
    console.log('Seeding database with sample data...');

    // Check if data already exists
    const existingSubscriptions = await adapter.getAll();
    if (existingSubscriptions.length > 0) {
      console.log('Database already contains data, skipping seed');
      return;
    }

    // Insert sample data
    for (let i = 0; i < sampleSubscriptions.length; i++) {
      const subscription = sampleSubscriptions[i];
      const id = await adapter.insert(subscription);
      console.log(`Inserted subscription ${i + 1}: ${subscription.name} (ID: ${id})`);
    }

    console.log('✓ Database seeded successfully');
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
}