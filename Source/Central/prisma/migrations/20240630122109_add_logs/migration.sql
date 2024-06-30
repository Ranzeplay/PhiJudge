-- CreateTable
CREATE TABLE "requestLog" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "isApiRoute" BOOLEAN NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "requestLog_pkey" PRIMARY KEY ("id")
);
