-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('SUPERADMIN', 'ADMIN', 'MENTOR', 'ASSISTANT', 'STUDENT');

-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('BEGINNER', 'ELEMENTARY', 'PREINTERMEDIATE', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "TestAnswer" AS ENUM ('variantA', 'variantB', 'variantC', 'variantD');

-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "file" TEXT,
    "email" TEXT,
    "role" "UserRoles" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "experience" INTEGER,
    "job" TEXT,
    "site" TEXT,
    "description" TEXT,
    "facebook" TEXT,
    "telegram" TEXT,
    "instagram" TEXT,
    "github" TEXT,
    "linkedin" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MentorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseAssistant" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseAssistant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Courses" (
    "id" SERIAL NOT NULL,
    "banner" TEXT NOT NULL,
    "introVideo" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "level" "CourseLevel" NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sections" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lessons" (
    "id" SERIAL NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Materials" (
    "id" SERIAL NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "file" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Homeworks" (
    "id" SERIAL NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "file" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Homeworks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exams" (
    "id" SERIAL NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "questoin" TEXT NOT NULL,
    "variantA" TEXT NOT NULL,
    "variantB" TEXT NOT NULL,
    "variantC" TEXT NOT NULL,
    "variantD" TEXT NOT NULL,
    "answer" "TestAnswer" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exams_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Comments" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payments" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "ExamAttempts_lessonId_userId_key" ON "ExamAttempts"("lessonId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamAnswers_attemptId_examId_key" ON "ExamAnswers"("attemptId", "examId");

-- AddForeignKey
ALTER TABLE "MentorProfile" ADD CONSTRAINT "MentorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseAssistant" ADD CONSTRAINT "CourseAssistant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Courses" ADD CONSTRAINT "Courses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sections" ADD CONSTRAINT "Sections_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lessons" ADD CONSTRAINT "Lessons_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materials" ADD CONSTRAINT "Materials_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homeworks" ADD CONSTRAINT "Homeworks_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exams" ADD CONSTRAINT "Exams_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exams" ADD CONSTRAINT "Exams_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAttempts" ADD CONSTRAINT "ExamAttempts_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAttempts" ADD CONSTRAINT "ExamAttempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAnswers" ADD CONSTRAINT "ExamAnswers_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "ExamAttempts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAnswers" ADD CONSTRAINT "ExamAnswers_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResults" ADD CONSTRAINT "ExamResults_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamResults" ADD CONSTRAINT "ExamResults_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
