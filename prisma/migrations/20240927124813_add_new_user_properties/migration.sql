/*
  Warnings:

  - Added the required column `currentlyTraining` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentSport" TEXT,
ADD COLUMN     "currentlyTraining" TEXT NOT NULL,
ADD COLUMN     "currentlyTrainingRate" TEXT,
ADD COLUMN     "inactivityPeriod" TEXT,
ADD COLUMN     "inactivityReason" TEXT,
ADD COLUMN     "personalTraining" TEXT,
ALTER COLUMN "sex" DROP DEFAULT;
