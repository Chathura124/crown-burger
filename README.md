
# 🍔 CROWN BURGER

### A Modern Burger Ordering & Product Management Platform

CROWN BURGER is a full-stack e-commerce web application designed to deliver an engaging online burger ordering experience.

The platform combines a visually appealing storefront, interactive scroll animations, product browsing, shopping cart functionality, and a streamlined checkout process.

A dedicated administrative dashboard enables efficient product and order management.

## ✨ Key Features

### Customer Experience
- Modern, responsive user interface
- Cinematic burger visuals and scroll animations
- Interactive product catalogue
- Product categories and filtering
- Product search and price sorting
- Detailed product descriptions and pricing
- Shopping cart with quantity management
- Cash on Delivery checkout
- Order information stored in MongoDB

### Admin Dashboard
- Admin authentication using JWT
- Create new products
- View and search existing products
- Update product information
- Delete products with confirmation
- Manage product prices and stock levels
- View customer orders
- Input validation and error handling

## 🛠 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Animations | GSAP, ScrollTrigger |
| Development | Visual Studio Code |
| Version Control | Git & GitHub |

## 🏗 System Architecture

The application follows a client-server architecture.

```text
Customer / Admin
       |
       v
Frontend (HTML, CSS, JavaScript)
       |
       v
REST API (Node.js + Express)
       |
       v
MongoDB Database
       |
       +-- Products
       |
       +-- Orders
```

## 📸 Application Interfaces

The platform includes:

- Animated homepage
- Burger product catalogue
- Shopping cart and checkout
- Admin login
- Product management dashboard
- Product creation and editing forms
- Customer order management

## ⚙️ Installation & Setup

### Prerequisites

Ensure the following are installed:

- Node.js and npm
- MongoDB Community Server
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Chathura124/crown-burger.git
cd crown-burger
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file using `.env.example` as a template.

Configure:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/crown_burger
JWT_SECRET=replace_with_your_own_secure_random_secret
ADMIN_EMAIL=admin@example.local
ADMIN_PASSWORD=replace_with_your_own_strong_password
```

Never commit `.env` or share your credentials.

### 4. Seed Sample Products

Make sure MongoDB is running.

```bash
npm run seed
```

### 5. Start the Application

```bash
npm start
```

Open the application:

**Customer Website:** http://localhost:3000

**Admin Dashboard:** http://localhost:3000/admin

## 🗄 Database

MongoDB stores application data in two primary collections.

**Products:** Product name, category, description, price, stock, availability and image information.

**Orders:** Customer information, purchased items, pricing, payment method and order status.

The application supports persistent data storage and full CRUD operations for product management.

## 🔒 Security & Validation

- JWT-based administrator authentication
- Protected administrative API operations
- Client-side form validation
- Server-side data validation
- Environment-based configuration
- Sensitive credentials excluded from version control

## 🚀 Future Enhancements

- Online payment gateway integration
- Customer accounts and order history
- Real-time order tracking
- Product reviews and ratings
- Cloud deployment
- Email notifications

## 👨‍💻 Developer

**Madushan S.C**  
Computer Engineering Undergraduate  
Faculty of Engineering, University of Ruhuna

**GitHub:** https://github.com/Chathura124

## 📄 Project Information

Developed as a mini project for **EC4307 – Web Application Development**, University of Ruhuna.
