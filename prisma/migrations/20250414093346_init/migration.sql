-- CreateTable
CREATE TABLE "ArtListing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "woodType" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "images" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "userId" TEXT,
    "artListingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderRequest" ADD CONSTRAINT "OrderRequest_artListingId_fkey" FOREIGN KEY ("artListingId") REFERENCES "ArtListing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
