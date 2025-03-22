/*
  Warnings:

  - A unique constraint covering the columns `[showtimeId,seatNumber]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Booking_showtimeId_seatNumber_key" ON "Booking"("showtimeId", "seatNumber");
