"use client";

import { useActionState } from "react";
import { verifyOTP } from "@/actions/verify";
import { useSearchParams } from "next/navigation";

type VerifyActionState = Awaited<ReturnType<typeof verifyOTP>>;

const initialState: VerifyActionState = {
  success: false,
  error: "",
};

export default function VerifyPage() {
  const [state, formAction, isPending] = useActionState<
    VerifyActionState,
    FormData
  >(verifyOTP, initialState);

  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf5ee] p-4 font-sans">
      <form
        action={formAction}
        className="bg-white p-8 sm:p-10 rounded-2xl shadow-[0_2px_16px_rgba(58,48,42,0.04)] border border-[#d8d0c8]/60 w-full max-w-md space-y-6"
      >
        <div className="text-center space-y-3 mb-2">
          <h2 className="text-3xl font-serif font-medium text-[#3a302a] tracking-tight">
            Cek Email Anda
          </h2>
          <p className="text-sm text-[#7a6f69] leading-relaxed px-2">
            Kami telah mengirimkan 6 digit kode OTP ke: <br />
            {/* Tampilkan email sebagai teks cetak tebal dengan warna Primary */}
            <strong className="text-[#c2652a] font-semibold text-base mt-1 block">
              {emailParam || "Email tidak ditemukan"}
            </strong>
          </p>
        </div>

        {state?.error && (
          <div className="p-4 bg-[#fdf2f2] text-[#8c3c3c] border border-[#f5d8d8] rounded-lg text-sm">
            {state.error}
          </div>
        )}

        <div className="space-y-4">
          {/* Input email disembunyikan (hidden), tapi datanya tetap terkirim saat tombol ditekan */}
          <input type="hidden" name="email" value={emailParam} />

          <input
            type="text"
            name="otp"
            maxLength={6}
            required
            placeholder="• • • • • •"
            className="w-full bg-white border border-[#d8d0c8] p-3 rounded-lg focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#3a302a] placeholder-[#d8d0c8] transition-all text-center tracking-[0.5em] text-xl font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={isPending || !emailParam}
          className="w-full mt-2 bg-[#c2652a] hover:bg-[#a85522] text-white font-medium py-3.5 rounded-lg disabled:opacity-50 transition-colors shadow-sm"
        >
          {isPending ? "Memverifikasi..." : "Verifikasi Sekarang"}
        </button>
      </form>
    </div>
  );
}
