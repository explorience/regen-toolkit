---
kb_type: signal
maturity: raw
corpus: articles
ai_assisted: true
---

# No known return path to Chainalysis or FBI IC3 — outreach needed

# assessed-but-excluded
- source_type on this work order was auto-classified "transcript" by the
  CLI's speaker-line heuristic (lines like "Your shield: reach crypto
  services..." false-positive-match the "Speaker: " regex); the article
  is actually a written guide/document. Processed it as such rather than
  forcing a transcript-shaped decomposition — flagging as a classifier
  friction, not silently overriding without note.
- "Building your security ecosystem" / "When prevention fails" sections —
  practical checklists and incident-response steps; treated as supporting
  material for the guide's encyclopedia-entry summary rather than split
  into their own objects (no new claim or concept beyond what's already
  captured).
- Direct references to FTC and Washington Post articles — kept as
  citations within existing objects rather than separate source-system
  cards, since they're one-off news citations, not living knowledge
  environments the toolkit will keep drawing from (unlike the
  Chainalysis annual report, which is recurring).

Hub: [[kb-hub-signal]]

Related: [[source-system]]

Source: `data/kb/signal.yaml#no-known-return-path-to-chainalysis-or-fbi-ic3-outreach-needed`
