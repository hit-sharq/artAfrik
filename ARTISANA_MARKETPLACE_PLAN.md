<!-- # Artisana Multi-Vendor Marketplace Implementation Plan

## 🎯 Goal: Full Artisan Registration & Shop Management System

A complete multi-vendor marketplace where artisans can register, get approved by admin, and manage their own shops with products.

---

## 📋 User Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ARTISAN REGISTRATION FLOW                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. ARTISAN REGISTRATION                                            │
│     ┌──────────────┐    ┌─────────────────┐    ┌─────────────────┐  │
│     │ Artisan visits│───▶│ Fills registration│───▶│ Details sent to │  │
│     │ /artisan/register│   │ form (name, email, │   │ Admin dashboard│  │
│     └──────────────┘    │ phone, specialty,  │   │ for approval    │  │
│                         │ region, bio, etc) │   └─────────────────┘  │
│                         └─────────────────┘            │             │
│                                                         ▼             │
│  2. ADMIN APPROVAL                                        ┌─────────┐│
│     ┌──────────────┐    ┌─────────────────┐    ┌──────────│ Pending ││
│     │ Admin reviews│───▶│ Approve/Reject  │───▶│          │ Artisan ││
│     │ registration │   │ artisan         │   │          └─────────┘│
│     └──────────────┘    └─────────────────┘            │             │
│                                                         ▼             │
│  3. SHOP ACTIVATION                            ┌───────────────────┐ │
│     ┌──────────────┐    ┌─────────────────┐    │ Artisan receives │ │
│     │ Artisan      │───▶│ Artisan gets    │───▶│ email, can now   │ │
│     │ approved!    │   │ access to       │   │ login and manage │ │
│     └──────────────┘    │ artisan dashboard│   │ their shop       │ │
│                         └─────────────────┘    └───────────────────┘ │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Implementation Phases

### Phase 1: Database Schema
- [ ] 1.1 Create Artisan model with registration fields
- [ ] 1.2 Add artisan approval status enum
- [ ] 1.3 Add ArtisanShop model for shop details
- [ ] 1.4 Link ArtListing to Artisan

### Phase 2: Artisan Registration
- [ ] 2.1 Create registration form page
- [ ] 2.2 Create registration API endpoint
- [ ] 2.3 Add email notifications for registration
- [ ] 2.4 Create registration success page

### Phase 3: Admin Dashboard
- [ ] 3.1 Artisan registration requests list
- [ ] 3.2 Artisan approval/rejection actions
- [ ] 3.3 Artisan management (view, edit, delete)
- [ ] 3.4 Bulk artisan actions

### Phase 4: Artisan Authentication
- [ ] 4.1 Update auth configuration for artisan login
- [ ] 4.2 Create artisan login page
- [ ] 4.3 Create artisan registration page
- [ ] 4.4 Protect artisan routes

### Phase 5: Artisan Dashboard
- [ ] 5.1 Artisan dashboard overview
- [ ] 5.2 Shop profile management (name, bio, logo)
- [ ] 5.3 Product management (add/edit/delete)
- [ ] 5.4 Order management view
- [ ] 5.5 Analytics/sales overview

### Phase 6: Artisan Shop Page
- [ ] 6.1 Public shop page `/shop/[artisanSlug]`
- [ ] 6.2 Shop header with logo, name, bio
- [ ] 6.3 Products grid filtered by artisan
- [ ] 6.4 Contact artisan button
- [ ] 6.5 SEO optimization for shop pages

### Phase 7: Integration
- [ ] 7.1 Add artisan filter to gallery
- [ ] 7.2 Add "Shop by [Artisan]" links
- [ ] 7.3 Update product pages with artisan info
- [ ] 7.4 Add artisan navigation to header

---

## 🔧 Technical Details

### 1. Database Schema

```prisma
// Artisan Registration Status Enum
enum ArtisanStatus {
  PENDING      // Awaiting admin approval
  APPROVED     // Approved, can manage shop
  REJECTED     // Rejected by admin
}

// Artisan Model
model Artisan {
  id              String   @id @default(cuid())
  
  // Authentication
  email           String   @unique
  clerkId         String?  @unique  // For authentication
  
  // Registration Details
  fullName        String
  phone           String?
  specialty       String   // e.g., "Beadwork", "Woodcarving"
  region          String
  location        String?  // Village/city
  yearsExperience Int?
  
  // Shop Details (set after approval)
  shopName        String?  @unique
  shopSlug        String?  @unique
  shopBio         String?  @db.Text
  shopLogo        String?
  shopBanner      String?
  
  // Social Links
  website         String?
  instagram       String?
  facebook        String?
  whatsapp        String?
  
  // Approval
  status          ArtisanStatus @default(PENDING)
  rejectionReason String?
  approvedAt      DateTime?
  approvedBy      String?
  
  // Verification
  isVerified      Boolean  @default(false)
  
  // Relations
  artListings     ArtListing[]
  orders          Order[]  @relation("ArtisanOrders")
  
  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// ArtListing Update
model ArtListing {
  // ... existing fields ...
  artisanId       String?
  artisan         Artisan? @relation(fields: [artisanId], references: [id])
}
```

### 2. New API Routes

```
POST   /api/artisans/register           - Artisan registration
GET    /api/artisans/pending            - Get pending registrations (admin)
POST   /api/artisans/[id]/approve       - Approve artisan
POST   /api/artisans/[id]/reject        - Reject artisan
GET    /api/artisans/[id]               - Get artisan details
PUT    /api/artisans/[id]               - Update artisan
GET    /api/artisans/shop/[slug]        - Get shop data
PUT    /api/artisans/shop/[id]          - Update shop settings
GET    /api/artisans/[id]/products      - Get artisan's products
POST   /api/artisans/[id]/products      - Add product to artisan
PUT    /api/artisans/[id]/products/[productId] - Update product
DELETE /api/artisans/[id]/products/[productId] - Delete product
GET    /api/artisans/[id]/orders        - Get artisan's orders
PUT    /api/artisans/[id]/orders/[orderId] - Update order status
GET    /api/artisans/analytics          - Get sales analytics
```

### 3. New Pages

```
/app/artisan/register/page.tsx          - Artisan registration form
/app/artisan/login/page.tsx             - Artisan login page
/app/artisan/dashboard/page.tsx         - Artisan dashboard overview
/app/artisan/dashboard/shop/page.tsx    - Shop profile management
/app/artisan/dashboard/products/page.tsx- Product management
/app/artisan/dashboard/orders/page.tsx  - Order management
/app/artisan/dashboard/analytics/page.tsx - Sales analytics
/app/artisan/dashboard/settings/page.tsx - Account settings
/app/shop/[slug]/page.tsx               - Public artisan shop page
/app/dashboard/artisans/page.tsx        - Admin: pending artisans
/app/dashboard/artisans/[id]/page.tsx   - Admin: artisan details
```

### 4. New Components

```
components/ArtisanRegistrationForm.tsx  - Registration form
components/ArtisanLoginForm.tsx         - Login form
components/ArtisanDashboardLayout.tsx   - Dashboard layout
components/ShopProfileEditor.tsx        - Shop settings form
components/ProductManager.tsx           - Product CRUD component
components/OrderManager.tsx             - Order management component
components/ArtisanShopHeader.tsx        - Shop page header
components/ArtisanProductCard.tsx       - Product card for shop
components/ArtisanStatsCard.tsx         - Analytics cards
components/ArtisanSidebar.tsx           - Dashboard navigation
```

---

## 📁 Files Structure

### New Files to Create:
```
app/api/artisans/register/route.ts
app/api/artisans/pending/route.ts
app/api/artisans/[id]/approve/route.ts
app/api/artisans/[id]/reject/route.ts
app/api/artisans/[id]/shop/route.ts
app/api/artisans/[id]/products/route.ts
app/api/artisans/[id]/orders/route.ts
app/api/artisans/analytics/route.ts
app/artisan/register/page.tsx
app/artisan/register/registration-form.tsx
app/artisan/login/page.tsx
app/artisan/login/login-form.tsx
app/artisan/dashboard/layout.tsx
app/artisan/dashboard/page.tsx
app/artisan/dashboard/shop/page.tsx
app/artisan/dashboard/products/page.tsx
app/artisan/dashboard/orders/page.tsx
app/artisan/dashboard/analytics/page.tsx
app/artisan/dashboard/settings/page.tsx
app/shop/[slug]/page.tsx
app/dashboard/artisans/page.tsx
app/dashboard/artisans/pending/page.tsx
app/dashboard/artisans/[id]/page.tsx
components/ArtisanRegistrationForm.tsx
components/ArtisanLoginForm.tsx
components/ArtisanDashboardLayout.tsx
components/ShopProfileEditor.tsx
components/ProductManager.tsx
components/OrderManager.tsx
components/ArtisanShopHeader.tsx
components/ArtisanSidebar.tsx
artisan-dashboard.css
artisan-shop.css
```

### Files to Update:
```
prisma/schema.prisma          - Add Artisan model
components/Header.tsx         - Add artisan links
app/dashboard/page.tsx        - Add artisan management nav
middleware.ts                 - Protect artisan routes
lib/auth.ts                   - Add artisan auth
app/api/art-listings/route.ts - Support artisan products
```

---

## 🎨 Design Features

### Registration Form:
- Full name, email, phone
- Specialty dropdown (Beadwork, Woodcarving, Textiles, Jewelry, Paintings, etc.)
- Region/location
- Years of experience
- Bio/description
- Photo upload (optional for registration)
- Terms acceptance

### Admin Dashboard - Artisans:
- Pending registrations list
- One-click approve/reject
- View full details
- Send rejection reason
- Search/filter artisans

### Artisan Dashboard:
- **Overview**: Stats (products, orders, revenue)
- **Shop**: Shop name, bio, logo, banner, social links
- **Products**: Add/Edit/Delete products with images
- **Orders**: View orders, update status, track shipment
- **Analytics**: Sales chart, popular products, revenue

### Public Shop Page:
- Shop banner/header
- Shop logo
- Shop name & bio
- Artisan photo & story
- Contact button
- Filterable products grid
- Social links

---

## 🔐 Authentication & Authorization

### Artisan Routes:
```
Middleware checks:
1. Is user authenticated?
2. Is user's role = "artisan"?
3. Is artisan status = "APPROVED"?

If not approved → Show "Awaiting Approval" page
If not logged in → Redirect to artisan login
```

### Admin Routes:
```
Middleware checks:
1. Is user authenticated?
2. Is user role = "admin"?

Only admins can approve/reject artisans
```

---

## 📅 Implementation Order

1. **Database Schema** - Foundation
2. **Registration Form & API** - Capture artisan info
3. **Admin Dashboard** - Approve artisans
4. **Artisan Login** - Separate auth flow
5. **Artisan Dashboard Layout** - Shell for dashboard
6. **Shop Profile Management** - Customize shop
7. **Product Management** - CRUD for products
8. **Public Shop Page** - Display to customers
9. **Order Management** - View and update orders
10. **Analytics** - Sales overview
11. **Integration** - Connect everything

---

## ⏱️ Estimated Time: 10-14 days

---

## 🚀 Phase 1 (Week 1) - Core Foundation
- Database schema
- Registration form
- Admin approval system
- Artisan login

## 🚀 Phase 2 (Week 2) - Dashboard & Shop
- Artisan dashboard
- Product management
- Order management
- Public shop pages
- Analytics

---

*Generated: 2024* -->
