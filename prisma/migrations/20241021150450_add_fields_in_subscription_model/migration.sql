/*
  Warnings:

  - You are about to drop the column `advance` on the `Subscriptions` table. All the data in the column will be lost.
  - Added the required column `doneAppointments` to the `Subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPaid` to the `Subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscriptions" DROP COLUMN "advance",
ADD COLUMN     "doneAppointments" INTEGER NOT NULL,
ADD COLUMN     "totalPaid" INTEGER NOT NULL;
