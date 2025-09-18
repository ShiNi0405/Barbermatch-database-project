/*
  # Initial BarberMatch Database Schema

  1. New Tables
    - `users` - Extended user profiles with role information
      - `id` (uuid, primary key) - matches Supabase auth user ID
      - `name` (text) - user's full name
      - `email` (text, unique) - user's email address
      - `role` (text) - either 'customer' or 'barber'
      - `created_at` (timestamp) - account creation date

    - `barbers` - Barber business profiles
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key) - references users table
      - `salon_name` (text) - name of salon or barber business
      - `bio` (text) - barber's biography and specialties
      - `phone` (text) - contact phone number
      - `address` (text) - business address
      - `latitude` (numeric) - geographical coordinates
      - `longitude` (numeric) - geographical coordinates
      - `operating_hours` (jsonb) - weekly schedule
      - `profile_image` (text) - URL to profile/salon image
      - `rating` (numeric) - average customer rating

    - `services` - Services offered by barbers
      - `id` (uuid, primary key)
      - `barber_id` (uuid, foreign key) - references barbers table
      - `name` (text) - service name
      - `category` (text) - service category (haircut, shave, etc.)
      - `description` (text) - detailed service description
      - `price_type` (text) - pricing model (fixed, range, starting_from)
      - `price_min` (numeric) - minimum or base price
      - `price_max` (numeric) - maximum price (for ranges)
      - `duration` (integer) - service duration in minutes
      - `image_url` (text) - reference image URL

    - `appointments` - Booking records
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key) - references users table
      - `barber_id` (uuid, foreign key) - references barbers table
      - `services` (jsonb) - array of selected services with snapshot data
      - `start_time` (timestamptz) - appointment date and time
      - `status` (text) - current status (requested, confirmed, completed, cancelled)
      - `notes` (text) - customer notes or special requests

    - `reviews` - Customer reviews and ratings
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key) - references users table
      - `barber_id` (uuid, foreign key) - references barbers table
      - `rating` (integer) - star rating (1-5)
      - `comment` (text) - review text

    - `portfolio` - Barber portfolio images
      - `id` (uuid, primary key)
      - `barber_id` (uuid, foreign key) - references barbers table
      - `category` (text) - men or women styles
      - `title` (text) - portfolio item title
      - `before_image` (text) - before photo URL
      - `after_image` (text) - after photo URL

    - `favourites` - Customer saved barbers
      - `customer_id` (uuid, foreign key) - references users table
      - `barber_id` (uuid, foreign key) - references barbers table
      - Composite primary key on both columns

  2. Security
    - Enable RLS on all tables
    - Users can read/update their own profile data
    - Barbers can manage their own business data (services, portfolio, appointments)
    - Customers can manage their own bookings and favourites
    - Public read access for barber discovery and portfolio viewing
    - Customers can create appointments and reviews

  3. Storage
    - Create public buckets for images: portfolio, service-images, profile-images
*/

-- Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text CHECK (role IN ('customer', 'barber')) DEFAULT 'customer',
  created_at timestamptz DEFAULT now()
);

-- Barbers table
CREATE TABLE IF NOT EXISTS barbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  salon_name text NOT NULL,
  bio text DEFAULT '',
  phone text NOT NULL,
  address text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  operating_hours jsonb DEFAULT '{
    "monday": {"open": "09:00", "close": "18:00", "closed": false},
    "tuesday": {"open": "09:00", "close": "18:00", "closed": false},
    "wednesday": {"open": "09:00", "close": "18:00", "closed": false},
    "thursday": {"open": "09:00", "close": "18:00", "closed": false},
    "friday": {"open": "09:00", "close": "18:00", "closed": false},
    "saturday": {"open": "09:00", "close": "17:00", "closed": false},
    "sunday": {"open": "10:00", "close": "16:00", "closed": true}
  }'::jsonb,
  profile_image text,
  rating numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id uuid NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text CHECK (category IN ('haircut', 'shave', 'styling', 'coloring', 'other')) NOT NULL,
  description text DEFAULT '',
  price_type text CHECK (price_type IN ('fixed', 'range', 'starting_from')) NOT NULL,
  price_min numeric NOT NULL,
  price_max numeric,
  duration integer NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  barber_id uuid NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
  services jsonb NOT NULL,
  start_time timestamptz NOT NULL,
  status text CHECK (status IN ('requested', 'confirmed', 'completed', 'cancelled')) DEFAULT 'requested',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  barber_id uuid NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(customer_id, barber_id)
);

-- Portfolio table
CREATE TABLE IF NOT EXISTS portfolio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id uuid NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
  category text CHECK (category IN ('men', 'women')) NOT NULL,
  title text NOT NULL,
  before_image text NOT NULL,
  after_image text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Favourites table
CREATE TABLE IF NOT EXISTS favourites (
  customer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  barber_id uuid NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (customer_id, barber_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read public barber data"
  ON users
  FOR SELECT
  TO authenticated
  USING (role = 'barber');

-- Barbers policies
CREATE POLICY "Barbers can manage their own profile"
  ON barbers
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Public read access for barber discovery"
  ON barbers
  FOR SELECT
  TO authenticated
  USING (true);

-- Services policies
CREATE POLICY "Barbers can manage their own services"
  ON services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM barbers 
      WHERE barbers.id = services.barber_id 
      AND barbers.user_id = auth.uid()
    )
  );

CREATE POLICY "Public read access for services"
  ON services
  FOR SELECT
  TO authenticated
  USING (true);

-- Appointments policies
CREATE POLICY "Customers can manage their appointments"
  ON appointments
  FOR ALL
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Barbers can manage appointments at their salon"
  ON appointments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM barbers 
      WHERE barbers.id = appointments.barber_id 
      AND barbers.user_id = auth.uid()
    )
  );

-- Reviews policies
CREATE POLICY "Customers can create and read reviews"
  ON reviews
  FOR ALL
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Barbers can read reviews about their services"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM barbers 
      WHERE barbers.id = reviews.barber_id 
      AND barbers.user_id = auth.uid()
    )
  );

CREATE POLICY "Public read access for reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (true);

-- Portfolio policies
CREATE POLICY "Barbers can manage their portfolio"
  ON portfolio
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM barbers 
      WHERE barbers.id = portfolio.barber_id 
      AND barbers.user_id = auth.uid()
    )
  );

CREATE POLICY "Public read access for portfolio"
  ON portfolio
  FOR SELECT
  TO authenticated
  USING (true);

-- Favourites policies
CREATE POLICY "Customers can manage their favourites"
  ON favourites
  FOR ALL
  TO authenticated
  USING (customer_id = auth.uid());

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('portfolio', 'portfolio', true),
  ('service-images', 'service-images', true),
  ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read access for portfolio images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'portfolio');

CREATE POLICY "Authenticated users can upload portfolio images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio');

CREATE POLICY "Public read access for service images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'service-images');

CREATE POLICY "Authenticated users can upload service images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'service-images');

CREATE POLICY "Public read access for profile images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'profile-images');

CREATE POLICY "Authenticated users can upload profile images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'profile-images');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_barbers_location ON barbers(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_services_barber_category ON services(barber_id, category);
CREATE INDEX IF NOT EXISTS idx_appointments_customer_status ON appointments(customer_id, status);
CREATE INDEX IF NOT EXISTS idx_appointments_barber_status ON appointments(barber_id, status);
CREATE INDEX IF NOT EXISTS idx_reviews_barber ON reviews(barber_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_barber_category ON portfolio(barber_id, category);