# Node Rest Shop Frontend - Architecture & Setup Guide

## 📋 Project Overview

Production-ready React + Vite frontend for Node-Rest-Shop API with:
- Modern SaaS-style UI (Premium design system)
- JWT authentication with secure token handling
- Protected routes and role-based access
- Comprehensive error handling & toast notifications
- Skeleton loaders and empty states
- Fully typed API integration

---

## 🗂️ Folder Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── client.js          # Axios client with interceptors
│   │   └── endpoints.js       # All API endpoint definitions
│   │
│   ├── components/
│   │   ├── Button.jsx         # Reusable button component
│   │   ├── Input.jsx          # Form input component
│   │   ├── Modal.jsx          # Modal dialogs
│   │   ├── Navigation.jsx     # Top navigation bar
│   │   ├── ProtectedRoute.jsx # Route protection wrapper
│   │   ├── ToastContainer.jsx # Toast notifications
│   │   ├── Skeleton.jsx       # Loading skeletons
│   │   └── EmptyState.jsx     # Empty state UI
│   │
│   ├── context/
│   │   └── AuthContext.jsx    # Authentication state management
│   │
│   ├── hooks/
│   │   ├── useAuth.js         # Auth context hook
│   │   └── useAsync.js        # Async state management hook
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx      # Login form
│   │   ├── SignupPage.jsx     # Signup form
│   │   ├── ProductsPage.jsx   # Products listing (grid)
│   │   ├── ProductDetailPage.jsx  # Single product detail
│   │   ├── CreateProductPage.jsx  # Create/upload product
│   │   ├── OrdersPage.jsx     # User orders list
│   │   ├── AccountPage.jsx    # User account management
│   │   └── NotFoundPage.jsx   # 404 page
│   │
│   ├── styles/
│   │   └── index.css          # Global styles + Tailwind
│   │
│   ├── utils/
│   │   └── toast.js           # Toast notification system
│   │
│   ├── App.jsx                # Main app component & routing
│   └── main.jsx               # React entry point
│
├── .env                       # Environment variables
├── .env.local                 # Local overrides (gitignored)
├── index.html                 # HTML entry point
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS configuration
└── vite.config.js            # Vite configuration
```

---

## 🎨 Design System

### Colors
- **Primary**: Deep blue (#576bff → #2b29a3) - Main brand color
- **Accent**: Cyan (#0ea5e9) - Secondary highlight
- **Neutrals**: Slate palette (50-950) - Text, backgrounds, borders
- **Semantic**: Green (success), Red (danger), Blue (info)

### Typography
- **Font**: Inter (system-ui fallback)
- **Scale**: sm (14px) → lg (18px)
- **Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

### Spacing
- **Scale**: 4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px
- **Card padding**: 24px (6)
- **Section gap**: 32px (8)

### Components
- **Card**: White bg, shadow, rounded border
- **Buttons**: 3 sizes (sm, md, lg) × 4 variants (primary, secondary, danger, ghost)
- **Inputs**: Full-width, focus rings, error states
- **Modal**: Centered, backdrop blur, fade animation

---

## 🔐 Authentication Flow

### Token Management
- **Storage**: `localStorage` with `Bearer {token}` format
- **Auto-attach**: Axios request interceptor adds Authorization header
- **Expiration**: 401 response triggers auto-logout + redirect to /login
- **Initialization**: App checks localStorage on mount, waits for auth state

### Protected Routes
```jsx
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```
Route checks `isAuthenticated` and redirects to login if not authorized.

---

## 🔌 API Integration

### Base Configuration
```javascript
// Client: src/api/client.js
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
});
```

### Endpoints Usage
```javascript
// src/api/endpoints.js
// Auth
authAPI.signup(email, password)
authAPI.login(email, password)
authAPI.deleteAccount(userId)

// Products
productsAPI.getAll()
productsAPI.getById(id)
productsAPI.create(formData)  // FormData with image
productsAPI.update(id, data)
productsAPI.delete(id)

// Orders
ordersAPI.getAll()
ordersAPI.getById(id)
ordersAPI.create(productId, quantity)
ordersAPI.delete(id)
```

### Error Handling
- All errors caught and displayed via toast notifications
- Backend error messages extracted: `error.response?.data?.error?.message`
- 401 errors trigger automatic logout

---

## 📱 Features Implementation

### 1. Authentication
- **Routes**: /login, /signup (public)
- **State**: Managed in AuthContext
- **Token**: Stored in localStorage
- **Auto-logout**: On 401 response

### 2. Products
- **Listing**: Grid layout, product cards with images
- **Detail**: Full product view with quantity selector
- **Create**: Form with image upload (admin)
- **Images**: Server-served from `/uploads/`

### 3. Orders
- **List**: User-specific orders with product details
- **Create**: From product detail page
- **Delete**: With confirmation modal

### 4. User Account
- **View**: Email and user ID display
- **Delete**: With permanent deletion warning modal

---

## 🚀 Getting Started

### Installation
```bash
cd frontend
npm install
cp .env.local.example .env.local  # Set VITE_API_URL
npm run dev
```

### Environment Variables
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Node Rest Shop
```

---

## 🧩 Reusable Components

All components are fully reusable with consistent props:

```jsx
// Button
<Button variant="primary|secondary|danger|ghost" size="sm|md|lg" isLoading={bool}>Action</Button>

// Input
<Input label="Field" name="field" error={errorMsg} required />

// Modal
<Modal isOpen={bool} title="Title" onConfirm={fn} isDangerous={bool}>Content</Modal>

// Toast
import { toast } from '@/utils/toast';
toast.success('Message')
toast.error('Message')
toast.loading('Message')

// Protected Route
<ProtectedRoute><Component /></ProtectedRoute>
```

---

## 🔧 Development Tips

### Adding a New Page
1. Create file in `src/pages/`
2. Add route in `App.jsx`
3. Use existing components for UI consistency
4. Use auth context for user data
5. Use toast for notifications

### Adding an API Call
1. Add endpoint in `src/api/endpoints.js`
2. Import and use in component
3. Handle errors with try/catch
4. Show toast notifications

### Styling
- Use Tailwind classes directly
- Custom utility classes in `src/styles/index.css`
- Color palette: primary-{600,700}, slate-{600,900}, etc.
- Responsive: `md:` (768px), `lg:` (1024px) breakpoints

---

## 📊 State Management

- **Auth**: React Context API (AuthContext)
- **UI State**: useState hooks
- **API Requests**: useAsync custom hook
- **Toast**: Global listener system

---

## ✅ Quality Checklist

- [x] No hardcoded URLs (all in .env)
- [x] Secure token handling
- [x] Protected routes enforced
- [x] Error messages from backend
- [x] Loading states (skeleton loaders)
- [x] Empty states (EmptyState component)
- [x] Confirmation modals (destructive actions)
- [x] Toast notifications (success/error/info)
- [x] Responsive design (mobile-first)
- [x] Production-grade UI (cohesive design system)

---

## 🎯 Next Steps

Ready to extend with:
- Admin dashboard
- Advanced filtering/search
- Wishlist feature
- Payment integration
- User reviews
- Real-time notifications
