"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type StepId =
  | "consent"
  | "bucketWidth"
  | "fullName"
  | "phone"
  | "email"
  | "country"
  | "roadName"
  | "city"
  | "state"
  | "zipCode";

type FormValues = {
  bucketWidth: string;
  city: string;
  consent: boolean;
  country: string;
  email: string;
  fullName: string;
  phone: string;
  roadName: string;
  state: string;
  zipCode: string;
};

const steps: { id: StepId; label: string; title: string }[] = [
  {
    id: "consent",
    label: "Consent",
    title: "Before you begin",
  },
  {
    id: "bucketWidth",
    label: "Bucket",
    title: "How wide is your bucket in inches?",
  },
  {
    id: "fullName",
    label: "Name",
    title: "What is your full name?",
  },
  {
    id: "phone",
    label: "Phone",
    title: "What is your phone number?",
  },
  {
    id: "email",
    label: "Email",
    title: "What is your email address?",
  },
  {
    id: "country",
    label: "Country",
    title: "What country is the delivery address in?",
  },
  {
    id: "roadName",
    label: "Road",
    title: "What is your exact street address or road name?",
  },
  {
    id: "city",
    label: "City",
    title: "What city is the delivery address in?",
  },
  {
    id: "state",
    label: "State",
    title: "What state or province is the delivery address in?",
  },
  {
    id: "zipCode",
    label: "ZIP",
    title: "What is the ZIP or postal code?",
  },
];

const initialValues: FormValues = {
  bucketWidth: "",
  city: "",
  consent: false,
  country: "",
  email: "",
  fullName: "",
  phone: "",
  roadName: "",
  state: "",
  zipCode: "",
};

const inputClasses =
  "mt-5 w-full rounded-lg border border-slate-200 bg-white px-4 py-4 text-base text-ink shadow-sm transition placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100";

const bucketWidthOptions = [
  { label: "0-60 inches wide", value: "0-60" },
  { label: "Over 60 inches", value: "over-60" },
];

const countryOptions = [
  { label: "USA", value: "USA" },
  { label: "Canada", value: "Canada" },
];

const metaPixelId = "1047002958291127";

const priceByCountry = {
  Canada: { currency: "CAD", value: 4700 },
  USA: { currency: "USD", value: 4500 },
} as const;

type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

function formatNorthAmericanPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length === 0) {
    return "";
  }

  if (digits.length <= 3) {
    return `(${digits}`;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function normalizeForHash(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

function normalizePhoneForHash(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 10) {
    return `1${digits}`;
  }

  return digits;
}

function getNameParts(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] ?? "";
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";

  return { firstName, lastName };
}

function getEventId() {
  if (typeof window.crypto?.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `lead-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

async function sha256(value: string) {
  if (!value || !window.crypto?.subtle) {
    return "";
  }

  const data = new TextEncoder().encode(value);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function hashFields(fields: Record<string, string>) {
  const hashedEntries = await Promise.all(
    Object.entries(fields).map(async ([key, value]) => [key, await sha256(value)] as const),
  );

  return Object.fromEntries(hashedEntries.filter(([, value]) => value.length > 0));
}

async function buildAdvancedMatching(values: FormValues) {
  const { firstName, lastName } = getNameParts(values.fullName);
  const countryCode = values.country === "Canada" ? "ca" : "us";

  return hashFields({
    country: countryCode,
    ct: normalizeForHash(values.city),
    em: values.email.trim().toLowerCase(),
    fn: normalizeForHash(firstName),
    ln: normalizeForHash(lastName),
    ph: normalizePhoneForHash(values.phone),
    st: normalizeForHash(values.state),
    zp: normalizeForHash(values.zipCode),
  });
}

async function trackMetaLead(values: FormValues) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") {
    return;
  }

  const price = values.country === "Canada" ? priceByCountry.Canada : priceByCountry.USA;
  const fbq = window.fbq;
  const eventID = getEventId();
  const [addressHash, locationHash] = await Promise.all([
    sha256(normalizeForHash(values.roadName)),
    sha256(
      normalizeForHash(`${values.roadName}${values.city}${values.state}${values.zipCode}`),
    ),
  ]);

  const customData = {
    address_hash: addressHash || undefined,
    bucket_width: bucketWidthOptions.find((option) => option.value === values.bucketWidth)?.label,
    content_category: "Lead",
    content_name: "DeSite SLG 56 Mini Screener Form",
    currency: price.currency,
    delivery_country: values.country,
    delivery_state: values.state,
    form_steps_completed: steps.length,
    lead_source: "SLG 56 landing page",
    location_hash: locationHash || undefined,
    value: price.value,
  };

  try {
    const advancedMatching = await buildAdvancedMatching(values);

    if (Object.keys(advancedMatching).length > 0) {
      fbq("init", metaPixelId, advancedMatching);
    }
  } catch {
    // The Lead event should still fire if browser hashing is unavailable.
  }

  fbq("track", "Lead", customData, { eventID });
}

export function PurchaseQuestionnaire() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [values, setValues] = useState<FormValues>(initialValues);
  const resetTimerRef = useRef<number | null>(null);
  const currentStep = steps[currentIndex];
  const isLastStep = currentIndex === steps.length - 1;
  const progress = useMemo(() => ((currentIndex + 1) / steps.length) * 100, [currentIndex]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  function updateValue<Key extends keyof FormValues>(key: Key, value: FormValues[Key]) {
    setValues((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function validateStep(stepId: StepId) {
    if (stepId === "consent" && !values.consent) {
      return "Please confirm that you would like pricing or a formal recommendation before continuing.";
    }

    if (stepId === "bucketWidth") {
      if (!values.bucketWidth) {
        return "Please select your bucket width range.";
      }
    }

    if (stepId === "fullName" && values.fullName.trim().length < 2) {
      return "Please enter your full name.";
    }

    if (stepId === "phone" && values.phone.replace(/\D/g, "").length !== 10) {
      return "Please enter a valid 10-digit phone number.";
    }

    if (stepId === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      return "Please enter a valid email address.";
    }

    if (stepId === "country" && !values.country) {
      return "Please select USA or Canada.";
    }

    if (stepId === "roadName" && values.roadName.trim().length < 4) {
      return "Please enter the exact street address or road name.";
    }

    if (stepId === "city" && values.city.trim().length < 2) {
      return "Please enter the city.";
    }

    if (stepId === "state" && values.state.trim().length < 2) {
      return "Please enter the state.";
    }

    if (stepId === "zipCode" && values.zipCode.trim().length < 5) {
      return "Please enter the ZIP code.";
    }

    return "";
  }

  async function submitRequest() {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/request", {
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const responseData = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(responseData.error ?? "The request could not be sent.");
      }

      await trackMetaLead(values);
      setIsSubmitted(true);
      resetTimerRef.current = window.setTimeout(() => {
        startOver();
      }, 60000);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "The request could not be sent.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function goNext() {
    if (isSubmitting) {
      return;
    }

    const validationError = validateStep(currentStep.id);

    if (validationError) {
      setError(validationError);
      return;
    }

    if (isLastStep) {
      await submitRequest();
      return;
    }

    setCurrentIndex((current) => current + 1);
    setError("");
  }

  function goBack() {
    if (isSubmitting) {
      return;
    }

    setCurrentIndex((current) => Math.max(0, current - 1));
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await goNext();
  }

  function startOver() {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }

    setValues({ ...initialValues });
    setCurrentIndex(0);
    setError("");
    setIsSubmitted(false);
  }

  function renderStep() {
    switch (currentStep.id) {
      case "consent":
        return (
          <div className="space-y-5">
            <p className="text-base leading-7 text-slate-600 sm:text-lg">
              This form is designed to help us determine the right machine, configuration, and
              available options for your needs. Please complete it if you are actively considering
              this machine and would like pricing or a formal recommendation. If you are still
              gathering information or have general questions, please call or email us first - we will
              be happy to help.
            </p>

            <p className="text-base leading-7 text-slate-600 sm:text-lg">
              Call{" "}
              <a className="font-bold text-brand-700 hover:text-brand-800" href="tel:8065003915">
                806-500-3915
              </a>{" "}
              or email{" "}
              <a
                className="font-bold text-brand-700 hover:text-brand-800"
                href="mailto:sales@desiteproducts.com"
              >
                sales@desiteproducts.com
              </a>
              .
            </p>

            <label className="flex cursor-pointer gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-brand-200 hover:bg-brand-50">
              <input
                type="checkbox"
                checked={values.consent}
                onChange={(event) => updateValue("consent", event.target.checked)}
                className="mt-1 size-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm font-semibold leading-6 text-ink sm:text-base">
                I am actively considering this machine and would like pricing or a formal
                recommendation for the DeSite SLG 56 Mini Screener.
              </span>
            </label>
          </div>
        );
      case "bucketWidth":
        return (
          <fieldset className="mt-5 space-y-3">
            <legend className="sr-only">
              Bucket width in inches
            </legend>
            {bucketWidthOptions.map((option) => {
              const isSelected = values.bucketWidth === option.value;

              return (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                    isSelected
                      ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
                      : "border-slate-200 bg-white hover:border-brand-200 hover:bg-brand-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="bucketWidth"
                    value={option.value}
                    checked={isSelected}
                    onChange={(event) => updateValue("bucketWidth", event.target.value)}
                    className="size-5 border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-base font-bold text-ink">{option.label}</span>
                </label>
              );
            })}
          </fieldset>
        );
      case "fullName":
        return (
          <input
            type="text"
            aria-label="Full name"
            autoComplete="name"
            value={values.fullName}
            onChange={(event) => updateValue("fullName", event.target.value)}
            className={inputClasses}
            placeholder="Full name"
          />
        );
      case "phone":
        return (
          <input
            type="tel"
            aria-label="Phone number"
            autoComplete="tel-national"
            inputMode="tel"
            maxLength={14}
            value={values.phone}
            onChange={(event) => updateValue("phone", formatNorthAmericanPhone(event.target.value))}
            className={inputClasses}
            placeholder="(806) 500-3915"
          />
        );
      case "email":
        return (
          <input
            type="email"
            aria-label="Email address"
            autoComplete="email"
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
            className={inputClasses}
            placeholder="Email address"
          />
        );
      case "country":
        return (
          <fieldset className="mt-5 space-y-3">
            <legend className="sr-only">Delivery country</legend>
            {countryOptions.map((option) => {
              const isSelected = values.country === option.value;

              return (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                    isSelected
                      ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
                      : "border-slate-200 bg-white hover:border-brand-200 hover:bg-brand-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="country"
                    value={option.value}
                    checked={isSelected}
                    onChange={(event) => updateValue("country", event.target.value)}
                    className="size-5 border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-base font-bold text-ink">{option.label}</span>
                </label>
              );
            })}
          </fieldset>
        );
      case "roadName":
        return (
          <input
            type="text"
            aria-label="Street address or road name"
            autoComplete="street-address"
            value={values.roadName}
            onChange={(event) => updateValue("roadName", event.target.value)}
            className={inputClasses}
            placeholder="Street address or road name"
          />
        );
      case "city":
        return (
          <input
            type="text"
            aria-label="City"
            autoComplete="address-level2"
            value={values.city}
            onChange={(event) => updateValue("city", event.target.value)}
            className={inputClasses}
            placeholder="City"
          />
        );
      case "state":
        return (
          <input
            type="text"
            aria-label="State or province"
            autoComplete="address-level1"
            value={values.state}
            onChange={(event) => updateValue("state", event.target.value)}
            className={inputClasses}
            placeholder="State or province"
          />
        );
      case "zipCode":
        return (
          <input
            type="text"
            aria-label="ZIP or postal code"
            autoComplete="postal-code"
            value={values.zipCode}
            onChange={(event) => updateValue("zipCode", event.target.value)}
            className={inputClasses}
            placeholder="ZIP or postal code"
          />
        );
    }
  }

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-2xl rounded-lg border border-white/40 bg-white/95 p-6 text-center shadow-soft backdrop-blur sm:p-8 lg:p-10">
        <p className="text-sm font-semibold uppercase text-brand-600">Thank you</p>
        <h2 className="mt-4 text-2xl font-bold leading-tight text-ink sm:text-3xl">
          Your request is complete.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          Thank you for your interest in the DeSite SLG 56 Mini Screener. A sales representative can
          use these details to help prepare pricing, configuration guidance, or a formal
          recommendation.
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold text-slate-500">
          This form will reset automatically in 1 minute.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="tel:8065003915"
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            Call Us
          </a>
          <button
            type="button"
            onClick={startOver}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition hover:border-brand-200 hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl rounded-lg border border-white/40 bg-white/95 p-5 shadow-soft backdrop-blur sm:p-7 lg:p-8"
    >
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-brand-600">Request form</p>
          <h2 className="mt-2 text-2xl font-bold leading-tight text-ink sm:text-3xl">
            {currentStep.title}
          </h2>
        </div>
        <div className="shrink-0 text-sm font-semibold text-slate-500">
          Step {currentIndex + 1} of {steps.length}
        </div>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
        <div
          className="h-full rounded-full bg-brand-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-7 min-h-48">{renderStep()}</div>

      {error ? (
        <p
          className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={currentIndex === 0 || isSubmitting}
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Sending..." : isLastStep ? "Submit Request" : "Continue"}
        </button>
      </div>
    </form>
  );
}
