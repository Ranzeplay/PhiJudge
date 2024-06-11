-- CreateEnum
CREATE TYPE "RecordStatus" AS ENUM ('PENDING', 'RUNNING', 'PASSED', 'FAILED', 'ERROR');

-- CreateEnum
CREATE TYPE "RecordTestPointStatus" AS ENUM ('PASSED', 'FAILED');

-- CreateEnum
CREATE TYPE "AgentStatus" AS ENUM ('DISCONNECTED', 'SUSPENDED', 'AVAILABLE');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "totalSubmits" INTEGER NOT NULL,
    "totalPassed" INTEGER NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problemTestData" (
    "id" SERIAL NOT NULL,
    "problemId" INTEGER NOT NULL,
    "input" TEXT NOT NULL,
    "expectedOutput" TEXT NOT NULL,
    "timeLimitMs" INTEGER NOT NULL,
    "memoryLimitBytes" INTEGER NOT NULL,

    CONSTRAINT "problemTestData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "record" (
    "id" SERIAL NOT NULL,
    "actualOutput" TEXT NOT NULL,
    "problemId" INTEGER NOT NULL,
    "status" "RecordStatus" NOT NULL,
    "submitterId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,

    CONSTRAINT "record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recordTestPoint" (
    "id" SERIAL NOT NULL,
    "recordId" INTEGER NOT NULL,
    "actualOutput" TEXT NOT NULL,
    "timeLimitMs" INTEGER NOT NULL,
    "memoryLimitBytes" INTEGER NOT NULL,
    "status" "RecordTestPointStatus" NOT NULL,

    CONSTRAINT "recordTestPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "AgentStatus" NOT NULL,
    "lastHeartbeat" TIMESTAMP(3) NOT NULL,
    "lastNetworkAddress" TEXT NOT NULL,

    CONSTRAINT "agent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "problem" ADD CONSTRAINT "problem_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problemTestData" ADD CONSTRAINT "problemTestData_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "record" ADD CONSTRAINT "record_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "record" ADD CONSTRAINT "record_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "record" ADD CONSTRAINT "record_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recordTestPoint" ADD CONSTRAINT "recordTestPoint_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "record"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
