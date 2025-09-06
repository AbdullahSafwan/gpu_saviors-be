-- AlterTable
ALTER TABLE `booking` ALTER COLUMN `createdBy` DROP DEFAULT,
    ALTER COLUMN `modifiedBy` DROP DEFAULT;

-- AlterTable
ALTER TABLE `booking_item` ALTER COLUMN `createdBy` DROP DEFAULT,
    ALTER COLUMN `modifiedBy` DROP DEFAULT;

-- AlterTable
ALTER TABLE `booking_payment` ALTER COLUMN `createdBy` DROP DEFAULT,
    ALTER COLUMN `modifiedBy` DROP DEFAULT;

-- AlterTable
ALTER TABLE `delivery` ALTER COLUMN `createdBy` DROP DEFAULT,
    ALTER COLUMN `modifiedBy` DROP DEFAULT;

-- AlterTable
ALTER TABLE `service` ALTER COLUMN `createdBy` DROP DEFAULT,
    ALTER COLUMN `modifiedBy` DROP DEFAULT;
