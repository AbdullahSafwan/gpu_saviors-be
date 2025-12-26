/*
  Warnings:

  - The values [IN_WAREHOUSE] on the enum `delivery_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `delivery` MODIFY `status` ENUM('PENDING', 'IN_TRANSIT_INBOUND', 'IN_TRANSIT_OUTBOUND', 'CANCELLED', 'DELIVERED', 'PENDING_INBOUND', 'PENDING_OUTBOUND') NOT NULL;
