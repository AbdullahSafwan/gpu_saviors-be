/*
  Warnings:

  - The values [CONTACTED] on the enum `booking_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `booking` MODIFY `status` ENUM('DRAFT', 'PENDING', 'IN_REVIEW', 'CONFIRMED', 'PENDING_DELIVERY', 'IN_QUEUE', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT';
