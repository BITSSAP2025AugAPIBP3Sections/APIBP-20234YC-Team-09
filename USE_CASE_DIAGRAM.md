# 📊 Fusion Electronics - Use Case Diagram

As per the API assignment requirements, here is the Use Case Diagram illustrating the interactions between stakeholders and the system.

```mermaid
usecaseDiagram
    actor "Guest User" as Guest
    actor "Registered Customer" as Customer
    actor "Administrator" as Admin

    package "Fusion Electronics System" {
        usecase "Register Account" as UC1
        usecase "Login" as UC2
        usecase "Browse Products" as UC3
        usecase "Search Products" as UC4
        usecase "View Product Details" as UC5
        usecase "Add to Cart" as UC6
        usecase "Place Order" as UC7
        usecase "Track Order" as UC8
        usecase "Manage Products" as UC9
        usecase "View All Orders" as UC10
    }

    Guest --> UC1
    Guest --> UC2
    Guest --> UC3
    Guest --> UC4
    Guest --> UC5

    Customer --> UC2
    Customer --> UC3
    Customer --> UC4
    Customer --> UC5
    Customer --> UC6
    Customer --> UC7
    Customer --> UC8

    Admin --> UC2
    Admin --> UC9
    Admin --> UC10
```

## 📝 Stakeholder & API Mapping

| Stakeholder | Relevant APIs | Access Level |
|-------------|---------------|--------------|
| **Guest User** | `POST /api/auth/register`<br>`POST /api/auth/login`<br>`GET /api/products` | Public |
| **Customer** | `GET /api/auth/user`<br>`POST /api/checkout/create-order`<br>`GET /api/orders/:id` | Authenticated |
| **Admin** | `POST /api/products` (Future)<br>`DELETE /api/products/:id` (Future) | Admin Role |

---

## 📋 API Documentation Requirements Checklist

- [x] **Use-case Diagram**: Included above.
- [x] **Stakeholders**: Defined for each API in Swagger description.
- [x] **User Privileges**: Access levels (Public/Authenticated) mentioned.
- [x] **Error Handling**: Detailed error codes (400, 401, 403, 409, 422, 500) documented.
- [x] **Response Codes**: Success (200, 201) and Error codes included.
