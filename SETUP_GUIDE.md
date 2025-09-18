# BarberMatch v2 - Setup & Run Guide

## Prerequisites

Before running the project, ensure you have the following installed:

### Required Software
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Expo CLI** - Install globally: `npm install -g @expo/cli`
- **Git** - [Download here](https://git-scm.com/)

### Mobile Development
- **Expo Go app** on your phone (iOS/Android) - [Download from App Store/Play Store](https://expo.dev/client)
- **iOS Simulator** (Mac only) - Install Xcode from App Store
- **Android Studio** (for Android emulator) - [Download here](https://developer.android.com/studio)

## Project Setup

### 1. Clone and Install Dependencies

```bash
# Navigate to your project directory
cd barbermatch_v2-main

# Install dependencies
npm install
```

### 2. Supabase Setup

You'll need a Supabase account and project:

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up for a free account

2. **Create New Project**
   - Click "New Project"
   - Choose your organization
   - Enter project name: "BarberMatch v2"
   - Set a strong database password
   - Choose a region close to you
   - Click "Create new project"

3. **Get Project Credentials**
   - Go to Settings → API
   - Copy your Project URL and anon/public key

4. **Run Database Migration**
   - Go to SQL Editor in Supabase dashboard
   - Copy the contents of `supabase/migrations/20250831140704_wooden_block.sql`
   - Paste and run the SQL to create all tables

### 3. Environment Configuration

Create a `.env` file in your project root:

```bash
# Create .env file
touch .env
```

Add your Supabase credentials to `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Example:**
```env
EXPO_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Running the Project

### Option 1: Development Server (Recommended)

```bash
# Start the development server
npm run dev
# or
expo start
```

This will:
- Start the Metro bundler
- Open Expo DevTools in your browser
- Show a QR code for mobile testing

### Option 2: Web Development

```bash
# Build and run for web
npm run build:web
```

### Option 3: Mobile Device Testing

1. **Install Expo Go** on your phone
2. **Start the dev server**: `npm run dev`
3. **Scan the QR code** with:
   - **iOS**: Camera app or Expo Go app
   - **Android**: Expo Go app

### Option 4: Simulator/Emulator

#### iOS Simulator (Mac only)
```bash
# Start dev server
npm run dev

# Press 'i' in terminal or click 'Run on iOS simulator' in Expo DevTools
```

#### Android Emulator
```bash
# Start dev server
npm run dev

# Press 'a' in terminal or click 'Run on Android device/emulator' in Expo DevTools
```

## Development Workflow

### 1. First Run Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Supabase project created and configured
- [ ] Environment variables set in `.env`
- [ ] Database migration run in Supabase
- [ ] Development server started (`npm run dev`)

### 2. Testing the App

1. **Authentication Flow**
   - Sign up with a new account
   - Select role (Customer/Barber)
   - Navigate through the app

2. **Customer Features**
   - Browse barbers in Discover tab
   - View barber profiles
   - Book appointments (if barbers are available)

3. **Barber Features**
   - Complete onboarding
   - Add services
   - Manage appointments

### 3. Common Commands

```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Clear Metro cache (if issues occur)
npx expo start --clear

# Install new dependencies
npm install package-name

# Update Expo CLI
npm install -g @expo/cli@latest
```

## Troubleshooting

### Common Issues

#### 1. Metro bundler issues
```bash
# Clear cache and restart
npx expo start --clear
```

#### 2. Environment variables not loading
- Ensure `.env` file is in project root
- Restart the development server
- Check variable names start with `EXPO_PUBLIC_`

#### 3. Supabase connection issues
- Verify your URL and key in `.env`
- Check Supabase project is active
- Ensure database migration was run successfully

#### 4. Mobile app not loading
- Check phone and computer are on same WiFi
- Try restarting Expo Go app
- Use tunnel mode: `npx expo start --tunnel`

#### 5. iOS Simulator issues
```bash
# Reset iOS Simulator
xcrun simctl erase all

# Reinstall Expo CLI
npm install -g @expo/cli@latest
```

### Getting Help

1. **Expo Documentation**: [docs.expo.dev](https://docs.expo.dev)
2. **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
3. **React Native Documentation**: [reactnative.dev](https://reactnative.dev)

## Project Structure Reminder

```
barbermatch_v2-main/
├── app/                    # Main app screens
├── components/             # Reusable UI components
├── stores/                 # Zustand state management
├── types/                  # TypeScript type definitions
├── lib/                    # Utilities (Supabase client)
├── hooks/                  # Custom React hooks
├── supabase/              # Database migrations
├── assets/                # Images and static files
├── .env                   # Environment variables (create this)
├── package.json           # Dependencies and scripts
└── PROJECT_INDEX.md       # Complete project documentation
```

## Next Steps

Once the app is running:

1. **Explore the codebase** using the `PROJECT_INDEX.md` file
2. **Test all features** on both customer and barber flows
3. **Customize the app** for your specific needs
4. **Add real AI integration** for hairstyle recommendations
5. **Implement map view** for barber discovery
6. **Add payment processing** for appointments

## Production Deployment

When ready for production:

1. **Build for app stores**:
   ```bash
   npx expo build:android
   npx expo build:ios
   ```

2. **Deploy to web**:
   ```bash
   npm run build:web
   ```

3. **Configure production Supabase** with proper security policies

Happy coding! 🚀
