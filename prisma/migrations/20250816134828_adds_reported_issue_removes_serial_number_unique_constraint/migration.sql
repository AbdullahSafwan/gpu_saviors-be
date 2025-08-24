-- DropIndex
DROP INDEX `booking_item_serialNumber_key` ON `booking_item`;

-- AlterTable
ALTER TABLE `booking_item` ADD COLUMN `reportedIssue` VARCHAR(191) NULL;
