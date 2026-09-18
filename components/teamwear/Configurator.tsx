"use client";

import { useReducer, useState, useMemo } from "react";
import { getGarment } from "@/data/teamwear";
import {
  reducer,
  initialConfiguration,
  STEPS,
  stepErrors,
  type Action,
  type StepId,
} from "@/lib/teamwear-state";
import type { TeamwearConfiguration } from "@/types";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { KitPreview } from "./KitPreview";
import { SportStep } from "./steps/SportStep";
import { GarmentStep } from "./steps/GarmentStep";
import { CustomiseStep } from "./steps/CustomiseStep";
import { QuantityStep } from "./steps/QuantityStep";
import { UploadStep } from "./steps/UploadStep";
import { ContactStep } from "./steps/ContactStep";
import { ReviewStep, type SubmitState } from "./steps/ReviewStep";

/**
 * SIGNATURE MOMENT 3 — Build your team.
 *
 * Presented as a product, not a contact form (brief 17). Seven steps, a live
 * preview that every control actually drives, and real validation, upload and
 * failure states.
 *
 * Step bodies live in their own files and the state lives in a reducer, so this
 * shell stays a shell (brief 43).
 */
export function Configurator() {
  const [state, dispatch] = useReducer(reducer, initialConfiguration);
  const [index, setIndex] = useState(0);
  const [showErrors, setShowErrors] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  const step = STEPS[index];
  const errors = useMemo(() => stepErrors(step.id, state), [step.id, state]);
  const blocked = errors.length > 0;
  const garment = getGarment(state.garment);

  function goNext() {
    if (blocked) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function goBack() {
    setShowErrors(false);
    setIndex((i) => Math.max(i - 1, 0));
  }

  async function submit() {
    setSubmitState({ status: "submitting" });
    try {
      const res = await fetch("/api/teamwear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sport: state.sport,
          garment: state.garment,
          colors: state.colors,
          pattern: state.pattern,
          quantity: state.quantity,
          logoPlacement: state.logoPlacement,
          playerName: state.playerName,
          playerNumber: state.playerNumber,
          hasLogo: Boolean(state.logo),
          hasSponsor: Boolean(state.sponsor),
          contact: state.contact,
        }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { message?: string } | null;
        setSubmitState({
          status: "error",
          message: body?.message ?? `The request failed (${res.status}). Nothing was sent.`,
        });
        return;
      }

      const body = (await res.json()) as { reference: string };
      setSubmitState({ status: "success", reference: body.reference });
    } catch {
      setSubmitState({
        status: "error",
        message:
          "We could not reach the server. Check your connection and try again — nothing was sent.",
      });
    }
  }

  const visibleErrors = showErrors ? errors : [];
  const inlineErrorStep = step.id === "quantity" || step.id === "contact";

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
      {/* ---- Steps ---- */}
      <div className="order-2 lg:order-1">
        <ol className="flex flex-wrap gap-x-5 gap-y-2 border-b border-line pb-5">
          {STEPS.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                /* Only steps already reached are navigable — you cannot skip
                   ahead past a gate that has not been satisfied. */
                disabled={i > index}
                aria-current={i === index ? "step" : undefined}
                onClick={() => {
                  setShowErrors(false);
                  setIndex(i);
                }}
                className={cn(
                  "text-spec min-h-[44px] transition-colors duration-[180ms]",
                  i === index && "text-ink",
                  i < index && "text-muted hover:text-ink",
                  i > index && "text-line-strong cursor-not-allowed",
                )}
              >
                {String(i + 1).padStart(2, "0")} {s.label}
              </button>
            </li>
          ))}
        </ol>

        <div className="py-9">
          <h2
            className="font-display"
            style={{
              fontSize: "var(--text-title)",
              lineHeight: "var(--text-title--line-height)",
              letterSpacing: "var(--text-title--letter-spacing)",
            }}
          >
            {headingFor(step.id)}
          </h2>

          <div className="mt-8">
            <StepBody
              id={step.id}
              state={state}
              dispatch={dispatch}
              errors={visibleErrors}
              submit={submit}
              submitState={submitState}
              onRetry={() => setSubmitState({ status: "idle" })}
            />
          </div>

          {visibleErrors.length > 0 && !inlineErrorStep && (
            <p role="alert" className="mt-6 text-[0.875rem] text-danger">
              {visibleErrors[0]}
            </p>
          )}

          {submitState.status !== "success" && (
            <div className="mt-12 flex items-center gap-3 border-t border-line pt-6">
              <Button type="button" variant="outline" onClick={goBack} disabled={index === 0}>
                Back
              </Button>
              {index < STEPS.length - 1 && (
                <Button type="button" onClick={goNext}>
                  Continue
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ---- Live preview ---- */}
      <aside className="order-1 mb-10 lg:order-2 lg:mb-0">
        <div className="sticky top-[88px]">
          <div className="border border-line bg-surface p-6">
            <KitPreview
              colors={state.colors}
              pattern={state.pattern}
              playerName={state.playerName}
              playerNumber={state.playerNumber}
              logoUrl={state.logo?.previewUrl ?? null}
              logoPlacement={state.logoPlacement}
              showName={garment?.supportsName ?? false}
              showNumber={garment?.supportsNumber ?? false}
              className="mx-auto h-auto w-full max-w-[20rem]"
            />
          </div>
          <p className="text-spec mt-4 text-muted">
            {garment ? `${garment.name} · ${state.quantity} units` : "Choose a garment"}
          </p>
        </div>
      </aside>
    </div>
  );
}

function headingFor(id: StepId): string {
  switch (id) {
    case "sport":
      return "What are you playing?";
    case "garment":
      return "What are we making?";
    case "customise":
      return "Make it yours.";
    case "quantity":
      return "How many?";
    case "upload":
      return "Send us your artwork.";
    case "contact":
      return "Where do we send the design?";
    case "review":
      return "Check it over.";
  }
}

interface StepBodyProps {
  id: StepId;
  state: TeamwearConfiguration;
  dispatch: React.Dispatch<Action>;
  errors: string[];
  submit: () => void;
  submitState: SubmitState;
  onRetry: () => void;
}

function StepBody({ id, state, dispatch, errors, submit, submitState, onRetry }: StepBodyProps) {
  switch (id) {
    case "sport":
      return <SportStep state={state} dispatch={dispatch} />;
    case "garment":
      return <GarmentStep state={state} dispatch={dispatch} />;
    case "customise":
      return <CustomiseStep state={state} dispatch={dispatch} />;
    case "quantity":
      return <QuantityStep state={state} dispatch={dispatch} errors={errors} />;
    case "upload":
      return <UploadStep state={state} dispatch={dispatch} />;
    case "contact":
      return <ContactStep state={state} dispatch={dispatch} errors={errors} />;
    case "review":
      return (
        <ReviewStep state={state} submit={submit} submitState={submitState} onRetry={onRetry} />
      );
  }
}
