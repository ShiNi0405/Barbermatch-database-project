export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: 'customer' | 'barber';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          role: 'customer' | 'barber';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: 'customer' | 'barber';
          created_at?: string;
        };
      };
      barbers: {
        Row: {
          id: string;
          user_id: string;
          salon_name: string;
          bio: string;
          phone: string;
          address: string;
          latitude: number;
          longitude: number;
          operating_hours: any;
          profile_image: string | null;
          rating: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          salon_name: string;
          bio?: string;
          phone: string;
          address: string;
          latitude: number;
          longitude: number;
          operating_hours?: any;
          profile_image?: string | null;
          rating?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          salon_name?: string;
          bio?: string;
          phone?: string;
          address?: string;
          latitude?: number;
          longitude?: number;
          operating_hours?: any;
          profile_image?: string | null;
          rating?: number;
          created_at?: string;
        };
      };
      service_categories: {
        Row: {
          id: string;
          barber_id: string | null;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          barber_id?: string | null;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          barber_id?: string | null;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          barber_id: string;
          name: string;
          category: 'haircut' | 'shave' | 'styling' | 'coloring' | 'other';
          category_id: string | null;
          description: string;
          price_type: 'fixed' | 'range' | 'starting_from';
          price_min: number;
          price_max: number | null;
          duration: number;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          barber_id: string;
          name: string;
          category?: 'haircut' | 'shave' | 'styling' | 'coloring' | 'other';
          category_id?: string | null;
          description?: string;
          price_type: 'fixed' | 'range' | 'starting_from';
          price_min: number;
          price_max?: number | null;
          duration: number;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          barber_id?: string;
          name?: string;
          category?: 'haircut' | 'shave' | 'styling' | 'coloring' | 'other';
          category_id?: string | null;
          description?: string;
          price_type?: 'fixed' | 'range' | 'starting_from';
          price_min?: number;
          price_max?: number | null;
          duration?: number;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          customer_id: string;
          barber_id: string;
          services: any;
          start_time: string;
          status: 'requested' | 'confirmed' | 'completed' | 'cancelled';
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          barber_id: string;
          services: any;
          start_time: string;
          status?: 'requested' | 'confirmed' | 'completed' | 'cancelled';
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          barber_id?: string;
          services?: any;
          start_time?: string;
          status?: 'requested' | 'confirmed' | 'completed' | 'cancelled';
          notes?: string | null;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          customer_id: string;
          barber_id: string;
          rating: number;
          comment: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          barber_id: string;
          rating: number;
          comment?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          barber_id?: string;
          rating?: number;
          comment?: string;
          created_at?: string;
        };
      };
      portfolio: {
        Row: {
          id: string;
          barber_id: string;
          category: 'men' | 'women';
          title: string;
          before_image: string;
          after_image: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          barber_id: string;
          category: 'men' | 'women';
          title: string;
          before_image: string;
          after_image: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          barber_id?: string;
          category?: 'men' | 'women';
          title?: string;
          before_image?: string;
          after_image?: string;
          created_at?: string;
        };
      };
      favourites: {
        Row: {
          customer_id: string;
          barber_id: string;
          created_at: string;
        };
        Insert: {
          customer_id: string;
          barber_id: string;
          created_at?: string;
        };
        Update: {
          customer_id?: string;
          barber_id?: string;
          created_at?: string;
        };
      };
    };
  };
}