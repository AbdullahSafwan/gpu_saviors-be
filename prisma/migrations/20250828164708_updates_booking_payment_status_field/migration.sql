/*
  Warnings:

  - The values [ENABLED,DISABLED] on the enum `booking_payment_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `booking_payment` MODIFY `status` ENUM('PENDING', 'PAID') NOT NULL;
