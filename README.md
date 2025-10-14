# FLIRT - Lost and Found Application

**Finding and Locating lost Items to Return to Their rightful owners**

A mobile-first Lost and Found web application for CCIS students built with React, TypeScript, Vite, and Tailwind CSS.

---

## 🚀 Quick Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd flirt-lost-and-found
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```

### 4. Open in browser
Navigate to: **http://localhost:5173**

**✅ Expected Result:** You should see the FLIRT homepage with a mobile-first UI showing the logo, navigation, and Lost & Found interface.

**❌ If you see JSON instead:** See [Troubleshooting](#troubleshooting) below.

---

## 🎨 Design System

- **Primary Color**: `#5B8FB9` (Muted Blue)
- **Light Accent**: `#D8E6F3`
- **Accent Color**: `#7FAFD9`
- **Text Color**: `#1F2937`
- **Mobile-first responsive design**
- **Clean typography with soft shadows**
- **Rounded buttons with smooth hover transitions**

## 📁 Project Structure

```
/
├── src/                      # Frontend source code
│   ├── main.tsx             # Application entry point
│   ├── App.tsx              # Main App component with routing
│   ├── vite-env.d.ts        # Vite TypeScript declarations
│   ├── components/          # Reusable React components
│   │   ├── Layout.tsx       # Main layout wrapper
│   │   ├── LoadingSpinner.tsx
│   │   ├── ToastProvider.tsx
│   │   ├── AdminAnalyticsSimple.tsx
│   │   ├── figma/           # Figma-specific components
│   │   │   └── ImageWithFallback.tsx
│   │   └── ui/              # Shadcn UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── ...          # (40+ UI components)
│   ├── pages/               # Application pages/routes
│   │   ├── Home.tsx         # Landing page with search
│   │   ├── ReportItem.tsx   # Report lost/found items
│   │   ├── ClaimItem.tsx    # Claim items form
│   │   ├── AdminDashboard.tsx # Admin management
│   │   ├── About.tsx        # About page
│   │   └── Auth.tsx         # Login/Signup
│   ├── styles/              # Global styles
│   │   └── globals.css      # Tailwind + custom CSS
│   └── assets/              # Static assets (images, icons)
│
├── server/                   # Backend Express.js API
│   ├── server.js            # Express server entry point
│   ├── package.json         # Backend dependencies
│   ├── env.example          # Environment variables template
│   ├── config/              # Configuration files
│   │   ├── database.js      # PostgreSQL connection
│   │   └── init-db.js       # Database initialization
│   ├── controllers/         # Request handlers
│   │   ├── itemController.js
│   │   ├── userController.js
│   │   ├── claimController.js
│   │   └── adminController.js
│   ├── routes/              # API route definitions
│   │   ├── itemRoutes.js
│   │   ├── userRoutes.js
│   │   ├── claimRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/          # Express middleware
│   │   ├── auth.js          # JWT authentication
│   │   ├── upload.js        # Multer file upload
│   │   ├── validator.js     # Input validation
│   │   ├── rateLimiter.js   # Rate limiting
│   │   └── errorHandler.js  # Error handling
│   ├── SQL_QUERIES.sql      # Database schema
│   └── Documentation/       # API docs
│       ├── SETUP.md
│       ├── AUTHENTICATION.md
│       ├── DATABASE_SCHEMA.md
│       ├── CLAIMS_API.md
│       └── TEST_API.md
│
├── guidelines/               # Development guidelines
│   └── Guidelines.md
│
├── index.html               # HTML entry point (Vite)
├── package.json             # Frontend dependencies
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript config
├── tsconfig.node.json       # TypeScript config for Node
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## 🔧 Troubleshooting

### Problem: Seeing JSON instead of HTML/UI

If you see a JSON response or API data instead of the FLIRT interface:

**Cause:** You're accessing the backend API port instead of the frontend app.

**Solution:**

1. **Verify the correct URL:**
   - ✅ **Frontend:** `http://localhost:5173` (Vite dev server)
   - ❌ **Backend API:** `http://localhost:5000` (Express server)

2. **Ensure you're in the root directory** (not the `/server` folder):
   ```bash
   # Should be in: /flirt-lost-and-found
   # NOT in: /flirt-lost-and-found/server
   pwd
   ```

3. **Run the correct command:**
   ```bash
   npm run dev
   # This starts the Vite frontend server on port 5173
   ```

4. **Check terminal output:**
   ```
   Expected output:
   VITE v5.x.x  ready in xxx ms
   ➜  Local:   http://localhost:5173/
   ```

5. **Hard refresh the browser:**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

### Other Common Issues

**Port 5173 already in use:**
```bash
# Kill the process
lsof -i :5173
kill -9 <PID>

# Or use a different port
npm run dev -- --port 3000
```

**Blank page or white screen:**
```bash
# Check browser console (F12) for errors
# Clear cache and hard refresh
# Reinstall dependencies:
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Module not found errors:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## 📦 Additional Commands

### Build for production
```bash
npm run build
```
Output will be in the `/dist` folder.

### Preview production build
```bash
npm run preview
```
Opens on `http://localhost:4173`

### Run TypeScript checks
```bash
npx tsc --noEmit
```

---

## 🖥️ Backend Setup (Optional)

The frontend works standalone with mock data. To connect the backend API:

1. **Navigate to server folder:**
   ```bash
   cd server
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your PostgreSQL credentials
   ```

4. **Start backend server:**
   ```bash
   npm start
   ```
   Backend runs on `http://localhost:5000`

**📖 Detailed backend setup:** See [server/SETUP.md](./server/SETUP.md)

---

## 📱 Features

- ✅ **Home** - Search and browse lost/found items
- ✅ **Report Item** - Submit lost or found items with image upload
- ✅ **Claim Item** - Search and claim your lost items
- ✅ **Admin Dashboard** - Manage reports and view analytics
- ✅ **About** - Learn about the FLIRT project
- ✅ **Auth** - Login/signup interface (backend integration ready)

### Mobile-First Design
- Responsive navigation (top bar on desktop, bottom bar on mobile)
- Touch-friendly tap targets
- Optimized for screens 375px and up
- Works on all modern browsers

### Accessibility
- WCAG 2.1 Level AA compliant
- Keyboard navigation support
- Screen reader friendly
- Semantic HTML structure

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS v4** - Styling
- **React Router** - Navigation
- **Shadcn UI** - Component library (40+ components)
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend (Optional)
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **bcrypt** - Password hashing

---

## 📁 Project Structure

```
/
├── src/                    # Frontend source
│   ├── main.tsx           # Entry point
│   └── App.tsx            # Main app component
├── components/             # React components
│   ├── Layout.tsx
│   └── ui/                # Shadcn UI components
├── pages/                  # Route pages
│   ├── Home.tsx
│   ├── ReportItem.tsx
│   ├── ClaimItem.tsx
│   ├── AdminDashboard.tsx
│   ├── About.tsx
│   └── Auth.tsx
├── styles/
│   └── globals.css        # Global styles + theme
├── server/                 # Backend (optional)
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   └── middleware/
├── index.html             # HTML entry point
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript config
```

---

## 🎯 Available Scripts

```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Build for production
npm run preview  # Preview production build (port 4173)
npm run lint     # Run ESLint
```

---

## 🔐 Environment Variables

### Backend Only
Create a `.env` file in the `/server` directory:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=flirt_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

See `server/env.example` for all available options.

**Note:** The frontend uses a proxy in `vite.config.ts` to forward `/api` requests to `http://localhost:5000`

## 📚 Documentation

### For New Users
- **[START_HERE.md](./START_HERE.md)** - ⭐ New to FLIRT? Start here!
- **[CLONE_AND_RUN.md](./CLONE_AND_RUN.md)** - Complete setup guide
- **[QUICK_START.md](./QUICK_START.md)** - 3-step quick start

### For Developers
- [Project Structure](./STRUCTURE.md) - Folder organization
- [Import Structure](./IMPORT_STRUCTURE.md) - Import patterns
- [Development Guidelines](./guidelines/Guidelines.md)

### Backend Documentation
- [Backend Setup Guide](./server/SETUP.md)
- [API Documentation](./server/README.md)
- [Authentication Guide](./server/AUTHENTICATION.md)
- [Database Schema](./server/DATABASE_SCHEMA.md)

---

## 📦 Deployment

### Frontend (Static Hosting)
```bash
npm run build
# Deploy the /dist folder to:
# - Netlify, Vercel, GitHub Pages, Cloudflare Pages, etc.
```

### Backend (Optional)
```bash
cd server
# Deploy to Heroku, Railway, Render, or any Node.js hosting
# Set environment variables on your platform
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

**Made with ❤️ for the CCIS community**
