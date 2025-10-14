# 🚀 FLIRT - Clone and Run Guide

**Getting your FLIRT app running after cloning the repository**

---

## ⚡ Quick Start (2 Commands)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

**Expected Result:**
- ✅ Server starts on `http://localhost:5173`
- ✅ Browser opens automatically (or open manually)
- ✅ Homepage displays with FLIRT logo and navigation
- ✅ Mobile-first UI is visible (NOT a JSON file)

---

## 📋 Prerequisites

Before cloning, ensure you have:

- **Node.js** v16 or higher (`node --version`)
- **npm** v7 or higher (`npm --version`)
- **Git** installed (`git --version`)

---

## 🔄 Step-by-Step Setup

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to the project directory
cd flirt-lost-and-found
```

### Step 2: Install Dependencies

```bash
npm install
```

**What happens:**
- Downloads all required packages (~500MB)
- Installs React, Vite, Tailwind CSS, and UI libraries
- Sets up development tools
- **Takes 1-3 minutes** depending on internet speed

**Expected output:**
```
added XXX packages, and audited XXX packages in XXs

XX packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### Step 3: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.4.3  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Browser console (F12) should show:**
```
🚀 FLIRT App initialized
📱 Mobile-first responsive design enabled
🎨 Muted blue theme: #5B8FB9
```

### Step 4: Open Browser

Open your browser to: **http://localhost:5173**

---

## ✅ What You Should See

### Homepage (Desktop)
```
┌─────────────────────────────────────────────┐
│  FLIRT Logo    Home Report Claim Admin About│
├─────────────────────────────────────────────┤
│                                             │
│        🔍 FLIRT                             │
│        Lost & Found                         │
│        Finding and Locating Items...        │
│                                             │
│        [Report Lost Item]  [Find Item]      │
│                                             │
│  ┌───────────┐  ┌───────────┐             │
│  │ Search    │  │ Quick     │             │
│  │ Items     │  │ Report    │             │
│  └───────────┘  └───────────┘             │
│                                             │
└─────────────────────────────────────────────┘
```

### Homepage (Mobile)
```
┌─────────────────────┐
│ FLIRT  ≡            │ ← Top header
├─────────────────────┤
│                     │
│   🔍 FLIRT          │
│   Lost & Found      │
│                     │
│   [Report Item]     │
│   [Find Item]       │
│                     │
│   Search Items ↓    │
│                     │
├─────────────────────┤
│ 🏠 📝 🔍 👤 ℹ️      │ ← Bottom nav
└─────────────────────┘
```

---

## ❌ Common Issues & Solutions

### Issue 1: "Cannot find module 'react-hot-toast'"

**Cause:** Missing dependency (now fixed in package.json)

**Solution:**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue 2: Port 5173 Already in Use

**Error:**
```
Error: Port 5173 is already in use
```

**Solution:**
```bash
# Find the process using port 5173
lsof -i :5173

# Kill the process (replace <PID> with actual process ID)
kill -9 <PID>

# Or use a different port
npm run dev -- --port 3000
```

### Issue 3: Blank Page / White Screen

**Causes:**
- JavaScript not enabled
- Browser cache issues
- Build errors

**Solution:**
```bash
# Clear browser cache (Ctrl+Shift+Delete)
# Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

# Check browser console (F12)
# Look for error messages

# Verify TypeScript compiles
npx tsc --noEmit

# Try rebuilding
npm run build
npm run preview
```

### Issue 4: "Failed to resolve import"

**Error:**
```
Failed to resolve import "../components/Layout"
```

**Solution:**
```bash
# Verify file structure
ls -la src/
ls -la components/
ls -la pages/

# Ensure all folders exist
# Check for typos in import paths
```

### Issue 5: Seeing JSON Instead of UI

**Cause:** Accessing API endpoint instead of app

**Solution:**
- Ensure you're visiting `http://localhost:5173` (NOT `http://localhost:5000`)
- The frontend runs on port **5173** (Vite)
- The backend API runs on port **5000** (Express)

### Issue 6: Styles Not Loading

**Symptoms:** Page loads but no colors/styling

**Solution:**
```bash
# Verify globals.css exists
ls -la styles/globals.css

# Check if Tailwind is installed
npm list tailwindcss

# Restart dev server
# Press Ctrl+C to stop
npm run dev
```

---

## 🔍 Verification Checklist

After running `npm run dev`, verify:

- [ ] ✅ Terminal shows "ready in XXX ms"
- [ ] ✅ Port 5173 is open
- [ ] ✅ No error messages in terminal
- [ ] ✅ Browser opens to localhost:5173
- [ ] ✅ FLIRT logo visible in header
- [ ] ✅ Navigation menu present (top or bottom)
- [ ] ✅ Homepage shows hero section
- [ ] ✅ Colors match theme (blue #5B8FB9)
- [ ] ✅ Can click navigation items
- [ ] ✅ Routes change (Home, Report, Claim, Admin, About)
- [ ] ✅ Browser console has no errors (F12)
- [ ] ✅ Mobile view works (resize browser or use DevTools)

---

## 🧪 Testing the Setup

### 1. Test Navigation
```bash
# Open http://localhost:5173
# Click each navigation item:
- Home      → Should show homepage
- Report    → Should show report form
- Claim     → Should show claim search
- Admin     → Should show admin dashboard
- About     → Should show about page
```

### 2. Test Responsive Design
```bash
# Open DevTools (F12)
# Toggle device toolbar (Ctrl+Shift+M)
# Select mobile device (iPhone 12, etc.)
# Verify:
- Bottom navigation appears
- Top header is compact
- Content is scrollable
- Touch targets are large
```

### 3. Test Build
```bash
# Build for production
npm run build

# Expected output:
# ✓ XXX modules transformed
# dist/index.html
# dist/assets/...

# Preview production build
npm run preview

# Opens on http://localhost:4173
```

---

## 📱 Mobile Testing on Real Device

### 1. Find Your Local IP

**Mac/Linux:**
```bash
ifconfig | grep "inet "
# Look for 192.168.x.x
```

**Windows:**
```bash
ipconfig
# Look for IPv4 Address: 192.168.x.x
```

### 2. Start Dev Server with Network Access

```bash
npm run dev -- --host
```

**Output will show:**
```
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.100:5173/
```

### 3. Access from Mobile

- Ensure mobile is on **same WiFi network**
- Open browser on mobile
- Visit: `http://192.168.1.100:5173` (use your IP)
- Test touch interactions

---

## 🎨 Expected Theme & Colors

### Visual Check

When the app loads correctly, you should see:

**Colors:**
- **Primary Blue:** `#5B8FB9` (buttons, active navigation)
- **Light Blue:** `#D8E6F3` (backgrounds, hover states)
- **Accent Blue:** `#7FAFD9` (gradients, highlights)
- **Dark Text:** `#1F2937` (main text)
- **Background:** `#F8FAFB` (page background)

**Typography:**
- Clean, modern font
- Readable text sizes
- Proper line spacing

**Components:**
- Rounded buttons
- Soft shadows on cards
- Smooth hover transitions
- Responsive navigation

---

## 📊 Performance Expectations

### Development Mode
- **Initial startup:** 1-3 seconds
- **Hot reload:** < 1 second
- **Page navigation:** Instant
- **Bundle size:** ~2-3 MB (unoptimized)

### Production Build
- **Build time:** 15-30 seconds
- **Bundle size:** < 500 KB (gzipped)
- **First load:** < 2 seconds
- **Time to interactive:** < 3 seconds

---

## 🛠️ Additional Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run TypeScript check
npx tsc --noEmit

# Run linter
npm run lint

# Clean install (if issues)
rm -rf node_modules package-lock.json
npm install
```

---

## 📁 File Structure Verification

After cloning, you should have:

```
flirt-lost-and-found/
├── src/                    ← Entry points
│   ├── main.tsx           ← React entry
│   ├── App.tsx            ← Main app component
│   └── vite-env.d.ts      ← Vite types
├── components/             ← React components
│   ├── Layout.tsx
│   ├── ToastProvider.tsx
│   └── ui/                ← Shadcn components
├── pages/                  ← Route pages
│   ├── Home.tsx
│   ├── ReportItem.tsx
│   └── ...
├── styles/
│   └── globals.css        ← Tailwind + custom styles
├── index.html             ← HTML entry
├── package.json           ← Dependencies
├── vite.config.ts         ← Vite config
└── tsconfig.json          ← TypeScript config
```

**Verify:**
```bash
# Check critical files exist
ls -la src/main.tsx
ls -la src/App.tsx
ls -la index.html
ls -la package.json
ls -la vite.config.ts
```

---

## 🎯 Success Criteria

Your setup is successful when:

1. ✅ `npm install` completes without errors
2. ✅ `npm run dev` starts server on port 5173
3. ✅ Browser shows FLIRT homepage (NOT JSON)
4. ✅ Navigation works (all 5 pages accessible)
5. ✅ Responsive design works (desktop + mobile)
6. ✅ Theme colors are correct (muted blue)
7. ✅ No console errors (F12)
8. ✅ `npm run build` succeeds
9. ✅ TypeScript compiles: `npx tsc --noEmit`
10. ✅ Production preview works: `npm run preview`

---

## 🔗 Backend Setup (Optional)

The frontend works standalone with mock data. To connect the backend:

1. **Navigate to server folder:**
   ```bash
   cd server
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database** (see `server/SETUP.md`)

4. **Create `.env` file:**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

5. **Start backend server:**
   ```bash
   npm start
   # Runs on http://localhost:5000
   ```

6. **Verify API:**
   ```bash
   curl http://localhost:5000/api/health
   # Should return: {"status":"ok"}
   ```

See [server/SETUP.md](./server/SETUP.md) for detailed backend setup.

---

## 📚 Documentation

For more details:

- [README.md](./README.md) - Project overview
- [QUICK_START.md](./QUICK_START.md) - Quick start guide
- [STARTUP_GUIDE.md](./STARTUP_GUIDE.md) - Entry point explanation
- [STRUCTURE.md](./STRUCTURE.md) - Project structure
- [TEST_BUILD.md](./TEST_BUILD.md) - Build testing
- [server/SETUP.md](./server/SETUP.md) - Backend setup

---

## 🆘 Still Having Issues?

### Check These:

1. **Node version:**
   ```bash
   node --version
   # Should be v16 or higher
   ```

2. **npm version:**
   ```bash
   npm --version
   # Should be v7 or higher
   ```

3. **File permissions:**
   ```bash
   # Ensure you have read/write access
   ls -la
   ```

4. **Firewall/Antivirus:**
   - May block port 5173
   - Try disabling temporarily

5. **Network issues:**
   - Check internet connection (npm needs to download packages)
   - Try using a different network

### Clean Reinstall

If all else fails:

```bash
# Delete everything
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall
npm install

# Start fresh
npm run dev
```

---

## ✨ What You Get After Clone

**Fully functional frontend with:**
- ✅ Mobile-first responsive design
- ✅ 6 complete pages (Home, Report, Claim, Admin, About, Auth)
- ✅ Navigation (top bar + bottom bar)
- ✅ Form validation
- ✅ Search and filtering
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling
- ✅ Accessibility features
- ✅ Muted blue theme
- ✅ 40+ UI components (Shadcn)

**Backend API (optional):**
- Express.js server
- PostgreSQL database
- JWT authentication
- File upload support
- Rate limiting
- API documentation

---

## 🎉 You're Ready!

After completing these steps, your FLIRT Lost and Found application should be running smoothly on `http://localhost:5173` with a beautiful mobile-first UI!

**Next steps:**
- Explore the codebase
- Test all features
- Connect the backend (optional)
- Customize for your needs
- Deploy to production

---

**Last Updated:** October 14, 2025  
**Tested On:** Node v18+, npm v9+  
**Status:** ✅ Production Ready
