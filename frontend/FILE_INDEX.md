# 📋 Frontend File Index & Reference

## Quick File Lookup

### 🔐 Authentication Files
| File | Purpose | Key Exports |
|------|---------|-------------|
| `src/context/AuthContext.jsx` | Auth state management | `AuthContext`, `AuthProvider` |
| `src/hooks/useAuth.js` | Hook to access auth | `useAuth` |
| `src/pages/LoginPage.jsx` | Login form page | `LoginPage` component |
| `src/pages/SignupPage.jsx` | Signup form page | `SignupPage` component |

### 🛍️ Products Files
| File | Purpose | Key Exports |
|------|---------|-------------|
| `src/pages/ProductsPage.jsx` | Products listing (grid) | `ProductsPage` component |
| `src/pages/ProductDetailPage.jsx` | Single product detail | `ProductDetailPage` component |
| `src/pages/CreateProductPage.jsx` | Create/upload product | `CreateProductPage` component |

### 📦 Orders Files
| File | Purpose | Key Exports |
|------|---------|-------------|
| `src/pages/OrdersPage.jsx` | Orders listing & delete | `OrdersPage` component |

### 👤 User Account Files
| File | Purpose | Key Exports |
|------|---------|-------------|
| `src/pages/AccountPage.jsx` | User profile & delete | `AccountPage` component |

### 🎨 UI Components
| File | Purpose | Props |
|------|---------|-------|
| `src/components/Button.jsx` | Reusable button | `variant`, `size`, `isLoading`, `disabled` |
| `src/components/Input.jsx` | Form input | `label`, `error`, `helperText`, `required` |
| `src/components/Modal.jsx` | Dialog modal | `isOpen`, `title`, `onConfirm`, `isDangerous` |
| `src/components/ToastContainer.jsx` | Toast notifications | - |
| `src/components/Skeleton.jsx` | Loading skeletons | `className`, `count` (grid) |
| `src/components/EmptyState.jsx` | No data UI | `title`, `description`, `icon`, `action` |
| `src/components/Navigation.jsx` | Top nav bar | - |
| `src/components/ProtectedRoute.jsx` | Route protection | `children` |

### 🔌 API Integration
| File | Purpose | Exports |
|------|---------|---------|
| `src/api/client.js` | Axios instance | `apiClient` |
| `src/api/endpoints.js` | API methods | `authAPI`, `productsAPI`, `ordersAPI` |

### 🛠️ Utilities
| File | Purpose | Exports |
|------|---------|---------|
| `src/utils/toast.js` | Toast system | `toast`, `removeToast`, `useToastListener` |
| `src/hooks/useAsync.js` | Async state hook | `useAsync` |

### 📦 Configuration Files
| File | Purpose |
|------|---------|
| `tailwind.config.js` | Tailwind CSS & design system config |
| `postcss.config.js` | PostCSS configuration |
| `vite.config.js` | Vite bundler configuration |
| `.env` | Environment variables (VITE_API_URL) |
| `package.json` | Dependencies & scripts |

### 📄 Documentation
| File | Purpose |
|------|---------|
| `README.md` | Project overview |
| `ARCHITECTURE.md` | Complete technical documentation |
| `SYSTEM_ARCHITECTURE.md` | Visual architecture & data flows |
| `FILE_INDEX.md` | This file - quick reference |

### 🎨 Styling
| File | Purpose |
|------|---------|
| `src/styles/index.css` | Global styles, Tailwind directives, animations |

### 📍 Entry Points
| File | Purpose |
|------|---------|
| `src/main.jsx` | React entry point (renders to #root) |
| `src/App.jsx` | Main app component (Router + Providers) |
| `index.html` | HTML entry point |

---

## Common Usage Patterns

### Adding Authentication to a Component
```jsx
import { useAuth } from '../hooks/useAuth';

export function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated && <p>Welcome, {user.email}</p>}
    </div>
  );
}
```

### Making an API Call
```jsx
import { productsAPI } from '../api/endpoints';
import { toast } from '../utils/toast';

export function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getAll();
      setData(response.data.data);
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return <button onClick={fetchData}>Load Data</button>;
}
```

### Showing a Toast
```jsx
import { toast } from '../utils/toast';

// Success
toast.success('Operation successful!');

// Error
toast.error('Something went wrong');

// Info
toast.info('This is an info message');

// Loading (doesn't auto-dismiss)
toast.loading('Please wait...');
```

### Creating a Protected Page
```jsx
import ProtectedRoute from '../components/ProtectedRoute';
import MyPage from '../pages/MyPage';

// In App.jsx
<Route
  path="/my-page"
  element={
    <ProtectedRoute>
      <MyPage />
    </ProtectedRoute>
  }
/>
```

### Using Buttons
```jsx
import { Button } from '../components/Button';

// Different variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Delete</Button>
<Button variant="ghost">Ghost</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>

// With loading state
<Button isLoading={isLoading}>Save</Button>

// Disabled
<Button disabled>Disabled</Button>
```

### Using Form Inputs
```jsx
import { Input } from '../components/Input';

<Input
  label="Email"
  name="email"
  type="email"
  placeholder="you@example.com"
  value={formData.email}
  onChange={handleChange}
  error={errors.email}
  required
/>
```

### Using Modal
```jsx
import { Modal } from '../components/Modal';

<Modal
  isOpen={isOpen}
  title="Confirm Action"
  onClose={() => setIsOpen(false)}
  onConfirm={handleConfirm}
  confirmText="Delete"
  isDangerous
  isLoading={deleting}
>
  <p>Are you sure?</p>
</Modal>
```

### Showing Loading State
```jsx
import { SkeletonGrid, Skeleton, SkeletonText } from '../components/Skeleton';

// Grid of skeletons
<SkeletonGrid count={6} />

// Single skeleton
<Skeleton className="h-48 w-full" />

// Text skeleton
<SkeletonText lines={3} />
```

### Empty State
```jsx
import { EmptyState } from '../components/EmptyState';

<EmptyState
  icon="📦"
  title="No products"
  description="Start by creating a product"
  action={<Button onClick={createNew}>Create</Button>}
/>
```

---

## File Size Reference

```
src/
├── api/
│   ├── client.js           (~30 lines)
│   └── endpoints.js        (~35 lines)
├── components/
│   ├── Button.jsx          (~40 lines)
│   ├── Input.jsx           (~45 lines)
│   ├── Modal.jsx           (~65 lines)
│   ├── ToastContainer.jsx  (~70 lines)
│   ├── Skeleton.jsx        (~40 lines)
│   ├── EmptyState.jsx      (~30 lines)
│   ├── Navigation.jsx      (~80 lines)
│   └── ProtectedRoute.jsx  (~25 lines)
├── context/
│   └── AuthContext.jsx     (~130 lines)
├── hooks/
│   ├── useAuth.js          (~10 lines)
│   └── useAsync.js         (~35 lines)
├── pages/
│   ├── LoginPage.jsx       (~90 lines)
│   ├── SignupPage.jsx      (~110 lines)
│   ├── ProductsPage.jsx    (~100 lines)
│   ├── ProductDetailPage.jsx (~160 lines)
│   ├── CreateProductPage.jsx (~130 lines)
│   ├── OrdersPage.jsx      (~140 lines)
│   ├── AccountPage.jsx     (~110 lines)
│   └── NotFoundPage.jsx    (~25 lines)
├── styles/
│   └── index.css           (~150 lines)
├── utils/
│   └── toast.js            (~40 lines)
├── App.jsx                 (~50 lines)
└── main.jsx                (~10 lines)

Total Frontend Code: ~1,400 lines (production-grade, zero boilerplate)
```

---

## Import Paths Quick Reference

### API Imports
```javascript
import { authAPI, productsAPI, ordersAPI } from '../api/endpoints';
import apiClient from '../api/client';
```

### Component Imports
```javascript
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import ToastContainer from '../components/ToastContainer';
import { Skeleton, SkeletonGrid, SkeletonText } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import Navigation from '../components/Navigation';
import ProtectedRoute from '../components/ProtectedRoute';
```

### Hook Imports
```javascript
import { useAuth } from '../hooks/useAuth';
import { useAsync } from '../hooks/useAsync';
```

### Utility Imports
```javascript
import { toast } from '../utils/toast';
```

### Context Imports
```javascript
import { AuthContext, AuthProvider } from '../context/AuthContext';
```

---

## Testing Checklist

- [ ] Can sign up with new email
- [ ] Can log in with correct credentials
- [ ] Cannot log in with wrong password
- [ ] Protected pages redirect to login
- [ ] Products list loads and displays
- [ ] Can create product with image
- [ ] Can view product detail
- [ ] Can create order from product
- [ ] Orders list shows user orders
- [ ] Can delete order with confirmation
- [ ] Can delete account with warning
- [ ] Logout clears token
- [ ] Token expires → auto logout
- [ ] Toast notifications appear
- [ ] Loading skeletons display
- [ ] Empty states show
- [ ] Mobile responsive

---

## Deployment Notes

### Build
```bash
npm run build
# Output: frontend/dist/
```

### Production Checklist
- [ ] Update VITE_API_URL to production API
- [ ] Build frontend with `npm run build`
- [ ] Deploy `dist/` folder to static hosting
- [ ] Configure CORS on backend
- [ ] Test all endpoints in production
- [ ] Monitor console for errors
- [ ] Test on mobile devices

---

This is your complete frontend file reference.
Navigate files using this guide for quick lookups!
