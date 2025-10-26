/*
  Warnings:

  - You are about to drop the column `isRepaired` on the `booking_item` table. All the data in the column will be lost.
  - The values [IN_REVIEW,IN_QUEUE,COMPLETED,IN_RESOLUTION] on the enum `booking_item_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `booking_item` DROP COLUMN `isRepaired`,
    MODIFY `status` ENUM('DRAFT', 'PENDING', 'IN_PROGRESS', 'REPAIRED', 'NOT_REPAIRED') NOT NULL DEFAULT 'DRAFT';
