import { notFoundError, unauthorizedError, invalidDataError, requestError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotels-repository";

async function listAvaliblesHotels(userId: number) {
  const enrollmentId = await getEnrollmentId(userId);
  const ticket = await ticketRepository.findTicketByEnrollmentId(Number(enrollmentId));

  if (!ticket || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote) {
    throw requestError(401, "forbidden error");
  }
  if (ticket.status === "RESERVED") {
    throw invalidDataError(["Tikect not paid"]);
  }

  return await hotelsRepository.findHotels();
}

async function listHotelRooms(hotelId: number, userId: number) {
  const enrollmentId = await getEnrollmentId(userId);
  const ticket = await ticketRepository.findTicketByEnrollmentId(Number(enrollmentId));

  if (!ticket || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote) {
    throw requestError(401, "forbidden error");
  }
  if (ticket.status === "RESERVED") {
    throw invalidDataError(["Tikect not paid"]);
  }
  
  const room = await hotelsRepository.findHotelsRooms(hotelId);
  if(!room.Rooms) {
    throw notFoundError();
  }

  return room;
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
