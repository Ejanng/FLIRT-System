# FLIRT Project Structure Guide

## Overview

This document explains the complete folder structure for the FLIRT Lost and Found application, organized as a monorepo with separate frontend (React + Vite) and backend (Express.js) applications.

## 📂 Root Directory Structure

```
/
├── src/                      # Frontend React application
├── server/                   # Backend Express.js API
├── guidelines/               # Development guidelines
├── index.html               # HTML entry point
├── package.json             # Frontend dependencies
├── vite.config.ts           # Vite build configuration
├── tsconfig.json            # TypeScript configuration
├── tsconfig.node.json       # TypeScript config for Vite
├── .gitignore               # Git ignore rules
├── README.md                # Project documentation
└── STRUCTURE.md             # This file
```

## 🎨 Frontend Structure (`/src`)

### Entry Points
```
/src
├── main.tsx                 # Application entry point
│                             # Renders App.tsx into root div
│                             # Imports global styles
│
├── App.tsx                  # Main App component
│                             # Contains Router and Routes
│                             # Layout wrapper for pages
│
└── vite-env.d.ts            # Vite type declarations
```

### Components (`/src/components`)
```
/src/components
├── Layout.tsx               # Main layout with navigation
├── LoadingSpinner.tsx       # Loading indicator
├── ToastProvider.tsx        # Toast notification provider
├── AdminAnalyticsSimple.tsx # Analytics component
│
├── figma/                   # Figma-imported components
│   └── ImageWithFallback.tsx # Image with fallback handling
│
└── ui/                      # Shadcn UI components (40+)
    ├── accordion.tsx        # Expandable sections
    ├── alert-dialog.tsx     # Modal dialogs
    ├── alert.tsx            # Alert messages
    ├── button.tsx           # Button component
    ├── card.tsx             # Card container
    ├── checkbox.tsx         # Checkbox input
    ├── dialog.tsx           # Dialog/modal
    ├── form.tsx             # Form components
    ├── input.tsx            # Text input
    ├── label.tsx            # Form label
    ├── select.tsx           # Dropdown select
    ├── table.tsx            # Data table
    ├── tabs.tsx             # Tab navigation
    ├── textarea.tsx         # Multi-line input
    ├── toast.tsx            # Toast notifications
    ├── tooltip.tsx          # Hover tooltips
    └── ...                  # (30+ more components)
```

### Pages (`/src/pages`)
```
/src/pages
├── Home.tsx                 # Landing page
│                             # - Search functionality
│                             # - Lost items list
│                             # - Found items list
│                             # - Filters (category, location, date)
│
├── ReportItem.tsx           # Report lost/found items
│                             # - Item details form
│                             # - Image upload
│                             # - Category selection
│                             # - Location input
│
├── ClaimItem.tsx            # Claim an item
│                             # - Claim form
│                             # - Verification questions
│                             # - Contact information
│
├── AdminDashboard.tsx       # Admin panel
│                             # - Analytics dashboard
│                             # - Manage items
│                             # - Manage claims
│                             # - User management
│
├── About.tsx                # About FLIRT page
│                             # - App information
│                             # - Team info
│                             # - Contact details
│
└── Auth.tsx                 # Login/Signup page
                              # - Login form
                              # - Signup form
                              # - JWT authentication
```

### Styles (`/src/styles`)
```
/src/styles
└── globals.css              # Global styles
                              # - Tailwind imports
                              # - CSS variables (colors)
                              # - Typography system
                              # - Custom utilities
                              # - Component overrides
```

### Assets (`/src/assets`)
```
/src/assets
├── images/                  # Image files
├── icons/                   # Custom icon files
└── fonts/                   # Custom fonts (if any)
```

## 🔧 Backend Structure (`/server`)

### Root Files
```
/server
├── server.js                # Express app entry point
├── package.json             # Backend dependencies
├── env.example              # Environment variables template
├── gitignore.txt            # Git ignore (rename to .gitignore)
└── .env                     # Actual environment variables (not in git)
```

### Configuration (`/server/config`)
```
/server/config
├── database.js              # PostgreSQL connection pool
│                             # - Connection configuration
│                             # - Error handling
│
└── init-db.js               # Database initialization
                              # - Test connection
                              # - Create tables if needed
```

### Controllers (`/server/controllers`)
```
/server/controllers
├── itemController.js        # Item management logic
│                             # - GET /api/items (list)
│                             # - GET /api/items/:id (details)
│                             # - POST /api/items (create)
│                             # - PUT /api/items/:id (update)
│                             # - DELETE /api/items/:id (delete)
│
├── userController.js        # User authentication logic
│                             # - POST /api/users/register
│                             # - POST /api/users/login
│                             # - GET /api/users/profile
│
├── claimController.js       # Claim management logic
│                             # - POST /api/claims (create)
│                             # - GET /api/claims (list)
│                             # - PUT /api/claims/:id (update status)
│
└── adminController.js       # Admin operations logic
                              # - GET /api/admin/stats
                              # - GET /api/admin/items
                              # - PUT /api/admin/items/:id/approve
                              # - DELETE /api/admin/items/:id
```

### Routes (`/server/routes`)
```
/server/routes
├── itemRoutes.js            # Item API endpoints
├── userRoutes.js            # User/auth API endpoints
├── claimRoutes.js           # Claim API endpoints
└── adminRoutes.js           # Admin API endpoints
```

### Middleware (`/server/middleware`)
```
/server/middleware
├── auth.js                  # JWT authentication
│                             # - Verify JWT token
│                             # - Attach user to request
│
├── upload.js                # File upload handling
│                             # - Multer configuration
│                             # - Image validation
│                             # - File size limits
│
├── validator.js             # Input validation
│                             # - Validate request body
│                             # - Sanitize inputs
│
├── rateLimiter.js           # Rate limiting
│                             # - Prevent abuse
│                             # - IP-based limiting
│
└── errorHandler.js          # Error handling
                              # - Catch errors
                              # - Format error responses
```

### Database (`/server`)
```
/server
└── SQL_QUERIES.sql          # Database schema
                              # - CREATE TABLE statements
                              # - Foreign keys
                              # - Indexes
                              # - Constraints
                              # - Sample data
```

### Documentation (`/server`)
```
/server
├── README.md                # Backend overview
├── SETUP.md                 # Setup instructions
├── AUTHENTICATION.md        # Auth guide
├── DATABASE_SCHEMA.md       # Database structure
├── CLAIMS_API.md            # Claims API docs
└── TEST_API.md              # API testing guide
```

## 🛠️ Configuration Files

### Vite Configuration (`/vite.config.ts`)
```typescript
- React plugin
- Path aliases (@/ → ./src/)
- Dev server on port 3000
- Proxy /api to backend
- Build optimization
```

### TypeScript Configuration (`/tsconfig.json`)
```json
- Target: ES2020
- Module: ESNext
- JSX: react-jsx
- Strict mode enabled
- Path mapping for @/*
```

### Package Management (`/package.json`)
```json
Frontend dependencies:
- react, react-dom
- react-router-dom
- tailwindcss
- vite
- typescript
- shadcn/ui components
- lucide-react
- recharts
- sonner
```

## 📱 Mobile-First Responsive Design

### Breakpoints (Tailwind)
```
sm:  640px   # Small tablets
md:  768px   # Tablets
lg:  1024px  # Laptops
xl:  1280px  # Desktops
2xl: 1536px  # Large desktops
```

### Component Organization
```
1. Mobile (default) - Stack vertically
2. Tablet (md:) - 2 columns where appropriate
3. Desktop (lg:) - Full layout with sidebars
```

## 🎨 Design System Structure

### Colors (`globals.css`)
```css
--primary: #5B8FB9      /* Muted blue */
--light: #D8E6F3        /* Light blue */
--accent: #7FAFD9       /* Accent blue */
--text: #1F2937         /* Dark gray */
```

### Typography
```css
h1-h6: Defined sizes and weights
body: Base font settings
Default line heights
Letter spacing
```

## 🔐 Security Structure

### Frontend
- No API keys in code
- Environment variables via Vite
- JWT stored in memory (not localStorage)
- HTTPS in production

### Backend
- JWT authentication
- Bcrypt password hashing
- Rate limiting
- Input validation
- CORS configuration
- SQL injection prevention

## 📦 Build Output

### Frontend Build (`npm run build`)
```
/dist
├── index.html               # Entry HTML
├── assets/
│   ├── index.[hash].js      # Bundled JS
│   ├── index.[hash].css     # Bundled CSS
│   └── [images]             # Optimized images
└── vite.svg
```

### Backend (No build needed)
```
Deploy server/ folder directly
Set environment variables
Start with: node server.js
```

## 🚀 Development Workflow

### 1. Start Backend
```bash
cd server
npm install
cp env.example .env
# Edit .env
npm run dev
```

### 2. Start Frontend
```bash
npm install
npm run dev
```

### 3. Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API: http://localhost:3000/api (proxied)

## 📝 File Naming Conventions

### React Components
- PascalCase: `ComponentName.tsx`
- Example: `AdminDashboard.tsx`

### Utilities/Helpers
- camelCase: `helperFunction.ts`
- Example: `formatDate.ts`

### Styles
- kebab-case: `component-name.css`
- Example: `globals.css`

### Backend Files
- camelCase: `fileName.js`
- Example: `itemController.js`

## 🔄 Data Flow

```
User Interaction
    ↓
React Component (pages/)
    ↓
API Call (/api/*)
    ↓
Vite Proxy (vite.config.ts)
    ↓
Express Route (server/routes/)
    ↓
Middleware (auth, validation)
    ↓
Controller (server/controllers/)
    ↓
Database (PostgreSQL)
    ↓
Response to Frontend
    ↓
Update UI
```

## 📚 Additional Notes

### Component Library (Shadcn UI)
- Components are copied into `/src/components/ui`
- Customizable and own the code
- Based on Radix UI primitives
- Fully accessible (WCAG 2.1 AA)

### Routing Strategy
- HashRouter for static hosting compatibility
- Nested routes for layout preservation
- Separate Auth route (no layout)

### State Management
- Local component state (useState)
- No global state library needed yet
- Context API for auth (if needed)

### API Communication
- RESTful API design
- JSON request/response
- JWT in Authorization header
- Error handling with try/catch

---

This structure provides a scalable, maintainable foundation for the FLIRT Lost and Found application while keeping frontend and backend concerns properly separated.
