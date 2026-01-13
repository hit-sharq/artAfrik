-- CreateEnum
CREATE TYPE "ArtisanStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "ArtListing" ADD COLUMN     "artisanId" TEXT;

-- CreateTable
CREATE TABLE "Artisan" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "clerkId" TEXT,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "specialty" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "location" TEXT,
    "yearsExperience" INTEGER,
    "shopName" TEXT,
    "shopSlug" TEXT,
    "shopBio" TEXT,
    "shopLogo" TEXT,
    "shopBanner" TEXT,
    "website" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "whatsapp" TEXT,
    "status" "ArtisanStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artisan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Artisan_email_key" ON "Artisan"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Artisan_clerkId_key" ON "Artisan"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Artisan_shopName_key" ON "Artisan"("shopName");

-- CreateIndex
CREATE UNIQUE INDEX "Artisan_shopSlug_key" ON "Artisan"("shopSlug");

-- AddForeignKey
ALTER TABLE "ArtListing" ADD CONSTRAINT "ArtListing_artisanId_fkey" FOREIGN KEY ("artisanId") REFERENCES "Artisan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
