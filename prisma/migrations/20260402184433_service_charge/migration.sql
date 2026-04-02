-- CreateTable
CREATE TABLE `service_charge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productName` VARCHAR(191) NOT NULL,
    `type` ENUM('REPAIR', 'MAINTENANCE', 'REBALL', 'OTHER') NOT NULL,
    `amount` INTEGER NOT NULL,
    `description` VARCHAR(191) NULL,
    `effectiveFrom` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` INTEGER NOT NULL,
    `modifiedBy` INTEGER NOT NULL,

    UNIQUE INDEX `service_charge_id_key`(`id`),
    INDEX `service_charge_type_isActive_idx`(`type`, `isActive`),
    UNIQUE INDEX `service_charge_productName_type_effectiveFrom_key`(`productName`, `type`, `effectiveFrom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `service_charge` ADD CONSTRAINT `service_charge_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_charge` ADD CONSTRAINT `service_charge_modifiedBy_fkey` FOREIGN KEY (`modifiedBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
