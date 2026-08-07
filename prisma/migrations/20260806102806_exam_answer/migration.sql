-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "ExamAttempts" (
    "id" SERIAL NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL DEFAULT 0,
    "timeSpent" INTEGER,
    "status" "AttemptStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),

    CONSTRAINT "ExamAttempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamAnswers" (
    "id" SERIAL NOT NULL,
    "attemptId" INTEGER NOT NULL,
    "examId" INTEGER NOT NULL,
    "selected" "TestAnswer" NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamAnswers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExamAttempts_lessonId_userId_key" ON "ExamAttempts"("lessonId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamAnswers_attemptId_examId_key" ON "ExamAnswers"("attemptId", "examId");

-- AddForeignKey
ALTER TABLE "ExamAttempts" ADD CONSTRAINT "ExamAttempts_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAttempts" ADD CONSTRAINT "ExamAttempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAnswers" ADD CONSTRAINT "ExamAnswers_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "ExamAttempts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAnswers" ADD CONSTRAINT "ExamAnswers_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
