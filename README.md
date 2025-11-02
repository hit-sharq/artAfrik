# 🎨 ArtAfrik

**ArtAfrik** is a full-stack web platform that curates and sells authentic Maasai Market goods and handcrafted African art — including beadwork, textiles, jewelry, paintings, home décor, carvings, masks, sculptures, and other traditional crafts — connecting collectors worldwide with talented African artisans.

## 🌍 Vision

To preserve and promote Africa's cultural legacy by giving global visibility to contemporary and traditional African art.

---

## 🚀 Tech Stack

### Frontend
- **Next.js** with **TypeScript**
- **CSS Modules** or **Tailwind CSS**
- **Cloudinary** for image hosting
- **React Hook Form** + **Zod** for validation

### Backend
- **Node.js** + **Prisma**
- **PostgreSQL** (hosted on Supabase or Railway)
- **Authentication**: Clerk or NextAuth.js

### Deployment
- **Vercel** (Frontend)
- **Supabase** (Database & Auth)

---

## 🖼️ Core Features

### Public Pages
- **Home** – Welcome message, featured art, and call-to-action
- **About** – Story of ArtAfrik and mission
- **Listings** – All art pieces with search and filters
- **Contact** – Inquiry form for potential buyers or partners

### Authenticated Dashboard
- **Admin Login** – Secure entry to the admin panel
- **Add/Edit Artworks** – Upload high-res images, metadata (title, category, price, material)
- **Mark as Featured or Sold**
- **View Inquiries** – Messages from interested users

---

## 📁 Folder Structure

arts-afrik/
├── app/ # Next.js routes
│ ├── dashboard/ # Admin dashboard
│ ├── listings/ # Art listings
│ ├── api/ # API routes
├── components/ # UI components
├── prisma/ # Prisma schema & migrations
├── public/ # Static assets
├── lib/ # Utility functions
├── styles/ # Global and module CSS

yaml
Copy
Edit

---

## 🧪 Setup & Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your-username/arts-afrik.git
   cd arts-afrik
Install dependencies

bash
Copy
Edit
npm install
Setup .env file

env
Copy
Edit
DATABASE_URL=postgresql://...
CLOUDINARY_URL=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
Run migrations

bash
Copy
Edit
npx prisma migrate dev --name init
Start development server

bash
Copy
Edit
npm run dev


*🌟 Contributing*
================

We welcome community contributions! To contribute:

Fork the repo

Create a branch

Submit a PR with your changes

📜 License
This project is licensed under the MIT License.

👤 Author
Joshua Mwendwa – Software Engineer & Founder of ArtAfrik
LinkedIn https://www.linkedin.com/in/lee-joshua-b183b5287/ | GitHub https://github.com/hit-sharq


