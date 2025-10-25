-- AlterTable
ALTER TABLE `system_configuration` ADD COLUMN `description` VARCHAR(191) NULL,
    MODIFY `value` TEXT NOT NULL;
