"use client";
import { COLORWAYS, PATTERNS, LOGO_PLACEMENTS, getGarment } from "@/data/teamwear";
import type { TeamwearConfiguration, LogoPlacement } from "@/types";
import type { Action } from "@/lib/teamwear-state";
import { OptionGrid, OptionCard, SwatchRow, Field, inputClass } from "../controls";

export function CustomiseStep({ state, dispatch }: { state: TeamwearConfiguration; dispatch: (a: Action) => void }) {
  const garment = getGarment(state.garment);
  if (!garment) return null;

  return (
    <div className="flex flex-col gap-10">
      {garment.regions.map((region) => (
        <SwatchRow
          key={region.id}
          legend={region.label}
          name={`color-${region.id}`}
          options={COLORWAYS}
          value={state.colors[region.id] ?? region.defaultColor}
          onChange={(hex) => dispatch({ type: "setColor", region: region.id, hex })}
        />
      ))}

      <div>
        <p className="text-spec mb-3 text-muted">Pattern</p>
        <OptionGrid legend="Choose a pattern" columns={4}>
          {PATTERNS.map((p) => (
            <OptionCard
              key={p.id}
              name="pattern"
              value={p.id}
              checked={state.pattern === p.id}
              onChange={(v) => dispatch({ type: "setPattern", pattern: v })}
              title={p.name}
            />
          ))}
        </OptionGrid>
      </div>

      <div>
        <p className="text-spec mb-3 text-muted">Logo placement</p>
        <OptionGrid legend="Choose logo placement" columns={4}>
          {LOGO_PLACEMENTS.map((p) => (
            <OptionCard
              key={p.id}
              name="placement"
              value={p.id}
              checked={state.logoPlacement === p.id}
              onChange={(v) => dispatch({ type: "setLogoPlacement", placement: v as LogoPlacement })}
              title={p.name}
            />
          ))}
        </OptionGrid>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {garment.supportsName && (
          <Field id="player-name" label="Player name" hint="Up to 12 characters. Shown on the preview.">
            <input
              id="player-name"
              type="text"
              maxLength={12}
              value={state.playerName}
              onChange={(e) => dispatch({ type: "setPlayerName", value: e.target.value })}
              className={inputClass}
              placeholder="KHAN"
            />
          </Field>
        )}
        {garment.supportsNumber && (
          <Field id="player-number" label="Player number" hint="Up to two digits.">
            <input
              id="player-number"
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={state.playerNumber}
              onChange={(e) => dispatch({ type: "setPlayerNumber", value: e.target.value })}
              className={inputClass}
              placeholder="10"
            />
          </Field>
        )}
      </div>

      <p className="border-l-2 border-line-strong pl-4 text-[0.8125rem] text-muted">
        Name and number are shown on one sample garment so you can see the
        treatment. Per-player names and numbers are collected as a list once you
        approve the design.
      </p>
    </div>
  );
}
