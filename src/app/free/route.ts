import type { NextRequest } from "next/server";

/**
 * The link shared on Instagram (clentr.com/free). Visitors land on the home page first, which then
 * hands them over to the resource library — see ResourceHandoff.
 */
export function GET(req: NextRequest) {
  const url = new URL("/", req.url);
  url.searchParams.set("r", "free");
  return Response.redirect(url, 307);
}
