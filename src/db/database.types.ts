/**
 * Database types for Supabase
 * 
 * These types represent the database schema and are used
 * for type-safe database operations.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      subscriptions: {
        Row: {
          id: string
          name: string
          subscription_date: string
          value: number
          is_active: boolean
          background_image: string | null
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          subscription_date: string
          value: number
          is_active?: boolean
          background_image?: string | null
          category?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          subscription_date?: string
          value?: number
          is_active?: boolean
          background_image?: string | null
          category?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
