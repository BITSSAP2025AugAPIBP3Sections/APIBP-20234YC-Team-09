# Fusion Electronics - Project Flow Documentation

## 🏗️ System Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React 18.x)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Port: 3000                                              │  │
│  │  - Material-UI Components                                │  │
│  │  - React Router (Navigation)                             │  │
│  │  - Context API (State Management)                        │  │
│  │  - Axios (HTTP Client)                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Requests
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Port: 8000                                              │  │
│  │  - REST API Endpoints                                    │  │
│  │  - JWT Authentication                                    │  │
│  │  - Request Validation                                    │  │
│  │  - Swagger API Documentation                             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
    ┌───────────────────────┐  ┌──────────────────────┐
    │   MongoDB Atlas       │  │   Vector Databases   │
    │   (Primary DB)        │  │   - Pinecone (AI)    │
    │   Port: 27017         │  │   - Weaviate         │
    │   - Products          │  │   - FAISS            │
    │   - Users             │  │   (Recommendations)  │
    │   - Orders            │  │                      │
    └───────────────────────┘  └──────────────────────┘
```

## 📊 User Journey Flow

### 1. Home Page Flow
```
User Opens Browser (http://localhost:3000)
    │
    ├─→ Frontend loads React App
    │   └─→ NavigationBar renders
    │   └─→ Home component renders
    │
    ├─→ API Call: GET /api/products
    │   └─→ Backend queries MongoDB
    │   └─→ Returns product list (59 products)
    │
    └─→ Display featured products with AI recommendations
        └─→ Pinecone provides similar product suggestions
```

### 2. Authentication Flow
```
User clicks "Login/Register"
    │
    ├─→ Login Flow:
    │   ├─→ User enters credentials
    │   ├─→ POST /api/auth/login
    │   ├─→ Backend validates with bcryptjs
    │   ├─→ JWT token generated (48h expiry)
    │   └─→ Token stored in localStorage
    │
    └─→ Register Flow:
        ├─→ User fills registration form
        ├─→ POST /api/auth/register
        ├─→ Password hashed (bcryptjs, 10 rounds)
        ├─→ User saved to MongoDB
        └─→ Auto-login with JWT token
```

### 3. Product Browsing Flow
```
User browses products
    │
    ├─→ Shop Page (/shop)
    │   ├─→ GET /api/products
    │   ├─→ Display all products in grid
    │   └─→ Filter by category/search
    │
    ├─→ Product Details (/product/:id)
    │   ├─→ GET /api/products/:id
    │   ├─→ Display product info
    │   ├─→ GET /api/products/:id/similar
    │   └─→ Show AI-powered recommendations
    │
    └─→ Search (/search?q=query)
        ├─→ GET /api/search?q=query
        ├─→ MongoDB regex search
        └─→ Display matching products
```

### 4. Shopping Cart Flow
```
User adds product to cart
    │
    ├─→ "Add to Cart" button clicked
    │   ├─→ Product added to Context state
    │   ├─→ Saved to localStorage (fusionCart)
    │   └─→ Cart badge updates (+1)
    │
    ├─→ View Cart (/cart)
    │   ├─→ Display cart items
    │   ├─→ Update quantity (+/-)
    │   ├─→ Remove items
    │   └─→ Calculate total price
    │
    └─→ Proceed to Checkout
        └─→ Navigate to /checkout
```

### 5. Checkout & Payment Flow
```
User proceeds to checkout
    │
    ├─→ Checkout Form (/checkout)
    │   ├─→ Enter shipping details
    │   ├─→ Enter payment info (card)
    │   │   └─→ react-credit-cards-2 visualization
    │   └─→ Submit order
    │
    ├─→ POST /api/checkout/create-order
    │   ├─→ Backend validates:
    │   │   ├─→ Email format
    │   │   ├─→ Card number (16 digits)
    │   │   ├─→ Expiry date (MM/YY)
    │   │   └─→ CVC (3-4 digits)
    │   ├─→ Simulate processing (3s delay)
    │   └─→ Return success response
    │
    └─→ Order Success (/order-success)
        ├─→ Display confirmation
        ├─→ Clear cart
        └─→ Show order details
```

## 🤖 AI Recommendation System Flow

```
Product Recommendation Request
    │
    ├─→ User views product details
    │
    ├─→ GET /api/products/:id/similar
    │   │
    │   ├─→ Backend retrieves product from MongoDB
    │   │
    │   ├─→ PRIMARY: Pinecone Vector Search
    │   │   ├─→ Get product vector (768 dimensions)
    │   │   ├─→ Query similar vectors (cosine similarity)
    │   │   ├─→ Return top 5 matches
    │   │   └─→ Fetch products from MongoDB
    │   │
    │   └─→ FALLBACK: Heuristic Scoring
    │       ├─→ Category match (+3 points)
    │       ├─→ Brand match (+2 points)
    │       ├─→ Name similarity (+3 points)
    │       ├─→ Description similarity (+1 point)
    │       ├─→ Price affinity (+2 points)
    │       └─→ Return top 5 scored products
    │
    └─→ Display recommendations to user
```

## 🔄 Data Synchronization Flow

```
Product Created/Updated in MongoDB
    │
    ├─→ Mongoose Post-Save Hook Triggered
    │
    ├─→ Generate Product Embedding
    │   ├─→ Combine text: name + description + category + brand
    │   ├─→ Google Generative AI (text-embedding-004)
    │   └─→ Create 768-dimensional vector
    │
    ├─→ Sync to Pinecone
    │   ├─→ Upsert vector with metadata
    │   │   ├─→ mongoId
    │   │   ├─→ category
    │   │   ├─→ brand
    │   │   ├─→ price
    │   │   └─→ name
    │   └─→ Store pineconeId in MongoDB
    │
    └─→ Optional: Sync to Weaviate/FAISS
```

## 🔐 Security Flow

```
Protected Route Access
    │
    ├─→ Request includes JWT token
    │
    ├─→ Auth Middleware (middleware/auth.js)
    │   ├─→ Extract token from header
    │   ├─→ Verify token with JWT_SECRET
    │   ├─→ Check expiration (48h)
    │   └─→ Decode user info
    │
    ├─→ If Valid:
    │   ├─→ Attach user to request
    │   └─→ Continue to route handler
    │
    └─→ If Invalid:
        ├─→ Return 401 Unauthorized
        └─→ Redirect to login
```

## 🚀 CI/CD Pipeline Flow (Jenkins)

```
Developer pushes code to GitHub
    │
    ├─→ Jenkins Detects Change (Poll SCM every 2h)
    │   OR Scheduled Build (Mon/Thu 2 AM)
    │
    ├─→ STAGE 1: Setup & Checkout
    │   ├─→ Clone repository
    │   └─→ Check Node.js version
    │
    ├─→ STAGE 2: Install Dependencies
    │   ├─→ npm install (frontend)
    │   └─→ npm install (backend)
    │
    ├─→ STAGE 3: Test & Build
    │   ├─→ Run backend tests (auth.spec.js)
    │   ├─→ Run frontend tests (Home.test.js)
    │   └─→ All tests pass ✓
    │
    ├─→ STAGE 4: Build Success
    │   └─→ Mark build as successful
    │
    └─→ Notify Team (email)
        └─→ Build history updated
```

## 🐳 Docker Containerization Flow

```
Build Docker Image
    │
    ├─→ docker build -t fusion-electronics:latest
    │
    ├─→ STAGE 1: Install Dependencies
    │   ├─→ Copy package.json files
    │   ├─→ npm install (frontend + backend)
    │   └─→ Create node_modules
    │
    ├─→ STAGE 2: Build Frontend
    │   ├─→ Copy React source
    │   ├─→ npm run build
    │   └─→ Generate static files
    │
    ├─→ STAGE 3: Setup Runtime
    │   ├─→ Install PM2 (process manager)
    │   ├─→ Create startup script
    │   │   ├─→ Start backend (port 8000)
    │   │   └─→ Start frontend (port 3000)
    │   └─→ Configure ports
    │
    └─→ Push to Docker Hub
        └─→ suryanshpandey7081/fusion-electronics:latest
```

## 📦 Deployment Flow

```
Production Deployment
    │
    ├─→ Pull Docker Image
    │   └─→ docker pull suryanshpandey7081/fusion-electronics:latest
    │
    ├─→ Run Container
    │   ├─→ docker run -p 3000:3000 -p 8000:8000
    │   ├─→ Frontend serves on port 3000
    │   └─→ Backend API on port 8000
    │
    ├─→ Connect to MongoDB Atlas
    │   ├─→ Whitelist server IP
    │   ├─→ Use connection string from env
    │   └─→ Database ready
    │
    └─→ Application Live
        ├─→ Users access frontend
        ├─→ API calls to backend
        └─→ Data from MongoDB
```

## 🔧 Development Environment Setup

```
Local Development Setup
    │
    ├─→ Prerequisites Installed
    │   ├─→ Node.js 18.x ✓
    │   ├─→ MongoDB connection ✓
    │   ├─→ Git ✓
    │   └─→ Docker Desktop ✓
    │
    ├─→ Clone Repository
    │   └─→ git clone <repo-url>
    │
    ├─→ Install Dependencies
    │   ├─→ npm install (root)
    │   └─→ cd backend && npm install
    │
    ├─→ Configure Environment (.env)
    │   ├─→ MONGO_URI
    │   ├─→ JWT_SECRET
    │   ├─→ PINECONE_API_KEY
    │   └─→ GOOGLE_AI_API_KEY
    │
    ├─→ Seed Database
    │   └─→ cd backend/seed && node productSeeds.js
    │
    ├─→ Start Development Servers
    │   ├─→ Terminal 1: cd backend && npm start (port 8000)
    │   └─→ Terminal 2: npm start (port 3000)
    │
    └─→ Access Application
        ├─→ Frontend: http://localhost:3000
        ├─→ Backend API: http://localhost:8000
        └─→ Swagger Docs: http://localhost:8000/api-docs
```

## 📱 API Endpoints Overview

```
Authentication APIs
├─→ POST /api/auth/register      - Create new user
├─→ POST /api/auth/login         - User login (returns JWT)
├─→ POST /api/auth/forgot-password - Password reset request
└─→ POST /api/auth/reset-password  - Complete password reset

Product APIs
├─→ GET  /api/products           - List all products
├─→ GET  /api/products/:id       - Get single product
├─→ GET  /api/products/:id/similar - AI recommendations
├─→ POST /api/products/recommendations - Batch recommendations
└─→ GET  /api/products/category/:category - Filter by category

Search API
└─→ GET  /api/search?q=query     - Search products

Checkout API
└─→ POST /api/checkout/create-order - Process order

Health Check
└─→ GET  /api/health             - Server status
```

## 🎯 Key Features Flow

### Feature: AI Product Recommendations
```
1. User views "Laptop X"
2. Frontend calls: GET /api/products/123/similar
3. Backend gets product vector from Pinecone
4. Pinecone finds 5 similar products (cosine similarity)
5. Backend fetches full product data from MongoDB
6. Frontend displays "You may also like" section
```

### Feature: Shopping Cart Persistence
```
1. User adds item to cart
2. Cart saved to React Context (memory)
3. Cart also saved to localStorage (fusionCart key)
4. User closes browser
5. User reopens site
6. Cart restored from localStorage automatically
```

### Feature: Responsive Design
```
1. User accesses site from any device
2. Material-UI breakpoints detect screen size
3. Layout adapts:
   - Mobile: Single column, hamburger menu
   - Tablet: 2-column grid
   - Desktop: 3-4 column grid, full nav
```

---

## 🎓 Technology Stack Summary

**Frontend:**
- React 18.x (UI framework)
- Material-UI 5.x (component library)
- React Router 6.x (navigation)
- Axios (HTTP client)
- React Hook Form (form handling)

**Backend:**
- Node.js 18.x (runtime)
- Express.js 4.x (web framework)
- MongoDB 6.x (database)
- Mongoose (ODM)
- JWT (authentication)
- Swagger (API docs)

**AI/ML:**
- Pinecone (vector database)
- Google Generative AI (embeddings)
- Weaviate (optional)
- FAISS (optional)
- LangChain (framework)

**DevOps:**
- Jenkins (CI/CD)
- Docker (containerization)
- GitHub Actions (automation)
- Git (version control)

---

**Created:** December 1, 2025
**Project:** Fusion Electronics E-commerce
**Team:** APIBP-20234YC-Team-09
