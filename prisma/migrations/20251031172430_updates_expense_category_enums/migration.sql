/*
  Warnings:

  - The values [SUPPLIES,TRANSPORT] on the enum `expense_entry_category` will be removed. If these variants are still used in the database, this will fail.

*/
-- DropIndex
DROP INDEX `idx_booking_active` ON `booking`;

-- DropIndex
DROP INDEX `idx_booking_client_type` ON `booking`;

-- DropIndex
DROP INDEX `idx_booking_created_at` ON `booking`;

-- DropIndex
DROP INDEX `idx_booking_payment_status` ON `booking`;

-- DropIndex
DROP INDEX `idx_booking_phone` ON `booking`;

-- DropIndex
DROP INDEX `idx_booking_referral_source` ON `booking`;

-- DropIndex
DROP INDEX `idx_booking_status` ON `booking`;

-- DropIndex
DROP INDEX `idx_booking_item_active` ON `booking_item`;

-- DropIndex
DROP INDEX `idx_booking_item_status` ON `booking_item`;

-- DropIndex
DROP INDEX `idx_booking_item_type` ON `booking_item`;

-- DropIndex
DROP INDEX `idx_booking_payment_status` ON `booking_payment`;

-- DropIndex
DROP INDEX `idx_warranty_active` ON `warranty`;

-- DropIndex
DROP INDEX `idx_warranty_dates` ON `warranty`;

-- DropIndex
DROP INDEX `idx_warranty_claim_created` ON `warranty_claim`;

-- AlterTable
ALTER TABLE `expense_entry` MODIFY `category` ENUM('RENT', 'UTILITIES', 'SALARIES', 'EQUIPMENT', 'MAINTENANCE', 'MARKETING', 'SHIPMENT', 'FOOD', 'REFRESHMENTS', 'MISCELLANEOUS') NOT NULL;
