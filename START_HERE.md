# 👋 START HERE - New to FLIRT?

**Welcome to FLIRT - Lost and Found for CCIS Students!**

---

## ⚡ I Just Want to Run the App

```bash
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

**That's it!** 🎉

---

## 📖 What is FLIRT?

**FLIRT** = **F**inding and **L**ocating lost **I**tems to **R**eturn to **T**heir rightful owners

A mobile-first web application that helps CCIS students report and find lost items.

---

## 🎯 What You Get

### 6 Complete Pages
1. **Home** - Search and browse lost/found items
2. **Report** - Report a lost or found item
3. **Claim** - Claim an item you've lost
4. **Admin** - Dashboard with analytics (for admins)
5. **About** - Learn about the project
6. **Auth** - Login/signup (ready for backend)

### Features
- ✅ Mobile-first responsive design
- ✅ Bottom navigation for easy thumb access
- ✅ Search and filter functionality
- ✅ Form validation
- ✅ Toast notifications
- ✅ Loading states
- ✅ Beautiful muted blue theme (#5B8FB9)
- ✅ Accessibility built-in

---

## 🚀 Quick Commands

```bash
# Install dependencies
npm install

# Start development server (port 5173)
npm run dev

# Build for production
npm run build

# Preview production build (port 4173)
npm run preview

# Check TypeScript
npx tsc --noEmit
```

---

## 📱 Testing on Mobile

### On Real Device

1. Find your computer's IP address:
   ```bash
   # Mac/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. Start dev server with network access:
   ```bash
   npm run dev -- --host
   ```

3. On mobile (same WiFi):
   - Open browser
   - Visit: `http://YOUR_IP:5173`

### In Browser DevTools

1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select mobile device (iPhone 12, etc.)
4. Test touch interactions

---

## 🎨 Theme Colors

```css
Primary Blue:  #5B8FB9  /* Main buttons, active nav */
Light Blue:    #D8E6F3  /* Backgrounds, hover states */
Accent Blue:   #7FAFD9  /* Gradients, highlights */
Text Dark:     #1F2937  /* Main text */
Background:    #F8FAFB  /* Page background */
```

---

## 📂 Project Structure

```
/
├── src/              # Entry points
│   ├── main.tsx     # React entry
│   └── App.tsx      # Router setup
├── components/       # Reusable components
│   ├── Layout.tsx
│   └── ui/          # 40+ UI components
├── pages/           # Route pages
│   ├── Home.tsx
│   ├── ReportItem.tsx
│   └── ...
├── styles/
│   └── globals.css  # Tailwind + theme
└── server/          # Optional backend
```

---

## 🔧 Troubleshooting

### Port 5173 Already in Use?

```bash
# Find and kill the process
lsof -i :5173
kill -9 <PID>

# Or use a different port
npm run dev -- --port 3000
```

### Module Not Found?

```bash
# Clean reinstall
rm -rf node_modules package-lock.json
npm install
```

### Blank Page?

1. Check browser console (F12) for errors
2. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R)
3. Clear browser cache

### Build Fails?

```bash
# Check TypeScript errors
npx tsc --noEmit

# Check for syntax errors
npm run build
```

---

## 📚 Documentation

### New Users (Start Here!)
- **[START_HERE.md](./START_HERE.md)** - This file
- **[CLONE_AND_RUN.md](./CLONE_AND_RUN.md)** - Detailed setup guide
- **[QUICK_START.md](./QUICK_START.md)** - 3-step quick start

### Developers
- [STRUCTURE.md](./STRUCTURE.md) - Project structure
- [IMPORT_STRUCTURE.md](./IMPORT_STRUCTURE.md) - Import patterns
- [TEST_BUILD.md](./TEST_BUILD.md) - Build testing

### Contributors
- [PRE_FLIGHT_CHECKLIST.md](./PRE_FLIGHT_CHECKLIST.md) - Before committing
- [DEPLOYMENT_READY.md](./DEPLOYMENT_READY.md) - Deployment status

### Backend (Optional)
- [server/SETUP.md](./server/SETUP.md) - Backend setup
- [server/README.md](./server/README.md) - API docs

---

## 🎯 Common Tasks

### I want to...

**...add a new page**
1. Create file in `/pages/NewPage.tsx`
2. Add route in `/src/App.tsx`
3. Add navigation link in `/components/Layout.tsx`

**...add a new component**
1. Create file in `/components/MyComponent.tsx`
2. Use relative imports: `import { MyComponent } from '../components/MyComponent'`

**...change colors**
1. Edit `/styles/globals.css`
2. Update CSS variables in `:root`

**...deploy**
1. Run `npm run build`
2. Deploy `/dist` folder to hosting (Netlify, Vercel, etc.)

**...connect backend**
1. See [server/SETUP.md](./server/SETUP.md)
2. Start backend: `cd server && npm start`
3. Backend runs on port 5000
4. Frontend proxies `/api` requests to backend

---

## ✅ Verify Installation

After `npm install && npm run dev`:

- [ ] Terminal shows "ready in XXX ms"
- [ ] No error messages
- [ ] Browser opens to localhost:5173
- [ ] FLIRT logo visible
- [ ] Navigation works
- [ ] Homepage loads
- [ ] Can navigate to all pages
- [ ] Mobile view works (resize browser)
- [ ] No console errors (F12)

---

## 🆘 Need Help?

### Quick Checks
1. Node version: `node --version` (need v16+)
2. npm version: `npm --version` (need v7+)
3. Files exist: `ls -la src/ components/ pages/`

### Common Commands
```bash
# Reinstall everything
rm -rf node_modules package-lock.json && npm install

# Check for errors
npx tsc --noEmit

# View logs
npm run dev 2>&1 | tee dev.log
```

### Documentation
- Full setup guide: [CLONE_AND_RUN.md](./CLONE_AND_RUN.md)
- Troubleshooting: [TEST_BUILD.md](./TEST_BUILD.md)
- All docs: [README.md](./README.md)

---

## 🎉 You're All Set!

Your FLIRT app should now be running at **http://localhost:5173**

### What to Explore:
- **Home** - Browse lost and found items
- **Report** - Try the form (works offline with mock data)
- **Claim** - Search for items
- **Admin** - View analytics dashboard
- **About** - Learn more about the project

### Next Steps:
1. Explore the codebase
2. Try all features
3. Test responsive design
4. Read documentation
5. Start customizing!

---

## 📞 Support

- **Setup Issues:** See [CLONE_AND_RUN.md](./CLONE_AND_RUN.md)
- **Build Issues:** See [TEST_BUILD.md](./TEST_BUILD.md)
- **Import Errors:** See [IMPORT_STRUCTURE.md](./IMPORT_STRUCTURE.md)
- **Backend Setup:** See [server/SETUP.md](./server/SETUP.md)

---

## 🚀 Ready to Code?

```bash
# Open in VS Code
code .

# Start dev server
npm run dev

# Open browser
# Visit: http://localhost:5173
```

**Happy coding!** 🎊

---

**Quick Links:**
- [Full README](./README.md)
- [Clone & Run Guide](./CLONE_AND_RUN.md)
- [Project Structure](./STRUCTURE.md)
- [Deployment Ready](./DEPLOYMENT_READY.md)
