/*
  Warnings:

  - You are about to drop the `Classroom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Exercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Classroom" DROP CONSTRAINT "Classroom_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "_ClassroomStudents" DROP CONSTRAINT "_ClassroomStudents_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClassroomStudents" DROP CONSTRAINT "_ClassroomStudents_B_fkey";

-- DropForeignKey
ALTER TABLE "_DecidedExercises" DROP CONSTRAINT "_DecidedExercises_A_fkey";

-- DropForeignKey
ALTER TABLE "_DecidedExercises" DROP CONSTRAINT "_DecidedExercises_B_fkey";

-- DropTable
DROP TABLE "Classroom";

-- DropTable
DROP TABLE "Exercise";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classrooms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Classrooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercises" (
    "id" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "available" TIMESTAMP(3) NOT NULL,
    "classroom_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exercises_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Classrooms_code_key" ON "Classrooms"("code");

-- AddForeignKey
ALTER TABLE "Classrooms" ADD CONSTRAINT "Classrooms_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercises" ADD CONSTRAINT "Exercises_classroom_id_fkey" FOREIGN KEY ("classroom_id") REFERENCES "Classrooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassroomStudents" ADD CONSTRAINT "_ClassroomStudents_A_fkey" FOREIGN KEY ("A") REFERENCES "Classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassroomStudents" ADD CONSTRAINT "_ClassroomStudents_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DecidedExercises" ADD CONSTRAINT "_DecidedExercises_A_fkey" FOREIGN KEY ("A") REFERENCES "Exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DecidedExercises" ADD CONSTRAINT "_DecidedExercises_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
