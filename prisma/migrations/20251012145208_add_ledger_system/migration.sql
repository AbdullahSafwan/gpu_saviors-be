-- CreateTable
CREATE TABLE `location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `postalCode` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `managerName` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` INTEGER NOT NULL,
    `modifiedBy` INTEGER NOT NULL,

    UNIQUE INDEX `location_id_key`(`id`),
    UNIQUE INDEX `location_code_key`(`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ledger_entry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entryDate` DATETIME(3) NOT NULL,
    `locationId` INTEGER NOT NULL,
    `category` ENUM('RENT', 'UTILITIES', 'SALARIES', 'EQUIPMENT', 'SUPPLIES', 'MAINTENANCE', 'MARKETING', 'TRANSPORT', 'MISCELLANEOUS') NOT NULL,
    `amount` DOUBLE NOT NULL,
    `paymentMethod` ENUM('CASH', 'BANK_TRANSFER', 'WALLET', 'CHEQUE', 'CREDIT_CARD', 'DEBIT_CARD') NOT NULL DEFAULT 'CASH',
    `description` VARCHAR(191) NOT NULL,
    `remarks` VARCHAR(191) NULL,
    `receiptNumber` VARCHAR(191) NULL,
    `receiptAttachment` VARCHAR(191) NULL,
    `vendorName` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` INTEGER NOT NULL,
    `modifiedBy` INTEGER NOT NULL,

    UNIQUE INDEX `ledger_entry_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `location` ADD CONSTRAINT `location_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `location` ADD CONSTRAINT `location_modifiedBy_fkey` FOREIGN KEY (`modifiedBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ledger_entry` ADD CONSTRAINT `ledger_entry_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ledger_entry` ADD CONSTRAINT `ledger_entry_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ledger_entry` ADD CONSTRAINT `ledger_entry_modifiedBy_fkey` FOREIGN KEY (`modifiedBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
