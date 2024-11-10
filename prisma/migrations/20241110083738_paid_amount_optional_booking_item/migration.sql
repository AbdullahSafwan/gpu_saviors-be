/*
  Warnings:

  - Added the required column `courier` to the `delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `delivery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `booking_item` ADD COLUMN `comments` VARCHAR(191) NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `paymentId` INTEGER NULL,
    ALTER COLUMN `status` DROP DEFAULT;

-- AlterTable
ALTER TABLE `booking_payment` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `contact_log` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `delivery` ADD COLUMN `courier` VARCHAR(191) NOT NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `postalCode` INTEGER NOT NULL,
    ADD COLUMN `type` ENUM('INBOUND', 'OUTBOUND') NOT NULL;

-- AlterTable
ALTER TABLE `refund` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `service` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `system_configuration` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE `booking_item` ADD CONSTRAINT `booking_item_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `booking_payment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
