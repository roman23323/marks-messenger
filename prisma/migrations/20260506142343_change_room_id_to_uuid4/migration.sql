/*
  Warnings:

  - The primary key for the `Room` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UsersToRooms` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_roomId_fkey";

-- DropForeignKey
ALTER TABLE "UsersToRooms" DROP CONSTRAINT "UsersToRooms_roomId_fkey";

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "roomId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Room" DROP CONSTRAINT "Room_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Room_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Room_id_seq";

-- AlterTable
ALTER TABLE "UsersToRooms" DROP CONSTRAINT "UsersToRooms_pkey",
ALTER COLUMN "roomId" SET DATA TYPE TEXT,
ADD CONSTRAINT "UsersToRooms_pkey" PRIMARY KEY ("userId", "roomId");

-- AddForeignKey
ALTER TABLE "UsersToRooms" ADD CONSTRAINT "UsersToRooms_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
