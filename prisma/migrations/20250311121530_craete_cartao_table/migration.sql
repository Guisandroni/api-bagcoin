/*
  Warnings:

  - You are about to drop the column `categoriaId` on the `Despesa` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Despesa` table. All the data in the column will be lost.
  - You are about to drop the column `categoriaId` on the `Meta` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Meta` table. All the data in the column will be lost.
  - You are about to drop the column `categoriaId` on the `Receita` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Receita` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TipoCartao" AS ENUM ('DEBITO', 'CREDITO');

-- DropForeignKey
ALTER TABLE "Despesa" DROP CONSTRAINT "Despesa_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Meta" DROP CONSTRAINT "Meta_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Receita" DROP CONSTRAINT "Receita_categoryId_fkey";

-- AlterTable
ALTER TABLE "Despesa" DROP COLUMN "categoriaId",
DROP COLUMN "categoryId",
ADD COLUMN     "cartaoId" TEXT;

-- AlterTable
ALTER TABLE "Meta" DROP COLUMN "categoriaId",
DROP COLUMN "categoryId",
ADD COLUMN     "cartaoId" TEXT;

-- AlterTable
ALTER TABLE "Receita" DROP COLUMN "categoriaId",
DROP COLUMN "categoryId",
ADD COLUMN     "cartaoId" TEXT;

-- DropTable
DROP TABLE "Category";

-- CreateTable
CREATE TABLE "Cartao" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tipo" "TipoCartao" NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "limite" DECIMAL(65,30),
    "diaFechamento" INTEGER,
    "diaVencimento" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cartao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Despesa" ADD CONSTRAINT "Despesa_cartaoId_fkey" FOREIGN KEY ("cartaoId") REFERENCES "Cartao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receita" ADD CONSTRAINT "Receita_cartaoId_fkey" FOREIGN KEY ("cartaoId") REFERENCES "Cartao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meta" ADD CONSTRAINT "Meta_cartaoId_fkey" FOREIGN KEY ("cartaoId") REFERENCES "Cartao"("id") ON DELETE SET NULL ON UPDATE CASCADE;
