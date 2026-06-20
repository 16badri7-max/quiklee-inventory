# Quiklee Dark Store Inventory & Real‑Time Stock Availability System

A full‑stack web application that lets you manage inventory for dark‑store locations, view real‑time stock levels, receive low‑stock/out‑of‑stock alerts, and generate visual reports.

## ✨ Features
- **React (Vite) Frontend** with Material‑UI dark theme & teal accent
- **Node.js + Express** REST API (CRUD, status, alerts, reports)
- **MySQL** relational storage with full schema
- **JWT authentication** (placeholder login endpoint can be added)
- **Docker Compose** for easy local development
- Responsive UI, charts (Chart.js), and modern animations
- Unit test scaffolding for backend (Jest) and frontend (React Testing Library)

## 📁 Folder Structure
```
project/
├─ backend/          # Express API
├─ frontend/         # React UI
├─ database/         # SQL schema
├─ docker-compose.yml
└─ README.md
```

## 🛠️ Prerequisites
- Docker & Docker‑Compose **or** local Node.js (v20+) & MySQL
- (Optional) `npm` version 10+

## 🚀 Development Setup (Docker)

```bash
# Clone repo and cd into folder
git clone <repo-url>
cd project

# Start containers
docker-compose up --build
```

- Backend API ➜ `http://localhost:5000/api`
- Frontend UI ➜ `http://localhost:3000`

### Without Docker (local)
1. **MySQL** – create DB using `database/quiklee_inventory.sql`.
2. **Backend**
   ```bash
   cd backend
   cp .env.example .env
   # edit .env with your DB credentials
   npm install
   npm run dev
   ```
3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📚 API Documentation

### Authentication
- **POST** `/api/auth/login` – returns JWT (implementation placeholder)

### Products
| Method | Endpoint                | Description |
|--------|-------------------------|-------------|
| POST   | `/api/products`         | Create new product (auth) |
| GET    | `/api/products`         | List products (optional filters `search`, `status`) |
| GET    | `/api/products/:id`     | Get single product |
| PUT    | `/api/products/:id`     | Update product |
| DELETE | `/api/products/:id`     | Delete product |
| PATCH  | `/api/products/:id/stock` | Adjust stock (`{ delta: -5 }`) |

### Inventory Status
- **GET** `/api/inventory/status?productId=123` – health (`Healthy`, `Low Stock`, `Out of Stock`)

### Alerts
- **GET** `/api/alerts` – list current alerts

### Reports
- **GET** `/api/reports/summary` – aggregated numbers (total, active, low‑stock, out‑of‑stock)

## 🧪 Testing
```bash
# Backend
cd backend
npm test    # runs Jest + Supertest

# Frontend
cd frontend
npm test    # (placeholder – add React Testing Library tests)
```

## 🎨 Design Notes
- **Material‑UI** with dark mode, teal primary color.
- Utilises gradient backgrounds and subtle hover animations.
- All components are reusable and built with a consistent design system.
- Accessibility considerations: proper aria labels, keyboard navigation.

## 📦 Deploy
- Build frontend: `npm run build` (produces `dist/`).
- Use the provided Docker images or copy the built assets to a static host.
- Backend can be containerised or deployed to any Node‑compatible platform (Heroku, Railway, etc.).

---
*Happy coding! 🎉*
