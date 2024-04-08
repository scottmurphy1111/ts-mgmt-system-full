/*
  Warnings:

  - Added the required column `tsSalesRepId` to the `Producer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Producer` ADD COLUMN `tsSalesRepId` VARCHAR(191) NOT NULL;
