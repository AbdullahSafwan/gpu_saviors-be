/*
  Warnings:

  - You are about to alter the column `address` on the `delivery` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(5))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `delivery` MODIFY `address` VARCHAR(191) NOT NULL;
