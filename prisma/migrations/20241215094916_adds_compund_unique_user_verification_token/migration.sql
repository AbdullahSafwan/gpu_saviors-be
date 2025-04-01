/*
  Warnings:

  - A unique constraint covering the columns `[userId,type]` on the table `user_verification_token` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `user_verification_token_userId_type_key` ON `user_verification_token`(`userId`, `type`);
