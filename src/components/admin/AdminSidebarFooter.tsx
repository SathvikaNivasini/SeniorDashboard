"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getBrowserClient } from "@/lib/supabase/client";
import { HomeIcon, LogoutIcon } from "@/components/icons";

export default function AdminSidebarFooter() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    await getBrowserClient().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="relative z-10 mt-7 flex flex-col gap-1 border-t border-white/10 px-4 pt-4">
      <Link
        href="/"
        className="flex items-center gap-3.5 rounded-full px-5 py-2.5 text-white/70 transition hover:bg-white/[0.08] hover:text-white"
      >
        <HomeIcon className="h-[19px] w-[19px] shrink-0" />
        <span className="text-[14px] font-medium">Student View</span>
      </Link>
      <button
        type="button"
        onClick={signOut}
        disabled={busy}
        className="flex items-center gap-3.5 rounded-full px-5 py-2.5 text-white/70 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
      >
        <LogoutIcon className="h-[19px] w-[19px] shrink-0" />
        <span className="text-[14px] font-medium">{busy ? "Signing out…" : "Sign Out"}</span>
      </button>
    </div>
  );
}
