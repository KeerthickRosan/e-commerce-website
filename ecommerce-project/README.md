# ShopSphere — Amazon-Inspired E-Commerce Platform

A full-stack e-commerce web application built with **Python, Django REST Framework, React.js, and MySQL**.

## Features

- Secure REST APIs with **JWT authentication**, refresh-token rotation, and **role-based permissions** (customer / admin)
- Input validation on every serializer (registration, checkout, products, reviews)
- Product **search**, filtering (category, price range, brand, stock) and sorting
- **Cart** and **wishlist** management
- Full **checkout → order** flow with stock decrement and order history
- **Payment integration** (Razorpay) — create order + signature verification endpoints
- Responsive **React** frontend styled with Tailwind CSS
- **Admin dashboard** for product CRUD and order status management
- Optimized MySQL schema via Django ORM (indexes, unique constraints, FK relations)

## Tech Stack

| Layer     | Technology                                   |
|-----------|-----------------------------------------------|
| Backend   | Python 3.11+, Django 5, Django REST Framework |
| Auth      | djangorestframework-simplejwt (JWT)           |
| Database  | MySQL 8                                       |
| Frontend  | React 18, React Router, Tailwind CSS, Axios   |
| Payments  | Razorpay (test mode)                          |

---

## Project Structure

```
ecommerce-project/
├── backend/
│   ├── ecommerce/        # Django project settings, urls
│   ├── accounts/         # Custom User model, JWT auth, profile
│   ├── products/         # Category, Product, Review + search/filter
│   ├── cart/              # Cart & CartItem
│   ├── wishlist/          # Wishlist
│   ├── orders/            # Checkout, order history, admin order mgmt
│   ├── payments/          # Razorpay integration
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/            # Axios client with JWT auto-refresh
    │   ├── context/        # Auth & Cart React context
    │   ├── components/     # Navbar, ProductCard, route guards
    │   └── pages/           # Home, ProductDetail, Cart, Checkout, Admin, ...
    ├── package.json
    └── .env.example
```

---

## 1. Backend Setup (Django)

### Prerequisites
- Python 3.11+
- MySQL 8 running locally (or a MySQL connection string)

### Steps

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

**On Ubuntu/Debian**, you may need MySQL dev headers before `mysqlclient` installs:
```bash
sudo apt-get install python3-dev default-libmysqlclient-dev build-essential pkg-config
```
**On macOS:**
```bash
brew install mysql-client pkg-config
```

### Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` and set your MySQL credentials, `SECRET_KEY`, and (optionally) Razorpay test keys.

### Create the MySQL database
```sql
CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4;
```

### Run migrations & create an admin user
```bash
python manage.py makemigrations
python manage.py migrate

# Create a superuser (Django admin access at /admin/)
python manage.py createsuperuser

# Optional: seed sample categories & products
python manage.py seed_data
```

To make a registered user an **admin** (for the storefront's admin dashboard, not just Django admin), open `/admin/`, edit that user, and set **role = admin** (and `is_staff = True` if you also want Django admin access).

### Run the backend
```bash
python manage.py runserver
```
API will be available at **http://127.0.0.1:8000/api/**
Django admin at **http://127.0.0.1:8000/admin/**

---

## 2. Frontend Setup (React)

### Prerequisites
- Node.js 18+ and npm

### Steps
```bash
cd frontend
npm install
cp .env.example .env
npm start
```
The app runs at **http://localhost:3000** and talks to the API at the URL set in `.env` (`REACT_APP_API_URL`).

---

## 3. Key API Endpoints

| Method | Endpoint                              | Description                        |
|--------|----------------------------------------|-------------------------------------|
| POST   | `/api/auth/register/`                  | Register a new customer            |
| POST   | `/api/auth/login/`                     | Obtain JWT access + refresh tokens |
| POST   | `/api/auth/token/refresh/`             | Refresh access token                |
| GET/PUT| `/api/auth/profile/`                   | View/update logged-in user profile |
| GET    | `/api/products/?search=&category=&min_price=&max_price=&ordering=` | List/search/filter products |
| GET    | `/api/products/<slug>/`                | Product detail                     |
| POST   | `/api/products/` *(admin)*             | Create product                     |
| GET    | `/api/cart/`                           | View current cart                  |
| POST   | `/api/cart/add/`                       | Add item to cart                   |
| PATCH/DELETE | `/api/cart/items/<id>/`          | Update/remove cart item            |
| POST   | `/api/wishlist/toggle/`                | Add/remove product from wishlist   |
| POST   | `/api/orders/checkout/`                | Place an order from the cart       |
| GET    | `/api/orders/`                         | Logged-in user's order history     |
| GET    | `/api/orders/admin/all/` *(admin)*     | All orders (admin)                 |
| PATCH  | `/api/orders/admin/<id>/status/` *(admin)* | Update order status           |
| POST   | `/api/payments/razorpay/create-order/` | Create a Razorpay order            |
| POST   | `/api/payments/razorpay/verify/`       | Verify Razorpay payment signature  |

---

## 4. Notes on the Payment Integration

The Razorpay integration is functional server-side (order creation + signature verification), but to fully wire up
the checkout widget in the browser you'll need to:
1. Add your test `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` to `backend/.env`.
2. Load the Razorpay `checkout.js` script in the frontend and open the payment widget using the
   `razorpay_order_id` and `razorpay_key_id` returned from `/api/payments/razorpay/create-order/`.
3. On success, call `/api/payments/razorpay/verify/` with the returned payment/order/signature to mark the order paid.

The `Checkout.js` page already calls the create-order endpoint when "Pay Online" is selected — the widget-opening
logic (`src/pages/Checkout.js`, marked with a comment) is the one piece left as an exercise since it requires a live
Razorpay account and loading an external script.

## 5. Production Checklist (not done here, since this is a learning/demo build)
- Set `DEBUG=False` and a strong `SECRET_KEY`
- Configure `ALLOWED_HOSTS` and HTTPS
- Serve static/media via S3, Nginx, or Whitenoise
- Use environment-specific `.env` files, never commit real secrets
- Add rate limiting, logging, and monitoring
