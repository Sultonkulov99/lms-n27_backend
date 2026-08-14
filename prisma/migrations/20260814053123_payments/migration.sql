/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Payments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payments" DROP CONSTRAINT "Payments_categoryId_fkey";

-- AlterTable
ALTER TABLE "Payments" DROP COLUMN "categoryId";
