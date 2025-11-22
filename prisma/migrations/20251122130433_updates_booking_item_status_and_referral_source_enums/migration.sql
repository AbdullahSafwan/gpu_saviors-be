/*
  Warnings:

  - The values [SOCIAL_MEDIA] on the enum `booking_referralSource` will be removed. If these variants are still used in the database, this will fail.

*/

-- AlterTable add fb, wa, insta, website to referralSource enum
ALTER TABLE `booking` MODIFY `referralSource` ENUM('SOCIAL_MEDIA', 'FACEBOOK', 'WHATSAPP', 'INSTAGRAM', 'WEBSITE', 'GOOGLE_SEARCH', 'FRIEND_REFERRAL', 'BUSINESS_REFERRAL', 'EXISTING_CUSTOMER', 'ONLINE_REVIEW', 'FORUM_COMMUNITY', 'OTHER') NULL;
-- update old booking referral sources from SOCIAL_MEDIA to FACEBOOK
UPDATE `booking` SET `referralSource` = 'FACEBOOK' WHERE `referralSource` = 'SOCIAL_MEDIA';
-- AlterTable remove SOCIAL_MEDIA from referralSource enum
ALTER TABLE `booking` MODIFY `referralSource` ENUM('FACEBOOK', 'WHATSAPP', 'INSTAGRAM', 'WEBSITE', 'GOOGLE_SEARCH', 'FRIEND_REFERRAL', 'BUSINESS_REFERRAL', 'EXISTING_CUSTOMER', 'ONLINE_REVIEW', 'FORUM_COMMUNITY', 'OTHER') NULL;

-- AlterTable
ALTER TABLE `booking_item` MODIFY `status` ENUM('DRAFT', 'PENDING', 'IN_PROGRESS', 'REPAIRED', 'NOT_REPAIRED', 'NO_ISSUE') NOT NULL DEFAULT 'DRAFT';
