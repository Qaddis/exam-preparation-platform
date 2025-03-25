/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Classroom` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Classroom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Classroom" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_code_key" ON "Classroom"("code");
