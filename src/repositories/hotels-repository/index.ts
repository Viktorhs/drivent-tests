import { prisma } from "@/config";
import { Hotel, Room } from "@prisma/client";

async function findHotels(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}

async function findHotelsRooms(hotelId: number) {
  return prisma.room.findMany({
    where: {
      hotelId
    },
    include: {
      Hotel: true
    }
  });
}

const hotelsRepository = {
  findHotels,
  findHotelsRooms,
};

export default hotelsRepository;
