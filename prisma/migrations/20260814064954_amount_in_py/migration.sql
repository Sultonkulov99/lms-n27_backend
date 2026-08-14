/*
  Warnings:

  - Added the required column `amount` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payments" ADD COLUMN     "amount" BIGINT NOT NULL;
