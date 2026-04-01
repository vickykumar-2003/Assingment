# Golf Charity Platform ⛳️🏆

A modern, full-stack MERN application for competitive golfers who want to support charities. Users can post scores (Stableford points calculated automatically), track their rank on a global leaderboard, and choose which charity receives a portion of their subscription.

## 🚀 Key Features

- **🛡️ Secure Auth**: Dedicated Member & Admin portals with JWT protection.
- **⛳️ Stableford Scoring**: Simply input your **Course Par** and **Strokes Taken**, and the system calculates Eagle, Birdie, Par, or Bogey points.
- **🏆 Global Leaderboard**: Real-time rankings (Monthly & All-time) to track the top players.
- **💳 Subscription System**: Choose Monthly or Yearly plans with auto-expiry tracking ($1000 prize pool).
- **❤️ Charity Integration**: Pick from curated charities; the dashboard shows the real-world impact of your contributions.
- **🎁 Prize verification**: Winners can upload proof of their scores for admin approval and payouts.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion (for smooth animations).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Security**: JWT & Bcryptjs.

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v14+)
- MongoDB (Running locally or MongoDB Atlas URI)

### 2. Backend Setup
1. Open a terminal and navigate to the `server/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server/` folder and add:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/golf-charity
   JWT_SECRET=your_super_secret_key
   STRIPE_SECRET_KEY=sk_test_...
   CLIENT_URL=http://localhost:5173
   ```
4. Seed some initial data (charities, admin, etc.):
   ```bash
   node seed.js
   node createAdmin.js
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open another terminal and navigate to the `client/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React dev server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:5173`.

---

## 🔑 Default Credentials

- **Admin Email**: `admin@golf.com`
- **Admin Password**: `Admin@1234`
- **Member Portal**: `/login`
- **Admin Portal**: `/admin-login`

---

## 📂 Project Structure

```text
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI (Navbar, etc.)
│   │   ├── context/        # Auth State Management
│   │   ├── pages/          # Full page views (Dashboard, Leaderboard, etc.)
│   │   └── App.jsx         # Routing & Layout
├── server/                 # Node.js Express Backend
│   ├── models/             # Mongoose Schemas (User, Score, Charity, etc.)
│   ├── routes/             # API Endpoints
│   ├── middleware/         # Auth & Validation
│   └── index.js            # Server Entry Point
```

---

*Built with ❤️ for the Golf Community and Global Causes.*
