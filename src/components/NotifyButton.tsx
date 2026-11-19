"use client";

import { useEffect, useState } from "react";
import { BellIcon, CheckCircleIcon, InfoIcon } from "@/components/icons";
import {
  enablePush, disablePush, getPushState, isSubscribed, type PushState,
} from "@/lib/push";

export default function NotifyButton() {
  const [state, setState] = useState<PushState | "loading">("loading");
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const s = getPushState();
      const sub = await isSubscribed();
      if (!alive) return;
      setState(s);
      setSubscribed(sub);
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function turnOn() {
    setBusy(true);
    setNote(null);
    const result = await enablePush();
    setBusy(false);
    if (result.ok) {
      setSubscribed(true);
      setState("granted");
      setNote("You'll get a notification when a new announcement is posted.");
    } else {
      setNote(result.reason);
      setState(getPushState());
    }
  }

  async function turnOff() {
    setBusy(true);
    await disablePush();
    setBusy(false);
    setSubscribed(false);
    setNote("Notifications turned off on this device.");
  }

  if (state === "loading") return null;

  if (state === "unsupported") {
    return (
      <p className="flex items-center gap-2 text-[13.5px] text-ink/45">
        <InfoIcon className="h-4 w-4 shrink-0" />
        This browser can&rsquo;t show notifications.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      {subscribed ? (
        <button
          type="button"
          onClick={turnOff}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full bg-mint px-4 py-2.5 text-[14px] font-medium text-ink transition hover:bg-mint/70 disabled:opacity-50"
        >
          <CheckCircleIcon className="h-[17px] w-[17px]" />
          {busy ? "Working…" : "Notifications on"}
        </button>
      ) : (
        <button
          type="button"
          onClick={turnOn}
          disabled={busy || state === "denied"}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[14px] font-medium text-white transition hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <BellIcon className="h-[17px] w-[17px]" />
          {busy
            ? "Setting up…"
            : state === "denied"
              ? "Notifications blocked"
              : state === "needs-install"
                ? "How to turn on notifications"
                : "Notify me of new posts"}
        </button>
      )}

      {note && (
        <p className="max-w-[320px] text-left text-[12.5px] leading-relaxed text-ink/55 sm:text-right">
          {note}
        </p>
      )}

      {state === "needs-install" && !note && (
        <p className="max-w-[320px] text-left text-[12.5px] leading-relaxed text-ink/55 sm:text-right">
          On iPhone: tap Share → Add to Home Screen, then open Senior Hub from
          your home screen.
        </p>
      )}
    </div>
  );
}
