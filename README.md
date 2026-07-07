<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=3B82F6&height=200&section=header&text=ShopNest%20API&fontSize=50&fontAlignY=35&desc=A%20Highly%20Scalable%20E-Commerce%20Backend&descAlignY=55&descSize=20" alt="Header" />
</div>

<div align="center">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" alt="Node.js" width="45" />
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg" alt="Express" width="45" />
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" width="45" />

  <br/><br/>

  <p>
    <a href="https://shopnest-api-h4yj.onrender.com"><img src="https://img.shields.io/badge/🔴_Live_Demo-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Live Demo" /></a>
    <a href="https://github.com/Arpan-max/ShopNest-API"><img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repo" /></a>
  </p>

  <p>
    <strong>A production-ready RESTful API engineered for modern e-commerce platforms.</strong><br/>
    <i>Built with Node.js, Express, PostgreSQL, and robust JWT authentication.</i>
  </p>
</div>

---

## 🌟 Why This Project Stands Out

**ShopNest API** isn't just a tutorial project; it's designed with **production-grade engineering principles** in mind:
- **Stateless Architecture**: Fully stateless authentication using JWTs, making the API easily horizontally scalable.
- **Data Integrity**: Enforced via a highly normalized PostgreSQL schema with explicit constraints, foreign keys, and cascading rules.
- **Security First**: Integrated with `helmet` for HTTP header hardening, `express-rate-limit` to prevent brute-force attacks, and `express-validator` to ensure payload sanitization.
- **Raw SQL Performance**: Bypassing heavy ORMs by using the `pg` driver to write optimized, native SQL queries.

---

## 🚀 Live Environment

The API is deployed and running live on Render!

- **Base URL**: [`https://shopnest-api-h4yj.onrender.com`](https://shopnest-api-h4yj.onrender.com)

*Note: Since it's deployed on Render's free tier, the first request might take ~50 seconds to wake up the server.*

---

## 🏗️ System Architecture (ERD)

The database schema is heavily normalized to ensure data integrity and zero redundancy.

```mermaid
erDiagram
    USERS {
        int id PK
        string name
        string email UK
        string password_hash
        string role "customer | admin"
        timestamp created_at
    }
    CATEGORIES {
        int id PK
        string name UK
        string slug UK
    }
    PRODUCTS {
        int id PK
        string name
        string description
        numeric price
        int stock_quantity
        int category_id FK
        string image_url
        timestamp created_at
    }
    CART_ITEMS {
        int id PK
        int user_id FK
        int product_id FK
        int quantity
    }
    ORDERS {
        int id PK
        int user_id FK
        string status
        numeric total_amount
        string shipping_address
        timestamp created_at
    }
    ORDER_ITEMS {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        numeric price_at_purchase
    }

    USERS ||--o{ CART_ITEMS : "has"
    USERS ||--o{ ORDERS : "places"
    CATEGORIES ||--o{ PRODUCTS : "contains"
    PRODUCTS ||--o{ CART_ITEMS : "added to"
    PRODUCTS ||--o{ ORDER_ITEMS : "part of"
    ORDERS ||--|{ ORDER_ITEMS : "contains"
```

---

## ⚡ Quick Start (Local Development)

Want to run it locally? 

### 1. Clone & Install
```bash
git clone https://github.com/Arpan-max/ShopNest-API.git
cd ShopNest-API
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=5000
DATABASE_URL=postgres://your_user:your_password@localhost:5432/shopnest
JWT_SECRET=your_super_secret_jwt_key_here
```

### 3. Database Initialization
Run the included scripts to construct tables and seed initial data:
```bash
npm run db:setup
npm run db:seed
```

### 4. Ignite the Server
```bash
npm run dev
```
The server will now be listening on `http://localhost:5000`.

---

## 📚 Core API Routes

### 👤 Authentication
| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Authenticate & get token | No |
| `GET`  | `/api/auth/me` | Fetch active profile | **Yes** |

### 📦 Catalog
| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `GET` | `/api/categories` | Browse product categories | No |
| `GET` | `/api/products` | Browse all products | No |
| `POST`| `/api/products` | Add new inventory | **Yes (Admin)** |

### 🛒 Shopping Cart
| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `GET` | `/api/cart` | View active cart | **Yes** |
| `POST`| `/api/cart` | Add item to cart | **Yes** |
| `DELETE`| `/api/cart/:id`| Remove an item | **Yes** |

### 💳 Order Management
| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/api/orders` | Checkout current cart | **Yes** |
| `GET`  | `/api/orders` | View order history | **Yes** |

---

## 🛠️ Tech Stack Spotlight

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" />
</p>

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---
<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=3B82F6&height=100&section=footer" alt="Footer" />
</div>
