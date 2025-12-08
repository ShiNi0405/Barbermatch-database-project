import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type UserProfile = Database['public']['Tables']['users']['Row'];

export interface AuthModelResult<T = any> {
  data?: T;
  error?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UserRoleUpdate {
  userId: string;
  role: 'customer' | 'barber';
}

/**
 * Model layer for authentication data operations
 * Handles all Supabase database interactions for auth-related data
 */
export class AuthModel {
  /**
   * Create user profile in users table
   */
  static async createUserProfile(
    userId: string,
    name: string,
    email: string,
    role: 'customer' | 'barber' = 'customer'
  ): Promise<AuthModelResult<UserProfile>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          name,
          email,
          role,
        } as any)
        .select('*')
        .single();

      if (error) {
        return { data: undefined, error: error.message };
      }

      return { data: data ? (data as UserProfile) : undefined };
    } catch (error) {
      return { data: undefined, error: 'Failed to create user profile' };
    }
  }

  /**
   * Load user profile by user ID
   */
  static async loadUserProfile(userId: string): Promise<AuthModelResult<UserProfile>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        return { data: undefined, error: error.message };
      }

      return { data: data ? (data as UserProfile) : undefined };
    } catch (error) {
      return { data: undefined, error: 'Failed to load user profile' };
    }
  }

  /**
   * Update user role
   */
  static async updateUserRole(
    userId: string,
    role: 'customer' | 'barber'
  ): Promise<AuthModelResult<UserProfile>> {
    try {
      const { data, error } = await (supabase as any)
        .from('users')
        .update({ role })
        .eq('id', userId)
        .select('*')
        .single();

      if (error) {
        return { data: undefined, error: error.message };
      }

      return { data: data ? (data as UserProfile) : undefined };
    } catch (error) {
      return { data: undefined, error: 'Failed to update user role' };
    }
  }
}
