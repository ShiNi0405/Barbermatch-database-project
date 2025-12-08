import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

export interface CurrentUserSession {
  user: User | null;
  session: Session | null;
}

/**
 * Service function to get the current authenticated user and session.
 * Wraps Supabase Auth getSession and normalizes the return shape.
 */
export async function getCurrentUserSession(): Promise<CurrentUserSession> {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('[authService] Failed to get current user session:', error);
      return {
        user: null,
        session: null,
      };
    }

    return {
      user: session?.user ?? null,
      session: session ?? null,
    };
  } catch (err) {
    console.error('[authService] Unexpected error while getting current user session:', err);

    return {
      user: null,
      session: null,
    };
  }
}


