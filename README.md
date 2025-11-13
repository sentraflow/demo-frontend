# E-Commerce Frontend Application

A full-featured e-commerce frontend built with Next.js and React, integrating with a RESTful API backend.

## Tech Stack

- **Next.js 14** - React framework with server-side rendering
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **TanStack Query (React Query)** - Data fetching and caching
- **Axios** - HTTP client

## Features

### User Features
- **Authentication**: User registration and login
- **Product Browsing**: View all products with search functionality
- **Product Details**: Detailed product information
- **Shopping Cart**: Add/remove items, update quantities
- **Checkout**: Place orders with shipping address
- **Order History**: View past orders and their status

### Admin Features
- **Product Management**: Create, update, and delete products
- **Inventory Control**: Manage stock quantities and availability

## API Integration

The application integrates with the following API endpoints:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/search?keyword={keyword}` - Search products
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/{id}` - Update product (Admin only)
- `DELETE /api/products/{id}` - Delete product (Admin only)

### Shopping Cart
- `GET /api/cart/user/{userId}` - Get user's cart items
- `POST /api/cart/user/{userId}` - Add item to cart
- `PUT /api/cart/user/{userId}/items/{cartItemId}?quantity={qty}` - Update cart item
- `DELETE /api/cart/user/{userId}/items/{cartItemId}` - Remove item from cart
- `DELETE /api/cart/user/{userId}` - Clear cart

### Orders
- `GET /api/orders/user/{userId}` - Get user's orders
- `POST /api/orders/user/{userId}` - Create order
- `DELETE /api/orders/{orderId}/user/{userId}` - Cancel order

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   API_BASE_URL=http://localhost:8080
   ```

   Update the URL to match your backend API server.

3. **Run Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

4. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
demo-frontend/
├── components/          # Reusable React components
│   ├── ui/             # UI components (Button, Input, Card, Modal)
│   ├── Layout.tsx      # Main layout with navigation
│   └── ProductCard.tsx # Product display component
├── hooks/              # React Query hooks for API calls
│   ├── use-auth.ts     # Authentication hooks
│   ├── use-products.ts # Product management hooks
│   ├── use-cart.ts     # Shopping cart hooks
│   └── use-orders.ts   # Order management hooks
├── lib/                # Utility libraries
│   └── api-client.ts   # Axios configuration with interceptors
├── pages/              # Next.js pages (routes)
│   ├── _app.tsx        # App wrapper with providers
│   ├── index.tsx       # Home page
│   ├── auth/           # Authentication pages
│   ├── products/       # Product listing and details
│   ├── cart.tsx        # Shopping cart page
│   ├── orders.tsx      # Order history page
│   └── admin/          # Admin dashboard
├── store/              # Zustand state management
│   └── auth-store.ts   # Authentication state
├── styles/             # Global styles
│   └── globals.css     # Tailwind CSS imports
└── types/              # TypeScript type definitions
    └── index.ts        # API model types
```

## Key Features Implementation

### Authentication
- JWT token storage in localStorage
- Automatic token injection in API requests
- Protected routes for authenticated users
- Role-based access control (Admin/User)

### State Management
- Zustand for global auth state
- React Query for server state caching
- Optimistic updates for better UX

### API Integration
- Axios interceptors for auth tokens
- Automatic error handling and retry logic
- Type-safe API calls with TypeScript

### UI/UX
- Responsive design with Tailwind CSS
- Loading states for async operations
- Error notifications
- Form validation

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Browse Products**: View all available products on the products page
3. **Search**: Use the search bar to find specific products
4. **Add to Cart**: Click "Add to Cart" on any product
5. **Manage Cart**: Update quantities or remove items from your cart
6. **Checkout**: Enter shipping address and place your order
7. **View Orders**: Check your order history and status
8. **Admin Panel** (Admin users only): Manage products inventory

## Development Notes

- The app uses Next.js App Router for routing
- All API calls are handled through React Query hooks
- Authentication state persists across page refreshes
- Protected routes automatically redirect unauthenticated users to login
