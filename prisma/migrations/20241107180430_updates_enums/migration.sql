/*
  Warnings:

  - The values [GPU_REPAIR,GPU_SERVICE] on the enum `booking_item_type` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[code]` on the table `booking_item` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `booking_item` ADD COLUMN `code` VARCHAR(191) NULL,
    MODIFY `type` ENUM('GPU', 'MOBO', 'LAPTOP') NOT NULL,
    MODIFY `status` ENUM('DRAFT', 'IN_REVIEW', 'IN_QUEUE', 'IN_PROGRESS', 'COMPLETED', 'IN_RESOLUTION') NOT NULL DEFAULT 'DRAFT';

-- CreateIndex
CREATE UNIQUE INDEX `booking_item_code_key` ON `booking_item`(`code`);
