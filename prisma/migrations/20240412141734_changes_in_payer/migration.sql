/*
  Warnings:

  - Made the column `user_id` on table `Expense` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `user_id` to the `Payer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_user_id_fkey";

-- AlterTable
ALTER TABLE "Expense" ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Payer" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payer" ADD CONSTRAINT "Payer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
