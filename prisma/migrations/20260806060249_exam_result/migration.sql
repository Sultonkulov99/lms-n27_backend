/*
  Warnings:

  - Added the required column `userId` to the `Exams` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exams" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ExamResults" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "correctAnswer" INTEGER NOT NULL,
    "wrongAnswer" INTEGER NOT NULL,
    "isPassed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamResults_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Exams" ADD CONSTRAINT "Exams_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResults" ADD CONSTRAINT "ExamResults_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResults" ADD CONSTRAINT "ExamResults_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
