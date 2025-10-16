# Rental Guru Frontend

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.6-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## 🏠 About Rental Guru

Rental Guru is a comprehensive property management platform designed to streamline rental property operations for property owners, tenants, and vendors. The platform provides an intuitive interface for managing properties, tenant relationships, maintenance requests, and communication across all stakeholders in the rental ecosystem.

### Key Features

- **Multi-Role Dashboard**: Separate dashboards for Property Owners, Tenants, and Vendors
- **Property Management**: Complete property listing and management system
- **Tenant Management**: Tenant applications, lease agreements, and communication
- **Vendor Network**: Service provider management and coordination
- **AI-Powered Assistant**: Guru AI for intelligent property management assistance
- **Real-time Communication**: Integrated messaging system
- **Payment Processing**: Rent collection and payment management
- **Maintenance Requests**: Streamlined maintenance workflow
- **KYC Verification**: Know Your Customer verification system
- **Bulk Import**: Excel-based property import functionality

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **pnpm** (v10.13.1 or higher) - Package manager
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/zaptatech/rental-guru-frontend.git
   cd rental-guru-frontend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**

   Create a `.env.local` file in the root directory and add the following environment variables:

   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=your_api_base_url_here

   # Google Maps API Key (for location services)
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

4. **Start the development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

```
rental-guru-frontend/
├── app/                          # Next.js App Router pages
│   ├── (dashboard)/             # Protected dashboard routes
│   │   ├── (property-owner)/    # Property owner specific pages
│   │   ├── (tenant)/           # Tenant specific pages
│   │   └── (vendor)/           # Vendor specific pages
│   ├── auth/                   # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── verify-otp/
│   ├── api/                    # API routes
│   └── globals.css             # Global styles
├── components/                 # Reusable UI components
│   ├── auth/                  # Authentication components
│   ├── dashboard/             # Dashboard specific components
│   ├── landing/               # Landing page components
│   ├── ui/                    # Base UI components (shadcn/ui)
│   └── theme-provider.tsx     # Theme configuration
├── hooks/                     # Custom React hooks
│   ├── api/                   # API related hooks
│   └── use-*.ts              # Utility hooks
├── lib/                       # Core utilities and configurations
│   ├── contexts/              # React contexts
│   ├── stores/                # Zustand state management
│   ├── axios.ts              # HTTP client configuration
│   └── utils.ts              # Utility functions
├── services/                  # API service functions
│   ├── auth/                 # Authentication services
│   ├── properties/           # Property management services
│   ├── tenant/               # Tenant services
│   └── vendor/               # Vendor services
├── assets/                    # Static assets
│   ├── icons/                # SVG icons
│   └── images/               # Images
├── public/                    # Public static files
├── utils/                     # Helper utilities
└── types.ts                   # Global TypeScript types
```

## 🎯 User Roles & Capabilities

### Property Owner

- **Dashboard**: Overview of properties, revenue, and tenant activities
- **Property Management**: Add, edit, and manage multiple property types
- **Tenant Management**: View applications, approve tenants, manage leases
- **Vendor Network**: Hire and manage service providers
- **Communication**: Direct messaging with tenants and vendors
- **Payments**: Rent collection and financial reporting
- **Administration**: User management and settings
- **Investors**: Investor relationship management

### Tenant

- **Dashboard**: Personal rental overview and notifications
- **Property Search**: Browse and apply for available properties
- **My Applications**: Track rental application status
- **Maintenance Requests**: Submit and track maintenance issues
- **Communication**: Message property owners and vendors
- **Payments**: Rent payment and history
- **Guru AI**: AI assistant for rental-related queries

### Vendor

- **Dashboard**: Service request overview and business metrics
- **Job Management**: View and manage service requests
- **Communication**: Coordinate with property owners and tenants
- **Profile Management**: Business profile and service offerings

## 🏢 Property Types Supported

The platform supports various property types with specialized workflows:

- **Single Family Home**: Traditional single-family residential properties
- **Multi-Family**: Duplexes, triplexes, and small multi-unit buildings
- **Student Housing**: Purpose-built student accommodation
- **Apartment Building**: Large residential complexes
- **Senior Living**: Age-restricted senior housing communities
- **University Housing**: On-campus and affiliated university housing

Each property type has customized:

- Listing forms and requirements
- Unit/room management interfaces
- Bulk import templates
- Specific compliance features

## 🛠️ Technology Stack

### Frontend Framework

- **Next.js 15.2.4**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript 5**: Type-safe development

### UI & Styling

- **Tailwind CSS 4.1.6**: Utility-first CSS framework
- **shadcn/ui**: High-quality component library
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Framer Motion**: Animation library

### State Management

- **Zustand**: Lightweight state management
- **React Query (TanStack Query)**: Server state management
- **React Hook Form**: Form state management
- **React Context**: Authentication and theme state

### Development Tools

- **ESLint**: Code linting with custom configuration
- **Prettier**: Code formatting
- **TypeScript ESLint**: TypeScript-specific linting rules

### APIs & Services

- **Axios**: HTTP client for API requests
- **Google Maps API**: Location services and mapping
- **React Phone Input**: International phone number input

### Validation & Forms

- **Zod**: Schema validation
- **React Hook Form**: Form handling with validation
- **Input OTP**: One-time password input components

## 📱 Key Features Deep Dive

### Authentication System

- Email/password authentication
- OTP verification for account security
- Multi-role user management
- KYC (Know Your Customer) verification process
- Role-based access control

### Property Management

- **Add Properties**: Step-by-step property addition wizard
- **Bulk Import**: Excel-based bulk property import
- **Property Types**: Support for 6 different property types
- **Unit Management**: Individual unit/room management
- **Photo Management**: Multiple photo upload with drag-and-drop
- **Availability Scheduling**: Property showing time management

### Communication Hub

- Real-time messaging between all user types
- Notification system for important updates
- Maintenance request communications
- Automated system notifications

### Dashboard Analytics

- Property performance metrics
- Revenue tracking and reporting
- Tenant engagement analytics
- Maintenance request tracking
- Occupancy rates and trends

## 🔧 Development Guidelines

### Code Style

- Follow TypeScript strict mode
- Use functional components with hooks
- Implement proper error boundaries
- Follow component composition patterns
- Use custom hooks for reusable logic

### File Naming Conventions

- Components: `PascalCase` (e.g., `PropertyCard.tsx`)
- Hooks: `camelCase` with `use` prefix (e.g., `usePropertyFilters.ts`)
- Utilities: `kebab-case` (e.g., `format-date.ts`)
- Types: `PascalCase` with appropriate suffix (e.g., `UserProfile.ts`)

### Component Structure

```tsx
// Component imports
import { useState } from "react";

// Type definitions
interface ComponentProps {
  // props
}

// Component implementation
export const ComponentName = ({ prop }: ComponentProps) => {
  // hooks
  // handlers
  // render
};

export default ComponentName;
```

## 🧪 Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Package Management
pnpm install      # Install dependencies
pnpm add [package]    # Add new dependency
pnpm remove [package] # Remove dependency
```

## 🌍 Environment Variables

### Required Environment Variables

| Variable                          | Description                               | Example                      |
| --------------------------------- | ----------------------------------------- | ---------------------------- |
| `NEXT_PUBLIC_API_URL`             | Backend API base URL                      | `https://api.rentalguru.com` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key for location services | `AIzaSy...`                  |

### Optional Environment Variables

| Variable   | Description             | Default       |
| ---------- | ----------------------- | ------------- |
| `NODE_ENV` | Environment mode        | `development` |
| `PORT`     | Development server port | `3000`        |

## 🚀 Deployment

### Production Build

```bash
pnpm build
pnpm start
```

### Environment Setup for Production

1. Set all required environment variables
2. Configure reverse proxy (nginx/apache)
3. Set up SSL certificates
4. Configure CDN for static assets
5. Set up monitoring and logging

### Recommended Hosting Platforms

- **Vercel**: Optimized for Next.js applications
- **Netlify**: Great for static deployments
- **AWS Amplify**: Full-stack AWS integration
- **Docker**: Containerized deployment

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Workflow

- Follow the existing code style and patterns
- Write meaningful commit messages
- Add appropriate tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📚 API Integration

The frontend integrates with the Rental Guru backend API for:

- **Authentication**: User login, signup, and session management
- **Property Management**: CRUD operations for properties and units
- **User Management**: Profile management for all user types
- **Communication**: Messaging and notification systems
- **File Uploads**: Property photos and document uploads
- **Payment Processing**: Rent collection and financial transactions

### API Client Configuration

The project uses Axios as the HTTP client with:

- Request/response interceptors for authentication
- Error handling and retry logic
- TypeScript interfaces for all API responses
- Centralized API endpoint configuration

## 🔒 Security Features

- **Authentication**: Secure token-based authentication
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Client and server-side validation with Zod
- **XSS Protection**: Content Security Policy implementation
- **CSRF Protection**: Built-in Next.js CSRF protection
- **Secure Headers**: Security headers configuration

## 📱 Browser Support

- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions
- **Mobile**: iOS Safari, Chrome Mobile

## 🐛 Known Issues & Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**

   - Ensure `.env.local` file is in the root directory
   - Restart the development server after adding new variables
   - Check variable names have `NEXT_PUBLIC_` prefix for client-side access

2. **Google Maps Not Loading**

   - Verify `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set correctly
   - Ensure the API key has proper permissions for Maps JavaScript API
   - Check browser console for specific Google Maps errors

3. **Build Errors**
   - Run `pnpm install` to ensure all dependencies are installed
   - Clear Next.js cache: `rm -rf .next`
   - Check for TypeScript errors: `pnpm lint`

### Performance Optimization

- Use dynamic imports for heavy components
- Optimize images with Next.js Image component
- Implement proper loading states
- Use React.memo for expensive components
- Minimize bundle size with tree shaking

## 📞 Support

For support and questions:

- **GitHub Issues**: [Report bugs and feature requests](https://github.com/zaptatech/rental-guru-frontend/issues)
- **Documentation**: Check the `/docs` folder for detailed guides
- **Email**: Contact the development team for urgent issues

## 📄 License

This project is proprietary software owned by ZaptaTech. All rights reserved.

---

**Built with ❤️ by the ZaptaTech Team**

_Making property management simple and efficient for everyone in the rental ecosystem._
