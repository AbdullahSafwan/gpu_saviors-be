-- AlterTable
ALTER TABLE `booking` ADD COLUMN `clientId` INTEGER NULL;

-- CreateTable
CREATE TABLE `client` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `businessName` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `contactPersonName` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `whatsappNumber` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `businessAddress` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `postalCode` VARCHAR(191) NULL,
    `paymentTermsDays` INTEGER NOT NULL DEFAULT 30,
    `creditLimit` INTEGER NULL,
    `status` ENUM('ACTIVE', 'SUSPENDED', 'CREDIT_HOLD', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `totalPayable` INTEGER NOT NULL DEFAULT 0,
    `totalPaid` INTEGER NOT NULL DEFAULT 0,
    `outstandingBalance` INTEGER NOT NULL DEFAULT 0,
    `locationId` INTEGER NOT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdBy` INTEGER NOT NULL,
    `modifiedBy` INTEGER NOT NULL,

    UNIQUE INDEX `client_id_key`(`id`),
    UNIQUE INDEX `client_code_key`(`code`),
    INDEX `client_businessName_phoneNumber_status_isActive_idx`(`businessName`, `phoneNumber`, `status`, `isActive`),
    INDEX `client_locationId_status_idx`(`locationId`, `status`),
    INDEX `client_code_idx`(`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `booking_clientId_status_isActive_idx` ON `booking`(`clientId`, `status`, `isActive`);

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `client` ADD CONSTRAINT `client_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `client` ADD CONSTRAINT `client_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `client` ADD CONSTRAINT `client_modifiedBy_fkey` FOREIGN KEY (`modifiedBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
