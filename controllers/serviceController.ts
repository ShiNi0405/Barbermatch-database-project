import { ServiceModel, ServiceData, ServiceUpdate } from '@/models/service';
import { Database } from '@/types/database';

type Service = Database['public']['Tables']['services']['Row'];
type ServiceWithCategory = Service & {
  service_categories: {
    id: string;
    name: string;
    barber_id: string | null;
  };
};

export interface ServiceControllerResult<T = any> {
  data?: T;
  error?: string;
}

export interface ServiceFormData {
  barber_id: string;
  name: string;
  category_id: string;
  description?: string;
  price_type: 'fixed' | 'range' | 'starting_from';
  price_min: number;
  price_max?: number | null;
  duration: number;
  image_url?: string | null;
}

/**
 * Controller layer for service-related business logic
 * Handles validation, business rules, and orchestrates model operations
 */
export class ServiceController {
  // Business rules and limits
  private static readonly MAX_SERVICES_PER_BARBER = 50;
  private static readonly MIN_SERVICE_NAME_LENGTH = 2;
  private static readonly MAX_SERVICE_NAME_LENGTH = 100;
  private static readonly MAX_DESCRIPTION_LENGTH = 500;
  private static readonly MIN_PRICE = 0.01;
  private static readonly MAX_PRICE = 10000;
  private static readonly MIN_DURATION = 15;
  private static readonly MAX_DURATION = 480; // 8 hours
  private static readonly ALLOWED_PRICE_TYPES: Array<'fixed' | 'range' | 'starting_from'> = ['fixed', 'range', 'starting_from'];

  /**
   * Add a new service with validation
   */
  static async addService(
    formData: ServiceFormData,
    currentServiceCount: number = 0
  ): Promise<ServiceControllerResult<Service>> {
    try {
      // Validate service data
      const validationError = this.validateServiceData(formData);
      if (validationError) {
        return { error: validationError };
      }

      // Check service limit
      if (currentServiceCount >= this.MAX_SERVICES_PER_BARBER) {
        return { error: `Service limit reached. Maximum ${this.MAX_SERVICES_PER_BARBER} services allowed per barber.` };
      }

      // Get current count from database if not provided
      let serviceCount = currentServiceCount;
      if (currentServiceCount === 0) {
        const countResult = await ServiceModel.getServiceCount(formData.barber_id);
        if (countResult.error) {
          return { error: countResult.error };
        }
        serviceCount = countResult.count;
      }

      // Check limit again with actual count
      if (serviceCount >= this.MAX_SERVICES_PER_BARBER) {
        return { error: `Service limit reached. Maximum ${this.MAX_SERVICES_PER_BARBER} services allowed per barber.` };
      }

      // Prepare service data
      const serviceData: ServiceData = {
        barber_id: formData.barber_id,
        name: formData.name.trim(),
        category_id: formData.category_id,
        description: formData.description?.trim() || '',
        price_type: formData.price_type,
        price_min: formData.price_min,
        price_max: formData.price_max || null,
        duration: formData.duration,
        image_url: formData.image_url || null,
      };

      // Call model to add service
      const result = await ServiceModel.addService(serviceData);
      
      if (result.error) {
        return { error: result.error };
      }

      return { data: undefined }; // Success response
    } catch (error) {
      return { error: 'Failed to add service' };
    }
  }

  /**
   * Update an existing service with validation
   */
  static async updateService(
    id: string,
    updates: Partial<ServiceFormData>
  ): Promise<ServiceControllerResult<Service>> {
    try {
      // Validate service ID
      if (!id || typeof id !== 'string') {
        return { error: 'Invalid service ID provided' };
      }

      // Validate updates if provided
      if (updates.name !== undefined) {
        const nameError = this.validateServiceName(updates.name);
        if (nameError) return { error: nameError };
      }

      if (updates.description !== undefined) {
        const descError = this.validateDescription(updates.description);
        if (descError) return { error: descError };
      }

      if (updates.price_type !== undefined) {
        const priceTypeError = this.validatePriceType(updates.price_type);
        if (priceTypeError) return { error: priceTypeError };
      }

      if (updates.price_min !== undefined) {
        const priceError = this.validatePrice(updates.price_min, updates.price_max);
        if (priceError) return { error: priceError };
      }

      if (updates.duration !== undefined) {
        const durationError = this.validateDuration(updates.duration);
        if (durationError) return { error: durationError };
      }

      // Prepare update data
      const updateData: ServiceUpdate = {
        name: updates.name?.trim(),
        description: updates.description?.trim(),
        price_type: updates.price_type,
        price_min: updates.price_min,
        price_max: updates.price_max,
        duration: updates.duration,
        image_url: updates.image_url,
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof ServiceUpdate] === undefined) {
          delete updateData[key as keyof ServiceUpdate];
        }
      });

      // Call model to update service
      const result = await ServiceModel.updateService(id, updateData);
      
      if (result.error) {
        return { error: result.error };
      }

      return { data: undefined }; // Success response
    } catch (error) {
      return { error: 'Failed to update service' };
    }
  }

  /**
   * Delete a service with validation
   */
  static async deleteService(id: string): Promise<ServiceControllerResult> {
    try {
      // Validate service ID
      if (!id || typeof id !== 'string') {
        return { error: 'Invalid service ID provided' };
      }

      // Call model to delete service
      const result = await ServiceModel.deleteService(id);
      
      if (result.error) {
        return { error: result.error };
      }

      return {}; // Success response
    } catch (error) {
      return { error: 'Failed to delete service' };
    }
  }

  /**
   * Load services with error handling
   */
  static async loadServices(barberId: string): Promise<ServiceControllerResult<ServiceWithCategory[]>> {
    try {
      if (!barberId || typeof barberId !== 'string') {
        return { error: 'Invalid barber ID provided' };
      }

      const result = await ServiceModel.loadServicesByBarberId(barberId);
      
      if (result.error) {
        return { error: result.error };
      }

      return { data: result.data };
    } catch (error) {
      return { error: 'Failed to load services' };
    }
  }

  /**
   * Search services with validation
   */
  static async searchServices(
    barberId: string,
    searchTerm: string
  ): Promise<ServiceControllerResult<ServiceWithCategory[]>> {
    try {
      if (!barberId || typeof barberId !== 'string') {
        return { error: 'Invalid barber ID provided' };
      }

      if (!searchTerm || searchTerm.trim().length < 2) {
        return { error: 'Search term must be at least 2 characters long' };
      }

      const result = await ServiceModel.searchServices(barberId, searchTerm.trim());
      
      if (result.error) {
        return { error: result.error };
      }

      return { data: result.data };
    } catch (error) {
      return { error: 'Failed to search services' };
    }
  }

  /**
   * Get services by category with validation
   */
  static async getServicesByCategory(
    barberId: string,
    categoryId: string
  ): Promise<ServiceControllerResult<ServiceWithCategory[]>> {
    try {
      if (!barberId || typeof barberId !== 'string') {
        return { error: 'Invalid barber ID provided' };
      }

      if (!categoryId || typeof categoryId !== 'string') {
        return { error: 'Invalid category ID provided' };
      }

      const result = await ServiceModel.getServicesByCategory(barberId, categoryId);
      
      if (result.error) {
        return { error: result.error };
      }

      return { data: result.data };
    } catch (error) {
      return { error: 'Failed to load services by category' };
    }
  }

  /**
   * Validate complete service data
   */
  private static validateServiceData(data: ServiceFormData): string | null {
    // Required fields
    if (!data.barber_id || typeof data.barber_id !== 'string') {
      return 'Invalid barber ID';
    }

    if (!data.category_id || typeof data.category_id !== 'string') {
      return 'Category is required';
    }

    // Validate individual fields
    const nameError = this.validateServiceName(data.name);
    if (nameError) return nameError;

    const descError = this.validateDescription(data.description);
    if (descError) return descError;

    const priceTypeError = this.validatePriceType(data.price_type);
    if (priceTypeError) return priceTypeError;

    const priceError = this.validatePrice(data.price_min, data.price_max);
    if (priceError) return priceError;

    const durationError = this.validateDuration(data.duration);
    if (durationError) return durationError;

    return null;
  }

  /**
   * Validate service name
   */
  private static validateServiceName(name: string): string | null {
    if (!name || typeof name !== 'string') {
      return 'Service name is required';
    }

    const trimmedName = name.trim();
    if (trimmedName.length < this.MIN_SERVICE_NAME_LENGTH) {
      return `Service name must be at least ${this.MIN_SERVICE_NAME_LENGTH} characters long`;
    }

    if (trimmedName.length > this.MAX_SERVICE_NAME_LENGTH) {
      return `Service name must be less than ${this.MAX_SERVICE_NAME_LENGTH} characters`;
    }

    return null;
  }

  /**
   * Validate description
   */
  private static validateDescription(description?: string): string | null {
    if (description && description.length > this.MAX_DESCRIPTION_LENGTH) {
      return `Description must be less than ${this.MAX_DESCRIPTION_LENGTH} characters`;
    }

    return null;
  }

  /**
   * Validate price type
   */
  private static validatePriceType(priceType: string): string | null {
    if (!this.ALLOWED_PRICE_TYPES.includes(priceType as any)) {
      return `Invalid price type. Must be one of: ${this.ALLOWED_PRICE_TYPES.join(', ')}`;
    }

    return null;
  }

  /**
   * Validate price values
   */
  private static validatePrice(priceMin: number, priceMax?: number | null): string | null {
    if (typeof priceMin !== 'number' || priceMin < this.MIN_PRICE || priceMin > this.MAX_PRICE) {
      return `Price must be between $${this.MIN_PRICE} and $${this.MAX_PRICE}`;
    }

    if (priceMax !== null && priceMax !== undefined) {
      if (typeof priceMax !== 'number' || priceMax < this.MIN_PRICE || priceMax > this.MAX_PRICE) {
        return `Maximum price must be between $${this.MIN_PRICE} and $${this.MAX_PRICE}`;
      }

      if (priceMax <= priceMin) {
        return 'Maximum price must be greater than minimum price';
      }
    }

    return null;
  }

  /**
   * Validate duration
   */
  private static validateDuration(duration: number): string | null {
    if (typeof duration !== 'number' || duration < this.MIN_DURATION || duration > this.MAX_DURATION) {
      return `Duration must be between ${this.MIN_DURATION} and ${this.MAX_DURATION} minutes`;
    }

    return null;
  }

  /**
   * Get maximum services allowed per barber
   */
  static getMaxServicesPerBarber(): number {
    return this.MAX_SERVICES_PER_BARBER;
  }

  /**
   * Check if service limit is reached
   */
  static isServiceLimitReached(currentCount: number): boolean {
    return currentCount >= this.MAX_SERVICES_PER_BARBER;
  }

  /**
   * Validate price type for range services
   */
  static validatePriceRange(priceMin: number, priceMax?: number | null): string | null {
    if (priceMax === null || priceMax === undefined) {
      return 'Maximum price is required for price range services';
    }

    return this.validatePrice(priceMin, priceMax);
  }

  /**
   * Format price for display
   */
  static formatPrice(priceType: string, priceMin: number, priceMax?: number | null): string {
    switch (priceType) {
      case 'fixed':
        return `$${priceMin.toFixed(2)}`;
      case 'range':
        return `$${priceMin.toFixed(2)} - $${(priceMax || 0).toFixed(2)}`;
      case 'starting_from':
        return `From $${priceMin.toFixed(2)}`;
      default:
        return `$${priceMin.toFixed(2)}`;
    }
  }
}
