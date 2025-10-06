/*
  Warnings:

  - The values [BT] on the enum `booking_payment_paymentMethod` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `booking_payment` MODIFY `paymentMethod` ENUM('CASH', 'WALLET', 'BANK_TRANSFER') NOT NULL;
