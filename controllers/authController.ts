import { supabase } from '@/lib/supabase';
import { AuthModel, SignUpData, SignInData, UserRoleUpdate, AuthModelResult } from '@/models/auth';
import { User } from '@supabase/supabase-js';

export interface AuthControllerResult<T = any> {
  data?: T;
  error?: string;
}

/**
 * Controller layer for authentication business logic
 * Handles validation, orchestrates auth operations, and manages auth state changes
 */
export class AuthController {
  /**
   * Sign up a new user with profile creation
   */
  static async signUp(data: SignUpData): Promise<AuthControllerResult<User>> {
    try {
      // Validate input data
      const validationError = this.validateSignUpData(data);
      if (validationError) {
        return { error: validationError };
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        return { error: authError.message };
      }

      if (!authData.user) {
        return { error: 'Failed to create user account' };
      }

      // Create user profile in users table
      const profileResult = await AuthModel.createUserProfile(
        authData.user.id,
        data.name,
        data.email,
        'customer' // default role
      );

      if (profileResult.error) {
        // If profile creation fails, we should ideally clean up the auth user
        // For now, we'll return the error but the user will need to retry
        return { error: profileResult.error };
      }

      return { data: authData.user };
    } catch (error) {
      return { error: 'An unexpected error occurred during sign up' };
    }
  }

  /**
   * Sign in an existing user
   */
  static async signIn(data: SignInData): Promise<AuthControllerResult<User>> {
    try {
      // Validate input data
      const validationError = this.validateSignInData(data);
      if (validationError) {
        return { error: validationError };
      }

      // Authenticate user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        return { error: authError.message };
      }

      if (!authData.user) {
        return { error: 'Failed to sign in' };
      }

      return { data: authData.user };
    } catch (error) {
      return { error: 'An unexpected error occurred during sign in' };
    }
  }

  /**
   * Sign out the current user
   */
  static async signOut(): Promise<AuthControllerResult> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { error: error.message };
      }

      return {}; // Success
    } catch (error) {
      return { error: 'Failed to sign out' };
    }
  }

  /**
   * Update user role
   */
  static async updateUserRole(
    userId: string,
    role: 'customer' | 'barber'
  ): Promise<AuthControllerResult> {
    try {
      // Validate input
      if (!userId || typeof userId !== 'string') {
        return { error: 'Invalid user ID' };
      }

      if (!['customer', 'barber'].includes(role)) {
        return { error: 'Invalid role. Must be customer or barber' };
      }

      // Update role in database
      const result = await AuthModel.updateUserRole(userId, role);
      
      if (result.error) {
        return { error: result.error };
      }

      return {}; // Success
    } catch (error) {
      return { error: 'Failed to update user role' };
    }
  }

  /**
   * Load user profile by user ID
   */
  static async loadUserProfile(userId: string): Promise<AuthModelResult> {
    try {
      if (!userId || typeof userId !== 'string') {
        return { error: 'Invalid user ID' };
      }

      const result = await AuthModel.loadUserProfile(userId);
      
      if (result.error) {
        return { error: result.error };
      }

      return { data: result.data };
    } catch (error) {
      return { error: 'Failed to load user profile' };
    }
  }

  /**
   * Get current session
   */
  static async getCurrentSession(): Promise<AuthControllerResult<User | null>> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        return { error: error.message };
      }

      return { data: session?.user || null };
    } catch (error) {
      return { error: 'Failed to get current session' };
    }
  }

  /**
   * Set up auth state change listener
   */
  static setupAuthStateListener(
    onSignedIn: (user: User) => void,
    onSignedOut: () => void
  ): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        onSignedIn(session.user);
      } else if (event === 'SIGNED_OUT') {
        onSignedOut();
      }
    });

    // Return unsubscribe function
    return () => subscription.unsubscribe();
  }

  /**
   * Validate sign up data
   */
  private static validateSignUpData(data: SignUpData): string | null {
    if (!data.email || typeof data.email !== 'string') {
      return 'Email is required';
    }

    if (!data.password || typeof data.password !== 'string') {
      return 'Password is required';
    }

    if (!data.name || typeof data.name !== 'string') {
      return 'Name is required';
    }

    if (data.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }

    if (data.name.trim().length < 2) {
      return 'Name must be at least 2 characters long';
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return 'Invalid email format';
    }

    return null;
  }

  /**
   * Validate sign in data
   */
  private static validateSignInData(data: SignInData): string | null {
    if (!data.email || typeof data.email !== 'string') {
      return 'Email is required';
    }

    if (!data.password || typeof data.password !== 'string') {
      return 'Password is required';
    }

    return null;
  }
}
