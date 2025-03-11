/*
  Warnings:

  - You are about to drop the column `balance` on the `Despesa` table. All the data in the column will be lost.
  - You are about to drop the column `cartaoId` on the `Despesa` table. All the data in the column will be lost.
  - You are about to drop the column `cartaoId` on the `Meta` table. All the data in the column will be lost.
  - You are about to drop the column `cartaoId` on the `Receita` table. All the data in the column will be lost.
  - You are about to drop the `Cartao` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Carteira` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor` to the `Despesa` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Despesa" DROP CONSTRAINT "Despesa_cartaoId_fkey";

-- DropForeignKey
ALTER TABLE "Despesa" DROP CONSTRAINT "Despesa_carteiraId_fkey";

-- DropForeignKey
ALTER TABLE "Meta" DROP CONSTRAINT "Meta_cartaoId_fkey";

-- DropForeignKey
ALTER TABLE "Meta" DROP CONSTRAINT "Meta_carteiraId_fkey";

-- DropForeignKey
ALTER TABLE "Receita" DROP CONSTRAINT "Receita_cartaoId_fkey";

-- DropForeignKey
ALTER TABLE "Receita" DROP CONSTRAINT "Receita_carteiraId_fkey";

-- AlterTable
ALTER TABLE "Carteira" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Despesa" DROP COLUMN "balance",
DROP COLUMN "cartaoId",
ADD COLUMN     "valor" DECIMAL(65,30) NOT NULL,
ALTER COLUMN "frequencia" SET DEFAULT 'MENSAL';

-- AlterTable
ALTER TABLE "Meta" DROP COLUMN "cartaoId",
ALTER COLUMN "frequencia" SET DEFAULT 'MENSAL';

-- AlterTable
ALTER TABLE "Receita" DROP COLUMN "cartaoId",
ALTER COLUMN "frequencia" SET DEFAULT 'MENSAL';

-- DropTable
DROP TABLE "Cartao";

-- DropEnum
DROP TYPE "TipoCartao";

-- CreateIndex
CREATE INDEX "Carteira_userId_idx" ON "Carteira"("userId");

-- CreateIndex
CREATE INDEX "Despesa_carteiraId_idx" ON "Despesa"("carteiraId");

-- CreateIndex
CREATE INDEX "Meta_carteiraId_idx" ON "Meta"("carteiraId");

-- CreateIndex
CREATE INDEX "Receita_carteiraId_idx" ON "Receita"("carteiraId");

-- AddForeignKey
ALTER TABLE "Carteira" ADD CONSTRAINT "Carteira_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Despesa" ADD CONSTRAINT "Despesa_carteiraId_fkey" FOREIGN KEY ("carteiraId") REFERENCES "Carteira"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receita" ADD CONSTRAINT "Receita_carteiraId_fkey" FOREIGN KEY ("carteiraId") REFERENCES "Carteira"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meta" ADD CONSTRAINT "Meta_carteiraId_fkey" FOREIGN KEY ("carteiraId") REFERENCES "Carteira"("id") ON DELETE CASCADE ON UPDATE CASCADE;
