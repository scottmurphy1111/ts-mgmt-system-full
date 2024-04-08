/*
  Warnings:

  - You are about to drop the `Markup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PortalUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProducerGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProducerLocation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProducerProgram` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Markup`;

-- DropTable
DROP TABLE `Note`;

-- DropTable
DROP TABLE `PortalUser`;

-- DropTable
DROP TABLE `ProducerGroup`;

-- DropTable
DROP TABLE `ProducerLocation`;

-- DropTable
DROP TABLE `ProducerProgram`;

-- CreateTable
CREATE TABLE `Producer` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `dba` VARCHAR(191) NULL,
    `taxId` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `type` VARCHAR(191) NOT NULL,
    `primaryContactName` VARCHAR(191) NOT NULL,
    `primaryContactPhone` VARCHAR(191) NOT NULL,
    `primaryContactEmail` VARCHAR(191) NOT NULL,
    `primaryContactTitle` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Location` (
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

    INDEX `Location_producerId_idx`(`producerId`),
    INDEX `Location_name_idx`(`name`),
    INDEX `Location_tsSalesRepId_idx`(`tsSalesRepId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LocationProgram` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `locationId` VARCHAR(191) NOT NULL,

    INDEX `LocationProgram_locationId_idx`(`locationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LocationMarkup` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `termValue` VARCHAR(191) NOT NULL,
    `markupValue` VARCHAR(191) NOT NULL,
    `locationProgramId` VARCHAR(191) NOT NULL,

    INDEX `LocationMarkup_locationProgramId_idx`(`locationProgramId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LocationNote` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `note` VARCHAR(191) NOT NULL,
    `locationId` VARCHAR(191) NOT NULL,

    INDEX `LocationNote_locationId_idx`(`locationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LocationContact` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `role` VARCHAR(191) NULL,
    `locationId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `LocationContact_email_key`(`email`),
    INDEX `LocationContact_locationId_idx`(`locationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
