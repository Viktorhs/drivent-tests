import { notFoundError, unauthorizedError, invalidDataError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotels-repository";

async function listAvaliblesHotels(userId: number) {
  const enrollmentId = getEnrollmentId(userId);
  const ticket = await ticketRepository.findTicketByEnrollmentId(Number(enrollmentId));

  if (!ticket || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote) {
    throw notFoundError();
  }
  if (ticket.status === "RESERVED") {
    throw invalidDataError(["Tikect not paid"]);
  }

  return await hotelsRepository.findHotels();
}

async function listHotelRooms(hotelId: number) {
  const rooms = await hotelsRepository.findHotelsRooms(hotelId);

  if (rooms.length === 0) {
    throw notFoundError();
  }

  return rooms;
}

async function getEnrollmentId(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!enrollment) {
    throw unauthorizedError();
  }
  return enrollment.id;
}

const hotelsService = {
  listAvaliblesHotels,
  listHotelRooms
};

export default hotelsService;
