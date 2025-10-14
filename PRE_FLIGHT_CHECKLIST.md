# ✈️ FLIRT - Pre-Flight Checklist

**Run this before committing/pushing to ensure everything works after cloning**

---

## 🎯 Mission: Ensure `npm install` + `npm run dev` Works

This checklist ensures that anyone cloning your repository can:
1. Run `npm install` successfully
2. Run `npm run dev` successfully
3. See the FLIRT UI at `http://localhost:5173` (NOT a JSON file)

---

## ✅ Critical Files Checklist

### Entry Point Files
- [ ] `/index.html` exists and points to `/src/main.tsx`
- [ ] `/src/main.tsx` exists and imports from `./App.tsx`
- [ ] `/src/App.tsx` exists and imports from `../components/` and `../pages/`
- [ ] `/src/vite-env.d.ts` exists (Vite TypeScript definitions)

### Configuration Files
- [ ] `/package.json` exists with all dependencies
- [ ] `/vite.config.ts` exists and properly configured
- [ ] `/tsconfig.json` exists with correct paths
- [ ] `/tsconfig.node.json` exists
- [ ] `/.gitignore` exists (excludes node_modules, .env, dist)

### Core Folders
- [ ] `/components/` folder exists
- [ ] `/components/ui/` folder exists with Shadcn components
- [ ] `/pages/` folder exists with all page components
- [ ] `/styles/` folder exists with `globals.css`

### Critical Components
- [ ] `/components/Layout.tsx` exists
- [ ] `/components/ToastProvider.tsx` exists
- [ ] `/components/LoadingSpinner.tsx` exists
- [ ] `/components/AdminAnalyticsSimple.tsx` exists

### Page Components
- [ ] `/pages/Home.tsx` exists
- [ ] `/pages/ReportItem.tsx` exists
- [ ] `/pages/ClaimItem.tsx` exists
- [ ] `/pages/AdminDashboard.tsx` exists
- [ ] `/pages/About.tsx` exists
- [ ] `/pages/Auth.tsx` exists

### Styles
- [ ] `/styles/globals.css` exists
- [ ] Tailwind CSS imports are present
- [ ] Custom color variables defined

---

## 📦 Dependencies Checklist

### Check package.json has:

**Core React Dependencies:**
- [ ] `react` (^18.3.1)
- [ ] `react-dom` (^18.3.1)
- [ ] `react-router-dom` (^6.26.0)

**Critical UI Libraries:**
- [ ] `react-hot-toast` (^2.4.1) ⚠️ **IMPORTANT**
- [ ] `lucide-react` (^0.445.0)
- [ ] All `@radix-ui/react-*` packages

**Styling:**
- [ ] `tailwindcss` (^4.0.0) - in devDependencies
- [ ] `class-variance-authority`
- [ ] `tailwind-merge`
- [ ] `clsx`

**Build Tools:**
- [ ] `vite` (^5.4.3) - in devDependencies
- [ ] `@vitejs/plugin-react` - in devDependencies
- [ ] `typescript` (^5.5.4) - in devDependencies

---

## 🔧 Configuration Verification

### package.json Scripts

```json
"scripts": {
  "dev": "vite",                    // ✅ Must be "vite"
  "build": "tsc && vite build",     // ✅ TypeScript then build
  "preview": "vite preview"         // ✅ Preview production
}
```

### vite.config.ts

```typescript
// ✅ Must have:
- React plugin
- Port 5173 (default Vite port)
- Proxy for /api to localhost:5000
- Correct alias paths
```

### tsconfig.json

```json
// ✅ Must have:
- "jsx": "react-jsx"
- "module": "ESNext"
- "moduleResolution": "bundler"
- Path mappings for @/* etc.
- Include: ["src", "components", "pages", "styles"]
```

### index.html

```html
<!-- ✅ Must have: -->
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

---

## 🧪 Test Commands

### 1. Clean Install Test

```bash
# Simulate fresh clone
rm -rf node_modules package-lock.json

# Install
npm install

# ✅ Should complete without errors
# ✅ Should install ~50-100 packages
# ✅ Should create package-lock.json
```

### 2. TypeScript Check

```bash
npx tsc --noEmit

# ✅ Should show: "No errors"
# ❌ If errors, fix them before committing
```

### 3. Development Server Test

```bash
npm run dev

# ✅ Should output:
#   VITE v5.x.x  ready in xxx ms
#   ➜  Local:   http://localhost:5173/

# ✅ Terminal should have no errors
```

### 4. Browser Test

```
Open: http://localhost:5173

✅ Should show:
   - FLIRT logo and branding
   - Navigation menu (top or bottom)
   - Homepage hero section
   - Blue color theme (#5B8FB9)

❌ Should NOT show:
   - Blank white page
   - JSON response
   - Error messages
   - "Cannot find module" errors
```

### 5. Console Test

```
Open browser DevTools (F12) > Console

✅ Should show:
   🚀 FLIRT App initialized
   📱 Mobile-first responsive design enabled
   🎨 Muted blue theme: #5B8FB9

❌ Should NOT show:
   - Red error messages
   - "Failed to fetch" errors
   - Import resolution errors
```

### 6. Navigation Test

```
Click each navigation item:

✅ Home     → Shows homepage
✅ Report   → Shows report form
✅ Claim    → Shows claim search
✅ Admin    → Shows admin dashboard
✅ About    → Shows about page

❌ Should NOT:
   - Show 404 errors
   - Cause console errors
   - Break navigation
```

### 7. Build Test

```bash
npm run build

# ✅ Should output:
#   vite v5.x.x building for production...
#   ✓ xxx modules transformed.
#   dist/index.html
#   dist/assets/...

# ✅ Should create /dist folder
# ❌ Should have no build errors
```

### 8. Preview Test

```bash
npm run preview

# ✅ Should start preview server
# ✅ Open http://localhost:4173
# ✅ Should show same UI as dev mode
```

---

## 📱 Responsive Design Test

### Desktop View (≥768px)

```
✅ Top navigation bar visible
✅ Logo in top-left corner
✅ Horizontal menu items (Home, Report, Claim, Admin, About)
✅ No bottom navigation bar
✅ Content fills screen width (max-width container)
```

### Mobile View (<768px)

```
✅ Compact top header with logo
✅ Hamburger menu icon in top-right
✅ Bottom navigation bar with 5 items
✅ Fixed bottom bar (always visible)
✅ Touch-friendly tap targets
✅ Content scrolls smoothly
```

**Test Method:**
- Open DevTools (F12)
- Click device toolbar (Ctrl+Shift+M)
- Select mobile device
- Resize browser window

---

## 🎨 Theme & Styling Test

### Colors Verification

```
✅ Primary Blue:   #5B8FB9 (buttons, active nav)
✅ Light Blue:     #D8E6F3 (backgrounds, hover)
✅ Accent Blue:    #7FAFD9 (gradients)
✅ Text Color:     #1F2937 (dark gray)
✅ Background:     #F8FAFB (off-white)
```

### Visual Elements

```
✅ Rounded corners on buttons and cards
✅ Soft shadows on cards
✅ Smooth hover transitions
✅ Proper typography (not default Times New Roman)
✅ Icons render correctly (Lucide React)
```

---

## 🚨 Common Issues to Check

### Issue: Missing Dependencies

```bash
# Check package.json has react-hot-toast
grep "react-hot-toast" package.json

# ✅ Should find: "react-hot-toast": "^2.4.1"
```

### Issue: Wrong Entry Point

```bash
# Verify index.html points to correct entry
grep "src/main.tsx" index.html

# ✅ Should find: <script type="module" src="/src/main.tsx"></script>
```

### Issue: Duplicate App.tsx

```bash
# Check if both exist
ls -la App.tsx
ls -la src/App.tsx

# ⚠️ Both may exist - src/App.tsx is used
# /App.tsx (root) is backup/legacy
```

### Issue: Missing Styles

```bash
# Check globals.css exists
ls -la styles/globals.css

# ✅ Should exist and be ~200+ lines
```

### Issue: Import Errors

```bash
# Verify no absolute imports
grep -r "from ['\"]/" --include="*.tsx" ./src ./components ./pages

# ✅ Should return nothing (0 results)
```

---

## 📋 Pre-Commit Checklist

Before committing and pushing:

### Code Quality
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] No lint errors: `npm run lint` (if configured)
- [ ] All imports use relative paths (no `/` prefix)
- [ ] No console.log statements in production code
- [ ] No commented-out code blocks

### Functionality
- [ ] `npm install` works from scratch
- [ ] `npm run dev` starts without errors
- [ ] All 6 pages load correctly
- [ ] Navigation works
- [ ] Forms validate input
- [ ] Responsive design works (mobile + desktop)

### Build
- [ ] `npm run build` succeeds
- [ ] `npm run preview` works
- [ ] No build warnings
- [ ] Bundle size is reasonable (<1MB)

### Files
- [ ] `.gitignore` excludes node_modules and .env
- [ ] `package.json` has all dependencies
- [ ] Documentation is up to date
- [ ] README has correct setup instructions

### Backend (Optional)
- [ ] `server/package.json` exists
- [ ] `server/.env.example` exists
- [ ] Backend documentation is complete
- [ ] API endpoints documented

---

## 🎯 Final Verification

### The Ultimate Test: Fresh Clone

```bash
# 1. Clone to a new location
cd /tmp
git clone <your-repo-url> test-clone
cd test-clone

# 2. Install
npm install

# 3. Start
npm run dev

# 4. Open http://localhost:5173

# ✅ SUCCESS = FLIRT homepage displays
# ❌ FAIL = Error messages or blank page
```

---

## ✅ Success Criteria

Your repository is ready to share when:

1. ✅ Fresh clone + `npm install` works
2. ✅ `npm run dev` starts server on port 5173
3. ✅ Browser shows FLIRT UI (not JSON)
4. ✅ All navigation links work
5. ✅ Mobile and desktop views work
6. ✅ No console errors
7. ✅ Build command succeeds
8. ✅ All documentation is accurate
9. ✅ .gitignore prevents committing node_modules
10. ✅ package.json has all required dependencies

---

## 📚 Related Documentation

- [CLONE_AND_RUN.md](./CLONE_AND_RUN.md) - Detailed clone & run guide
- [QUICK_START.md](./QUICK_START.md) - Quick start guide
- [TEST_BUILD.md](./TEST_BUILD.md) - Build testing guide
- [README.md](./README.md) - Project overview

---

## 🎉 You're Ready to Share!

Once all checkboxes are ✅, your repository is ready for:
- GitHub/GitLab push
- Team collaboration
- Production deployment
- Open source release

**Anyone can clone and run with just:**
```bash
npm install && npm run dev
```

---

**Last Updated:** October 14, 2025  
**Status:** ✅ Verified  
**Next Review:** Before each major release
