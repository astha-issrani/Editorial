# The Editorial — MERN Stack Blog CMS

A full-stack editorial blog platform built with MongoDB, Express, React, and Node.js. Matches the minimalist black-and-white aesthetic of The Editorial design system with Playfair Display and DM Sans typography.

---

## Project Structure

```
the-editorial/
├── backend/                  # Express + MongoDB API
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Category.js
│   │   ├── Affiliate.js
│   │   └── Newsletter.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── posts.js
│   │   ├── categories.js
│   │   ├── affiliates.js
│   │   ├── analytics.js
│   │   └── newsletter.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── seed.js
│   └── .env.example
│
├── frontend/                 # React app
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   └── layout/
│       │       ├── Navbar.jsx + .css
│       │       ├── Footer.jsx + .css
│       │       └── AdminSidebar.jsx + .css
│       ├── context/
│       │   └── AuthContext.js
│       ├── pages/
│       │   ├── HomePage.jsx + .css
│       │   ├── BlogListingPage.jsx + .css
│       │   ├── SingleBlogPost.jsx + .css
│       │   ├── SearchPage.jsx + .css
│       │   ├── AffiliatePage.jsx + .css
│       │   ├── LoginPage.jsx + .css
│       │   ├── NotFoundPage.jsx + .css
│       │   ├── AdminDashboard.jsx + .css
│       │   ├── AdminPostsPage.jsx
│       │   ├── EditPostPage.jsx + .css
│       │   ├── CategoriesPage.jsx
│       │   ├── AdminAffiliatePage.jsx
│       │   └── AnalyticsPage.jsx
│       ├── utils/
│       │   └── api.js
│       ├── App.js
│       ├── index.js
│       └── index.css
│
└── package.json              # Root scripts
```

---

## Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm

---

## Setup & Installation

### 1. Clone / download this project

### 2. Install all dependencies

```bash
# From the project root
npm install
npm run install-all
```

### 3. Configure environment variables

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/the-editorial
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
```

### 4. Seed the database

```bash
npm run seed
```

This creates:
- **Admin user**: `admin@editorial.com` / `admin123`
- 7 sample published articles
- 11 categories
- 4 affiliate links

### 5. Run the development servers

```bash
# Run both frontend and backend simultaneously
npm run dev
```

Or separately:
```bash
# Backend only (port 5000)
npm run start:backend

# Frontend only (port 3000)
npm run start:frontend
```

---

## Pages & Routes

### Public Pages
| Route | Page |
|-------|------|
| `/` | Home — featured post, latest perspectives, newsletter CTA |
| `/posts` | Blog listing — filterable by category, sidebar with newsletter + trending |
| `/post/:slug` | Single post — full article, related posts, newsletter |
| `/search?q=query` | Search results |
| `/affiliates` | Affiliate links page |
| `/login` | Admin login |

### Admin Pages (requires login)
| Route | Page |
|-------|------|
| `/admin` | Dashboard — stats overview |
| `/admin/posts` | All posts — publish/draft toggle, delete |
| `/admin/posts/new` | Create new post |
| `/admin/posts/edit/:id` | Edit existing post |
| `/admin/categories` | Manage categories |
| `/admin/affiliates` | Manage affiliate links |
| `/admin/analytics` | View analytics |

---

## API Endpoints

### Auth
- `POST /api/auth/login` — Login
- `POST /api/auth/register` — Register
- `GET /api/auth/me` — Current user (protected)

### Posts
- `GET /api/posts` — All published posts (query: `?category=&search=&page=&limit=`)
- `GET /api/posts/featured` — Featured post
- `GET /api/posts/admin/all` — All posts for admin (protected)
- `GET /api/posts/:slug` — Single post (increments view count)
- `POST /api/posts` — Create post (protected)
- `PUT /api/posts/:id` — Update post (protected)
- `DELETE /api/posts/:id` — Delete post (protected)

### Categories
- `GET /api/categories` — All categories
- `POST /api/categories` — Create category (protected)
- `DELETE /api/categories/:id` — Delete category (protected)

### Affiliates
- `GET /api/affiliates` — Active affiliates (public)
- `GET /api/affiliates/admin` — All affiliates (protected)
- `POST /api/affiliates` — Create affiliate (protected)
- `PUT /api/affiliates/:id/click` — Record click (public)
- `PUT /api/affiliates/:id` — Update affiliate (protected)
- `DELETE /api/affiliates/:id` — Delete affiliate (protected)

### Newsletter
- `POST /api/newsletter/subscribe` — Subscribe
- `GET /api/newsletter/list` — All subscribers (protected)

### Analytics
- `GET /api/analytics/dashboard` — Dashboard stats (protected)

---

## Design System

- **Fonts**: Playfair Display (headings/display) + DM Sans (body)
- **Colors**: Pure black `#000` / white `#fff` / gray scale
- **Typography scale**: 10px labels → 40px display headings
- **Spacing**: 4px base unit, consistent scale
- **Theme**: Minimalist editorial, black-and-white

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Styling | Plain CSS with CSS variables |
| Fonts | Google Fonts (Playfair Display + DM Sans) |
