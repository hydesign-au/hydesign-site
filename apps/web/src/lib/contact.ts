import * as z from "zod";

import { services } from "@/content/services";

// One schema for the enquiry form, shared by both sides: the contact form validates
// against it through TanStack Form, and /api/contact parses the request body with it.

const serviceSlugs = new Set(services.map((service) => service.slug));
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CONTACT_SUCCESS_MESSAGE = "Thanks for contacting us, we'll get back to you shortly.";

export const contactEnquirySchema = z
  .object({
    name: z.string().trim().min(1, "Required."),
    email: z.string().trim().min(1, "Required."),
    phone: z.string().trim(),
    service: z.string().min(1, "Required."),
    other: z.string().trim(),
    suburb: z.string().trim(),
    message: z.string().trim().min(1, "Required."),
    captchaToken: z.string().max(2048),
  })
  .superRefine((value, ctx) => {
    if (value.email && !emailPattern.test(value.email)) {
      ctx.addIssue({ code: "custom", path: ["email"], message: "Check the email address." });
    }

    if (value.service && value.service !== "other" && !serviceSlugs.has(value.service)) {
      ctx.addIssue({
        code: "custom",
        path: ["service"],
        message: "Choose a service from the list.",
      });
    }

    if (value.service === "other" && !value.other) {
      ctx.addIssue({ code: "custom", path: ["other"], message: "Required." });
    }
  });

export type ContactEnquiry = z.infer<typeof contactEnquirySchema>;

export type ContactFormConfig = { formEnabled: false } | { formEnabled: true; siteKey: string };
