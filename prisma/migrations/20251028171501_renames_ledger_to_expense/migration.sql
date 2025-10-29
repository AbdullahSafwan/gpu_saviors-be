/*
  Warnings:

  - You are about to drop the `ledger_entry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ledger_entry` DROP FOREIGN KEY `ledger_entry_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `ledger_entry` DROP FOREIGN KEY `ledger_entry_locationId_fkey`;

-- DropForeignKey
ALTER TABLE `ledger_entry` DROP FOREIGN KEY `ledger_entry_modifiedBy_fkey`;

-- DropTable
DROP TABLE `ledger_entry`;

-- CreateTable
CREATE TABLE `expense_entry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entryDate` DATETIME(3) NOT NULL,
    `locationId` INTEGER NOT NULL,
    `category` ENUM('RENT', 'UTILITIES', 'SALARIES', 'EQUIPMENT', 'SUPPLIES', 'MAINTENANCE', 'MARKETING', 'TRANSPORT', 'MISCELLANEOUS') NOT NULL,
    `amount` INTEGER NOT NULL,
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

    UNIQUE INDEX `expense_entry_id_key`(`id`),
    INDEX `expense_entry_entryDate_category_isActive_idx`(`entryDate`, `category`, `isActive`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `expense_entry` ADD CONSTRAINT `expense_entry_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expense_entry` ADD CONSTRAINT `expense_entry_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expense_entry` ADD CONSTRAINT `expense_entry_modifiedBy_fkey` FOREIGN KEY (`modifiedBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
