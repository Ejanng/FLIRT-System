# FLIRT Import Structure Guide

## ✅ All Imports Use Relative Paths

This document confirms that all component and page files use **relative imports** instead of absolute paths, preventing structure issues.

---

## 📁 File Structure Overview

```
/
├── src/                    # Entry point files
│   ├── main.tsx           # Imports from ../styles/
│   └── App.tsx            # Imports from ../components/ and ../pages/
│
├── components/             # Reusable components (root level)
│   ├── Layout.tsx         # ✅ Uses ./ui/ for UI components
│   ├── LoadingSpinner.tsx # ✅ No external imports
│   ├── ToastProvider.tsx  # ✅ No component imports
│   ├── AdminAnalyticsSimple.tsx # ✅ Uses ./ui/ for UI components
│   └── ui/                # Shadcn UI components
│
├── pages/                  # Route pages (root level)
│   ├── Home.tsx           # ✅ Uses ../components/
│   ├── ReportItem.tsx     # ✅ Uses ../components/
│   ├── ClaimItem.tsx      # ✅ Uses ../components/
│   ├── AdminDashboard.tsx # ✅ Uses ../components/
│   ├── About.tsx          # ✅ Uses ../components/
│   └── Auth.tsx           # ✅ Uses ../components/
│
└── styles/
    └── globals.css
```

---

## 🔍 Import Patterns by Location

### 1. **`/src/main.tsx`** (Entry Point)
```typescript
import App from './App.tsx'           // ✅ Same directory
import '../styles/globals.css'        // ✅ Relative to parent
```

**Location**: `/src/`  
**Import targets**: 
- Same folder: `./`
- Styles folder: `../styles/`

---

### 2. **`/src/App.tsx`** (Router)
```typescript
import { ToastProvider } from '../components/ToastProvider';
import { Layout } from '../components/Layout';
import { Home } from '../pages/Home';
import { ReportItem } from '../pages/ReportItem';
import { ClaimItem } from '../pages/ClaimItem';
import { AdminDashboard } from '../pages/AdminDashboard';
import { About } from '../pages/About';
import { Auth } from '../pages/Auth';
```

**Location**: `/src/`  
**Import targets**: 
- Components: `../components/`
- Pages: `../pages/`

**Why `../`?** Because `/src/App.tsx` needs to go up one level to reach `/components` and `/pages`

---

### 3. **`/components/Layout.tsx`** (Navigation Component)
```typescript
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Search, LayoutDashboard, Info, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';              // ✅ Relative import
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';  // ✅ Relative import
```

**Location**: `/components/`  
**Import targets**: 
- UI components: `./ui/` (same parent folder, ui subfolder)

**Why `./`?** Because `/components/Layout.tsx` imports from `/components/ui/`

---

### 4. **`/components/LoadingSpinner.tsx`** (Loading Component)
```typescript
// No imports - pure TypeScript and CSS
```

**Location**: `/components/`  
**Import targets**: None

**No external component dependencies** - uses only Tailwind classes

---

### 5. **`/components/ToastProvider.tsx`** (Toast Notifications)
```typescript
import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle2, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react';
```

**Location**: `/components/`  
**Import targets**: 
- External libraries only (react-hot-toast, lucide-react)

**No local component imports** - standalone provider

---

### 6. **`/components/AdminAnalyticsSimple.tsx`** (Analytics Dashboard)
```typescript
import { Card } from './ui/card';                  // ✅ Relative import
import { TrendingUp, Package, CheckCircle, Users, Calendar, MapPin } from 'lucide-react';
```

**Location**: `/components/`  
**Import targets**: 
- UI components: `./ui/` (same parent folder, ui subfolder)

**Why `./`?** Because `/components/AdminAnalyticsSimple.tsx` imports from `/components/ui/`

---

### 7. **`/pages/Home.tsx`** (Homepage)
```typescript
import { Link } from 'react-router-dom';
import { Search, FileText, ArrowRight, Users, Heart, Shield } from 'lucide-react';
import { Card } from '../components/ui/card';     // ✅ Relative import
import { Button } from '../components/ui/button'; // ✅ Relative import
```

**Location**: `/pages/`  
**Import targets**: 
- UI components: `../components/ui/` (up one level, then into components/ui)

**Why `../`?** Because `/pages/Home.tsx` needs to go up to root, then down into `/components/ui/`

---

### 8. **`/pages/ReportItem.tsx`** (Report Form)
```typescript
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import { customToast } from '../components/ToastProvider';  // ✅ Relative import
```

**Location**: `/pages/`  
**Import targets**: 
- UI components: `../components/ui/`
- Custom components: `../components/ToastProvider`

---

### 9. **`/pages/ClaimItem.tsx`** (Claim Form)
```typescript
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { customToast } from '../components/ToastProvider';
import { LoadingSpinner, InlineLoader } from '../components/LoadingSpinner';  // ✅ Relative import
```

**Location**: `/pages/`  
**Import targets**: 
- UI components: `../components/ui/`
- Custom components: `../components/ToastProvider`, `../components/LoadingSpinner`

---

### 10. **`/pages/AdminDashboard.tsx`** (Admin Panel)
```typescript
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { customToast } from '../components/ToastProvider';
import { AdminAnalytics } from '../components/AdminAnalyticsSimple';  // ✅ Relative import
```

**Location**: `/pages/`  
**Import targets**: 
- UI components: `../components/ui/`
- Custom components: `../components/ToastProvider`, `../components/AdminAnalyticsSimple`

---

### 11. **`/pages/About.tsx`** (About Page)
```typescript
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Heart, Target, Users, Shield, Mail, Github, Twitter } from 'lucide-react';
```

**Location**: `/pages/`  
**Import targets**: 
- UI components: `../components/ui/`

---

### 12. **`/pages/Auth.tsx`** (Authentication)
```typescript
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { customToast } from '../components/ToastProvider';
```

**Location**: `/pages/`  
**Import targets**: 
- UI components: `../components/ui/`
- Custom components: `../components/ToastProvider`

---

## ✅ Import Path Rules

### ✅ **CORRECT** - Relative Paths
```typescript
// From /components/Layout.tsx
import { Button } from './ui/button';

// From /pages/Home.tsx
import { Card } from '../components/ui/card';

// From /src/App.tsx
import { Layout } from '../components/Layout';
```

### ❌ **INCORRECT** - Absolute Paths (NOT USED)
```typescript
// These patterns are NOT used in our codebase
import { Button } from '/components/ui/button';
import { Card } from '/components/ui/card';
import { Layout } from '/components/Layout';
```

---

## 📊 Import Summary Table

| File Location | Imports From | Import Pattern |
|---------------|-------------|----------------|
| `/src/main.tsx` | `/src/App.tsx` | `./App.tsx` |
| `/src/main.tsx` | `/styles/globals.css` | `../styles/globals.css` |
| `/src/App.tsx` | `/components/*` | `../components/*` |
| `/src/App.tsx` | `/pages/*` | `../pages/*` |
| `/components/Layout.tsx` | `/components/ui/*` | `./ui/*` |
| `/components/AdminAnalyticsSimple.tsx` | `/components/ui/*` | `./ui/*` |
| `/pages/*` | `/components/ui/*` | `../components/ui/*` |
| `/pages/*` | `/components/*` | `../components/*` |

---

## 🎯 Why Relative Imports?

### ✅ **Benefits**
1. **Portability**: Move folders without breaking imports
2. **No Configuration**: Works without Vite/TypeScript aliases
3. **Clarity**: Shows relationship between files
4. **Standard**: Follows ES modules best practices
5. **No Conflicts**: Avoids absolute path resolution issues

### ⚠️ **Absolute Path Issues**
- Breaks when folder structure changes
- Requires build tool configuration
- Can conflict with node_modules
- Not portable across environments
- Harder to reason about file relationships

---

## 🔧 Path Aliases (Optional Enhancement)

While we use relative paths, Vite config includes path aliases for convenience:

```typescript
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './components'),
      '@pages': path.resolve(__dirname, './pages'),
      '@styles': path.resolve(__dirname, './styles'),
    },
  },
})
```

**Currently NOT used** but available if you want to refactor to:
```typescript
import { Layout } from '@components/Layout';
import { Home } from '@pages/Home';
```

---

## 🔍 Verification

Run this command to check for absolute imports (should return nothing):
```bash
grep -r "from ['\"]/" --include="*.tsx" --include="*.ts" ./src ./components ./pages
```

Result: **No absolute imports found** ✅

---

## 📝 Import Checklist

When creating new files:

- [ ] Use relative paths (`./` or `../`)
- [ ] Never start imports with `/`
- [ ] Match the pattern of nearby files
- [ ] From `/components/`: use `./ui/` for UI components
- [ ] From `/pages/`: use `../components/` for components
- [ ] From `/src/`: use `../` to reach root folders

---

## 🎉 Conclusion

All FLIRT components and pages correctly use **relative imports** following these patterns:

1. **Same directory**: `./filename`
2. **Subdirectory**: `./subfolder/filename`
3. **Parent directory**: `../filename`
4. **Parent's subdirectory**: `../folder/filename`

**No absolute paths (starting with `/`) are used anywhere in the codebase!**

This ensures the project structure is maintainable, portable, and follows React best practices.

---

**Last Updated**: October 14, 2025  
**Status**: ✅ All imports verified as relative  
**Files Checked**: 12 component/page files  
**Absolute Imports Found**: 0
