/*
  Warnings:

  - Added the required column `primaryAddress` to the `ProducerGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryCity` to the `ProducerGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryContactEmail` to the `ProducerGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryContactName` to the `ProducerGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryContactPhone` to the `ProducerGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryState` to the `ProducerGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryZip` to the `ProducerGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ProducerGroup` ADD COLUMN `mailingAddress` VARCHAR(191) NULL,
    ADD COLUMN `mailingCity` VARCHAR(191) NULL,
    ADD COLUMN `mailingCountry` VARCHAR(191) NULL DEFAULT 'USA',
    ADD COLUMN `mailingState` VARCHAR(191) NULL,
    ADD COLUMN `mailingZip` VARCHAR(191) NULL,
    ADD COLUMN `primaryAddress` VARCHAR(191) NOT NULL,
    ADD COLUMN `primaryCity` VARCHAR(191) NOT NULL,
    ADD COLUMN `primaryContactEmail` VARCHAR(191) NOT NULL,
    ADD COLUMN `primaryContactName` VARCHAR(191) NOT NULL,
    ADD COLUMN `primaryContactPhone` VARCHAR(191) NOT NULL,
    ADD COLUMN `primaryContactTitle` VARCHAR(191) NULL,
    ADD COLUMN `primaryCountry` VARCHAR(191) NOT NULL DEFAULT 'USA',
    ADD COLUMN `primaryState` VARCHAR(191) NOT NULL,
    ADD COLUMN `primaryZip` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `PortalUser` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `locationId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PortalUser_email_key`(`email`),
    INDEX `PortalUser_locationId_idx`(`locationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
