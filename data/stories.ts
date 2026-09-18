import type { Story } from "@/types";

/**
 * DEMO JOURNAL.
 *
 * Sample articles written to demonstrate the stories routes and the reading
 * layout. They are written in the brand voice and are technically plausible,
 * but they are not reviewed editorial and carry no claim about this brand's
 * own products, suppliers or factories.
 *
 * `body` is markdown-lite: a string beginning `## ` renders as a section
 * heading, anything else renders as a paragraph.
 */

export const STORIES: Story[] = [
  {
    slug: "what-gsm-actually-means",
    title: "What GSM actually means",
    date: "2026-08-14",
    category: "Material",
    standfirst:
      "Every technical garment quotes a number in grams per square metre. Very few explain what it changes about the thing you are about to wear.",
    readingMinutes: 5,
    body: [
      "GSM is grams per square metre. Cut a one-metre square out of a roll of fabric, weigh it, and that is the number. It is the single most useful specification on a garment label, and it is almost always printed without any explanation of what it buys you.",
      "## Lighter is not automatically better",
      "A 120 GSM running tee and a 420 GSM hoodie are not competing. They are solving opposite problems. The running tee is trying to get heat off your skin and out of the garment as fast as possible, so it is knitted thin and open. The hoodie is trying to hold heat in, so it is knitted thick with a brushed inner face that traps air.",
      "Where GSM becomes a genuine quality signal is within a category. Two training tees, both claiming to be performance pieces, one at 145 GSM and one at 190 GSM: the heavier one will usually feel more substantial in the hand and worse in the third kilometre.",
      "## The number does not describe the knit",
      "This is the part that gets lost. Two fabrics at identical weight can behave completely differently depending on how the yarn is structured. A tightly knitted 160 GSM jersey and an open-hole 160 GSM mesh weigh the same and ventilate nothing alike.",
      "So GSM tells you about mass, and mass correlates with warmth, durability and drape. It tells you nothing on its own about airflow, stretch recovery or how the fabric behaves once it is wet. A specification sheet that quotes weight and stops is telling you a quarter of the story.",
      "## What to actually ask",
      "Weight, composition and knit structure together. Composition tells you how it handles moisture — polyester moves it, cotton holds it, elastane is what lets it return to shape rather than bagging at the elbow. Knit structure tells you what the fabric does with air.",
      "Any brand that will give you all three is a brand that knows what it ordered from the mill.",
    ],
  },
  {
    slug: "margalla-at-six",
    title: "The Margalla trails at six in the morning",
    date: "2026-07-29",
    category: "Training",
    standfirst:
      "Islamabad has a mountain range on its northern edge and a two-hour window before the heat makes it a different proposition entirely.",
    readingMinutes: 4,
    body: [
      "Trail Five starts behind the Faisal Mosque and climbs roughly four hundred metres over three kilometres. At six in the morning in July it is already twenty-eight degrees and the humidity has not broken from the night before.",
      "## The first twenty minutes decide everything",
      "Anyone who runs the Margallas regularly will tell you the same thing: what you wear for the first twenty minutes is a different decision from what you would want for the rest of it. The climb out of the car park is steep and shaded, you are not yet producing much heat, and the air is still heavy.",
      "Twenty minutes in, the trail opens out, the sun clears the ridge, and the garment that felt reasonable at the trailhead becomes the thing you are thinking about instead of the run.",
      "## Why humid heat is a different problem",
      "In dry heat, sweat evaporates off the skin and the evaporation is what cools you. In humid heat the air is already carrying most of the water it can hold, so evaporation slows down and the cooling mechanism you are relying on partly stops working.",
      "This is why fabric weight matters more here than it does in a dry climate, and why a shirt that clings once it is wet is worse than a slightly heavier one that does not. Wet fabric held flat against skin blocks what little evaporation is still available.",
      "## What holds up",
      "Textured knits, because the surface relief keeps the cloth off the skin when it is saturated. Light colours on the exposed sections of the climb. A shoulder seam that sits inboard if you are carrying any kind of pack or vest, because a seam under a strap becomes a problem at about kilometre four.",
      "And a layer you can carry without noticing, for the descent, when you stop generating heat and the shade on the lower trail is genuinely cold.",
    ],
  },
  {
    slug: "why-team-kit-fades",
    title: "Why your team kit fades and what to do about it",
    date: "2026-06-18",
    category: "Teamwear",
    standfirst:
      "Two sets of jerseys, ordered the same week, same colours. One looks finished after a season. The difference is usually how the colour got onto the cloth.",
    readingMinutes: 6,
    body: [
      "There are three common ways to put a design onto a team jersey, and they age very differently. Most clubs find this out after the fact.",
      "## Screen printing",
      "Ink is pushed through a stencil onto the surface of the fabric and cured with heat. It sits on top of the cloth as a layer you can feel with a fingertip.",
      "It is cheap at volume, the colour is dense and accurate, and it is the right answer for a cotton tee. On a technical jersey it has two problems: the printed area does not breathe, and because the ink is a surface layer, it cracks along fold lines over time. Anywhere the garment creases repeatedly, that is where it will fail first.",
      "## Heat transfer vinyl",
      "A design is cut from coloured vinyl and pressed on. This is what most quick-turnaround shops use for names and numbers, because there is no screen to set up and a one-off is as cheap as a hundred.",
      "It is durable against fading — the colour is the vinyl, so it does not wash out. But it is a plastic sheet bonded to the cloth, it breathes even less than screen print, and the edges lift eventually. On a number that covers most of the back panel, that is a meaningful amount of the garment sealed shut.",
      "## Sublimation",
      "The design is printed onto transfer paper with disperse dye, then heat and pressure turn that dye into a gas which bonds into the polyester fibre itself. The colour becomes part of the yarn rather than a layer on top of it.",
      "Nothing sits on the surface, so the fabric breathes exactly as it did before printing, and there is no edge to lift or crack. It cannot fade in the way a surface print fades, because there is no surface print.",
      "The constraints are real: it only works on polyester or high-polyester blends, and it only works light-to-dark, so you cannot sublimate white onto a dark base — the base cloth has to be white and the design supplies all the colour.",
      "## What this means when you order",
      "If the kit is polyester and you want it to survive more than one season, sublimation is the answer for anything covering a large area. If you are putting a small crest on a cotton training tee, screen print is fine and cheaper.",
      "The question worth asking any supplier is simply which of the three they are using and why. A supplier who answers that clearly is one who has thought about the garment lasting.",
    ],
  },
  {
    slug: "anatomy-of-a-shoulder-seam",
    title: "The anatomy of a shoulder seam",
    date: "2026-05-22",
    category: "Construction",
    standfirst:
      "The single detail that decides whether a training top is comfortable is one most people never consciously notice.",
    readingMinutes: 4,
    body: [
      "Pick up any technical top and find the shoulder seam. Where it sits relative to the point of your shoulder tells you more about how the garment will feel in use than the fabric specification does.",
      "## Set-in",
      "The standard. The seam runs over the top of the shoulder, roughly along the line of the joint. It is the cleanest-looking option and it is what most shirts use, because it holds a defined shoulder line and looks sharp standing still.",
      "It is also directly under a backpack strap, a racket bag, or a vest. Anyone who has run with a hydration vest in a set-in-seam shirt knows what four kilometres of that feels like.",
      "## Raglan",
      "The seam runs diagonally from the underarm to the collar, so the sleeve and the shoulder are a single piece of cloth. There is no seam across the top of the joint at all.",
      "This is why raglan is standard on kit built for overhead movement — throwing, bowling, serving. The cost is aesthetic: a raglan has a softer, less defined shoulder line, which is why you see it far more on sportswear than on shirts.",
      "## Dropped",
      "The seam is moved outboard, past the point of the shoulder and onto the upper arm. It gives a relaxed line and, more usefully, means raising your arms pulls the sleeve rather than lifting the whole body of the garment.",
      "That last part is the practical argument. In a set-in top cut close, reaching overhead lifts the hem. In a dropped-shoulder cut, it does not.",
      "## Inboard",
      "Less common, and specific: the seam is moved the other way, inward from the joint toward the neck, deliberately clearing the strap line on either side. It exists almost entirely for people carrying something.",
      "None of these is correct in general. They are answers to different questions, and a brand that has chosen one on purpose will usually tell you which question it was answering.",
    ],
  },
  {
    slug: "training-through-a-punjab-summer",
    title: "Training through a Punjab summer",
    date: "2026-04-30",
    category: "Training",
    standfirst:
      "Forty-four degrees with the humidity of a monsoon approach is not a condition you train through with better willpower. It is one you plan around.",
    readingMinutes: 5,
    body: [
      "From late May through July, large parts of Punjab and Sindh sit in conditions where the standard advice about hydration and pacing stops being cautious and starts being the actual limit.",
      "## Wet bulb, not temperature",
      "The number on a weather app is dry bulb temperature, and on its own it is close to useless for judging whether a session is safe. What matters is the combination of heat and humidity, because that combination decides whether sweating can still cool you.",
      "At high humidity, sweat stops evaporating efficiently. You continue losing water while gaining progressively less cooling from it. This is the mechanism behind most serious heat incidents in sport, and it is why a humid thirty-eight can be more dangerous than a dry forty-three.",
      "## What actually changes",
      "Sessions move. Early morning before the sun clears, or after sunset. The middle of the day is not a test of commitment in these conditions, it is just a worse session with more risk attached.",
      "Intensity comes down for the first ten days of any significant heat, then comes back up. Heat acclimatisation is a real physiological adaptation — plasma volume increases, sweat rate rises and starts earlier, and sodium concentration in sweat drops. It takes most people ten to fourteen days of consistent exposure, and it is largely lost within about a month of stopping.",
      "## Clothing is a variable, not a solution",
      "The right garment helps at the margin: light, open-knit, textured so it does not seal to wet skin, in a colour that is not absorbing everything the sun offers. It changes how long you last and how comfortable you are while you do.",
      "It does not change the underlying physics. No fabric makes a midday session in a humid forty-two a good idea. The most useful thing a technical garment does in this climate is stay out of the way of a body that is already working hard enough.",
    ],
  },
];

export function getStory(slug: string): Story | undefined {
  return STORIES.find((s) => s.slug === slug);
}

/** Newest first. */
export function storiesByDate(): Story[] {
  return [...STORIES].sort((a, b) => b.date.localeCompare(a.date));
}

export function formatStoryDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
