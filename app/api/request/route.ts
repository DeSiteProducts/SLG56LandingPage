import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RequestPayload = {
  bucketWidth?: unknown;
  city?: unknown;
  consent?: unknown;
  country?: unknown;
  email?: unknown;
  fullName?: unknown;
  phone?: unknown;
  roadName?: unknown;
  state?: unknown;
  zipCode?: unknown;
};

const bucketWidthLabels: Record<string, string> = {
  "0-60": "0-60 inches wide",
  "over-60": "Over 60 inches",
};

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validatePayload(payload: RequestPayload) {
  const data = {
    bucketWidth: getString(payload.bucketWidth),
    city: getString(payload.city),
    consent: payload.consent === true,
    country: getString(payload.country),
    email: getString(payload.email),
    fullName: getString(payload.fullName),
    phone: getString(payload.phone),
    roadName: getString(payload.roadName),
    state: getString(payload.state),
    zipCode: getString(payload.zipCode),
  };

  if (!data.consent) {
    return { data, error: "Consent is required." };
  }

  if (!bucketWidthLabels[data.bucketWidth]) {
    return { data, error: "Bucket width is required." };
  }

  if (data.fullName.length < 2) {
    return { data, error: "Full name is required." };
  }

  if (data.phone.replace(/\D/g, "").length !== 10) {
    return { data, error: "A valid 10-digit phone number is required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { data, error: "A valid email address is required." };
  }

  if (!["USA", "Canada"].includes(data.country)) {
    return { data, error: "Country must be USA or Canada." };
  }

  if (data.roadName.length < 4) {
    return { data, error: "Street address or road name is required." };
  }

  if (data.city.length < 2) {
    return { data, error: "City is required." };
  }

  if (data.state.length < 2) {
    return { data, error: "State or province is required." };
  }

  if (data.zipCode.length < 5) {
    return { data, error: "ZIP or postal code is required." };
  }

  return { data, error: "" };
}

export async function POST(request: Request) {
  let payload: RequestPayload;

  try {
    payload = (await request.json()) as RequestPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { data, error } = validatePayload(payload);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const response = await fetch(
      "https://ppl0reirjh.execute-api.us-east-1.amazonaws.com/default/sendSLG56email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();

      console.error("Lambda Error:", errorBody);

      return NextResponse.json(
        {
          error:
            "The request could not be emailed. Please try again later.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("Lambda Request Failed:", err);

    return NextResponse.json(
      {
        error:
          "The request could not be emailed. Please try again later.",
      },
      { status: 502 }
    );
  }
}