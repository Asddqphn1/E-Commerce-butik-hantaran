import nodemailer from "nodemailer";

// Konfigurasi transporter menggunakan SMTP Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOTP(email: string, otpCode: string) {
  try {
    const mailOptions = {
      from: `"Butik Hantaran" <${process.env.EMAIL_USER}>`, // Akan muncul sebagai pengirim
      to: email, // Bebas kirim ke email siapa saja sekarang!
      subject: "Kode Verifikasi Anda - Butik Hantaran",
      html: `
        <div style="background-color: #faf5ee; padding: 40px 20px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #3a302a; text-align: center;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 16px; border: 1px solid rgba(216, 208, 200, 0.6); box-shadow: 0 4px 12px rgba(58, 48, 42, 0.03);">
            
            <h1 style="font-family: 'Georgia', serif; font-size: 28px; font-weight: 500; margin-bottom: 24px; color: #3a302a; letter-spacing: -0.02em;">
              Butik<span style="color: #c2652a;">Hantaran</span>
            </h1>

            <div style="height: 1px; background-color: #d8d0c8; width: 40px; margin: 0 auto 24px auto; opacity: 0.5;"></div>

            <h2 style="font-family: 'Georgia', serif; font-size: 20px; font-weight: 500; margin-bottom: 16px; color: #3a302a;">
              Verifikasi Email Anda
            </h2>
            
            <p style="font-size: 15px; line-height: 1.6; color: #7a6f69; margin-bottom: 32px;">
              Terima kasih telah bergabung. Gunakan kode keamanan di bawah ini untuk menyelesaikan pendaftaran akun Anda.
            </p>

            <div style="background-color: #faf5ee; border: 1px dashed #c2652a; border-radius: 12px; padding: 20px; margin-bottom: 32px;">
              <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #c2652a; display: block; margin-left: 8px;">
                ${otpCode}
              </span>
            </div>

            <p style="font-size: 13px; color: #a39a94; margin-bottom: 0;">
              Kode ini berlaku selama <strong>15 menit</strong>.<br>
              Demi keamanan, jangan bagikan kode ini kepada siapa pun.
            </p>

          </div>
          
          <p style="margin-top: 24px; font-size: 12px; color: #a39a94; letter-spacing: 0.05em; text-transform: uppercase;">
            &copy; ${new Date().getFullYear()} Butik Hantaran — Warm Minimalism
          </p>
        </div>
      `,
    };

    // Eksekusi pengiriman email
    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (error) {
    console.error("Nodemailer Error:", error);
    return { success: false, error: "Gagal mengirim email sistem." };
  }
}
