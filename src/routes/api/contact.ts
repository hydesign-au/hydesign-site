import { createFileRoute } from "@tanstack/react-router";

import { CONTACT_SUCCESS_MESSAGE, contactEnquirySchema } from "@/lib/contact";
import { ContactSubmissionError, deliverContactEnquiry } from "@/lib/contact.server";
import { privateNoStoreHeaders } from "@/lib/http-cache";

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const payload = await request.json().catch(() => null);
        const parsed = contactEnquirySchema.safeParse(payload);

        if (!parsed.success) {
          return jsonError(parsed.error.issues[0]?.message ?? "Send the enquiry form again.", 400);
        }

        try {
          await deliverContactEnquiry(parsed.data, requestIp(request.headers));
        } catch (error) {
          if (error instanceof ContactSubmissionError) {
            return jsonError(error.message, error.status);
          }

          console.error("Contact enquiry delivery failed", {
            message: error instanceof Error ? error.message : String(error),
          });
          return jsonError("We couldn't send the enquiry. Please call us.", 500);
        }

        return Response.json(
          {
            ok: true,
            message: CONTACT_SUCCESS_MESSAGE,
          },
          { headers: privateNoStoreHeaders },
        );
      },
    },
  },
});

function requestIp(headers: Headers) {
  const forwardedFor = headers.get("cf-connecting-ip") ?? headers.get("x-forwarded-for") ?? "";
  return forwardedFor.split(",", 1)[0]?.trim() ?? "";
}

function jsonError(message: string, status: number) {
  return Response.json({ ok: false, message }, { status, headers: privateNoStoreHeaders });
}
