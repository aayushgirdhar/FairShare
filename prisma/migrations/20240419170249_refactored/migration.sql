/*
  Warnings:

  - You are about to drop the column `user_id` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the `Payer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GroupToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `payee_id` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admin_id` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Payer" DROP CONSTRAINT "Payer_expense_id_fkey";

-- DropForeignKey
ALTER TABLE "Payer" DROP CONSTRAINT "Payer_user_id_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToUser" DROP CONSTRAINT "_GroupToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToUser" DROP CONSTRAINT "_GroupToUser_B_fkey";

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "user_id",
ADD COLUMN     "payee_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "admin_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Payer";

-- DropTable
DROP TABLE "_GroupToUser";

-- CreateTable
CREATE TABLE "GroupMember" (
    "group_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("group_id","user_id")
);

-- CreateTable
CREATE TABLE "ExpensePayer" (
    "user_id" INTEGER NOT NULL,
    "expense_id" INTEGER NOT NULL,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ExpensePayer_pkey" PRIMARY KEY ("user_id","expense_id")
);

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_payee_id_fkey" FOREIGN KEY ("payee_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpensePayer" ADD CONSTRAINT "ExpensePayer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpensePayer" ADD CONSTRAINT "ExpensePayer_expense_id_fkey" FOREIGN KEY ("expense_id") REFERENCES "Expense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
