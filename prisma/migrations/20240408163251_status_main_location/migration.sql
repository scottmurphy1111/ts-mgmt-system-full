-- AlterTable
ALTER TABLE `Producer` ADD COLUMN `status` ENUM('PENDING', 'ENROLLED', 'ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `TsLocation` MODIFY `main` BOOLEAN NOT NULL DEFAULT false;
