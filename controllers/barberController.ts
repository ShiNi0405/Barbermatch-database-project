import { BarberModel, BarberProfileData, PortfolioItemData } from '@/models/barber';
import { Database } from '@/types/database';

type Barber = Database['public']['Tables']['barbers']['Row'];
type Portfolio = Database['public']['Tables']['portfolio']['Row'];

export interface BarberControllerResult<T = any> {
  data?: T;
  error?: string;
}

/**
 * Controller layer for barber-related business logic
 * Handles validation, business rules, and orchestrates model operations
 */
export class BarberController {
  // Portfolio limits and validation
  private static readonly MAX_PORTFOLIO_ITEMS = 20;
  private static readonly REQUIRED_PROFILE_FIELDS = ['user_id', 'salon_name', 'phone', 'address', 'latitude', 'longitude'];

  /**
   * Create or update barber profile with validation
   */
  static async createBarberProfile(
    data: BarberProfileData
  ): Promise<BarberControllerResult<Barber>> {
    try {
      // Validate required fields
      const validationError = this.validateProfileData(data);
      if (validationError) {
        return { error: validationError };
      }

      // Validate coordinates
      const coordinateError = this.validateCoordinates(data.latitude, data.longitude);
      if (coordinateError) {
        return { error: coordinateError };
      }

      // Validate phone number
      const phoneError = this.validatePhoneNumber(data.phone);
      if (phoneError) {
        return { error: phoneError };
      }

      // Call model to create/update profile
      const result = await BarberModel.createOrUpdateProfile(data);
      
      if (result.error) {
        return { error: result.error };
      }

      return { data: result.data };
    } catch (error) {
      return { error: 'Failed to create barber profile' };
    }
  }

  /**
   * Load barber profile with error handling
   */
  static async loadBarberProfile(
    userId: string
  ): Promise<BarberControllerResult<Barber>> {
    try {
      if (!userId || typeof userId !== 'string') {
        return { error: 'Invalid user ID provided' };
      }

      const result = await BarberModel.loadProfileByUserId(userId);
      
      if (result.error) {
        return { error: result.error };
      }

      return { data: result.data };
    } catch (error) {
      return { error: 'Failed to load barber profile' };
    }
  }

  /**
   * Add portfolio item with validation and limits
   */
  static async addPortfolioItem(
    item: PortfolioItemData,
    currentPortfolioCount: number = 0
  ): Promise<BarberControllerResult<Portfolio>> {
    try {
      // Validate portfolio item data
      const validationError = this.validatePortfolioItem(item);
      if (validationError) {
        return { error: validationError };
      }

      // Check portfolio limit
      if (currentPortfolioCount >= this.MAX_PORTFOLIO_ITEMS) {
        return { error: `Portfolio limit reached. Maximum ${this.MAX_PORTFOLIO_ITEMS} items allowed.` };
      }

      // Get current count from database if not provided
      let portfolioCount = currentPortfolioCount;
      if (currentPortfolioCount === 0) {
        const countResult = await BarberModel.getPortfolioCount(item.barber_id);
        if (countResult.error) {
          return { error: countResult.error };
        }
        portfolioCount = countResult.count;
      }

      // Check limit again with actual count
      if (portfolioCount >= this.MAX_PORTFOLIO_ITEMS) {
        return { error: `Portfolio limit reached. Maximum ${this.MAX_PORTFOLIO_ITEMS} items allowed.` };
      }

      // Call model to add portfolio item
      const result = await BarberModel.addPortfolioItem(item);
      
      if (result.error) {
        return { error: result.error };
      }

      return { data: null }; // Success response
    } catch (error) {
      return { error: 'Failed to add portfolio item' };
    }
  }

  /**
   * Load portfolio with error handling
   */
  static async loadPortfolio(
    barberId: string
  ): Promise<BarberControllerResult<Portfolio[]>> {
    try {
      if (!barberId || typeof barberId !== 'string') {
        return { error: 'Invalid barber ID provided' };
      }

      const result = await BarberModel.loadPortfolioByBarberId(barberId);
      
      if (result.error) {
        return { error: result.error };
      }

      return { data: result.data };
    } catch (error) {
      return { error: 'Failed to load portfolio' };
    }
  }

  /**
   * Delete portfolio item with validation
   */
  static async deletePortfolioItem(itemId: string): Promise<BarberControllerResult> {
    try {
      if (!itemId || typeof itemId !== 'string') {
        return { error: 'Invalid portfolio item ID provided' };
      }

      const result = await BarberModel.deletePortfolioItem(itemId);
      
      if (result.error) {
        return { error: result.error };
      }

      return {}; // Success response
    } catch (error) {
      return { error: 'Failed to delete portfolio item' };
    }
  }

  /**
   * Validate barber profile data
   */
  private static validateProfileData(data: BarberProfileData): string | null {
    for (const field of this.REQUIRED_PROFILE_FIELDS) {
      if (!data[field as keyof BarberProfileData]) {
        return `Missing required field: ${field}`;
      }
    }

    if (data.salon_name.trim().length < 2) {
      return 'Salon name must be at least 2 characters long';
    }

    if (data.salon_name.trim().length > 100) {
      return 'Salon name must be less than 100 characters';
    }

    if (data.bio && data.bio.length > 500) {
      return 'Bio must be less than 500 characters';
    }

    return null;
  }

  /**
   * Validate coordinates
   */
  private static validateCoordinates(latitude: number, longitude: number): string | null {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return 'Latitude and longitude must be numbers';
    }

    if (latitude < -90 || latitude > 90) {
      return 'Latitude must be between -90 and 90';
    }

    if (longitude < -180 || longitude > 180) {
      return 'Longitude must be between -180 and 180';
    }

    return null;
  }

  /**
   * Validate phone number
   */
  private static validatePhoneNumber(phone: string): string | null {
    if (!phone || typeof phone !== 'string') {
      return 'Phone number is required';
    }

    // Basic phone validation - can be enhanced based on requirements
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      return 'Invalid phone number format';
    }

    return null;
  }

  /**
   * Validate portfolio item data
   */
  private static validatePortfolioItem(item: PortfolioItemData): string | null {
    if (!item.barber_id || typeof item.barber_id !== 'string') {
      return 'Invalid barber ID';
    }

    if (!item.category || !['men', 'women'].includes(item.category)) {
      return 'Category must be either "men" or "women"';
    }

    if (!item.title || item.title.trim().length < 2) {
      return 'Title must be at least 2 characters long';
    }

    if (item.title.trim().length > 100) {
      return 'Title must be less than 100 characters';
    }

    if (!item.before_image || typeof item.before_image !== 'string') {
      return 'Before image URL is required';
    }

    if (!item.after_image || typeof item.after_image !== 'string') {
      return 'After image URL is required';
    }

    return null;
  }

  /**
   * Get maximum portfolio items allowed
   */
  static getMaxPortfolioItems(): number {
    return this.MAX_PORTFOLIO_ITEMS;
  }

  /**
   * Check if portfolio is at limit
   */
  static isPortfolioAtLimit(currentCount: number): boolean {
    return currentCount >= this.MAX_PORTFOLIO_ITEMS;
  }
}
