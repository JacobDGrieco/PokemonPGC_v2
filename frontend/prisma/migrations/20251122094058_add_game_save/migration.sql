-- CreateTable
CREATE TABLE "GameSave" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "gameKey" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameSave_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameSave_userId_gameKey_key" ON "GameSave"("userId", "gameKey");

-- AddForeignKey
ALTER TABLE "GameSave" ADD CONSTRAINT "GameSave_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
