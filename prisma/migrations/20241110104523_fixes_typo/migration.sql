/*
  Warnings:

  - You are about to drop the column `whatsppNumber` on the `booking` table. All the data in the column will be lost.
  - Added the required column `whatsappNumber` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` DROP COLUMN `whatsppNumber`,
    ADD COLUMN `whatsappNumber` VARCHAR(191) NOT NULL;
