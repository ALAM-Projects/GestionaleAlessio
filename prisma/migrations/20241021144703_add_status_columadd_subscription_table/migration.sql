-- CreateTable
CREATE TABLE "Subscriptions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "advance" INTEGER NOT NULL,
    "appointmentsIncluded" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Subscriptions_userId_idx" ON "Subscriptions"("userId");

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
