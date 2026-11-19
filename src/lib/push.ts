"use client";

import { getBrowserClient } from "@/lib/supabase/client";

export type PushState =
  /** Browser has no Push API at all (e.g. desktop Safari < 16). */
  | "unsupported"
  /** iOS: Push only exists once the site is installed to the Home Screen. */
  | "needs-install"
  /** Supported, not yet asked. */
  | "default"
  /** Subscribed on this device. */
  | "granted"
  /** User blocked notifications in browser settings. */
  | "denied";

export const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

function isIos() {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPadOS 13+ reports as Mac, but has touch points.
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // Safari's non-standard flag.
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function getPushState(): PushState {
  if (typeof window === "undefined") return "unsupported";

  const hasApi =
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window;

  if (!hasApi) return isIos() && !isStandalone() ? "needs-install" : "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return "default";
}

/** VAPID keys travel as base64url; PushManager wants raw bytes. */
function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const normalised = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(normalised);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

async function registerWorker() {
  const existing = await navigator.serviceWorker.getRegistration("/sw.js");
  if (existing) {
    await navigator.serviceWorker.ready;
    return existing;
  }
  const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  await navigator.serviceWorker.ready;
  return reg;
}

function keyToBase64(sub: PushSubscription, name: "p256dh" | "auth") {
  const key = sub.getKey(name);
  if (!key) throw new Error(`subscription missing ${name}`);
  return window.btoa(String.fromCharCode(...new Uint8Array(key)));
}

/**
 * Register this device for announcement pushes.
 * Returns the resulting state so the caller can render the right message.
 */
export async function enablePush(): Promise<
  { ok: true } | { ok: false; reason: string }
> {
  if (!VAPID_PUBLIC_KEY) {
    return { ok: false, reason: "Push isn't configured on this deployment yet." };
  }

  const state = getPushState();
  if (state === "needs-install") {
    return {
      ok: false,
      reason:
        "On iPhone, tap Share → Add to Home Screen, open Senior Hub from there, then turn notifications on.",
    };
  }
  if (state === "unsupported") {
    return { ok: false, reason: "This browser doesn't support notifications." };
  }
  if (state === "denied") {
    return {
      ok: false,
      reason: "Notifications are blocked for this site in your browser settings.",
    };
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return { ok: false, reason: "Notifications weren't allowed." };
  }

  let subscription: PushSubscription;
  try {
    const registration = await registerWorker();
    const existing = await registration.pushManager.getSubscription();
    subscription =
      existing ??
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      }));
  } catch {
    return {
      ok: false,
      reason:
        "Couldn't reach the notification service. Check your connection and try again.",
    };
  }

  // Registered through an RPC, not a direct upsert: the table stays unreadable
  // so nobody can enumerate other people's push endpoints.
  const { error } = await getBrowserClient().rpc("register_push_subscription", {
    p_endpoint: subscription.endpoint,
    p_p256dh: keyToBase64(subscription, "p256dh"),
    p_auth: keyToBase64(subscription, "auth"),
  });

  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

/** Stop pushes to this device. */
export async function disablePush(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) return false;
  const registration = await navigator.serviceWorker.getRegistration("/sw.js");
  const subscription = await registration?.pushManager.getSubscription();
  if (!subscription) return true;

  // Unsubscribe locally; the server prunes the row when the endpoint 410s.
  await subscription.unsubscribe();
  return true;
}

/** True when this device already has a live subscription. */
export async function isSubscribed() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return false;
  if (!("PushManager" in window)) return false;
  if (Notification.permission !== "granted") return false;
  const registration = await navigator.serviceWorker.getRegistration("/sw.js");
  const subscription = await registration?.pushManager.getSubscription();
  return Boolean(subscription);
}
