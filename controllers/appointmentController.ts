import { 
  AppointmentModel, 
  AppointmentData, 
  AppointmentUpdate, 
  AppointmentWithDetails,
  AppointmentStatus 
} from '@/models/appointment';
// Note: services field in appointments is JSONB (any type)

export interface AppointmentControllerResult<T = any> {
  data?: T;
  error?: string;
}

export interface AppointmentFormData {
  customer_id: string;
  barber_id: string;
  services: any; // JSONB field - can contain service selection data
  start_time: string;
  notes?: string;
}

export interface AppointmentStatusUpdate {
  appointmentId: string;
  newStatus: AppointmentStatus;
  userId: string;
  userRole: 'customer' | 'barber';
}

/**
 * Controller layer for appointment-related business logic
 * Handles validation, business rules, and orchestrates model operations
 */
export class AppointmentController {
  // Business rules and limits
  private static readonly MIN_ADVANCE_BOOKING_HOURS = 2; // 2 hours in advance
  private static readonly MAX_ADVANCE_BOOKING_DAYS = 30; // 30 days in advance
  private static readonly MAX_APPOINTMENT_DURATION_HOURS = 4; // 4 hours max
  private static readonly BUSINESS_HOURS_START = 9; // 9 AM
  private static readonly BUSINESS_HOURS_END = 18; // 6 PM
  private static readonly ALLOWED_STATUS_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
    [AppointmentStatus.REQUESTED]: [AppointmentStatus.CONFIRMED, AppointmentStatus.CANCELLED],
    [AppointmentStatus.CONFIRMED]: [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED],
    [AppointmentStatus.COMPLETED]: [], // Terminal state
    [AppointmentStatus.CANCELLED]: [], // Terminal state
  };

  /**
   * Create a new appointment with validation
   */
  static async createAppointment(
    formData: AppointmentFormData
  ): Promise<AppointmentControllerResult<AppointmentWithDetails>> {
    try {
      // Validate appointment data
      const validationError = this.validateAppointmentData(formData);
      if (validationError) {
        return { error: validationError };
      }

      // Validate booking time
      const timeValidationError = this.validateBookingTime(formData.start_time);
      if (timeValidationError) {
        return { error: timeValidationError };
      }

      // Check for conflicts
      const conflictCheck = await this.checkBookingConflicts(
        formData.barber_id,
        formData.start_time,
        formData.services
      );
      
      if (conflictCheck.error) {
        return { error: conflictCheck.error };
      }

      if (conflictCheck.hasConflicts) {
        return { error: 'This time slot is already booked. Please choose another time.' };
      }

      // Prepare appointment data
      const appointmentData: AppointmentData = {
        customer_id: formData.customer_id,
        barber_id: formData.barber_id,
        services: formData.services,
        start_time: formData.start_time,
        status: AppointmentStatus.REQUESTED,
        notes: formData.notes || null,
      };

      // Call model to create appointment
      const result = await AppointmentModel.createAppointment(appointmentData);
      
      if (result.error) {
        return { error: result.error };
      }

      return { data: undefined }; // Success response
    } catch (error) {
      return { error: 'Failed to create appointment' };
    }
  }

  /**
   * Update appointment status with validation
   */
  static async updateAppointmentStatus(
    updateData: AppointmentStatusUpdate
  ): Promise<AppointmentControllerResult<AppointmentWithDetails>> {
    try {
      // Validate update data
      const validationError = this.validateStatusUpdate(updateData);
      if (validationError) {
        return { error: validationError };
      }

      // Load current appointment to validate transition
      const currentAppointment = await AppointmentModel.loadAppointmentById(updateData.appointmentId);
      if (currentAppointment.error) {
        return { error: currentAppointment.error };
      }

      if (!currentAppointment.data) {
        return { error: 'Appointment not found' };
      }

      // Validate status transition
      const transitionError = this.validateStatusTransition(
        currentAppointment.data.status as AppointmentStatus,
        updateData.newStatus,
        updateData.userRole
      );
      if (transitionError) {
        return { error: transitionError };
      }

      // Validate user permissions
      const permissionError = this.validateUserPermissions(
        currentAppointment.data,
        updateData.userId,
        updateData.userRole
      );
      if (permissionError) {
        return { error: permissionError };
      }

      // Call model to update status
      const result = await AppointmentModel.updateAppointmentStatus(
        updateData.appointmentId,
        updateData.newStatus
      );
      
      if (result.error) {
        return { error: result.error };
      }

      return { data: undefined }; // Success response
    } catch (error) {
      return { error: 'Failed to update appointment status' };
    }
  }

  /**
   * Load appointments with error handling
   */
  static async loadAppointments(
    userId: string,
    role: 'customer' | 'barber'
  ): Promise<AppointmentControllerResult<AppointmentWithDetails[]>> {
    try {
      if (!userId || typeof userId !== 'string') {
        return { error: 'Invalid user ID provided' };
      }

      if (!role || !['customer', 'barber'].includes(role)) {
        return { error: 'Invalid user role provided' };
      }

      const result = await AppointmentModel.loadAppointmentsByUser(userId, role);
      
      if (result.error) {
        return { error: result.error };
      }

      return { data: result.data };
    } catch (error) {
      return { error: 'Failed to load appointments' };
    }
  }

  /**
   * Load appointments by status with validation
   */
  static async loadAppointmentsByStatus(
    userId: string,
    role: 'customer' | 'barber',
    status: AppointmentStatus
  ): Promise<AppointmentControllerResult<AppointmentWithDetails[]>> {
    try {
      if (!userId || typeof userId !== 'string') {
        return { error: 'Invalid user ID provided' };
      }

      if (!role || !['customer', 'barber'].includes(role)) {
        return { error: 'Invalid user role provided' };
      }

      if (!Object.values(AppointmentStatus).includes(status)) {
        return { error: 'Invalid appointment status provided' };
      }

      const result = await AppointmentModel.loadAppointmentsByStatus(userId, role, status);
      
      if (result.error) {
        return { error: result.error };
      }

      return { data: result.data };
    } catch (error) {
      return { error: 'Failed to load appointments by status' };
    }
  }

  /**
   * Delete appointment with validation
   */
  static async deleteAppointment(
    appointmentId: string,
    userId: string,
    userRole: 'customer' | 'barber'
  ): Promise<AppointmentControllerResult> {
    try {
      if (!appointmentId || typeof appointmentId !== 'string') {
        return { error: 'Invalid appointment ID provided' };
      }

      // Load appointment to validate permissions
      const appointment = await AppointmentModel.loadAppointmentById(appointmentId);
      if (appointment.error) {
        return { error: appointment.error };
      }

      if (!appointment.data) {
        return { error: 'Appointment not found' };
      }

      // Validate user permissions
      const permissionError = this.validateUserPermissions(
        appointment.data,
        userId,
        userRole
      );
      if (permissionError) {
        return { error: permissionError };
      }

      // Only allow deletion of requested or cancelled appointments
      if (![AppointmentStatus.REQUESTED, AppointmentStatus.CANCELLED].includes(
        appointment.data.status as AppointmentStatus
      )) {
        return { error: 'Cannot delete confirmed or completed appointments' };
      }

      const result = await AppointmentModel.deleteAppointment(appointmentId);
      
      if (result.error) {
        return { error: result.error };
      }

      return {}; // Success response
    } catch (error) {
      return { error: 'Failed to delete appointment' };
    }
  }

  /**
   * Get appointment statistics
   */
  static async getAppointmentStats(
    userId: string,
    role: 'customer' | 'barber'
  ): Promise<AppointmentControllerResult<Record<AppointmentStatus, number>>> {
    try {
      if (!userId || typeof userId !== 'string') {
        return { error: 'Invalid user ID provided' };
      }

      const stats: Record<AppointmentStatus, number> = {
        [AppointmentStatus.REQUESTED]: 0,
        [AppointmentStatus.CONFIRMED]: 0,
        [AppointmentStatus.COMPLETED]: 0,
        [AppointmentStatus.CANCELLED]: 0,
      };

      // Get counts for each status
      for (const status of Object.values(AppointmentStatus)) {
        const countResult = await AppointmentModel.getAppointmentCount(userId, role, status);
        if (countResult.error) {
          return { error: countResult.error };
        }
        stats[status] = countResult.count;
      }

      return { data: stats };
    } catch (error) {
      return { error: 'Failed to get appointment statistics' };
    }
  }

  /**
   * Validate appointment form data
   */
  private static validateAppointmentData(data: AppointmentFormData): string | null {
    if (!data.customer_id || typeof data.customer_id !== 'string') {
      return 'Invalid customer ID';
    }

    if (!data.barber_id || typeof data.barber_id !== 'string') {
      return 'Invalid barber ID';
    }

    if (!data.start_time || typeof data.start_time !== 'string') {
      return 'Appointment time is required';
    }

    if (!data.services) {
      return 'Service selection is required';
    }

    return null;
  }

  /**
   * Validate booking time constraints
   */
  private static validateBookingTime(startTime: string): string | null {
    const appointmentDate = new Date(startTime);
    const now = new Date();

    // Check if appointment is in the past
    if (appointmentDate <= now) {
      return 'Cannot book appointments in the past';
    }

    // Check minimum advance booking
    const minAdvanceTime = new Date(now.getTime() + (this.MIN_ADVANCE_BOOKING_HOURS * 60 * 60 * 1000));
    if (appointmentDate < minAdvanceTime) {
      return `Appointments must be booked at least ${this.MIN_ADVANCE_BOOKING_HOURS} hours in advance`;
    }

    // Check maximum advance booking
    const maxAdvanceTime = new Date(now.getTime() + (this.MAX_ADVANCE_BOOKING_DAYS * 24 * 60 * 60 * 1000));
    if (appointmentDate > maxAdvanceTime) {
      return `Cannot book appointments more than ${this.MAX_ADVANCE_BOOKING_DAYS} days in advance`;
    }

    // Check business hours
    const hour = appointmentDate.getHours();
    if (hour < this.BUSINESS_HOURS_START || hour >= this.BUSINESS_HOURS_END) {
      return `Appointments must be scheduled between ${this.BUSINESS_HOURS_START}:00 AM and ${this.BUSINESS_HOURS_END}:00 PM`;
    }

    // Check if it's a weekday (Monday = 1, Sunday = 0)
    const dayOfWeek = appointmentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return 'Appointments can only be booked on weekdays';
    }

    return null;
  }

  /**
   * Check for booking conflicts
   */
  private static async checkBookingConflicts(
    barberId: string,
    startTime: string,
    services: any
  ): Promise<{ hasConflicts: boolean; error?: string }> {
    try {
      // Calculate end time based on services (simplified - would need service duration lookup)
      const estimatedDuration = 60; // Default 60 minutes
      const endTime = new Date(new Date(startTime).getTime() + (estimatedDuration * 60 * 1000)).toISOString();

      const conflictResult = await AppointmentModel.checkAppointmentConflicts(
        barberId,
        startTime,
        endTime
      );

      if (conflictResult.error) {
        return { hasConflicts: false, error: conflictResult.error };
      }

      return { hasConflicts: conflictResult.hasConflicts };
    } catch (error) {
      return { hasConflicts: false, error: 'Failed to check booking conflicts' };
    }
  }

  /**
   * Validate status update data
   */
  private static validateStatusUpdate(data: AppointmentStatusUpdate): string | null {
    if (!data.appointmentId || typeof data.appointmentId !== 'string') {
      return 'Invalid appointment ID';
    }

    if (!Object.values(AppointmentStatus).includes(data.newStatus)) {
      return 'Invalid appointment status';
    }

    if (!data.userId || typeof data.userId !== 'string') {
      return 'Invalid user ID';
    }

    if (!['customer', 'barber'].includes(data.userRole)) {
      return 'Invalid user role';
    }

    return null;
  }

  /**
   * Validate status transition
   */
  private static validateStatusTransition(
    currentStatus: AppointmentStatus,
    newStatus: AppointmentStatus,
    userRole: 'customer' | 'barber'
  ): string | null {
    // Check if transition is allowed
    const allowedTransitions = this.ALLOWED_STATUS_TRANSITIONS[currentStatus];
    if (!allowedTransitions.includes(newStatus)) {
      return `Cannot change status from ${currentStatus} to ${newStatus}`;
    }

    // Role-specific validations
    if (userRole === 'customer') {
      // Customers can only cancel their own appointments
      if (newStatus !== AppointmentStatus.CANCELLED) {
        return 'Customers can only cancel appointments';
      }
    } else if (userRole === 'barber') {
      // Barbers can confirm, cancel, or complete appointments
      if (![AppointmentStatus.CONFIRMED, AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED].includes(newStatus)) {
        return 'Invalid status transition for barber';
      }
    }

    return null;
  }

  /**
   * Validate user permissions
   */
  private static validateUserPermissions(
    appointment: AppointmentWithDetails,
    userId: string,
    userRole: 'customer' | 'barber'
  ): string | null {
    if (userRole === 'customer' && appointment.customer_id !== userId) {
      return 'You can only manage your own appointments';
    }

    if (userRole === 'barber' && appointment.barber_id !== userId) {
      return 'You can only manage appointments for your business';
    }

    return null;
  }

  /**
   * Format appointment status for display
   */
  static formatStatus(status: AppointmentStatus): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  /**
   * Get status color for UI
   */
  static getStatusColor(status: AppointmentStatus): string {
    const colors = {
      [AppointmentStatus.REQUESTED]: '#F59E0B',
      [AppointmentStatus.CONFIRMED]: '#10B981',
      [AppointmentStatus.COMPLETED]: '#8B5CF6',
      [AppointmentStatus.CANCELLED]: '#EF4444',
    };
    return colors[status];
  }

  /**
   * Get status background color for UI
   */
  static getStatusBackgroundColor(status: AppointmentStatus): string {
    const backgrounds = {
      [AppointmentStatus.REQUESTED]: '#FEF3C7',
      [AppointmentStatus.CONFIRMED]: '#D1FAE5',
      [AppointmentStatus.COMPLETED]: '#E9D5FF',
      [AppointmentStatus.CANCELLED]: '#FEE2E2',
    };
    return backgrounds[status];
  }

  /**
   * Check if status transition is allowed
   */
  static isStatusTransitionAllowed(
    currentStatus: AppointmentStatus,
    newStatus: AppointmentStatus
  ): boolean {
    return this.ALLOWED_STATUS_TRANSITIONS[currentStatus]?.includes(newStatus) || false;
  }

  /**
   * Get allowed status transitions for current status
   */
  static getAllowedStatusTransitions(currentStatus: AppointmentStatus): AppointmentStatus[] {
    return this.ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
  }
}
