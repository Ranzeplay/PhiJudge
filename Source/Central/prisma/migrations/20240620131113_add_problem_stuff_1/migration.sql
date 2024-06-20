/*
  Warnings:

  - Added the required column `order` to the `problemTestData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `recordTestPoint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "problem" ALTER COLUMN "totalSubmits" SET DEFAULT 0,
ALTER COLUMN "totalPassed" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "problemTestData" ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "recordTestPoint" ADD COLUMN     "order" INTEGER NOT NULL;
