import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";
import { calculateBookingDates } from "./dates";

const NON_BLOCKING_STATUSES: BookingStatus[] = [
  BookingStatus.CANCELLED,
  BookingStatus.RETURNED,
];

export async function checkAvailability(
  eventDateIso: string,
  requestedBoxes: number,
  serviceId: number,
) {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service) throw new Error("Layanan tidak ditemukan.");

  // Logic Bypass untuk Hidden Hantaran (Unlimited)
  if (service.is_unlimited) {
    return { isAvailable: true, sisaBox: 999 };
  }

  const { dropOffDate, returnDate } = calculateBookingDates(eventDateIso);

  const overlappingBookings = await prisma.booking.aggregate({
    _sum: { jumlah_box: true },
    where: {
      service_id: serviceId,
      status_booking: { notIn: NON_BLOCKING_STATUSES },
      drop_off_date: { lte: returnDate },
      return_date: { gte: dropOffDate },
    },
  });

  const totalBooked = overlappingBookings._sum.jumlah_box || 0;
  const sisaBox = service.stok_box - totalBooked;

  return {
    isAvailable: sisaBox >= requestedBoxes,
    sisaBox: sisaBox,
  };
}

// Helper untuk UI Landing Page
export async function getCurrentInventory() {
  const services = await prisma.service.findMany({
    where: { is_active: true },
  });
  const openBookings = await prisma.booking.groupBy({
    by: ["service_id"],
    _sum: { jumlah_box: true },
    where: { status_booking: { notIn: NON_BLOCKING_STATUSES } },
  });

  let globalMax = 0;
  let globalBooked = 0;
  const inventoryMap: Record<
    number,
    { max: number; sisa: number; is_unlimited: boolean }
  > = {};

  services.forEach((s) => {
    const booked =
      openBookings.find((b) => b.service_id === s.id)?._sum.jumlah_box || 0;
    inventoryMap[s.id] = {
      max: s.stok_box,
      sisa: s.is_unlimited ? 999 : Math.max(0, s.stok_box - booked),
      is_unlimited: s.is_unlimited,
    };

    if (!s.is_unlimited) {
      globalMax += s.stok_box;
      globalBooked += booked;
    }
  });

  return {
    sisaBox: globalMax - globalBooked,
    maxCapacity: globalMax,
    inventoryMap,
  };
}
