/*
  Warnings:

  - A unique constraint covering the columns `[serialNumber]` on the table `booking_item` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `booking_item` ADD COLUMN `serialNumber` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `booking_item_serialNumber_key` ON `booking_item`(`serialNumber`);
