"use client";
import type { TeamwearConfiguration } from "@/types";
import type { Action } from "@/lib/teamwear-state";
import { Field, inputClass } from "../controls";

export function ContactStep({
  state,
  dispatch,
  errors,
}: {
  state: TeamwearConfiguration;
  dispatch: (a: Action) => void;
  errors: string[];
}) {
  const nameError = errors.find((e) => e.includes("name to reply"));
  const reachError = errors.find((e) => e.includes("WhatsApp number or an email"));
  const emailError = errors.find((e) => e.includes("does not look right"));

  return (
    <div className="flex max-w-xl flex-col gap-8">
      <Field id="contact-name" label="Your name" error={nameError}>
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          value={state.contact.name}
          aria-invalid={Boolean(nameError)}
          aria-describedby={nameError ? "contact-name-error" : undefined}
          onChange={(e) => dispatch({ type: "setContact", field: "name", value: e.target.value })}
          className={inputClass}
        />
      </Field>

      <Field
        id="contact-org"
        label="Team or organisation"
        hint="Club, school, university, gym or company."
      >
        <input
          id="contact-org"
          type="text"
          autoComplete="organization"
          value={state.contact.organisation}
          onChange={(e) =>
            dispatch({ type: "setContact", field: "organisation", value: e.target.value })
          }
          className={inputClass}
        />
      </Field>

      <Field
        id="contact-whatsapp"
        label="WhatsApp number"
        hint="Fastest way to send you the design. Include the country code."
        error={reachError}
      >
        <input
          id="contact-whatsapp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+92 300 0000000"
          value={state.contact.whatsapp}
          aria-invalid={Boolean(reachError)}
          aria-describedby={reachError ? "contact-whatsapp-error" : undefined}
          onChange={(e) =>
            dispatch({ type: "setContact", field: "whatsapp", value: e.target.value })
          }
          className={inputClass}
        />
      </Field>

      <Field id="contact-email" label="Email" hint="Optional if you gave a WhatsApp number." error={emailError}>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          value={state.contact.email}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "contact-email-error" : undefined}
          onChange={(e) => dispatch({ type: "setContact", field: "email", value: e.target.value })}
          className={inputClass}
        />
      </Field>
    </div>
  );
}
