# Regen Web3 Toolkit — Backlog

Extracted from `Web3 Toolkit.md` master doc (line references in brackets). Not prioritized; owner TBD.

## Structural integrity (CSIS integration)

- [ ] **Add validation rules to Deployment Layer** — valid/invalid examples, minimum criteria per section. Right now requirements are defined but nothing checks if a deployment is actually valid. [L118–128]
- [ ] **Connect Option Library to CSIS constraints** — annotate every option (governance, funding, etc.) with required constraints and typical failure modes. Today teams can pick structurally incompatible systems. [L130–144]
- [ ] **Enforce CSIS in Tracks** — every track must pre-satisfy CSIS requirements and include constraint templates. Tracks are currently compositions but not guaranteed to be structurally valid. [L146–156]
- [ ] **Clarify compressive vs generative standards** — architecture doesn't yet distinguish them. Generative layer = conditions under which coordination capacity develops and is sustained. [L189–192]
- [ ] **Add capacity-building, shared understanding, and conflict transformation** as separate structural concerns in the deployment layer. [L191–192]
- [ ] **Encode conformance posture** — where is the system merely CSIS-inspired vs actually applying standards? Mark scope (e.g. Deployment = strict, Ontology = advisory). [L193–195]

## Resource Graph / curation

- [ ] **Add "Don't Know" section links** to proper places in the Resource Graph tab. [L160]
- [ ] **Resource audit** — confirm GPT didn't chop links from the source Google Sheet. Add: tokenengineeringlabs.com, block.science, Benjamin Barber FtC (computable law), occresearch.org, taxes (r/cryptotaxes + tools). [L164–168]
- [ ] **Add headings inside tabs** for easier navigation. [L170]
- [ ] **Input more context on Bloom, Greenpill, ReFi DAO** so the AI has full ecosystem grounding. [L180]
- [ ] **Add a location/interest/offers-and-requests connection layer** — Craigslist-esque matching for people not tied to a chapter/local node. [L176]
- [ ] **Reference other curated layers** — Bread Coop Share channel, other community curation patterns. [L178]

## Meeting notes

- [ ] **Consolidate all previous meeting notes** — LLM-distill/learn from them. Start with Apr 9 Regen Web3 Toolkit meeting (external Google Doc). [L106–110]

## Conceptual clarity

- [ ] **Taxonomy vs Ontology** — write a crisp distinction in the knowledge base. [L181]
- [ ] **RatherMercurial ontology review** — Octo, SuperBenefit; incorporate tweet L174. [L172–174]

## Content (from March sprint)

- [ ] Apply Matt's feedback on 4 articles (scams, seed phrases, wallet comparison, key terms). [L94]
- [ ] Add real-world examples from approved source maps (Restor, Hylo, P2P Foundation, ReFi Ecosystem, Weavers Network, Second Renaissance). [L95]
- [ ] Human review of all 67 published AI-assisted drafts — particularly for nuance, cultural context, and lived-experience content. [L47, L96]
- [ ] **Phase 2** — expand 43 medium-length (200–799 word) articles via editorial pipeline. [L92]
- [ ] **Phase 3** — write 139 stub articles from scratch. [L93]

## Master doc housekeeping

- [ ] **Resolve architecture version** — doc has 3 variants (Layers 1–8 detailed, 7-layer summary, 6-layer team map). Pick canonical, mark others as summaries.
- [ ] **Resolve ontology version** — Version A (Octo-aligned) vs Version B (CSIS-optimized). Doc recommends v1 as base + v2b as semantic overlay — formalize.
- [ ] **Extract resources dump** — 11+ domain URL lists (~lines 1089–5000) to structured `data/resources.yaml`. Large effort.
- [ ] **Archive previous iterations** (V2 Clean, V2+ Integrated, CSIS version Google Docs) — L100–102.

## External standards to integrate

- [ ] Durgadas — [CSIS standards](https://github.com/coordination-structural-integrity-suite/suite) — core structural integrity reference. [L116]
