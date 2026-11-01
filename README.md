# CROWN BURGER — Animated E-commerce Mini Project

An original, dark-and-orange burger storefront inspired by the **visual direction** of the supplied CROWN BURGER reference video (bold black hero, prominent stacked burger, dramatic typography). Includes locally bundled photorealistic burger assets (adapted from an original generated visual design concept), photo-layer ingredient-assembly scroll effect, floating/zooming rotating hero burger, menu, cart, checkout, secured admin login, database CRUD, and order workflow.

## Requirements

- Windows, macOS or Linux
- Node.js **20 or newer** with npm
- Local MongoDB Community Server (running) **or** a MongoDB Atlas connection URI
- A browser; Internet access for Google Fonts and GSAP CDN (website/cart still work without them; GSAP hero motion gracefully falls back)
- VS Code recommended, optional

## Start locally (Windows / VS Code)

1. Extract the project ZIP.
2. Open `crown-burger` folder in VS Code.
3. Install Node.js LTS and MongoDB Community Server. Check in VS Code terminal:

   ```powershell
   node -v
   npm -v
   ```

4. Copy `.env.example` to `.env` (Windows PowerShell: `Copy-Item .env.example .env`) and **change ADMIN_PASSWORD and JWT_SECRET**. `JWT_SECRET` must be at least 32 characters; choose a long random value. Do **not** commit `.env`.
5. Verify MongoDB is running. On Windows, check **Services → MongoDB Server → Running** (or connect using MongoDB Compass to `mongodb://127.0.0.1:27017`).
6. From project root, run:

   ```powershell
   npm install
   npm run seed
   npm start
   ```

7. Open **http://localhost:3000** for the store, and **http://localhost:3000/admin** for Admin Studio. Use `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`.
8. To stop, press `Ctrl+C`. Next time, run `npm start` (no need to seed again).

If PowerShell blocks npm.ps1, use the VS Code terminal profile **Command Prompt**, or execute `npm.cmd install`, `npm.cmd run seed`, `npm.cmd start`. Do not change execution policy just for this project.

## How to use

- **Customer:** filter or search burgers, sort by price, add to bag, adjust quantity, checkout with name/email/phone/address. Checkout accepts **Cash on Delivery** for a demo; NO actual payment gateway or courier integration is included. The backend independently calculates trusted prices and reserves inventory.
- **Admin:** login → Product Management → CREATE, READ, UPDATE and DELETE burgers, edit price/description/stock/availability/image and category → Orders tab → change order status. Cancelled orders restore stock; delivered orders cannot be cancelled.
- **Animation:** scroll the homepage to watch the hero burger float, turn and shrink, followed by the ingredient deconstruction scene which gradually assembles from six layers. GSAP ScrollTrigger handles hero scroll; native scroll-position logic drives the SVG ingredient layers. Respects reduced motion preference for GSAP portions.
- **Images:** Locally bundled JPG burger photos work offline, including hero, product images and combination promotional artwork. Sides and drinks currently use bundled vector illustrations. New products may use a custom HTTPS image URL. Photo assets were cropped from the AI-generated design concept and are illustrative rather than verified real menu photography.

## Folder structure

```
crown-burger/
├── .env.example
├── package.json
├── README.md
├── public/
│   ├── index.html / style.css / app.js
│   ├── admin.html / admin.css / admin.js
│   └── assets/hero-burger.jpg, burger-1.jpg ... burger-4.jpg, layer-1.png ... layer-6.png, SVG illustrations
├── scripts/seed.js
└── src/server.js
```

## REST API

| Route | Method | Purpose | Auth |
|---|---|---|---|
| `/api/health` | GET | Connectivity | No |
| `/api/products` | GET | Menu + category/search/sort | No |
| `/api/products/:id` | GET | Product details JSON | No |
| `/api/auth/login` | POST | Admin JWT login | No |
| `/api/admin/products` | GET | All products, including hidden | Admin |
| `/api/admin/products` | POST | Create product | Admin |
| `/api/admin/products/:id` | PUT | Edit product | Admin |
| `/api/admin/products/:id` | DELETE | Delete product | Admin |
| `/api/orders` | POST | Create cash-on-delivery order | No |
| `/api/admin/orders` | GET | List orders | Admin |
| `/api/admin/orders/:id` | PATCH | Update order status | Admin |

## Data model / ERD

```mermaid
erDiagram
  PRODUCT ||--o{ ORDER_ITEM : ordered_as
  ORDER ||--|{ ORDER_ITEM : includes
  PRODUCT { ObjectId _id PK; string name; string category; string description; number price; number stock; boolean isAvailable; boolean isFeatured; string image; string theme }
  ORDER { ObjectId _id PK; object customer; number subtotal; number deliveryFee; number total; string status; date createdAt }
  ORDER_ITEM { ObjectId product FK; string name; number quantity; number unitPrice; number subtotal }
```

Orders embed order items in a MongoDB `orders` document; products live in the `products` collection. Customer contact/delivery info is embedded on orders. For academic demonstration, admin credentials are configured in `.env` and JWT sessions expire after three hours.

## Evaluation rubric coverage (EC4307, 30 points)

- Create / Read / Update / Delete: admin product form and management table (4+4+4+4)
- Client-side HTML form constraints and server-side schema/input validation; error messages (2)
- MongoDB products and orders design, IDs and relationships (4)
- Responsive storefront, animation, consistent admin experience (2)
- Separate organized frontend/backend/scripts, version control friendly (2)
- This README, ERD, setup guide; capture your own screenshots (2)
- Record your own demonstration of at most 5 minutes with camera on (2)

**Important:** The supplied rubric says academic integrity checks apply to AI-generated content and code similarity. Understand, adapt, test and explain your submission; follow your instructor's AI disclosure rules.

## Suggested 5-minute demonstration

1. 0:00–0:45: Show homepage scroll animations and responsive layout.
2. 0:45–1:30: Menu filters, search, sorting and customer bag.
3. 1:30–2:00: Complete demo Cash on Delivery checkout; inspect order.
4. 2:00–4:15: Admin login → Create product → view/search → edit → delete; demonstrate database persistence on reload.
5. 4:15–5:00: Orders status, validation, MongoDB Compass collections, ERD.

## Known limits / next improvements

- Burger visuals are photographic-style crops of the generated reference concept; sides/drinks use vector art. For genuinely accurate food photographs, replace them with photographs of your actual menu items. Scroll ingredient animation is a 2D image-layer illusion rather than a true 3D model.
- Orders have no user accounts, payment processing, notifications or shipment tracking.
- This is a **coursework/demo baseline**, not a production commerce deployment. For production, add CSRF protections where relevant, verified image hosts and CSP, database transactions for multi-item order stock reservations, HTTPS, role management, persistent sessions, stronger admin account storage, logs, tests and payment-provider integration.
- MongoDB must be running for seeded storefront products; the UI shows a retry message otherwise.

## 2026 premium design refresh

The storefront uses a photographic-style burger hero, dark charcoal background, glowing orange buttons, Manrope headings, realistic-looking menu photos, a combo banner and CSS image-layer scroll assembly. The supplied illustration assets remain available as fallbacks for sides and drinks. The design screenshot was used as visual source artwork, not copied from a commercial template.

**Testing note:** JS syntax checks were performed. A working MongoDB service and end-to-end checkout/admin browser flow were not available for testing in this execution environment. Test `/api/health`, seed, CRUD and checkout on your PC before submitting.
