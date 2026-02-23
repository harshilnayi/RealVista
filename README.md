# 🏠 RealVista — Smart Property Discovery Platform

A modern, full-stack real estate web application built with **Next.js 14**, **Supabase**, and **Leaflet.js**. Features a stunning dark UI with glassmorphism effects, interactive maps, and comprehensive property management.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

- 🔐 **Authentication** — Email/password signup with role selection (Buyer, Seller, Agent)
- 🏘️ **Property Listings** — Browse, search, filter, sort with grid/list view
- 📝 **Add Property** — Multi-step form with image upload
- 🗺️ **Interactive Map** — Leaflet.js map with property markers
- 🧮 **EMI Calculator** — Real-time mortgage calculator with donut chart
- 👥 **Agents Directory** — Find and contact agents/sellers
- ❤️ **Favorites** — Save properties you love
- 📊 **Dashboard** — Role-based dashboard with stats and quick actions
- 📨 **Inquiries** — Send/receive property inquiries
- 📱 **Responsive** — Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 19, CSS Modules |
| Backend | Supabase (Auth, PostgreSQL, Storage) |
| Maps | Leaflet.js + OpenStreetMap |
| Icons | Lucide React |
| Deployment | Vercel |

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/harshilnayi/realvista.git
cd realvista
npm install
```

### 2. Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Copy your **Project URL** and **anon key** from Settings → API
3. Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

4. Run the SQL schema in Supabase SQL Editor:

```bash
# Copy contents of supabase/schema.sql and run in Supabase Dashboard → SQL Editor
```

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
realvista/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── about/            # About page
│   │   ├── agents/           # Agents directory
│   │   ├── calculator/       # EMI Calculator
│   │   ├── dashboard/        # User dashboard
│   │   │   ├── favorites/    # Saved properties
│   │   │   ├── inquiries/    # Messages
│   │   │   └── listings/     # My properties
│   │   ├── login/            # Login page
│   │   ├── map/              # Interactive map
│   │   ├── properties/       # Property browse & detail
│   │   │   ├── [id]/         # Property detail page
│   │   │   └── new/          # Add property form
│   │   └── register/         # Registration page
│   ├── components/           # Reusable components
│   │   └── layout/           # Navbar, Footer
│   └── lib/                  # Utilities, configs
│       ├── supabase/         # Supabase client/server
│       ├── constants.js      # App constants
│       └── utils.js          # Helper functions
├── supabase/
│   └── schema.sql            # Database schema
└── public/                   # Static assets
```

## 📊 Database Schema

- **profiles** — User profiles with roles
- **properties** — Property listings
- **property_images** — Property photos
- **favorites** — Saved properties
- **inquiries** — User-to-user messages

All tables have Row Level Security (RLS) enabled.

## 📄 License

MIT License — feel free to use for your own projects!

---

Built with ❤️ as a Final Year Project
