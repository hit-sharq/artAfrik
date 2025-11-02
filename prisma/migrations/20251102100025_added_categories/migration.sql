/*
  Warnings:

  - You are about to drop the column `woodType` on the `ArtListing` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `ArtListing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ArtListing" DROP COLUMN "woodType",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "material" TEXT;

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- AddForeignKey
ALTER TABLE "ArtListing" ADD CONSTRAINT "ArtListing_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
