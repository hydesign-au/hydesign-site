import { services } from "@/content/services";
import { siteSettings } from "@/content/site";
import type { ContactEnquiry, ContactFormConfig } from "@/lib/contact";
import { runtimeEnv, runtimeValue } from "@/server/env";

type EnabledContactConfig = {
  formEnabled: true;
  siteKey: string;
  secretKey: string;
  email: SendEmail;
};

type ContactConfig = { formEnabled: false } | EnabledContactConfig;

const TURNSTILE_TIMEOUT_MS = 10 * 1000;

const serviceLabels = new Map([
  ...services.map((service) => [service.slug, service.title] as const),
  ["other", "Other"] as const,
]);

class ContactSubmissionError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

function readContactFormConfig(): ContactFormConfig {
  const config = readContactConfig();
  return config.formEnabled
    ? { formEnabled: true, siteKey: config.siteKey }
    : { formEnabled: false };
}

async function deliverContactEnquiry(enquiry: ContactEnquiry, remoteIp: string) {
  const config = readContactConfig();
  if (!config.formEnabled) {
    throw new ContactSubmissionError(
      "The enquiry form isn't available. Please call or email us.",
      503,
    );
  }

  await verifyTurnstile(enquiry.captchaToken, remoteIp, config.secretKey);

  const serviceLabel = serviceLabels.get(enquiry.service) ?? enquiry.service;
  await config.email.send({
    from: "no-reply@hydesign.com.au",
    to: siteSettings.email,
    replyTo: enquiry.email || undefined,
    subject: `HyDesign enquiry${serviceLabel ? ` - ${serviceLabel}` : ""}`,
    text: buildEmailText(enquiry, serviceLabel),
  });
}

function readContactConfig(): ContactConfig {
  const siteKey = runtimeValue("TURNSTILE_SITE_KEY");
  const secretKey = runtimeValue("TURNSTILE_SECRET_KEY");
  const email = runtimeEnv.CONTACT_EMAIL;

  if (!siteKey || !secretKey || !email) {
    return { formEnabled: false };
  }

  return { formEnabled: true, siteKey, secretKey, email };
}

async function verifyTurnstile(token: string, remoteIp: string, secretKey: string) {
  if (!token) {
    throw new ContactSubmissionError("Complete the CAPTCHA check.", 400);
  }

  const body = new FormData();
  body.set("secret", secretKey);
  body.set("response", token);

  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  let response: Response;
  try {
    response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(TURNSTILE_TIMEOUT_MS),
    });
  } catch {
    throw new ContactSubmissionError("CAPTCHA couldn't be checked. Please try again.", 502);
  }

  if (!response.ok) {
    throw new ContactSubmissionError("CAPTCHA couldn't be checked. Please try again.", 502);
  }

  const result = await response.json().catch(() => null);
  if (!isRecord(result) || result.success !== true) {
    throw new ContactSubmissionError("Complete the CAPTCHA check again.", 400);
  }
}

function buildEmailText(enquiry: ContactEnquiry, serviceLabel: string) {
  const interest = enquiry.service === "other" ? `${serviceLabel}: ${enquiry.other}` : serviceLabel;

  const contactDetails = [
    `Email: ${enquiry.email}`,
    enquiry.phone ? `Phone: ${enquiry.phone}` : "",
    enquiry.suburb ? `Suburb / site: ${enquiry.suburb}` : "",
  ].filter(Boolean);

  return [
    `Hi there, my name is ${enquiry.name}. I'm interested in ${interest}.`,
    "",
    enquiry.message,
    "",
    ...contactDetails,
  ].join("\n");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

export { ContactSubmissionError, deliverContactEnquiry, readContactFormConfig };
