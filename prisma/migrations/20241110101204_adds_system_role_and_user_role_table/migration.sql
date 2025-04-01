-- CreateTable
CREATE TABLE `system_role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL,

    UNIQUE INDEX `system_role_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `roleId` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL,

    UNIQUE INDEX `user_role_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_role` ADD CONSTRAINT `user_role_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_role` ADD CONSTRAINT `user_role_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `system_role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
