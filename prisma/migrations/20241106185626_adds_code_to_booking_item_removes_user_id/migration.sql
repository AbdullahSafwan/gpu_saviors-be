/*
  Warnings:

  - You are about to drop the column `userId` on the `booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `booking` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `booking_userId_fkey`;

-- AlterTable
ALTER TABLE `booking` DROP COLUMN `userId`,
    ADD COLUMN `code` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `booking_code_key` ON `booking`(`code`);
