import { NextResponse } from "next/server";
import { getPriceForRequest } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const pricing = getPriceForRequest(request.headers);

  return NextResponse.json(
    {
      amount: pricing.amount,
      currency: pricing.currency,
    },
    {
      headers: {
        "Cache-Control": "private, max-age=300",
      },
    },
  );
}
