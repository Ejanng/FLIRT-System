# 🚀 FLIRT Startup Guide

## Quick Start (3 Commands)

```bash
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser. You should see the FLIRT homepage! 🎉

---

## 📋 What You'll See

When you visit `http://localhost:5173`, the app will:

1. ✅ Load the **Homepage** automatically
2. ✅ Display the **mobile-first responsive layout**
3. ✅ Show **navigation** (top bar on desktop, bottom bar on mobile)
4. ✅ Present the FLIRT hero section with search functionality
5. ✅ List lost and found items (mock data if backend is not running)

---

## 🔍 How the Entry Points Work

### 1. **`/index.html`** (Root HTML File)
```html
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

**What it does:**
- Creates an empty `<div id="root">` where React will mount
- Loads `/src/main.tsx` as the JavaScript entry point
- Sets up mobile viewport meta tags
- Configures theme color (#5B8FB9 - muted blue)
- Provides accessibility features

**Mobile-first features:**
- Responsive viewport settings
- Apple mobile web app meta tags
- Theme color for browser chrome
- Touch-friendly scaling

---

### 2. **`/src/main.tsx`** (React Entry Point)
```typescript
import App from './App.tsx'
import '../styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

**What it does:**
- Finds the `#root` div from `index.html`
- Imports global styles (Tailwind CSS + custom styles)
- Creates a React root and renders the `<App />` component
- Wraps app in `StrictMode` for development warnings
- Logs initialization messages in development mode

**Import paths:**
- `./App.tsx` → `/src/App.tsx` (same folder)
- `../styles/globals.css` → `/styles/globals.css` (parent folder)

---

### 3. **`/src/App.tsx`** (Main Application Component)
```typescript
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        {/* ... other routes ... */}
      </Routes>
      <ToastProvider />
    </Router>
  );
}
```

**What it does:**
- Sets up **React Router** with HashRouter (for static hosting)
- Wraps all main routes with `<Layout>` component
- Loads **Home page by default** when visiting `/`
- Provides toast notifications globally
- Handles 404s by redirecting to homepage

**Route structure:**
```
/              → Home (with Layout)
/report        → Report Item (with Layout)
/claim         → Claim Item (with Layout)
/admin         → Admin Dashboard (with Layout)
/about         → About Page (with Layout)
/auth          → Authentication (NO Layout)
/*             → Redirect to Home
```

---

## 🎨 Layout Component Loading

The **`/components/Layout.tsx`** provides:

### Desktop (≥768px)
- ✅ Top navigation bar with logo
- ✅ Horizontal menu items
- ✅ Active route highlighting
- ✅ Hover effects on navigation

### Mobile (<768px)
- ✅ Top header with logo and hamburger menu
- ✅ Bottom navigation bar (thumb-friendly)
- ✅ 5 main navigation items
- ✅ Active route indicator (blue highlight)
- ✅ Fixed positioning for easy access

### Responsive Breakpoints
```css
Mobile:  < 768px  (default styles)
Tablet:  ≥ 768px  (md: prefix)
Desktop: ≥ 1024px (lg: prefix)
```

---

## 📱 Mobile-First Design Features

### Viewport Configuration
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
```

- **Width**: Matches device width
- **Initial Scale**: 1:1 pixel ratio
- **Max Scale**: Allows zooming up to 5x
- **User Scalable**: Users can pinch to zoom (accessibility)

### Touch-Friendly Targets
- Minimum tap target: 44×44px (iOS guidelines)
- Bottom navigation: 64px height
- Adequate spacing between touch targets

### Performance Optimizations
- Lazy loading routes (future enhancement)
- Optimized images with fallbacks
- Minimal JavaScript bundle with code splitting

---

## 🧭 Navigation Flow

```
User visits localhost:5173
         ↓
    index.html loads
         ↓
    Loads /src/main.tsx
         ↓
    Imports globals.css (Tailwind + custom styles)
         ↓
    Renders <App /> component
         ↓
    HashRouter initializes (#/)
         ↓
    Matches Route path="/"
         ↓
    Wraps <Home /> in <Layout>
         ↓
    Layout renders:
    - Desktop: Top nav + content
    - Mobile: Top header + content + bottom nav
         ↓
    Home page displays:
    - Hero section
    - Search functionality
    - Lost items list
    - Found items list
    - Features showcase
```

---

## 🎯 Default Homepage Features

When you load the app, the **Home** component shows:

### 1. **Hero Section**
- FLIRT logo and branding
- Tagline: "Finding and Locating lost Items..."
- Call-to-action buttons
- Gradient background with muted blue theme

### 2. **Search & Filters**
- Search by item name/description
- Filter by category (Electronics, Books, etc.)
- Filter by location
- Filter by date range

### 3. **Lost Items Section**
- Card grid layout
- Item images
- Item descriptions
- Status badges
- Click to view details

### 4. **Found Items Section**
- Similar card layout
- Shows found items waiting to be claimed
- Quick claim action

### 5. **Statistics**
- Items reported count
- Items returned count
- Success rate percentage

### 6. **Features Showcase**
- Easy search feature
- Quick reporting feature
- Community-driven approach

---

## 🔧 Troubleshooting

### Problem: Blank Page
**Solution:**
1. Check browser console (F12) for errors
2. Verify all files exist:
   - `/index.html`
   - `/src/main.tsx`
   - `/src/App.tsx`
   - `/components/Layout.tsx`
   - `/pages/Home.tsx`
   - `/styles/globals.css`
3. Ensure imports use correct paths

### Problem: "Cannot find module" errors
**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Problem: Port 5173 already in use
**Solution:**
```bash
# Kill process on port 5173
lsof -i :5173
kill -9 <PID>

# Or use a different port
# Edit vite.config.ts and change port
```

### Problem: Styles not loading
**Solution:**
1. Verify `/styles/globals.css` exists
2. Check Tailwind CSS is installed: `npm list tailwindcss`
3. Restart dev server: `npm run dev`

### Problem: Layout not showing
**Solution:**
1. Check `/components/Layout.tsx` exists
2. Verify import path in `/src/App.tsx`
3. Check for TypeScript errors in terminal

---

## ✅ Verification Checklist

After running `npm run dev`, verify:

- [ ] Terminal shows "Local: http://localhost:5173"
- [ ] No error messages in terminal
- [ ] Browser opens automatically (or open manually)
- [ ] FLIRT logo visible in top-left (desktop) or top (mobile)
- [ ] Navigation menu visible
- [ ] Homepage content loads (hero, search, items)
- [ ] Can click navigation items (Home, Report, Claim, Admin, About)
- [ ] Mobile: Bottom navigation bar shows 5 items
- [ ] Desktop: Top navigation bar shows all items
- [ ] Responsive: Resize browser to see layout changes
- [ ] No console errors in browser DevTools (F12)

---

## 📱 Testing Mobile View

### In Browser (Desktop)
1. Open DevTools (F12)
2. Click device toolbar icon (or press Ctrl+Shift+M)
3. Select a mobile device (iPhone 12, etc.)
4. Verify:
   - Bottom navigation bar appears
   - Top header is compact
   - Content is thumb-scrollable
   - Touch targets are large enough

### On Real Device
1. Get your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Ensure device is on same WiFi network
3. Open browser on mobile device
4. Visit: `http://YOUR_IP:5173`
5. Test touch interactions

---

## 🎨 Theme Colors Reference

The app uses a **muted blue color palette**:

```css
Primary:   #5B8FB9  /* Main blue */
Light:     #D8E6F3  /* Light blue background */
Accent:    #7FAFD9  /* Accent blue */
Text:      #1F2937  /* Dark gray text */
Background: #F8FAFB /* Off-white background */
```

These are defined in `/styles/globals.css` and used throughout components.

---

## 🚦 Development Mode Features

When running `npm run dev`, you get:

- ✅ **Hot Module Replacement (HMR)** - Changes appear instantly
- ✅ **Error overlay** - Shows errors in browser
- ✅ **Console logs** - Initialization messages
- ✅ **React DevTools** - Debug components
- ✅ **Source maps** - Debug original TypeScript

---

## 🏗️ File Structure Recap

```
/
├── index.html              # HTML entry (loads /src/main.tsx)
├── src/
│   ├── main.tsx           # React entry (renders App)
│   └── App.tsx            # Router + routes (loads Layout + Home)
├── components/
│   └── Layout.tsx         # Navigation + layout wrapper
├── pages/
│   └── Home.tsx           # Homepage component (default route)
├── styles/
│   └── globals.css        # Global styles + Tailwind
└── vite.config.ts         # Build configuration
```

---

## 🎉 Success!

If you see the FLIRT homepage with:
- ✅ Logo and branding
- ✅ Navigation menu
- ✅ Hero section
- ✅ Search functionality
- ✅ Item listings

**Congratulations! Your mobile-first FLIRT app is running! 🎊**

Now you can:
1. Click around the navigation
2. Test the Report Item form
3. View the Admin Dashboard
4. Read the About page
5. Test responsive layouts

---

## 📚 Next Steps

- **Add Backend**: See [server/SETUP.md](./server/SETUP.md)
- **Deploy**: Build with `npm run build`, deploy `/dist` folder
- **Customize**: Edit colors in `/styles/globals.css`
- **Add Features**: Create new pages in `/pages`
- **Test**: Set up Jest/Vitest for testing

---

## 🆘 Need Help?

- Check [QUICK_START.md](./QUICK_START.md) for basic setup
- Read [README.md](./README.md) for full documentation
- View [STRUCTURE.md](./STRUCTURE.md) for file organization
- See [server/SETUP.md](./server/SETUP.md) for backend setup

---

**Happy coding! 🚀**

FLIRT - Finding and Locating lost Items to Return to Their rightful owners
