/*
  Warnings:

  - Made the column `role` on table `LocationContact` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `LocationContact` MODIFY `role` VARCHAR(191) NOT NULL;
