/*
  Warnings:

  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Location`;

-- CreateTable
CREATE TABLE `TsLocation` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `website` VARCHAR(191) NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `zip` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL DEFAULT 'USA',
    `mailingAddress` VARCHAR(191) NULL,
    `mailingCity` VARCHAR(191) NULL,
    `mailingState` VARCHAR(191) NULL,
    `mailingZip` VARCHAR(191) NULL,
    `mailingCountry` VARCHAR(191) NULL DEFAULT 'USA',
    `tsSalesRepId` VARCHAR(191) NOT NULL,
    `producerId` VARCHAR(191) NULL,
    `main` BOOLEAN NOT NULL DEFAULT true,

    INDEX `TsLocation_producerId_idx`(`producerId`),
    INDEX `TsLocation_name_idx`(`name`),
    INDEX `TsLocation_tsSalesRepId_idx`(`tsSalesRepId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
