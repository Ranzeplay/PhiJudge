/*
  Warnings:

  - The values [PASSED,FAILED] on the enum `RecordTestPointStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `actualOutput` on the `record` table. All the data in the column will be lost.
  - You are about to drop the column `memoryLimitBytes` on the `recordTestPoint` table. All the data in the column will be lost.
  - You are about to drop the column `timeLimitMs` on the `recordTestPoint` table. All the data in the column will be lost.
  - Added the required column `actualPeakMemoryBytes` to the `recordTestPoint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualTimeMs` to the `recordTestPoint` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CompilationStatus" AS ENUM ('PENDING', 'PASSED_WITHOUT_WARNINGS', 'PASSED_WITH_WARNINGS', 'FAILED_WITH_ERRORS', 'UNKNOWN');

-- AlterEnum
BEGIN;
CREATE TYPE "RecordTestPointStatus_new" AS ENUM ('Accepted', 'WrongAnswer', 'TimeLimitExceeded', 'MemoryLimitExceeded', 'OutputLimitExceeded', 'RuntimeError', 'Unknown');
ALTER TABLE "recordTestPoint" ALTER COLUMN "status" TYPE "RecordTestPointStatus_new" USING ("status"::text::"RecordTestPointStatus_new");
ALTER TYPE "RecordTestPointStatus" RENAME TO "RecordTestPointStatus_old";
ALTER TYPE "RecordTestPointStatus_new" RENAME TO "RecordTestPointStatus";
DROP TYPE "RecordTestPointStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "agent" ADD COLUMN     "availableLanguageId" TEXT[],
ALTER COLUMN "status" SET DEFAULT 'DISCONNECTED',
ALTER COLUMN "lastHeartbeat" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "lastNetworkAddress" SET DEFAULT 'Unknown';

-- AlterTable
ALTER TABLE "record" DROP COLUMN "actualOutput",
ADD COLUMN     "compilationOutput" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "compilationResult" "CompilationStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "recordTestPoint" DROP COLUMN "memoryLimitBytes",
DROP COLUMN "timeLimitMs",
ADD COLUMN     "actualPeakMemoryBytes" INTEGER NOT NULL,
ADD COLUMN     "actualTimeMs" INTEGER NOT NULL;
