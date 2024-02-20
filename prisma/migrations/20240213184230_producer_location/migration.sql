/*
  Warnings:

  - You are about to drop the column `locationId` on the `PortalUser` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `producerLocationId` to the `PortalUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `producerLocationId` to the `Program` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `PortalUser_locationId_idx` ON `PortalUser`;

-- DropIndex
DROP INDEX `Program_locationId_idx` ON `Program`;

-- AlterTable
ALTER TABLE `PortalUser` DROP COLUMN `locationId`,
    ADD COLUMN `producerLocationId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Program` DROP COLUMN `locationId`,
    ADD COLUMN `producerLocationId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Location`;

-- CreateTable
CREATE TABLE `ProducerLocation` (
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
    `producerGroupId` VARCHAR(191) NULL,
    `main` BOOLEAN NOT NULL DEFAULT true,

    INDEX `ProducerLocation_producerGroupId_idx`(`producerGroupId`),
    INDEX `ProducerLocation_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Note` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `note` VARCHAR(191) NOT NULL,
    `producerLocationId` VARCHAR(191) NOT NULL,

    INDEX `Note_producerLocationId_idx`(`producerLocationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `PortalUser_producerLocationId_idx` ON `PortalUser`(`producerLocationId`);

-- CreateIndex
CREATE INDEX `Program_producerLocationId_idx` ON `Program`(`producerLocationId`);
