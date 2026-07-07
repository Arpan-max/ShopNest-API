# ShopNest API

ShopNest API is a complete backend RESTful API designed for e-commerce platforms, providing secure authentication, catalogue management, per-user shopping carts, and transactional order placements.

## Features
- **Authentication**: JWT-based Bearer token authentication with role-based access control (customer vs admin).
- **Catalogue**: Categories and Products with advanced SQL-based filtering, searching, sorting, and pagination.
- **Cart Management**: Add, update, remove items, with real-time stock validation.
- **Order Processing**: Atomic transaction placing an order from cart, snapshotting prices, decrementing stock, and clearing cart securely.
- **Robust Error Handling**: Centralized error responses wrapped in a consistent payload.

## Tech Stack
- **Node.js + Express.js**
- **PostgreSQL** (via `pg` node-postgres driver, raw SQL, no ORM)
- **bcryptjs** for hashing
- **jsonwebtoken** for auth
- **express-validator** for payload validation

## Folder Structure (Layered Architecture)
```
shopnest-api/
├── server.js               (entry point, binds port)
├── app.js                  (express setup, middleware, routes)
├── config/                 (db connection pool)
├── database/               (schema and seed scripts)
├── middleware/             (auth, validation, error handling)
├── routes/                 (express routers mapping endpoints to controllers)
├── controllers/            (parse req, call services, shape res - no business logic)
├── services/               (business logic, orchestrates repositories, owns transactions)
├── repositories/           (data access layer, raw SQL queries ONLY)
└── utils/                  (helpers, custom error classes)
```
*Flow*: Routes -> Controllers -> Services -> Repositories.

## Local Setup Instructions
1. Clone the repository and run `npm install`.
2. Copy `.env.example` to `.env`.
3. Provide your `DATABASE_URL` (e.g. from Neon.tech or a local Postgres instance) and `JWT_SECRET`.
4. Run `npm run db:setup` to construct the database schema.
5. Run `npm run db:seed` to populate sample categories and products.
6. Run `npm run dev` to start the server locally with nodemon on port 5000.

## API Documentation
See [docs/API.md](docs/API.md) for full endpoint references.
- `POST /api/auth/register`, `/api/auth/login`
- `GET /api/products` (supports query params: category, search, minPrice, maxPrice, sortBy, page, limit)
- `POST /api/cart`
- `POST /api/orders`

## Manual Steps You Must Do Yourself (Deployment)

**A. Create a hosted PostgreSQL database (Neon.tech — free tier)**
1. Sign up at neon.tech, create a new project.
2. Copy the connection string shown (it already includes `?sslmode=require`).
3. Paste it into `DATABASE_URL` in `.env`.

**B. Set up the schema**
1. Run `npm run db:setup && npm run db:seed` locally once your `.env` is filled in with the Neon database string. (Alternatively, run the raw SQL from the database folder directly in Neon's SQL editor).

**C. Generate a JWT secret**
Run locally: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` and paste the output into `JWT_SECRET` in your `.env`.

**D. Create your first admin user**
There's no UI, so: register a normal account via `POST /api/auth/register` (e.g. in Postman), then manually promote it in the Neon SQL editor:
```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```
Use this admin account's token to create categories and products via the API before testing cart/checkout.

**E. Push code to GitHub**
`git init`, `git add .`, `git commit -m "Initial commit"`, create a repo on GitHub, `git remote add origin <repo-url>`, `git push -u origin main`.

**F. Deploy to Render.com**
1. Sign up at render.com → "New +" → "Web Service" → connect your GitHub repo.
2. Build command: `npm install`. Start command: `npm start`.
3. Add environment variables: `DATABASE_URL` (your Neon string), `JWT_SECRET`, `JWT_EXPIRES_IN` (e.g. 7d), `NODE_ENV=production`.
4. Deploy. Render gives you a live URL like `https://shopnest-api.onrender.com`.

**G. Test the live API**
Use Postman/Insomnia against the live URL. Test flow: register -> login -> get products -> add to cart -> place order.
