# Contributing content to the Regen Web3 Toolkit

Thanks for jumping in. This is the short version of how the content is structured, the bar to write to, and where help is most needed.

## How it was made (the honest version)

AI-assisted, human-reviewed. First drafts came out of a multi-agent pipeline (research, draft, fact-check, edit, persona-critique), then everything was scrubbed and fact-checked by hand and de-slopped (AI tells and clichés stripped, sources verified, every URL checked). So there is a real editorial bar; it was just heavily AI-accelerated. Not "unattended."

## The structure to fit into

Content is organised into **3 guided journeys**, each an ordered sequence of articles:

- **Newcomer Orientation** (16) — from zero to oriented
- **Local Node Builder** (22) — standing up a chapter / hub / node
- **Knowledge Commons Builder** (14) — building a living knowledge commons

The journeys are defined in [`src/data/journeys.js`](../src/data/journeys.js) (the ordered list of articles per chapter, plus blurbs). Each article is a plain Markdown file in [`src/content/docs/`](../src/content/docs/) named by its slug, e.g. `what-is-blockchain.md`. There is also a knowledge map at `/explorer/` generated from `journeys.js` (run `node scripts/gen-graph.mjs` to regenerate after changing journeys), and curated cross-journey "related" links live in that same script.

## House style (the bar)

Pulled from `skills/references/content-style-guide.md`:

- **Voice:** warm, plain, practical, anti-hype. Direct address ("you"), active voice, cut fluff.
- **Open with a concrete scenario** the reader recognises from their own work. No throat-clearing.
- **Define every jargon term in bold on first use**, immediately followed by a plain-language explanation.
- **One idea per section.** Short paragraphs. Real, named examples (never invented projects, tools or places).
- **Source-backed, no hallucination.** Verify time-sensitive facts (figures, fees, tool names, dates) against the live web; if you can't verify a specific stat, qualify it or cut it.
- End the body with a **`## Try This`** block of three tiered next steps:
  > **Start here:** one thing anyone can do today
  > **Go deeper:** a hands-on exercise needing some setup
  > **Stretch:** a real implementation challenge
- End with a **`## References`** list: every external source as a Markdown link with a short note.
- **No em-dashes.** Use commas, colons, parentheses, or split the sentence. (Hard house rule.)
- **Word count:** foundational/concept articles 800-1200; how-to / case studies 1200-1800.
- **Frontmatter is clean Starlight, only:**
  ```
  ---
  title: "Title Case Title"
  description: "One real sentence: what this covers and who it's for."
  ---
  ```
  No other frontmatter keys (they break the build).

Three reader personas to write for: the **grounded regen** (new to crypto, real-world organiser), the **on-chain regen** (in ReFi, building locally), the **curious degen** (crypto-native, wants legit impact).

## Where help is most needed (gap list)

In rough priority for someone with a knowledge-architecture / ontology background:

1. **Knowledge Commons Builder journey** — most in your wheelhouse. The 14 articles are drafted; they would benefit from an expert eye, especially `ontology-vs-taxonomy`, `source-systems`, `metadata-that-matters`, `review-and-maturity`, `federation-portability`, `knowledge-tools-directory`.
2. **The structured / interop layer** — the weakest part right now. Article metadata, the cross-linking model (currently a hand-curated set of 10 "related" edges in `scripts/gen-graph.mjs`), and any path toward a real shared ontology / Geo Protocol / SuperBenefit-garden interop. This is exactly where your Geo work applies.
3. **The backlog** — see [`docs/backlog.md`](./backlog.md): ~118 scaffolded-but-unwritten topics grouped by section. The biggest gaps are Track 3 (Playbooks): regional and thematic case studies, protocol playbooks, the tools directory, and the glossary.
4. **Review the older library articles** — ~67 real articles that sit outside the 3 journeys are from an earlier pass and aren't yet at the current bar.

## How to contribute

1. Work against the toolkit repo (`explorience/regen-toolkit`). The current journey content lives on the `build/onboarding-journeys-v1` branch / PR #311 (ask Heenal for the right base if it hasn't merged yet).
2. Add or revise a Markdown article in `src/content/docs/` in the format above, or propose new articles/edits to a journey in `src/data/journeys.js`.
3. `npm install && npm run dev` to preview locally.
4. Open a PR. Keep changes scoped to a chapter or topic so they're easy to review.

Questions, just ask Heenal. Most useful first move: pick a chapter in the Knowledge Commons journey and tell him where you'd deepen it.
