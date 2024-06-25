/*
  Warnings:

  - The values [RUNNING] on the enum `RecordStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RecordStatus_new" AS ENUM ('PENDING', 'COMPILING', 'TESTING', 'PASSED', 'FAILED', 'ERROR', 'UNKNOWN');
ALTER TABLE "record" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "record" ALTER COLUMN "status" TYPE "RecordStatus_new" USING ("status"::text::"RecordStatus_new");
ALTER TYPE "RecordStatus" RENAME TO "RecordStatus_old";
ALTER TYPE "RecordStatus_new" RENAME TO "RecordStatus";
DROP TYPE "RecordStatus_old";
ALTER TABLE "record" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
