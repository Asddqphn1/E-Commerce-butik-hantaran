import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = "Asia/Jakarta";

export function calculateBookingDates(eventDateIso: string) {
  // Set ke awal hari (00:00:00) pada zona waktu WIB
  const eventDate = dayjs.tz(eventDateIso, TZ).startOf("day");

  return {
    eventDate: eventDate.toDate(),
    dropOffDate: eventDate.subtract(7, "day").toDate(), // H-7
    pickUpDate: eventDate.subtract(1, "day").toDate(), // H-1
    returnDate: eventDate.add(2, "day").toDate(), // H+2
  };
}
