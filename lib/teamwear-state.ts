import type { TeamwearConfiguration, UploadedAsset, LogoPlacement, SportId, GarmentId } from "@/types";
import { getGarment } from "@/data/teamwear";

export const STEPS = [
  { id: "sport", label: "Sport" },
  { id: "garment", label: "Garment" },
  { id: "customise", label: "Customise" },
  { id: "quantity", label: "Quantity" },
  { id: "upload", label: "Artwork" },
  { id: "contact", label: "Contact" },
  { id: "review", label: "Review" },
] as const;

export type StepId = (typeof STEPS)[number]["id"];

export const initialConfiguration: TeamwearConfiguration = {
  sport: null,
  garment: null,
  colors: { body: "#1c1917", panel: "#b85d3b", collar: "#f9f8f6" },
  pattern: "none",
  playerName: "",
  playerNumber: "",
  quantity: 12,
  logo: null,
  sponsor: null,
  logoPlacement: "chest-left",
  contact: { name: "", whatsapp: "", email: "", organisation: "" },
};

export type Action =
  | { type: "setSport"; sport: SportId }
  | { type: "setGarment"; garment: GarmentId }
  | { type: "setColor"; region: string; hex: string }
  | { type: "setPattern"; pattern: string }
  | { type: "setPlayerName"; value: string }
  | { type: "setPlayerNumber"; value: string }
  | { type: "setQuantity"; value: number }
  | { type: "setLogo"; asset: UploadedAsset | null }
  | { type: "setSponsor"; asset: UploadedAsset | null }
  | { type: "setLogoPlacement"; placement: LogoPlacement }
  | { type: "setContact"; field: keyof TeamwearConfiguration["contact"]; value: string }
  | { type: "reset" };

export function reducer(state: TeamwearConfiguration, action: Action): TeamwearConfiguration {
  switch (action.type) {
    case "setSport": {
      // Changing sport can invalidate the garment — clear it rather than carry
      // a combination that isn't offered.
      const garment = getGarment(state.garment);
      const stillValid = garment?.sports.includes(action.sport) ?? false;
      return { ...state, sport: action.sport, garment: stillValid ? state.garment : null };
    }
    case "setGarment": {
      const garment = getGarment(action.garment);
      const colors = { ...state.colors };
      // Seed any region this garment has that the previous one didn't.
      garment?.regions.forEach((r) => {
        if (!(r.id in colors)) colors[r.id] = r.defaultColor;
      });
      const minimum = garment?.minimumOrder ?? 1;
      return {
        ...state,
        garment: action.garment,
        colors,
        quantity: Math.max(state.quantity, minimum),
      };
    }
    case "setColor":
      return { ...state, colors: { ...state.colors, [action.region]: action.hex } };
    case "setPattern":
      return { ...state, pattern: action.pattern };
    case "setPlayerName":
      return { ...state, playerName: action.value.slice(0, 12) };
    case "setPlayerNumber":
      return { ...state, playerNumber: action.value.replace(/\D/g, "").slice(0, 2) };
    case "setQuantity":
      return { ...state, quantity: Number.isFinite(action.value) ? action.value : 0 };
    case "setLogo":
      return { ...state, logo: action.asset };
    case "setSponsor":
      return { ...state, sponsor: action.asset };
    case "setLogoPlacement":
      return { ...state, logoPlacement: action.placement };
    case "setContact":
      return { ...state, contact: { ...state.contact, [action.field]: action.value } };
    case "reset":
      return initialConfiguration;
    default:
      return state;
  }
}

/** Per-step validity. Drives whether Continue is enabled and what error shows. */
export function stepErrors(step: StepId, s: TeamwearConfiguration): string[] {
  const errors: string[] = [];
  const garment = getGarment(s.garment);

  switch (step) {
    case "sport":
      if (!s.sport) errors.push("Choose a sport to continue.");
      break;
    case "garment":
      if (!s.garment) errors.push("Choose a garment to continue.");
      break;
    case "quantity": {
      const min = garment?.minimumOrder ?? 1;
      if (!Number.isInteger(s.quantity)) errors.push("Enter a whole number.");
      else if (s.quantity < min)
        errors.push(`Minimum order for this garment is ${min} units.`);
      else if (s.quantity > 5000)
        errors.push("For orders above 5,000 units, talk to us directly.");
      break;
    }
    case "contact": {
      if (!s.contact.name.trim()) errors.push("We need a name to reply to.");
      const hasWhatsapp = s.contact.whatsapp.replace(/\D/g, "").length >= 10;
      const hasEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s.contact.email.trim());
      if (!hasWhatsapp && !hasEmail)
        errors.push("Give us a WhatsApp number or an email address so we can send the design.");
      if (s.contact.email.trim() && !hasEmail) errors.push("That email address does not look right.");
      break;
    }
    default:
      break;
  }
  return errors;
}

export function isStepValid(step: StepId, s: TeamwearConfiguration): boolean {
  return stepErrors(step, s).length === 0;
}
