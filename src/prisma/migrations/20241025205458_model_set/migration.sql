-- AlterTable
ALTER TABLE `user` ADD COLUMN `modifiedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `booking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('DRAFT', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'CONTACTED') NOT NULL,
    `payableAmount` INTEGER NULL,
    `paidAmount` INTEGER NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `booking_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking_item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('GPU_REPAIR', 'GPU_SERVICE') NOT NULL,
    `payableAmount` INTEGER NOT NULL,
    `paidAmount` INTEGER NOT NULL,
    `status` ENUM('DRAFT', 'IN_REVIEW', 'IN_QUEUE', 'IN_PROGRESS', 'COMPLETED', 'IN_RESOLUTION') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `bookingId` INTEGER NOT NULL,

    UNIQUE INDEX `booking_item_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `delivery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'IN_TRANSIT_INBOUND', 'IN_TRANSIT_OUTBOUND', 'IN_WAREHOUSE', 'DELIVERED', 'PENDING_INBOUND', 'PENDING_OUTBOUND') NOT NULL,
    `address` ENUM('DRAFT', 'IN_REVIEW', 'IN_QUEUE', 'IN_PROGRESS', 'COMPLETED', 'IN_RESOLUTION') NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `landmark` INTEGER NULL,
    `secondaryPhoneNumber` VARCHAR(191) NULL,
    `deliveryDate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `delivery_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingItemId` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'IN_REPAIR', 'IN_QA', 'QA_PASSED', 'QA_FAILED') NOT NULL,
    `remarks` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `service_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingItemId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `bookingId` INTEGER NOT NULL,
    `contactedAt` DATETIME(3) NOT NULL,
    `status` ENUM('SMS', 'CALL', 'EMAIL') NOT NULL,
    `notes` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `contact_log_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking_payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` INTEGER NOT NULL,
    `status` ENUM('ENABLED', 'DISABLED') NOT NULL,
    `payableAmount` INTEGER NULL,
    `paidAmount` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `paymentMethod` ENUM('CASH', 'WALLET', 'BT') NOT NULL,
    `recipientName` VARCHAR(191) NOT NULL,
    `transactionId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `booking_payment_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refund` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paymentId` INTEGER NOT NULL,
    `refundDate` DATETIME(3) NOT NULL,
    `remarks` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `amount` INTEGER NOT NULL,

    UNIQUE INDEX `refund_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_item` ADD CONSTRAINT `booking_item_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `delivery` ADD CONSTRAINT `delivery_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service` ADD CONSTRAINT `service_bookingItemId_fkey` FOREIGN KEY (`bookingItemId`) REFERENCES `booking_item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contact_log` ADD CONSTRAINT `contact_log_bookingItemId_fkey` FOREIGN KEY (`bookingItemId`) REFERENCES `booking_item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contact_log` ADD CONSTRAINT `contact_log_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contact_log` ADD CONSTRAINT `contact_log_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_payment` ADD CONSTRAINT `booking_payment_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refund` ADD CONSTRAINT `refund_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `booking_payment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
