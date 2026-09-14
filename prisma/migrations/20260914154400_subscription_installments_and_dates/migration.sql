-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "advancePaymentDate" TEXT;
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "expirationDate" TEXT;
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "paymentType" TEXT NOT NULL DEFAULT 'FULL';
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "installments" JSONB;
