<!-- # Running ArtAfrik - Quick Start Guide

This guide provides step-by-step instructions to set up and run the ArtAfrik platform after cloning the repository.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Minimum Version | Required |
|------|-----------------|----------|
| **Node.js** | 18.x or higher | ✅ Yes |
| **npm** | 9.x or higher | ✅ Yes (comes with Node.js) |
| **PostgreSQL** | 14.x or higher | ✅ Yes |
| **Git** | 2.x or higher | ✅ Yes |

### Check Your Versions
```bash
node --version    # Should be 18.x or higher
npm --version     # Should be 9.x or higher
psql --version    # Should be 14.x or higher
git --version     # Should be 2.x or higher
```

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/arts-afrik.git
cd arts-afrik
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages including:
- Next.js 14
- Prisma ORM
- Stripe SDK
- Clerk Authentication
- Cloudinary for images
- And more...

### Step 3: Set Up Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit the file with your values
nano .env
```

#### Required Environment Variables

**Database Configuration:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/artafrik?schema=public"
```

**Clerk Authentication:**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**Cloudinary (Image Upload):**
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Stripe (International Payments):**
```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**M-Pesa (Kenya Mobile Money):**
```env
MPESA_ENVIRONMENT=sandbox
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_passkey
MPESA_SHORTCODE=522533
MPESA_ACCOUNT_NUMBER=7771828
```

**PesaPal (East Africa Payments):**
```env
PESAPAL_ENVIRONMENT=sandbox
PESAPAL_CONSUMER_KEY=your_consumer_key
PESAPAL_CONSUMER_SECRET=your_consumer_secret
```

**Application URL:**
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Set Up the Database

#### Option A: Local PostgreSQL
```bash
# Create database
createdb artafrik

# Or using psql
psql -U postgres
CREATE DATABASE artafrik;
\q
```

#### Option B: Using Docker
```bash
# Start PostgreSQL container
docker run --name artafrik-db \
  -e POSTGRES_DB=artafrik \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:14

# Stop/Start commands
docker stop artafrik-db
docker start artafrik-db
```

#### Option C: Cloud Database (Recommended for Production)
Use one of these services:
- **Supabase** (Free tier available)
- **Railway** (Easy setup)
- **Neon** (Serverless PostgreSQL)
- **Render** (Free tier available)

### Step 5: Run Database Migrations
```bash
npx prisma migrate dev --name init
```

This will:
- Create all database tables
- Apply schema changes
- Generate TypeScript types

### Step 6: Start the Development Server
```bash
npm run dev
```

### Step 7: Open in Browser
Navigate to: [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma database GUI |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma migrate dev` | Run migrations |

---

## 🔧 Configuration Details

### Database Setup

#### Local PostgreSQL Setup (Ubuntu/Debian)
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo service postgresql start

# Switch to postgres user
sudo -i -u postgres

# Create database and user
psql
CREATE DATABASE artafrik;
CREATE USER artafrik_user WITH PASSWORD 'your_password';
ALTER DATABASE artafrik OWNER TO artafrik_user;
\q
exit

# Update .env
DATABASE_URL="postgresql://artafrik_user:your_password@localhost:5432/artafrik?schema=public"
```

#### Local PostgreSQL Setup (macOS)
```bash
# Install via Homebrew
brew install postgresql@14
brew services start postgresql@14

# Create database
createdb artafrik

# Or using psql
psql postgres
CREATE DATABASE artafrik;
\q
```

#### Local PostgreSQL Setup (Windows)
1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer
3. Use pgAdmin or psql to create database
4. Update connection string in .env

### Clerk Authentication Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create new application
3. Copy publishable key and secret key
4. Configure redirect URLs:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
5. Enable providers (Email, Google, GitHub, etc.)

### Cloudinary Setup

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Copy cloud name, API key, and API secret
3. Configure upload preset:
   - Go to Settings → Upload
   - Add upload preset
   - Set signing mode to "Unsigned"
   - Note the preset name

### Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test)
2. Create account or sign in
3. Get test API keys from Developers → API keys
4. Use test mode keys for development
5. Test with card: `4242 4242 4242 4242`

### M-Pesa Setup (Daraja API)

1. Go to [Safaricom Developer Portal](https://developer.safaricom.co.ke)
2. Create account
3. Create app (Sandbox)
4. Get Consumer Key and Consumer Secret
5. Configure callback URL in your app
6. Use sandbox for testing

### PesaPal Setup

1. Go to [PesaPal Developer Portal](https://developer.pesapal.com)
2. Register as developer
3. Create application
4. Get Consumer Key and Consumer Secret
5. Use sandbox for testing

---

## 📁 Project Structure

```
arts-afrik/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── checkout/          # Checkout page
│   ├── dashboard/         # Admin dashboard
│   ├── gallery/           # Art gallery
│   └── ...
├── components/            # React components
├── contexts/              # React contexts
├── hooks/                 # Custom hooks
├── lib/                   # Utility functions
│   ├── auth.ts           # Clerk authentication
│   ├── prisma.ts         # Database client
│   ├── email-service.ts  # Email sending
│   └── ...
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── public/               # Static assets
└── styles/               # Global styles
```

---

## 🧪 Testing the Application

### Running Tests
```bash
# Run all tests
npm test

# Run specific test
npm test -- --testNamePattern="payment"

# Run with coverage
npm test -- --coverage
```

### Testing Payment Methods

#### Stripe (Test Cards)
```bash
# Use these test cards:
4242 4242 4242 4242  - Success
4000 0000 0000 9995  - Decline
4000 0000 0000 3220  - 3D Secure
```

#### M-Pesa (Sandbox)
```bash
# Phone number format: 254700000000
# Use test PIN: 1234
# Check simulator at: https://developer.safaricom.co.ke/simulator
```

#### PesaPal (Sandbox)
```bash
# Use test credentials from PesaPal dashboard
# Select "Test Mode" in checkout
```

---

## 🚨 Common Issues & Solutions

### Issue: `npm install` fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Database connection failed
**Solution:**
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Verify connection string format
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# Test connection
npx prisma db ping
```

### Issue: Clerk authentication not working
**Solution:**
```bash
# Check environment variables
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
echo $CLERK_SECRET_KEY

# Verify redirect URLs in Clerk dashboard
# Must include: http://localhost:3000
```

### Issue: Images not uploading
**Solution:**
```bash
# Verify Cloudinary credentials
# Check upload preset is set to "Unsigned"
# Ensure environment variables are correct
```

### Issue: Payment not processing
**Solution:**
```bash
# Check Stripe/M-Pesa/PesaPal keys are set
# Verify webhook endpoints if using live mode
# Check browser console for errors
```

### Issue: `next build` fails
**Solution:**
```bash
# Run linting to see errors
npm run lint

# Check TypeScript errors
npx tsc --noEmit

# Clear .next folder
rm -rf .next
npm run build
```

---

## 📦 Building for Production

### 1. Update Environment Variables
```env
# Use production keys
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 2. Build Application
```bash
npm run build
```

### 3. Start Production Server
```bash
npm run start
```

### 4. Use Process Manager (Recommended)
```bash
# Using PM2
npm install -g pm2
pm2 start npm --name "artafrik" -- run start
pm2 save
pm2 startup

# Using systemd (Linux)
sudo systemctl enable artafrik
sudo systemctl start artafrik
```

---

## 🐳 Docker Deployment

### 1. Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
```

### 2. Create docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/artafrik
      - NODE_ENV=production
    depends_on:
      - db
    restart: always

  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=artafrik
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

volumes:
  postgres_data:
```

### 3. Run Docker
```bash
docker-compose up -d
```

---

## 📊 Database Management

### View Database GUI
```bash
npx prisma studio
```
Opens at: http://localhost:5555

### Reset Database
```bash
# WARNING: This deletes all data
npx prisma migrate reset
```

### Generate Migration
```bash
npx prisma migrate dev --name describe_changes
```

### Seed Database
```bash
# If you have a seed file
npx prisma db seed
```

---

## 🔒 Security Checklist

- [ ] Use strong, unique passwords
- [ ] Never commit `.env` files
- [ ] Use environment variables for all secrets
- [ ] Enable 2FA on all accounts
- [ ] Use HTTPS in production
- [ ] Regularly update dependencies
- [ ] Set up webhook signature verification
- [ ] Implement rate limiting
- [ ] Enable CORS restrictions

---

## 📚 Useful Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Clerk Docs](https://clerk.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [M-Pesa Docs](https://developer.safaricom.co.ke/docs)
- [PesaPal Docs](https://developer.pesapal.com)

### Community
- [GitHub Issues](https://github.com/your-username/arts-afrik/issues)
- [Discord Server](https://discord.gg/artafrik)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/artafrik)

---

## 📞 Getting Help

If you encounter issues:

1. Check this documentation
2. Search existing [GitHub Issues](https://github.com/your-username/arts-afrik/issues)
3. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version, etc.)
   - Screenshots if applicable

---

## ✅ Quick Verification Checklist

After setup, verify everything works:

- [ ] `npm run dev` starts without errors
- [ ] Homepage loads at http://localhost:3000
- [ ] Clerk sign-up/sign-in works
- [ ] Can browse art gallery
- [ ] Can add items to cart
- [ ] Checkout page loads
- [ ] Payment flow works (test mode)

---

**Happy Coding! 🎨**
 -->
