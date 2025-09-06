/*
  Warnings:

  - Added the required column `createdBy` to the `refund` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modifiedBy` to the `refund` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` ADD COLUMN `createdBy` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `modifiedBy` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `booking_item` ADD COLUMN `createdBy` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `modifiedBy` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `booking_payment` ADD COLUMN `createdBy` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `modifiedBy` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `delivery` ADD COLUMN `createdBy` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `modifiedBy` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `refund` ADD COLUMN `createdBy` INTEGER NOT NULL,
    ADD COLUMN `modifiedBy` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `service` ADD COLUMN `createdBy` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `modifiedBy` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_modifiedBy_fkey` FOREIGN KEY (`modifiedBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_item` ADD CONSTRAINT `booking_item_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_item` ADD CONSTRAINT `booking_item_modifiedBy_fkey` FOREIGN KEY (`modifiedBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `delivery` ADD CONSTRAINT `delivery_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `delivery` ADD CONSTRAINT `delivery_modifiedBy_fkey` FOREIGN KEY (`modifiedBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service` ADD CONSTRAINT `service_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service` ADD CONSTRAINT `service_modifiedBy_fkey` FOREIGN KEY (`modifiedBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_payment` ADD CONSTRAINT `booking_payment_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_payment` ADD CONSTRAINT `booking_payment_modifiedBy_fkey` FOREIGN KEY (`modifiedBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refund` ADD CONSTRAINT `refund_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refund` ADD CONSTRAINT `refund_modifiedBy_fkey` FOREIGN KEY (`modifiedBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
