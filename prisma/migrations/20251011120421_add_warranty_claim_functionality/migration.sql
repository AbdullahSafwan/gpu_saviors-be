-- AlterTable
ALTER TABLE `booking` ADD COLUMN `isWarrantyClaim` BOOLEAN NOT NULL DEFAULT false,
    ALTER COLUMN `clientType` DROP DEFAULT;

-- CreateTable
CREATE TABLE `warranty` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingItemId` INTEGER NOT NULL,
    `warrantyStartDate` DATETIME(3) NOT NULL,
    `warrantyEndDate` DATETIME(3) NOT NULL,
    `warrantyDays` INTEGER NOT NULL DEFAULT 15,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` INTEGER NOT NULL,
    `modifiedBy` INTEGER NOT NULL,

    UNIQUE INDEX `warranty_id_key`(`id`),
    UNIQUE INDEX `warranty_bookingItemId_key`(`bookingItemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `warranty_claim` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `originalBookingId` INTEGER NOT NULL,
    `claimBookingId` INTEGER NOT NULL,
    `claimNumber` VARCHAR(191) NOT NULL,
    `claimDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `remarks` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` INTEGER NOT NULL,
    `modifiedBy` INTEGER NOT NULL,

    UNIQUE INDEX `warranty_claim_id_key`(`id`),
    UNIQUE INDEX `warranty_claim_claimNumber_key`(`claimNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `warranty_claim_item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `warrantyClaimId` INTEGER NOT NULL,
    `warrantyId` INTEGER NOT NULL,
    `reportedIssue` VARCHAR(191) NOT NULL,
    `remarks` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `warranty_claim_item_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `warranty` ADD CONSTRAINT `warranty_bookingItemId_fkey` FOREIGN KEY (`bookingItemId`) REFERENCES `booking_item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `warranty` ADD CONSTRAINT `warranty_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `warranty` ADD CONSTRAINT `warranty_modifiedBy_fkey` FOREIGN KEY (`modifiedBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `warranty_claim` ADD CONSTRAINT `warranty_claim_originalBookingId_fkey` FOREIGN KEY (`originalBookingId`) REFERENCES `booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `warranty_claim` ADD CONSTRAINT `warranty_claim_claimBookingId_fkey` FOREIGN KEY (`claimBookingId`) REFERENCES `booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `warranty_claim` ADD CONSTRAINT `warranty_claim_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `warranty_claim` ADD CONSTRAINT `warranty_claim_modifiedBy_fkey` FOREIGN KEY (`modifiedBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `warranty_claim_item` ADD CONSTRAINT `warranty_claim_item_warrantyClaimId_fkey` FOREIGN KEY (`warrantyClaimId`) REFERENCES `warranty_claim`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `warranty_claim_item` ADD CONSTRAINT `warranty_claim_item_warrantyId_fkey` FOREIGN KEY (`warrantyId`) REFERENCES `warranty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
