/*
  Warnings:

  - You are about to drop the column `paymentId` on the `refund` table. All the data in the column will be lost.
  - Added the required column `bookingId` to the `refund` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `refund` DROP FOREIGN KEY `refund_paymentId_fkey`;

-- DropIndex
DROP INDEX `refund_paymentId_fkey` ON `refund`;

-- AlterTable
ALTER TABLE `booking` ADD COLUMN `hasRefunds` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `totalRefunded` INTEGER NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `booking_item` ADD COLUMN `refundedAmount` INTEGER NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `refund` DROP COLUMN `paymentId`,
    ADD COLUMN `bookingId` INTEGER NOT NULL,
    ADD COLUMN `warrantyClaimId` INTEGER NULL;

-- CreateTable
CREATE TABLE `refund_item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `refundId` INTEGER NOT NULL,
    `bookingItemId` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `remarks` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `refund_item_id_key`(`id`),
    UNIQUE INDEX `refund_item_bookingItemId_key`(`bookingItemId`),
    INDEX `refund_item_refundId_idx`(`refundId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `refund` ADD CONSTRAINT `refund_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refund` ADD CONSTRAINT `refund_warrantyClaimId_fkey` FOREIGN KEY (`warrantyClaimId`) REFERENCES `warranty_claim`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refund_item` ADD CONSTRAINT `refund_item_refundId_fkey` FOREIGN KEY (`refundId`) REFERENCES `refund`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refund_item` ADD CONSTRAINT `refund_item_bookingItemId_fkey` FOREIGN KEY (`bookingItemId`) REFERENCES `booking_item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
