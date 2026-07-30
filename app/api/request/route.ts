import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { data, error } = validatePayload(payload);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT ?? "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM;

  if (!smtpHost || !smtpUser || !smtpPass || !smtpFrom) {
    return NextResponse.json(
      { error: "Email service is not configured yet." },
      { status: 503 },
    );
  }

  const submittedAt = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Chicago",
  });

  const rows = [
    ["Bucket width", bucketWidthLabels[data.bucketWidth]],
    ["Full name", data.fullName],
    ["Phone", data.phone],
    ["Email", data.email],
    ["Country", data.country],
    ["Street address / road name", data.roadName],
    ["City", data.city],
    ["State / province", data.state],
    ["ZIP / postal code", data.zipCode],
    ["Submitted", submittedAt],
  ];

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const htmlRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <th align="left" style="padding:10px 14px;background:#f1f5f9;border-bottom:1px solid #e2e8f0;font-family:Arial,sans-serif;font-size:14px;color:#0f172a;">${escapeHtml(label)}</th>
          <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;font-family:Arial,sans-serif;font-size:14px;color:#334155;">${escapeHtml(value)}</td>
        </tr>
      `,
    )
    .join("");

  const transporter = nodemailer.createTransport({
    auth: {
      pass: smtpPass,
      user: smtpUser,
    },
    host: smtpHost,
    port: smtpPort,
    secure: process.env.SMTP_SECURE === "true" || smtpPort === 465,
  });

  try {
    await transporter.sendMail({
      from: smtpFrom,
      html: `
        <div style="font-family:Arial,sans-serif;color:#0f172a;">
          <h1 style="font-size:22px;margin:0 0 16px;">New SLG 56 request</h1>
          <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:680px;border:1px solid #e2e8f0;">
            ${htmlRows}
          </table>
        </div>
      `,
      replyTo: data.email,
      subject: `New SLG 56 request from ${data.fullName}`,
      text,
      to: "salesusa@desiteproducts.com",
    });
  } catch {
    return NextResponse.json(
      { error: "The request could not be emailed. Please try again or contact sales." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
