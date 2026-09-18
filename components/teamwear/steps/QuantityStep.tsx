"use client";
import { getGarment } from "@/data/teamwear";
import type { TeamwearConfiguration } from "@/types";
import type { Action } from "@/lib/teamwear-state";
import { Field, inputClass } from "../controls";

export function QuantityStep({
  state,
  dispatch,
  errors,
}: {
  state: TeamwearConfiguration;
  dispatch: (a: Action) => void;
  errors: string[];
}) {
  const garment = getGarment(state.garment);
  const min = garment?.minimumOrder ?? 1;
  const garmentLabel = garment ? garment.name.toLowerCase() : "this garment";

  return (
    <div className="max-w-sm">
      <Field
        id="quantity"
        label="How many units"
        hint={`Minimum ${min} for ${garmentLabel}.`}
        error={errors[0]}
      >
        <input
          id="quantity"
          type="number"
          min={min}
          max={5000}
          step={1}
          value={Number.isFinite(state.quantity) ? state.quantity : ""}
          aria-invalid={errors.length > 0}
          aria-describedby={errors.length > 0 ? "quantity-error" : undefined}
          onChange={(e) => dispatch({ type: "setQuantity", value: e.target.valueAsNumber })}
          className={inputClass}
        />
      </Field>
      <p className="mt-6 text-[0.8125rem] text-muted">
        We do not quote a price here. Cost depends on fabric, print method and
        quantity, and we would rather give you a real number than an estimate
        that moves later.
      </p>
    </div>
  );
}
