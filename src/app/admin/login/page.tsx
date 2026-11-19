"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getBrowserClient, ADMIN_EMAIL } from "@/lib/supabase/client";
import { GradCapMark, LockIcon, ArrowRightIcon, SparkleIcon } from "@/components/icons";
import { CanvasFlourish, Swash } from "@/components/Decorations";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const supabase = getBrowserClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: code,
    });

    if (authError) {
      setError("That code isn't right. Check it and try again.");
      setBusy(false);
      return;
    }

    const next = params.get("next") ?? "/admin";
    router.replace(next);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-7">
      <label htmlFor="code" className="block text-[14px] font-semibold text-ink/70">
        Admin access code
      </label>
      <div className="relative mt-2">
        <LockIcon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink/35" />
        <input
          id="code"
          type="password"
          autoFocus
          autoComplete="current-password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter the code"
          className="w-full rounded-2xl border border-ink/12 bg-white py-3.5 pl-12 pr-4 text-[16px] text-ink outline-none transition placeholder:text-ink/30 focus:border-gold focus:ring-4 focus:ring-gold/15"
        />
      </div>

      {error && (
        <p role="alert" className="mt-3 rounded-xl bg-[#fde0dd] px-4 py-2.5 text-[14px] text-[#9c1f24]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy || code.length === 0}
        className="group mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-ink py-3.5 text-[15px] font-semibold text-white transition hover:bg-ink/88 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {busy ? "Checking…" : "Open Admin Dashboard"}
        {!busy && (
          <ArrowRightIcon className="h-[17px] w-[17px] transition-transform group-hover:translate-x-0.5" />
        )}
      </button>

      <p className="mt-5 text-center text-[13.5px] text-ink/45">
        Students don&rsquo;t need a code.{" "}
        <Link href="/" className="font-semibold text-gold-deep hover:text-ink">
          Go to the student dashboard
        </Link>
      </p>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="hub-canvas relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <CanvasFlourish className="pointer-events-none absolute -top-px right-0 w-[560px] max-w-[70%]" />

      <div className="relative z-10 w-full max-w-[430px]">
        <div className="hub-card relative overflow-hidden p-7 sm:p-9">
          <div className="flex items-center gap-2.5">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sidebar">
              <GradCapMark className="h-6 w-7 text-gold" />
            </span>
            <div>
              <p className="font-display text-[21px] font-bold leading-none tracking-tight text-ink">
                Senior Hub
              </p>
              <p className="mt-1 text-[13px] text-ink/50">Coppell High School</p>
            </div>
          </div>

          <h1 className="font-display mt-7 flex items-center gap-2.5 text-[31px] font-bold leading-tight tracking-tight text-ink">
            Admin Access
            <SparkleIcon className="h-5 w-5 text-gold" />
          </h1>
          <Swash className="mt-0.5 h-4 w-[128px] text-gold/70" />
          <p className="font-display mt-2 text-[15.5px] italic text-ink/60">
            Enter your code to post and manage senior information.
          </p>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
