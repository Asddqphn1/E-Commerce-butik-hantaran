import { prisma } from "@/lib/prisma";
import BookingForm from "@/components/BookingForm";

export const metadata = {
  title: "Booking Hantaran | Butik Hantaran Pekanbaru",
  description: "Pesan box hantaran eksklusif tanpa DP di Pekanbaru.",
};

export default async function BookingPage() {
  // Langsung fetch dari DB (Server-Side)
  // Hanya ambil layanan yang sedang aktif
  const activeServices = await prisma.service.findMany({
    where: {
      is_active: true,
    },
    select: {
      id: true,
      nama_desain: true,
      harga_reguler: true,
      harga_wo: true,
    },
  });

  // Untuk mode tanpa auth penuh, ambil user pertama sebagai tester agar FK user_id valid.
  const fallbackUser = await prisma.user.findFirst({
    select: { id: true },
    orderBy: { id: "asc" },
  });

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Sewa Box Hantaran
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Lengkapi momen bahagiamu. Pilih desain, tentukan tanggal, kami yang
          urus sisanya.
        </p>
      </div>

      {/* Render Client Component dan Passing Data (Props) */}
      <BookingForm
        services={activeServices}
        userId={fallbackUser?.id ?? null}
      />
    </main>
  );
}
