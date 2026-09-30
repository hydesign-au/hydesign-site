import { Button } from "@hydesign/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@hydesign/ui/components/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@hydesign/ui/components/field";
import { Input } from "@hydesign/ui/components/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@hydesign/ui/components/select";
import { Textarea } from "@hydesign/ui/components/textarea";
import { Turnstile } from "@marsidev/react-turnstile";
import { useForm } from "@tanstack/react-form";
import { SendIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { createPortal } from "react-dom";

import { Confetti } from "@/components/confetti";
import { services } from "@/content/services";
import {
  CONTACT_SUCCESS_MESSAGE,
  contactEnquirySchema,
  type ContactFormConfig,
} from "@/lib/contact";

type FormStatus = { kind: "idle" | "success" | "error"; message: string };
type TextFieldName = "name" | "email" | "phone" | "other" | "suburb";

const serviceItems: Record<string, string> = {
  ...Object.fromEntries(services.map((service) => [service.slug, service.title])),
  other: "Other",
};

const successConfettiOptions = {
  particleCount: 80,
  spread: 70,
  startVelocity: 35,
  origin: { y: 0.62 },
  disableForReducedMotion: true,
};

function ContactFormCard({
  config,
  initialService = "",
}: {
  config: ContactFormConfig;
  initialService?: string;
}) {
  const [status, setStatus] = useState<FormStatus>({ kind: "idle", message: "" });
  const reduceMotion = useReducedMotion();
  const validInitialService = initialService in serviceItems ? initialService : "";

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: validInitialService,
      other: "",
      suburb: "",
      message: "",
      captchaToken: "",
    },
    validators: { onSubmit: contactEnquirySchema },
    onSubmit: async ({ value }) => {
      setStatus({ kind: "idle", message: "" });

      // Without Turnstile the server answers that enquiries are unavailable.
      if (config.formEnabled && !value.captchaToken) {
        setStatus({ kind: "error", message: "Complete the CAPTCHA check." });
        return;
      }

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });
        const result = readContactResponse(await response.json().catch(() => null));

        if (!response.ok) {
          setStatus({
            kind: "error",
            message: result.message ?? "Something did not send. Please call or email us directly.",
          });
          return;
        }

        setStatus({
          kind: "success",
          message: result.message ?? CONTACT_SUCCESS_MESSAGE,
        });
      } catch {
        setStatus({
          kind: "error",
          message: "Something did not send. Please call or email us directly.",
        });
      }
    },
  });

  const textField = (name: TextFieldName, label: string, type = "text") => (
    <form.Field name={name}>
      {(field) => {
        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            <Input
              aria-invalid={isInvalid}
              id={field.name}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              type={type}
              value={field.state.value}
            />
            <FieldError errors={field.state.meta.errors} />
          </Field>
        );
      }}
    </form.Field>
  );

  const transition = { duration: reduceMotion ? 0 : 0.28, ease: "easeInOut" as const };

  return (
    <div className="relative">
      <Card className="[--card-spacing:--spacing(6)] md:[--card-spacing:--spacing(8)]">
        <CardHeader>
          <CardTitle>Shoot us a message</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence initial={false} mode="wait">
            {status.kind === "success" ? (
              <motion.div
                key="confirmation"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={transition}
              >
                <p aria-live="polite" className="leading-6 text-foreground" role="status">
                  {status.message}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={transition}
                className="overflow-hidden"
              >
                <form
                  noValidate
                  onSubmit={(event) => {
                    event.preventDefault();
                    void form.handleSubmit();
                  }}
                >
                  <FieldGroup className="gap-4">
                    <FieldGroup className="grid gap-4 md:grid-cols-2">
                      {textField("name", "Name")}
                      {textField("email", "Email", "email")}
                    </FieldGroup>
                    <FieldGroup className="grid gap-4 md:grid-cols-2">
                      {textField("phone", "Phone", "tel")}
                      {textField("suburb", "Suburb / site location")}
                    </FieldGroup>
                    <form.Field name="service">
                      {(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor="service">
                              What service are you interested in?
                            </FieldLabel>
                            <Select
                              items={serviceItems}
                              onValueChange={(value) => {
                                const nextValue = typeof value === "string" ? value : "";
                                field.handleChange(nextValue);
                                if (nextValue !== "other") {
                                  form.setFieldValue("other", "");
                                }
                              }}
                              value={field.state.value || null}
                            >
                              <SelectTrigger
                                aria-invalid={isInvalid}
                                className="w-full"
                                id="service"
                              >
                                <SelectValue placeholder="Choose a service" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {services.map((service) => (
                                    <SelectItem key={service.slug} value={service.slug}>
                                      {service.title}
                                    </SelectItem>
                                  ))}
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FieldError errors={field.state.meta.errors} />
                          </Field>
                        );
                      }}
                    </form.Field>
                    <form.Subscribe selector={(state) => state.values.service}>
                      {(service) =>
                        service === "other"
                          ? textField("other", "Briefly explain what you're after")
                          : null
                      }
                    </form.Subscribe>
                    <form.Field name="message">
                      {(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor="message">Message</FieldLabel>
                            <Textarea
                              aria-invalid={isInvalid}
                              className="min-h-36"
                              id="message"
                              name="message"
                              onBlur={field.handleBlur}
                              onChange={(event) => field.handleChange(event.target.value)}
                              value={field.state.value}
                            />
                            <FieldError errors={field.state.meta.errors} />
                          </Field>
                        );
                      }}
                    </form.Field>
                    {config.formEnabled ? (
                      <form.Field name="captchaToken">
                        {(field) => (
                          <Turnstile
                            onError={() => field.handleChange("")}
                            onExpire={() => field.handleChange("")}
                            onSuccess={(token) => field.handleChange(token)}
                            options={{ size: "invisible" }}
                            siteKey={config.siteKey}
                          />
                        )}
                      </form.Field>
                    ) : null}
                    {status.message ? <FieldError>{status.message}</FieldError> : null}
                    <form.Subscribe selector={(state) => state.isSubmitting}>
                      {(isSubmitting) => (
                        <Button disabled={isSubmitting} type="submit">
                          {isSubmitting ? "Sending..." : "Send"}
                          <SendIcon data-icon="inline-end" />
                        </Button>
                      )}
                    </form.Subscribe>
                  </FieldGroup>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      {status.kind === "success"
        ? createPortal(
            <Confetti
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 z-50 h-dvh w-dvw"
              options={successConfettiOptions}
            />,
            document.body,
          )
        : null}
    </div>
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function readContactResponse(value: unknown): { message?: string } {
  if (!isRecord(value)) {
    return {};
  }

  return typeof value.message === "string" ? { message: value.message } : {};
}

export { ContactFormCard };
