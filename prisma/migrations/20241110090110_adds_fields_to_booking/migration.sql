/*
  Warnings:

  - Added the required column `clientName` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whatsppNumber` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` ADD COLUMN `appointmentDate` DATETIME(3) NULL,
    ADD COLUMN `clientName` VARCHAR(191) NOT NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `whatsppNumber` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `booking_item` ADD COLUMN `isRepaired` BOOLEAN NOT NULL DEFAULT false;
