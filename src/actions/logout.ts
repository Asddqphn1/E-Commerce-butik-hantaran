// src/actions/logout.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutUser() {
  const cookieStore = await cookies();

  // Hapus semua cookie sesi
  cookieStore.delete("user_name");
  cookieStore.delete("user_id");

  redirect("/login");
}
