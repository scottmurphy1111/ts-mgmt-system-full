/*
  Warnings:

  - You are about to drop the column `programId` on the `Markup` table. All the data in the column will be lost.
  - You are about to drop the column `mailingAddress` on the `ProducerGroup` table. All the data in the column will be lost.
  - You are about to drop the column `mailingCity` on the `ProducerGroup` table. All the data in the column will be lost.
  - You are about to drop the column `mailingCountry` on the `ProducerGroup` table. All the data in the column will be lost.
  - You are about to drop the column `mailingState` on the `ProducerGroup` table. All the data in the column will be lost.
  - You are about to drop the column `mailingZip` on the `ProducerGroup` table. All the data in the column will be lost.
  - You are about to drop the column `primaryAddress` on the `ProducerGroup` table. All the data in the column will be lost.
  - You are about to drop the column `primaryCity` on the `ProducerGroup` table. All the data in the column will be lost.
  - You are about to drop the column `primaryCountry` on the `ProducerGroup` table. All the data in the column will be lost.
  - You are about to drop the column `primaryState` on the `ProducerGroup` table. All the data in the column will be lost.
  - You are about to drop the column `primaryZip` on the `ProducerGroup` table. All the data in the column will be lost.
  - You are about to drop the `Program` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `producerProgramId` to the `Markup` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Markup_programId_idx` ON `Markup`;

-- AlterTable
ALTER TABLE `Markup` DROP COLUMN `programId`,
    ADD COLUMN `producerProgramId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ProducerGroup` DROP COLUMN `mailingAddress`,
    DROP COLUMN `mailingCity`,
    DROP COLUMN `mailingCountry`,
    DROP COLUMN `mailingState`,
    DROP COLUMN `mailingZip`,
    DROP COLUMN `primaryAddress`,
    DROP COLUMN `primaryCity`,
    DROP COLUMN `primaryCountry`,
    DROP COLUMN `primaryState`,
    DROP COLUMN `primaryZip`;

-- AlterTable
ALTER TABLE `ProducerLocation` ADD COLUMN `mailingAddress` VARCHAR(191) NULL,
    ADD COLUMN `mailingCity` VARCHAR(191) NULL,
    ADD COLUMN `mailingCountry` VARCHAR(191) NULL DEFAULT 'USA',
    ADD COLUMN `mailingState` VARCHAR(191) NULL,
    ADD COLUMN `mailingZip` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Program`;

-- CreateTable
CREATE TABLE `ProducerProgram` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `producerLocationId` VARCHAR(191) NOT NULL,

    INDEX `ProducerProgram_producerLocationId_idx`(`producerLocationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Markup_producerProgramId_idx` ON `Markup`(`producerProgramId`);
