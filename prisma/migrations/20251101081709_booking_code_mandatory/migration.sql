/*
  Warnings:

  - Made the column `code` on table `booking` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `booking` MODIFY `code` VARCHAR(191) NOT NULL;
