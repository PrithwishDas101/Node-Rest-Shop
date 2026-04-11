# 🚀 Quick Start Guide - Node Rest Shop Frontend

## Installation & Setup

### 1️⃣ Navigate to frontend directory
```bash
cd frontend
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Verify environment config
Make sure `.env` contains the correct API URL:
```env
VITE_API_URL=http://localhost:3000/api
```

If your backend runs on a different port, update:
```env
VITE_API_URL=http://localhost:YOUR_PORT/api
```

### 4️⃣ Start development server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

---

## 🔄 Full Stack Startup Command

If running both backend and frontend on the same machine:

```bash
# Terminal 1: Backend
cd Node-Rest-Shop
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

---

## ✅ What's Included

### 📱 Pages (All Ready)
- ✅ Login / Signup (with validation)
- ✅ Products Listing (grid layout)
- ✅ Product Detail (with order creation)
- ✅ Create Product (with image upload)
- ✅ Orders Management (list + delete)
- ✅ Account Settings (profile + delete)

### 🎨 Features
- ✅ Modern SaaS-style UI (premium design system)
- ✅ Dark/light text with professional colors
- ✅ Responsive mobile design
- ✅ Toast notifications
- ✅ Loading skeletons
- ✅ Error handling
- ✅ Empty states
- ✅ Confirmation modals

### 🔐 Security
- ✅ JWT authentication
- ✅ Secure token storage
- ✅ Protected routes
- ✅ Auto-logout on token expiration
- ✅ Request interceptors

---

## 🌐 API Connection

The frontend is already connected to all backend endpoints:

### Authentication
- `POST /users/signup` - Sign up
- `POST /users/login` - Log in
- `DELETE /users/:userId` - Delete account

### Products
- `GET /products` - List all products
- `GET /products/:id` - Get product detail
- `POST /products` - Create product (auth, image upload)
- `PATCH /products/:id` - Update product (auth)
- `DELETE /products/:id` - Delete product (auth)

### Orders
- `GET /orders` - Get user orders (auth)
- `POST /orders` - Create order (auth)
- `GET /orders/:id` - Get order detail (auth)
- `DELETE /orders/:id` - Delete order (auth)

---

## 💡 Usage Examples

### Creating a Product
1. Log in or sign up
2. Click "Add Product" button
3. Fill in name, price, and upload image
4. Click "Create Product"

### Creating an Order
1. Browse products or view product detail
2. Click "Order" button
3. Adjust quantity if needed
4. Confirm order creation

### Managing Orders
1. Go to "Orders" page
2. View all your orders with product details
3. Delete orders using the delete button
4. Confirm deletion in modal

### Account Management
1. Go to "Account"
2. View your email and user ID
3. (Advanced) Delete your account in danger zone

---

## 🔧 Customization

### Changing API URL
Edit `frontend/.env`:
```env
VITE_API_URL=your-api-url
```

### Customizing Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: { ... },  // Main brand color
  accent: { ... }    // Highlight color
}
```

### Modifying Layout
All pages are in `frontend/src/pages/`
All components are in `frontend/src/components/`

### Adding New Pages
1. Create new file in `src/pages/`
2. Add route in `src/App.jsx`
3. Use existing components for consistency

---

## 📊 Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── client.js         ← Axios config + interceptors
│   │   └── endpoints.js      ← All API methods
│   ├── components/           ← Reusable UI components (8 files)
│   ├── context/              ← Auth state management
│   ├── hooks/                ← Custom hooks
│   ├── pages/                ← Page components (7 pages)
│   ├── styles/               ← Global CSS + Tailwind
│   ├── utils/                ← Utilities (toast system)
│   ├── App.jsx               ← Main app + routing
│   └── main.jsx              ← React entry point
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .env
```

---

## 🐛 Troubleshooting

### Port 5173 already in use
```bash
npm run dev -- --port 3001
```

### API connection error
- Check if backend is running on http://localhost:3000
- Verify VITE_API_URL in `.env`
- Check browser console for error details

### Images not loading
- Ensure backend image upload is working
- Check file paths in product responses
- Verify `/uploads` folder exists on backend

### Authentication not working
- Clear localStorage: Open DevTools → Storage → localStorage → Clear
- Log out and log back in
- Check if backend returns proper JWT token

---

## 📚 Documentation

Full technical documentation available in:
- `ARCHITECTURE.md` - Complete architecture guide
- `README.md` - Project overview

---

## ✨ You're All Set!

The frontend is production-ready and fully integrated with your backend.

**Happy coding! 🎉**
