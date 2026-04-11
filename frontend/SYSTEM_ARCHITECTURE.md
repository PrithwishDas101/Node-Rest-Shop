# 🏗️ Complete Frontend Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     REACT FRONTEND (Vite)                       │
│                     Port: 5173                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              PAGES (7 Fully Implemented)                 │  │
│  │  ┌──────────────┬──────────────┬────────────────────┐   │  │
│  │  │   Auth       │   Products   │   Orders & Account │   │  │
│  │  ├──────────────┼──────────────┼────────────────────┤   │  │
│  │  │ • LoginPage  │ • Listing    │ • Orders List      │   │  │
│  │  │ • SignupPage │ • Detail     │ • Account Settings │   │  │
│  │  │              │ • Create     │ • Delete Account   │   │  │
│  │  └──────────────┴──────────────┴────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ▲                                     │
│  ┌──────────────────────────┴──────────────────────────────┐   │
│  │            REACT CONTEXT + HOOKS LAYER                 │   │
│  ├────────────────────────────────────────────────────────┤   │
│  │ • AuthContext       - Auth state (user, token, etc)    │   │
│  │ • useAuth()         - Hook to access auth context      │   │
│  │ • useAsync()        - Hook for async state mgmt        │   │
│  │ • ProtectedRoute    - Route protection wrapper         │   │
│  └────────────────────────────────────────────────────────┘   │
│                            ▲                                     │
│  ┌──────────────────────────┴──────────────────────────────┐   │
│  │         REUSABLE UI COMPONENTS (8 Components)          │   │
│  ├────────────────────────────────────────────────────────┤   │
│  │ • Button        - 4 variants × 3 sizes                 │   │
│  │ • Input         - Form inputs with validation          │   │
│  │ • Modal         - Confirmation & custom dialogs        │   │
│  │ • ToastContainer- Success/error/info notifications    │   │
│  │ • Skeleton      - Loading states (grid & text)        │   │
│  │ • EmptyState    - No-data UI display                  │   │
│  │ • Navigation    - Top nav bar (auth-aware)            │   │
│  │ • ProtectedRoute- Secure route wrapper                │   │
│  └────────────────────────────────────────────────────────┘   │
│                            ▲                                     │
│  ┌──────────────────────────┴──────────────────────────────┐   │
│  │            API INTEGRATION LAYER                        │   │
│  ├────────────────────────────────────────────────────────┤   │
│  │ ┌─────────────────────────────────────────────────┐   │   │
│  │ │         src/api/client.js                       │   │   │
│  │ │ Axios Instance with Interceptors:              │   │   │
│  │ │ • Request: Auto-attach Authorization header    │   │   │
│  │ │ • Response: Handle 401 → Auto-logout           │   │   │
│  │ └─────────────────────────────────────────────────┘   │   │
│  │                                                        │   │
│  │ ┌─────────────────────────────────────────────────┐   │   │
│  │ │         src/api/endpoints.js                    │   │   │
│  │ │ API Method Groups:                              │   │   │
│  │ │ • authAPI (signup/login/deleteAccount)          │   │   │
│  │ │ • productsAPI (getAll/getById/create/etc)       │   │   │
│  │ │ • ordersAPI (getAll/create/delete)              │   │   │
│  │ └─────────────────────────────────────────────────┘   │   │
│  └────────────────────────────────────────────────────────┘   │
│                            │                                     │
│  ┌──────────────────────────┴──────────────────────────────┐   │
│  │         UTILITIES & STYLING                            │   │
│  ├────────────────────────────────────────────────────────┤   │
│  │ • toast.js          - Toast notification system        │   │
│  │ • styles/index.css  - Global styles + Tailwind        │   │
│  │ • tailwind.config.js- Design system colors/spacing    │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              NODE.JS + EXPRESS BACKEND API                      │
│                     Port: 3000                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    ENDPOINTS                             │  │
│  │                                                          │  │
│  │  Auth Routes        │  Product Routes   │  Order Routes │  │
│  │  ─────────────────  │  ──────────────   │  ─────────    │  │
│  │  POST /signup       │  GET /products    │ GET /orders   │  │
│  │  POST /login        │  GET /:id         │ POST /        │  │
│  │  DELETE /:userId    │  POST / (auth)    │ GET /:id      │  │
│  │                     │  PATCH /:id (auth)│ DELETE /:id   │  │
│  │                     │  DELETE /:id (auth)               │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               MONGODB DATABASE                           │  │
│  │  Users  │  Products  │  Orders                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Examples

### Authentication Flow
```
1. User enters email/password
2. LoginPage → authAPI.login()
3. Axios POST to /users/login
4. Backend returns { token, user }
5. Save to localStorage + AuthContext
6. Axios interceptor auto-attaches header
7. Redirect to /products
```

### Product Listing Flow
```
1. ProductsPage mounts
2. Calls productsAPI.getAll()
3. Axios GET to /products
4. Request interceptor adds token
5. Backend returns products array
6. setState(products)
7. Render product cards (or skeleton while loading)
```

### Create Order Flow
```
1. User on ProductDetailPage
2. Selects quantity + clicks Order
3. ProductDetailPage → ordersAPI.create(productId, qty)
4. Axios POST to /orders with auth
5. Interceptor auto-attaches token
6. Backend creates order + returns data
7. Toast success + redirect to /orders
```

---

## Component Hierarchy

```
App.jsx (Router + AuthProvider)
├── Navigation (auth-aware links)
├── Routes
│   ├── Public Routes
│   │   ├── /login → LoginPage
│   │   ├── /signup → SignupPage
│   │   ├── /products → ProductsPage
│   │   │   ├── ProductCard (×n, uses Button + Card)
│   │   │   └── navigate to ProductDetailPage
│   │   └── /products/:id → ProductDetailPage
│   │       ├── Input (quantity)
│   │       ├── Button (Create Order)
│   │       └── navigate to /orders
│   │
│   └── Protected Routes
│       ├── /create-product → CreateProductPage
│       │   ├── Input (name, price)
│       │   ├── File input (image)
│       │   └── Button (Create)
│       ├── /orders → OrdersPage
│       │   ├── OrderCard (×n)
│       │   ├── Button (Delete)
│       │   └── Modal (confirm delete)
│       └── /account → AccountPage
│           ├── Input (email display)
│           └── Button (Delete Account)
│               └── Modal (confirm delete)
│
└── ToastContainer (global notifications)
```

---

## State Management Flow

```
┌────────────────────────────────────────────────┐
│          AuthContext (Global State)            │
├────────────────────────────────────────────────┤
│  • user: { _id, email }                        │
│  • token: JWT string                           │
│  • loading: boolean                            │
│  • isAuthenticated: boolean                    │
│  • isInitialized: boolean                      │
└───────────────┬────────────┬────────────────────┘
                │            │
        ┌───────┘            └──────────┐
        │                               │
        ▼                               ▼
   LoginPage                  ProtectedRoute
   SignupPage                 ProductDetailPage
   Navigation                 OrdersPage
                              AccountPage

┌────────────────────────────────────────────────┐
│     Component Local State (useState)           │
├────────────────────────────────────────────────┤
│  • products: Array                             │
│  • loading: boolean                            │
│  • errors: Object                              │
│  • formData: Object                            │
│  • quantity: number                            │
│  • modalOpen: boolean                          │
└────────────────────────────────────────────────┘
```

---

## Design System Tokens

### Colors
```
Primary:   #576bff to #2b29a3 (Deep Blue)
Accent:    #0ea5e9 (Cyan)
Neutral:   Slate 50-950
Success:   #10b981 (Green)
Danger:    #ef4444 (Red)
Info:      #3b82f6 (Blue)
```

### Spacing Scale
```
0.5  → 2px
1    → 4px
2    → 8px
3    → 12px
4    → 16px
6    → 24px  ← Default card padding
8    → 32px  ← Default section gap
```

### Typography
```
Font:     Inter (system-ui fallback)
Weights:  400 (regular), 500 (medium), 600 (semibold), 700 (bold)
Sizes:    sm (14px), base (16px), lg (18px), xl (20px), 2xl (24px)
```

### Breakpoints
```
sm:  640px
md:  768px   ← Used: Grid 2 cols
lg:  1024px  ← Used: Grid 3 cols
xl:  1280px
2xl: 1536px
```

---

## Error Handling Strategy

```
┌──────────────────────────────────────────────────────┐
│  Try/Catch in Components                             │
└──────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────┐
│  Extract Error: error.response?.data?.error?.message │
└──────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────┐
│  Special Case: 401 → Axios Interceptor              │
│  • Auto-logout                                       │
│  • Clear localStorage                               │
│  • Redirect to /login                               │
└──────────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────┐
│  Display Toast: toast.error(message)                 │
└──────────────────────────────────────────────────────┘
```

---

## File Dependencies Map

```
App.jsx
├── imports from AuthProvider
├── imports from Router + routes
├── imports from Navigation
├── imports from ToastContainer
└── imports from all Pages

AuthContext.jsx
├── uses authAPI (endpoints)
└── uses toast (utils)

ProductsPage.jsx
├── uses productsAPI (endpoints)
├── uses Button, Skeleton, EmptyState components
└── uses toast (utils)

ProductDetailPage.jsx
├── uses ordersAPI, productsAPI (endpoints)
├── uses Button, Input, Skeleton components
├── uses useAuth hook
└── uses toast (utils)

OrdersPage.jsx
├── uses ordersAPI, productsAPI (endpoints)
├── uses Button, Modal, EmptyState, SkeletonGrid
└── uses toast (utils)

Navigation.jsx
├── uses useAuth hook
├── uses Button component
└── uses react-router-dom

ProtectedRoute.jsx
├── uses useAuth hook
└── redirects to /login if not authenticated
```

---

## Environment Variables

```
VITE_API_URL        → Backend API base URL (http://localhost:3000/api)
VITE_APP_NAME       → App name for display
```

---

## Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
# Outputs to: frontend/dist/
```

### Preview Build
```bash
npm run preview
```

---

## Security Checklist

✅ JWT stored in localStorage (secure for SPA)
✅ Token sent in Authorization header via interceptor
✅ 401 responses → auto-logout + localStorage clear
✅ Protected routes check isAuthenticated
✅ No sensitive data in component props
✅ Form validation on client side
✅ Error messages from backend (no exposure)
✅ CORS configured on backend
✅ Helmet enabled on backend
✅ No hardcoded API URLs

---

This is a production-ready, secure, and maintainable MERN stack frontend.
