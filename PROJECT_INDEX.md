# BarberMatch v2 - Project Index

## Overview
BarberMatch v2 is a React Native mobile application built with Expo that connects customers with local barbers. The app features AI-powered hairstyle recommendations, appointment booking, and a comprehensive barber management system.

## Technology Stack
- **Framework**: React Native with Expo SDK 53
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: Custom components with Lucide React Native icons
- **Styling**: StyleSheet with Inter font family
- **TypeScript**: Full TypeScript support

## Project Structure

### Configuration Files
- `package.json` - Dependencies and scripts (Expo, React Native, Supabase, Zustand)
- `app.json` - Expo configuration with typed routes enabled
- `tsconfig.json` - TypeScript configuration with path aliases
- `babel.config.js` - Babel configuration
- `metro.config.js` - Metro bundler configuration

### Core Application Structure

#### App Directory (`app/`)
- `_layout.tsx` - Root layout with QueryClient provider and font loading
- `index.tsx` - Main entry point with authentication routing logic
- `auth.tsx` - Authentication screen (sign up/sign in)
- `role-selection.tsx` - User role selection (customer/barber)
- `+not-found.tsx` - 404 error page

#### Customer Flow (`app/(customer)/`)
- `_layout.tsx` - Customer layout wrapper
- `(tabs)/_layout.tsx` - Tab navigation for customers
  - `index.tsx` - Home dashboard
  - `discover.tsx` - Barber discovery with search and filters
  - `appointments.tsx` - Customer appointments
  - `settings.tsx` - Customer settings

#### Barber Flow (`app/(barber)/`)
- `_layout.tsx` - Barber layout wrapper
- `onboarding.tsx` - Barber onboarding process
- `(tabs)/_layout.tsx` - Tab navigation for barbers
  - `index.tsx` - Barber dashboard
  - `appointments.tsx` - Barber appointment management
  - `services.tsx` - Service management
  - `profile.tsx` - Barber profile

#### AI Features (`app/ai/`)
- `index.tsx` - AI feature entry point
- `tryout.tsx` - Camera-based AI hairstyle tryout
- `processing.tsx` - AI processing screen with animations
- `results.tsx` - AI-generated hairstyle results

#### Additional Screens
- `booking/index.tsx` - Appointment booking flow
- `profile/[barberId].tsx` - Individual barber profile view

### Components (`components/`)
- `AddServiceModal.tsx` - Modal for adding new services (barbers)
- `AppointmentCard.tsx` - Appointment display component with status management
- `BarberCard.tsx` - Barber listing card with rating and location
- `FilterBottomSheet.tsx` - Filtering interface for barber discovery
- `ServiceCard.tsx` - Service display with pricing and category

### State Management (`stores/`)
- `authStore.ts` - Authentication state (sign up, sign in, user profile)
- `barberStore.ts` - Barber profile, services, and portfolio management
- `appointmentStore.ts` - Appointment creation and status management

### Database (`types/` & `supabase/`)
- `database.ts` - TypeScript types for all database tables
- `migrations/20250831140704_wooden_block.sql` - Complete database schema

#### Database Tables
1. **users** - User profiles with role-based access
2. **barbers** - Barber business profiles with location data
3. **services** - Barber services with pricing and categories
4. **appointments** - Booking records with status tracking
5. **reviews** - Customer reviews and ratings
6. **portfolio** - Barber work portfolio (before/after images)
7. **favourites** - Customer saved barbers

### Utilities
- `lib/supabase.ts` - Supabase client configuration
- `hooks/useFrameworkReady.ts` - Framework initialization hook

## Key Features

### Authentication & User Management
- Email/password authentication via Supabase
- Role-based access (customer/barber)
- User profile management
- Secure session handling

### Barber Discovery
- Location-based barber search
- Advanced filtering (rating, distance, category)
- Map and list view modes
- Barber profile viewing

### Appointment System
- Service selection and booking
- Appointment status tracking (requested → confirmed → completed)
- Real-time updates via Supabase
- Customer and barber appointment management

### AI Hairstyle Features
- Camera-based photo capture
- AI processing simulation
- Hairstyle recommendation results
- Social sharing capabilities

### Barber Management
- Service creation and management
- Portfolio upload and management
- Appointment acceptance/rejection
- Business profile management

## Database Schema Highlights

### Security
- Row Level Security (RLS) enabled on all tables
- Role-based access policies
- Secure user data isolation

### Performance
- Optimized indexes for location-based queries
- Efficient appointment and review lookups
- Categorized service filtering

### Storage
- Public buckets for images (portfolio, services, profiles)
- Secure upload policies
- Image optimization support

## Development Setup

### Prerequisites
- Node.js and npm
- Expo CLI
- Supabase account and project

### Environment Variables
- `EXPO_PUBLIC_SUPABASE_URL` - Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

### Key Dependencies
- `@supabase/supabase-js` - Database and auth
- `zustand` - State management
- `expo-router` - Navigation
- `expo-camera` - Camera functionality
- `expo-location` - Location services
- `lucide-react-native` - Icons
- `react-native-reanimated` - Animations

## File Organization Patterns

### Routing
- File-based routing with Expo Router
- Nested layouts for customer/barber flows
- Tab navigation for main app sections
- Modal and stack navigation for features

### Component Architecture
- Reusable UI components in `/components`
- Props-based customization
- Consistent styling patterns
- TypeScript interfaces for all props

### State Management
- Zustand stores for different domains
- Async actions for API calls
- Error handling and loading states
- Type-safe store interfaces

### Database Integration
- TypeScript-generated types from Supabase
- Consistent error handling
- Optimistic updates where appropriate
- Real-time subscriptions for live data

## Notable Implementation Details

### Authentication Flow
1. User signs up/in → Role selection → Appropriate dashboard
2. Persistent sessions with automatic token refresh
3. Protected routes based on authentication state

### Appointment Workflow
1. Customer discovers barber → Views services → Books appointment
2. Barber receives request → Accepts/rejects → Manages schedule
3. Status updates trigger real-time UI changes

### AI Feature Flow
1. Camera capture → Gender selection → AI processing simulation
2. Results display with hairstyle options → Social sharing
3. Direct booking integration with selected look

### Location Services
- GPS-based barber discovery
- Distance calculations
- Map integration (placeholder for future implementation)

## Development Notes

### Current Status
- Core functionality implemented
- AI features are UI mockups (processing simulation)
- Map view placeholder (list view functional)
- Some screens are basic placeholders (booking, barber profile)

### Future Enhancements
- Real AI integration for hairstyle recommendations
- Map view implementation
- Push notifications for appointments
- Payment integration
- Advanced filtering and search
- Social features and reviews

### Code Quality
- Full TypeScript coverage
- Consistent error handling
- Responsive design patterns
- Accessibility considerations
- Performance optimizations (lazy loading, image optimization)

This project represents a comprehensive barber booking platform with modern React Native architecture, robust database design, and scalable state management patterns.
