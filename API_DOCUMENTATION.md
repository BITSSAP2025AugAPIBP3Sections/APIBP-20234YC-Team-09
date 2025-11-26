# 📚 Fusion Electronics API Documentation

This document provides a detailed explanation of all API endpoints available in the Fusion Electronics backend.

**Base URL:** `http://localhost:8000`

---

## 🔐 **Authentication APIs**
Manage user accounts and security.

### 1. **Register User**
*   **Endpoint:** `POST /api/auth/register`
*   **Description:** Creates a new user account.
*   **Input (JSON):**
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123"
    }
    ```
*   **Output (Success 200):** Returns a JWT token.
    ```json
    { "token": "eyJhbGciOiJIUzI1Ni..." }
    ```

### 2. **Login User**
*   **Endpoint:** `POST /api/auth/login`
*   **Description:** Authenticates a user and returns a token.
*   **Input (JSON):**
    ```json
    {
      "email": "john@example.com",
      "password": "password123"
    }
    ```
*   **Output (Success 200):** Returns a JWT token.
*   **Error (400):** `{ "msg": "Invalid credentials" }`

### 3. **Get User Profile**
*   **Endpoint:** `GET /api/auth/user`
*   **Headers:** `x-auth-token: <your_token>`
*   **Description:** Returns the currently logged-in user's data (excluding password).

---

## 🛍️ **Product APIs**
Browse and search for products.

### 4. **Get All Products**
*   **Endpoint:** `GET /api/products`
*   **Description:** Returns a list of all available products.
*   **Output (Success 200):** Array of product objects.

### 5. **Get Single Product**
*   **Endpoint:** `GET /api/products/:id`
*   **Description:** Returns details of a specific product by its ID.
*   **Example:** `/api/products/674576b8cfe123...`
*   **Error (404):** `{ "message": "Product not found" }`

### 6. **Search Products**
*   **Endpoint:** `GET /api/products/search/:query`
*   **Description:** Search for products by name or description.
*   **Example:** `/api/products/search/iphone`

### 7. **Get Similar Products (Recommendations)**
*   **Endpoint:** `GET /api/products/:id/similar`
*   **Description:** Returns products similar to the given ID (uses Vector Search or fallback logic).

---

## 🛒 **Checkout & Order APIs**
Manage shopping cart and orders.

### 8. **Create Order**
*   **Endpoint:** `POST /api/checkout/create-order`
*   **Description:** Places a new order.
*   **Input (JSON):**
    ```json
    {
      "items": [{ "product": "ID...", "quantity": 1 }],
      "total": 999,
      "customer": { "name": "John", "email": "john@example.com", ... },
      "payment": { "cardNumber": "..." }
    }
    ```
*   **Output (Success 201):** Returns the created order details.

### 9. **Get Order Status**
*   **Endpoint:** `GET /api/orders/:orderId`
*   **Description:** Returns the status and details of a specific order.
*   **Example:** `/api/orders/ORD-1732604321`

---

## 📄 **Documentation API**

### 10. **Swagger UI**
*   **URL:** `http://localhost:8000/api-docs`
*   **Description:** Interactive API documentation interface.
