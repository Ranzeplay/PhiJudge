/*
  Warnings:

  - The values [Accepted,WrongAnswer,TimeLimitExceeded,MemoryLimitExceeded,OutputLimitExceeded,RuntimeError,Unknown] on the enum `RecordTestPointStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `agent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `problem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `problemTestData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `record` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recordTestPoint` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `requestLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RecordTestPointStatus_new" AS ENUM ('ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'OUTPUT_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'UNKNOWN');
ALTER TABLE "recordTestPoints" ALTER COLUMN "status" TYPE "RecordTestPointStatus_new" USING ("status"::text::"RecordTestPointStatus_new");
ALTER TYPE "RecordTestPointStatus" RENAME TO "RecordTestPointStatus_old";
ALTER TYPE "RecordTestPointStatus_new" RENAME TO "RecordTestPointStatus";
DROP TYPE "RecordTestPointStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "problem" DROP CONSTRAINT "problem_authorId_fkey";

-- DropForeignKey
ALTER TABLE "problemTestData" DROP CONSTRAINT "problemTestData_problemId_fkey";

-- DropForeignKey
ALTER TABLE "record" DROP CONSTRAINT "record_agentId_fkey";

-- DropForeignKey
ALTER TABLE "record" DROP CONSTRAINT "record_problemId_fkey";

-- DropForeignKey
ALTER TABLE "record" DROP CONSTRAINT "record_submitterId_fkey";

-- DropForeignKey
ALTER TABLE "recordTestPoint" DROP CONSTRAINT "recordTestPoint_recordId_fkey";

-- DropTable
DROP TABLE "agent";

-- DropTable
DROP TABLE "problem";

-- DropTable
DROP TABLE "problemTestData";

-- DropTable
DROP TABLE "record";

-- DropTable
DROP TABLE "recordTestPoint";

-- DropTable
DROP TABLE "requestLog";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problems" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "totalSubmits" INTEGER NOT NULL DEFAULT 0,
    "totalPassed" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "problems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problemTestPoints" (
    "id" SERIAL NOT NULL,
    "problemId" INTEGER NOT NULL,
    "input" TEXT NOT NULL,
    "expectedOutput" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "timeLimitMs" INTEGER NOT NULL,
    "memoryLimitBytes" INTEGER NOT NULL,

    CONSTRAINT "problemTestPoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "records" (
    "id" SERIAL NOT NULL,
    "problemId" INTEGER NOT NULL,
    "status" "RecordStatus" NOT NULL DEFAULT 'PENDING',
    "submitterId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "sourceCode" TEXT NOT NULL,
    "compilationResult" "CompilationStatus" NOT NULL DEFAULT 'PENDING',
    "compilationOutput" TEXT NOT NULL DEFAULT '',
    "enableOptimization" BOOLEAN NOT NULL DEFAULT false,
    "warningAsError" BOOLEAN NOT NULL DEFAULT false,
    "submitTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recordTestPoints" (
    "id" SERIAL NOT NULL,
    "recordId" INTEGER NOT NULL,
    "actualOutput" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "actualTimeMs" INTEGER NOT NULL,
    "actualPeakMemoryBytes" INTEGER NOT NULL,
    "status" "RecordTestPointStatus" NOT NULL,

    CONSTRAINT "recordTestPoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "AgentStatus" NOT NULL DEFAULT 'DISCONNECTED',
    "lastHeartbeatTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastNetworkAddress" TEXT NOT NULL DEFAULT 'Unknown',
    "availableLanguageId" TEXT[],

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requestLogs" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "isApiRoute" BOOLEAN NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "requestLogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "availableProgrammingLanguages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "availableProgrammingLanguages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "availableProgrammingLanguages_id_key" ON "availableProgrammingLanguages"("id");

-- AddForeignKey
ALTER TABLE "problems" ADD CONSTRAINT "problems_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problemTestPoints" ADD CONSTRAINT "problemTestPoints_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "availableProgrammingLanguages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recordTestPoints" ADD CONSTRAINT "recordTestPoints_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "records"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
