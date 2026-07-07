# ShopNest API Documentation

Base URL: `/api`

All responses follow this envelope structure:
\`\`\`json
// Success
{
  "success": true,
  "data": { ... },
  "meta": { ... } // optional pagination
}

// Error
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // optional array of specific field errors
}
\`\`\`

---

## Authentication (`/api/auth`)

### Register
- **Method:** POST
- **Path:** `/register`
- **Auth:** None
- **Body:**
  \`\`\`json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  \`\`\`
- **Response:** 201 Created. Returns `{ user, token }`.

### Login
- **Method:** POST
- **Path:** `/login`
- **Auth:** None
- **Body:**
  \`\`\`json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  \`\`\`
- **Response:** 200 OK. Returns `{ user, token }`.

### Get Current User
- **Method:** GET
- **Path:** `/me`
- **Auth:** Bearer Token
- **Response:** 200 OK. Returns `{ user }`.

---

## Categories (`/api/categories`)

### List Categories
- **Method:** GET
- **Path:** `/`
- **Auth:** None
- **Response:** 200 OK. Returns list of categories.

### Create Category
- **Method:** POST
- **Path:** `/`
- **Auth:** Admin Token
- **Body:** `{ "name": "Electronics", "slug": "electronics" }`
- **Response:** 201 Created.

### Update Category
- **Method:** PUT
- **Path:** `/:id`
- **Auth:** Admin Token
- **Body:** `{ "name": "New Name", "slug": "new-slug" }`
- **Response:** 200 OK.

### Delete Category
- **Method:** DELETE
- **Path:** `/:id`
- **Auth:** Admin Token
- **Response:** 200 OK.

---

## Products (`/api/products`)

### List Products
- **Method:** GET
- **Path:** `/`
- **Auth:** None
- **Query Params:** `category`, `minPrice`, `maxPrice`, `search`, `sortBy` (price_asc, price_desc, newest, name_asc), `page`, `limit`
- **Response:** 200 OK. Returns `data` array and `meta` object.

### Get Single Product
- **Method:** GET
- **Path:** `/:id`
- **Auth:** None
- **Response:** 200 OK.

### Create Product
- **Method:** POST
- **Path:** `/`
- **Auth:** Admin Token
- **Body:** 
  \`\`\`json
  {
    "name": "Product Name",
    "description": "Product Description",
    "price": 99.99,
    "stockQuantity": 10,
    "categoryId": 1,
    "imageUrl": "https://example.com/image.jpg"
  }
  \`\`\`
- **Response:** 201 Created.

### Update Product
- **Method:** PUT
- **Path:** `/:id`
- **Auth:** Admin Token
- **Body:** Any editable fields from Create.
- **Response:** 200 OK.

### Delete Product
- **Method:** DELETE
- **Path:** `/:id`
- **Auth:** Admin Token
- **Response:** 200 OK.

---

## Cart (`/api/cart`)

### Get Cart
- **Method:** GET
- **Path:** `/`
- **Auth:** Bearer Token
- **Response:** 200 OK. Returns `{ items, subtotal }`.

### Add Item to Cart
- **Method:** POST
- **Path:** `/`
- **Auth:** Bearer Token
- **Body:** `{ "productId": 1, "quantity": 2 }`
- **Response:** 200 OK.

### Update Cart Item
- **Method:** PUT
- **Path:** `/:itemId`
- **Auth:** Bearer Token
- **Body:** `{ "quantity": 3 }`
- **Response:** 200 OK.

### Remove Cart Item
- **Method:** DELETE
- **Path:** `/:itemId`
- **Auth:** Bearer Token
- **Response:** 200 OK.

### Clear Cart
- **Method:** DELETE
- **Path:** `/`
- **Auth:** Bearer Token
- **Response:** 200 OK.

---

## Orders (`/api/orders`)

### Place Order
- **Method:** POST
- **Path:** `/`
- **Auth:** Bearer Token
- **Body:** `{ "shippingAddress": "123 Main St, City, Country" }`
- **Response:** 201 Created. Converts current cart to order.

### List My Orders
- **Method:** GET
- **Path:** `/`
- **Auth:** Bearer Token
- **Response:** 200 OK.

### Get Order by ID
- **Method:** GET
- **Path:** `/:id`
- **Auth:** Bearer Token (Admin can view any, user can view own)
- **Response:** 200 OK.

### Update Order Status
- **Method:** PATCH
- **Path:** `/:id/status`
- **Auth:** Admin Token
- **Body:** `{ "status": "shipped" }` // pending, processing, shipped, delivered, cancelled
- **Response:** 200 OK.
