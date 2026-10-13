import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { serviceClient } from "@/lib/supabase/service";

type CalPayload = {
  uid?: string;
  title?: string;
  startTime?: string;
  endTime?: string;
  additionalNotes?: string;
  attendees?: { name?: string; email?: string }[];
};

const STATUS: Record<string, string> = {
  BOOKING_CREATED: "created",
  BOOKING_RESCHEDULED: "rescheduled",
  BOOKING_CANCELLED: "cancelled",
};

/** Cal.com webhook: records who booked a call. Signed with CAL_WEBHOOK_SECRET. */
export async function POST(req: NextRequest) {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  const raw = await req.text();
  if (!secret) return new Response("Webhook secret not configured", { status: 503 });

  const sig = req.headers.get("x-cal-signature-256") ?? "";
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const ok = sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  if (!ok) return new Response("Bad signature", { status: 401 });

  const body = JSON.parse(raw) as { triggerEvent?: string; payload?: CalPayload };
  const status = STATUS[body.triggerEvent ?? ""];
  const p = body.payload;
  if (!status || !p?.uid) return new Response(null, { status: 204 }); // e.g. Cal's "ping" test

  const db = serviceClient();
  if (!db) return new Response("Database not configured", { status: 503 });
  const who = p.attendees?.[0];
  const { error } = await db.from("bookings").upsert(
    {
      uid: p.uid,
      status,
      name: who?.name ?? null,
      email: who?.email ?? null,
      start_time: p.startTime ?? null,
      end_time: p.endTime ?? null,
      title: p.title ?? null,
      notes: p.additionalNotes ?? null,
    },
    { onConflict: "uid" },
  );
  return error ? new Response("Store failed", { status: 500 }) : new Response(null, { status: 204 });
}
