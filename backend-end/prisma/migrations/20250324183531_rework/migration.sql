/*
  Warnings:

  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teacher` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TEACHER');

-- DropForeignKey
ALTER TABLE "Classroom" DROP CONSTRAINT "Classroom_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "_ClassroomStudents" DROP CONSTRAINT "_ClassroomStudents_B_fkey";

-- DropForeignKey
ALTER TABLE "_DecidedExercises" DROP CONSTRAINT "_DecidedExercises_B_fkey";

-- AlterTable
ALTER TABLE "_ClassroomStudents" ADD CONSTRAINT "_ClassroomStudents_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ClassroomStudents_AB_unique";

-- AlterTable
ALTER TABLE "_DecidedExercises" ADD CONSTRAINT "_DecidedExercises_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_DecidedExercises_AB_unique";

-- DropTable
DROP TABLE "Student";

-- DropTable
DROP TABLE "Teacher";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassroomStudents" ADD CONSTRAINT "_ClassroomStudents_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DecidedExercises" ADD CONSTRAINT "_DecidedExercises_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
