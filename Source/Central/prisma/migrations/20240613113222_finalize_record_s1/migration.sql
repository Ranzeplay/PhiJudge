/*
  Warnings:

  - Added the required column `languageId` to the `record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceCode` to the `record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "record" ADD COLUMN     "enableOptimization" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "languageId" TEXT NOT NULL,
ADD COLUMN     "sourceCode" TEXT NOT NULL,
ADD COLUMN     "submitTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "warningAsError" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "actualOutput" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
