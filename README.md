# ShopSmart — Flipkart Clone E-Commerce Platform

A fully functional e-commerce web application that closely replicates Flipkart's design and user experience, built as an SDE Intern Full-Stack Assignment.

## 🚀 Live Demo
- **Frontend**: [Deploy to Vercel]
- **Backend**: [Deploy to Render]

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (JSX) + Vite |
| Styling | Tailwind CSS v3 |
| State Management | React Context API (Reducer pattern) |
| HTTP Client | Axios |
| Routing | React Router DOM v6 |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| Notifications | React Toastify |
| Icons | React Icons (Feather) |

---

## ✅ Features Implemented

### Core Features
- **Product Listing Page** — Grid layout, search, category & price filter, sort options
- **Product Detail Page** — Image gallery with thumbnail switching, specs table, offers section, add to cart / buy now
- **Shopping Cart** — Item list with quantity controls, price summary, discount display
- **Order Placement** — Full address form with validation, payment method selection, order summary panel
- **Order Confirmation** — Order ID display, tracking steps, delivery date estimation

### Bonus Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ User authentication (Login / Signup with JWT)
- ✅ Default logged-in user (no login required for demo)
- ✅ Order history page
- ✅ Wishlist functionality
- ✅ Auto-sliding hero banner
- ✅ Cart persisted in localStorage
- ✅ SEO meta tags
- ✅ Email notification on order placement (via Nodemailer with HTML templates and local backup file logging)

---

## 🗄️ Database Schema

### `products`
```
_id, name, description, price, originalPrice, discountPercent,
category, brand, images[], stock, rating, reviewCount,
specifications{Map}, tags[], isFeatured, timestamps
```

### `users`
```
_id, name, email, password(bcrypt hashed), phone,
addresses[{name,phone,pincode,locality,address,city,state,addressType}],
wishlist[ref:Product], isDefault, timestamps
```

### `orders`
```
_id, orderId(human-readable "OD..."), user(ref:User), guestName,
items[{product(ref),name,image,price,quantity}],
shippingAddress{}, paymentMethod, itemsPrice, shippingPrice,
totalPrice, status(enum), deliveryDate, placedAt, timestamps
```

---

## 📦 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

Create `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/shopsmart
JWT_SECRET=shopsmart_secret_key_2024
NODE_ENV=development
```

### 3. Seed the Database

```bash
cd backend
npm run seed
```

This seeds **30+ products** across 6 categories and creates a default user:
- **Email**: `rahul.sharma@example.com`
- **Password**: `password123`

### 4. Start the Application

**Backend** (Terminal 1):
```bash
cd backend
npm run dev
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```

Visit: `http://localhost:5173`

---

## 📁 Project Structure

```
Shop-Smart/
├── backend/
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── authController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Product.js
│   │   ├── User.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── authRoutes.js
│   ├── services/
│   │   └── emailService.js
│   ├── seed/
│   │   └── seedData.js
│   ├── server.js
│   ├── test_api.js
│   └── .env
└── frontend/
    └── src/
        ├── api/
        │   └── api.js
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ProductCard.jsx
        │   └── Footer.jsx
        ├── context/
        │   ├── CartContext.jsx
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── ProductListing.jsx
        │   ├── ProductDetail.jsx
        │   ├── Cart.jsx
        │   ├── Checkout.jsx
        │   ├── OrderSuccess.jsx
        │   ├── OrderHistory.jsx
        │   ├── Login.jsx
        │   ├── Signup.jsx
        │   └── Wishlist.jsx
        ├── App.jsx
        ├── main.jsx
        └── index.css
```

---

## 🔌 API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (search, category, price, sort, pagination) |
| GET | `/api/products/:id` | Get product by ID |
| GET | `/api/products/categories` | Get all categories |
| GET | `/api/products/featured` | Get featured products |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create new order |
| GET | `/api/orders/:orderId` | Get order by orderId |
| GET | `/api/orders/my` | Get logged-in user's orders (JWT) |

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT token |
| GET | `/api/auth/me` | Get current user (JWT protected) |
| POST | `/api/auth/wishlist/:productId` | Toggle wishlist item (JWT) |

---

## 💡 Assumptions Made

1. **No Login Required**: A default user (Rahul Sharma) is auto-loaded for the shopping experience. Login/Signup is available as a bonus feature.
2. **Guest Orders**: Orders can be placed without authentication; the shipping address name is used as the guest name.
3. **MongoDB instead of PostgreSQL/MySQL**: Per project configuration, MongoDB with Mongoose is used. The schema design demonstrates proper relational modeling using `ObjectId` references between collections.
4. **Product Images**: Using Unsplash for high-quality product images.
5. **Payment**: Payment methods are UI-only (COD, UPI, Card) — no actual payment gateway integration.
6. **Cart**: Stored in `localStorage` for persistence across page reloads without requiring backend cart management.
7. **Email Notification**: The backend utilizes `nodemailer` to dispatch order confirmation emails. It automatically defaults to Ethereal Mail (for sandbox testing) if no SMTP credentials are configured in `.env`, and logs the full HTML email structure to a local `orders_emails.log` file in the backend root for easy debugging.

---

## 👨‍💻 Author

Built as part of the SDE Intern Full-Stack Assignment.
