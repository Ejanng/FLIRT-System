# FLIRT Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
The app will automatically open at **http://localhost:5173**

You should see the FLIRT homepage with:
- ✅ Search functionality
- ✅ Lost items list
- ✅ Found items list
- ✅ Navigation menu
- ✅ Mobile-responsive design

## 📦 Package.json Configuration

Your `package.json` is configured with:

### Core Dependencies
- **React 18.3.1** - UI framework
- **React Router DOM 6.26.0** - Client-side routing
- **TailwindCSS 4.0** - Utility-first styling
- **Motion 11.11.17** - Animation library (Framer Motion successor)
- **TypeScript 5.5.4** - Type safety
- **Vite 5.4.3** - Fast build tool

### UI Components
- **Shadcn UI** - 40+ accessible components via Radix UI
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **Recharts** - Charts for admin dashboard

### Development Scripts
```json
{
  "dev": "vite",              // Start dev server at :5173
  "build": "tsc && vite build", // Production build
  "preview": "vite preview",   // Preview production build
  "lint": "eslint ."           // Lint TypeScript files
}
```

## 🏗️ Project Structure

```
/
├── src/                    # Entry point and main app
│   ├── main.tsx           # ReactDOM entry (imports App)
│   └── App.tsx            # Router and routes setup
│
├── components/             # Reusable components
│   ├── Layout.tsx         # Navigation + layout wrapper
│   ├── LoadingSpinner.tsx
│   ├── ToastProvider.tsx
│   └── ui/                # 40+ Shadcn components
│
├── pages/                  # Route pages
│   ├── Home.tsx           # Homepage - search & browse
│   ├── ReportItem.tsx     # Report lost/found items
│   ├── ClaimItem.tsx      # Claim an item
│   ├── AdminDashboard.tsx # Admin panel
│   ├── About.tsx          # About page
│   └── Auth.tsx           # Login/Signup
│
├── styles/
│   └── globals.css        # Tailwind + custom styles
│
├── server/                 # Backend Express.js API
│   └── (see server/SETUP.md)
│
├── index.html             # HTML entry point
├── vite.config.ts         # Vite configuration
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript config
```

## 🎨 Vite Configuration

The `vite.config.ts` is set up with:

### Development Server
- **Port**: 5173 (default Vite port)
- **Proxy**: `/api` routes forward to `http://localhost:5000`

### Path Aliases
```typescript
{
  '@': './src',              // import from '@/...'
  '@components': './components',
  '@pages': './pages',
  '@styles': './styles'
}
```

### Build Optimization
- TypeScript compilation check
- Vendor code splitting (React, React DOM, React Router)
- Output to `/dist` folder

## 🔧 Common Commands

### Development
```bash
npm run dev          # Start dev server (:5173)
```

### Production Build
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run lint         # Run ESLint
```

## 🌐 Access the Application

Once running, open your browser:

**Frontend**: http://localhost:5173

You'll see:
1. **Home Page** with search bar
2. **Lost Items** section
3. **Found Items** section  
4. **Navigation** (Home, Report, Claim, Admin, About)

## 🔌 Backend (Optional)

To enable full functionality (database, auth, uploads):

```bash
cd server
npm install
cp env.example .env
# Edit .env with your PostgreSQL credentials
npm run dev
```

Backend will run on **http://localhost:5000**

See [server/SETUP.md](./server/SETUP.md) for details.

## 📱 Features You'll See

### Immediately Working
✅ **Navigation** - All routes functional  
✅ **Forms** - Report/Claim item forms  
✅ **Responsive Design** - Mobile, tablet, desktop  
✅ **Search UI** - Filter by category, location, date  
✅ **Admin Dashboard** - Analytics and management UI  

### Requires Backend
⚠️ **Database Operations** - Create/read/update items  
⚠️ **Image Uploads** - Upload item photos  
⚠️ **Authentication** - Login/signup functionality  
⚠️ **Claims Processing** - Submit and manage claims  

## 🎯 Default Port: 5173

The app uses **port 5173** (Vite's default) instead of 3000.

Benefits:
- Standard Vite convention
- No conflicts with Create React App projects
- Faster startup time

To change the port, edit `vite.config.ts`:
```typescript
server: {
  port: 3000, // Your preferred port
  // ...
}
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process on port 5173
lsof -i :5173

# Kill the process
kill -9 <PID>

# Or use a different port in vite.config.ts
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Clear TypeScript cache
rm -rf node_modules/.vite
npm run dev
```

### Blank Page / White Screen
1. Check browser console for errors
2. Verify `index.html` exists at root
3. Ensure `/src/main.tsx` imports are correct
4. Check that `globals.css` exists in `/styles`

## ✨ What Makes This Setup Work

### 1. **Correct Entry Point Chain**
```
index.html 
  → /src/main.tsx 
    → /src/App.tsx 
      → Pages (Home, Report, etc.)
```

### 2. **Proper Import Paths**
- `/src/main.tsx` imports from `../styles/globals.css`
- `/src/App.tsx` imports from `../components/` and `../pages/`
- All paths are relative to the actual file structure

### 3. **Vite Configuration**
- Port set to 5173
- Path aliases configured
- API proxy to backend
- React plugin enabled

### 4. **TypeScript Configuration**
- Includes `src`, `components`, `pages`, `styles`
- Path aliases match Vite config
- Proper module resolution

## 🎉 You're Ready!

Run `npm run dev` and start building your Lost and Found app!

For more details:
- [README.md](./README.md) - Full project documentation
- [STRUCTURE.md](./STRUCTURE.md) - Detailed folder structure
- [server/SETUP.md](./server/SETUP.md) - Backend setup

---

**FLIRT** - Finding and Locating lost Items to Return to Their rightful owners  
Made with ❤️ for CCIS students
