---
id: regen-web3-toolkit
type: project
name: "Regen Web3 Toolkit"
status: Develop
stage: planning
lead: did:refi-bcn:luiz-fernando
contributors:
  - did:refi-bcn:heenal
  - did:refi-bcn:matt
  - did:refi-bcn:brandon
startDate: 2026-02-20
repo: https://github.com/regen-coordination/regen-toolkit
site: https://regen-toolkit-site.vercel.app
charmverse: https://app.charmverse.io/greenpill-writers-guild/tools-for-regeneration-project-plan-6070706289406744
master_doc: docs/projects/regen-toolkit/Web3 Toolkit.md
---

# Regen Web3 Toolkit

**Status**: Develop · **Lead**: Luiz Fernando · **Repo**: [regen-coordination/regen-toolkit](https://github.com/regen-coordination/regen-toolkit) · **Site**: [regen-toolkit-site.vercel.app](https://regen-toolkit-site.vercel.app)

## Vision

A layered knowledge and coordination system for regenerative web3 and local ecosystem building. At the surface, an educational and navigation tool; underneath, a system that connects knowledge, real-world projects, design options, deployment constraints, and ontology — so people can not only learn ideas but also apply them in coherent ways.

In one sentence: **a regenerative web3 knowledge garden that doubles as a design and deployment framework**.

## Three concurrent goals

1. **Public-facing knowledge base** — 254 articles in inventory, 67 drafted and deployed, 5 learning paths, knowledge explorer, tag explorer, editorial pipeline.
2. **Mapping and resource layer** — aggregates projects, organizations, people, tools, papers, ecosystem references across ReFi, governance, localism, mechanism design.
3. **Coordination architecture** — not just a library of ideas but a structured system for helping groups choose models, understand tradeoffs, and deploy them with clarity.

## System architecture (8 layers)

| # | Layer | Function | Owner |
|---|---|---|---|
| 1 | Resource Graph | Reality-grounding — projects, orgs, people, places, papers, tools, maps | Brandon + TBD curator |
| 2 | Encyclopedia | Structured knowledge — concepts, frameworks, articles, learning paths | Heenal |
| 3 | Ontology | Semantic backbone — entity types, relationships, classifications (spans all layers) | Matt (ops taxonomy) + Luiz (architecture) |
| 4 | Option Library | Design components — governance, coordination, funding, incentives, measurement | Luiz; unowned in practice |
| 5 | Deployment | Structural constraint — decision, info, power, accountability, failure detection, classification | Luiz + Durgadas (CSIS upstream) |
| 6 | Tracks | Application compositions — audience/context-specific pathways | Heenal |
| 7 | Implementations | Real deployments — local nodes, pilots, campaigns, case studies | Unowned |
| 8 | Feedback & Evolution | System update — capture → classify → review → update → communicate → version | Unowned |

**Flow:** Resource Graph → Encyclopedia → Option Library → Deployment → Tracks → Implementations → Feedback → back into all prior layers. **Ontology** cross-cuts everything.

## CSIS conformance posture

The Regen Toolkit is *not* a CSIS implementation. It is a broader knowledge, design, and deployment system that is increasingly informed by CSIS as a structural integrity framework. CSIS is applied most directly in the **Deployment Layer** (options/tracks must translate into explicit structural conditions), and secondarily in the **Feedback Layer** (tensions, failures, adaptations are surfaced and integrated).

Open architectural gaps flagged in the master doc:
- Compressive vs generative standards not yet explicit
- Capacity-building conditions, shared understanding, and conflict transformation not separated from structural constraints
- No assessment/conformance posture (partial adoption vs full conformance)

## Extracted artifacts

Structured extractions from the master doc live alongside canonical org-os data:

- **Ontology entities** — `data/ontology/regen-toolkit-entities.yaml` (15 core types + extensions)
- **Ontology relationships** — `data/ontology/regen-toolkit-relationships.yaml`
- **Classification layers** — `data/ontology/regen-toolkit-classification.yaml` (9 cross-cutting attributes)
- **Octo/SuperBenefit interop mapping** — `data/ontology/regen-toolkit-octo-mapping.yaml`
- **Option Library taxonomy** — `data/option-library.yaml` (9 categories)
- **Deployment requirements** — `data/deployment-requirements.yaml` (6 structural components + invalid conditions)
- **Feedback process** — `data/feedback-process.yaml` (5-step loop + governance)

## Backlog

Explicit todos extracted from master doc → `docs/projects/regen-toolkit/BACKLOG.md` (11 items, CSIS integration + validation + resource audit).

## Current sprint status (from master doc, dated 2026-03-25/26)

- 67 articles drafted and deployed via 5-stage editorial pipeline (research → writing → fact-checking → editing → critique)
- Astro/Starlight site deployed at regen-toolkit-site.vercel.app
- Knowledge Explorer with 5 learning paths live (Newcomer 21, Community Org 23, Local Chapter 17, Governance 14, Environmental 20)
- Matt's ontology integrated as structured frontmatter metadata
- Mapping Infrastructure doc (Brandon's) incorporated into writing system

**Next phases:**
- Phase 2 — expand 43 medium articles through editorial pipeline
- Phase 3 — write 139 stub articles from scratch
- Apply Matt's feedback on 4 articles (scams, seed phrases, wallet comparison, key terms)
- Add real-world examples from approved source maps (Restor, Hylo, P2P Foundation, ReFi Ecosystem, Weavers Network, Second Renaissance)
- Human review of all published drafts

## Unresolved design decisions

From the master doc, still needing your call:

1. **Canonical architecture version** — doc contains 3 variants (detailed Layer 1–8 spec, 7-layer summary, 6-layer team map). Pick one canonical, mark others as accessible summaries.
2. **Ontology resolution** — Version A (Octo-aligned, interop-first) vs Version B (CSIS-optimized, structure-first). Doc recommends v1 as base + v2b as semantic overlay. Formalize.
3. **Resource dump consolidation** — 11+ domain URL lists (~3,900 lines) in master doc; not yet lifted to structured `resources.yaml`.
4. **Taxonomy vs Ontology distinction** — flagged for conceptual clarity in master doc line 181.

## See also

- `docs/260423 Regen Web3 Toolkit - Master Doc Briefing.md` — personal briefing
- `docs/CSIS.md` — CSIS reference page (structural integrity framework)

## Source-of-truth inputs

- [x] Master doc fully mapped: `docs/projects/regen-toolkit/Web3 Toolkit.md`
- [x] Repo cloned: `repos/regen-toolkit/` (last commit 2026-03-27)
- [ ] April 9 meeting notes consolidated (doc links to external Google Doc, not processed)
- [ ] Previous iteration docs (V2, V2+, CSIS) reviewed and archived
- [ ] Local Regen Toolkit spreadsheet reviewed

## Recent meetings

- **2026-07-02** — [Planning Call](../meetings/260702%20Regen%20Web3%20Toolkit%20Planning%20Call.md) (Framework-as-Package + First Ingestion Test Cases). **Framework-as-package** adopted (portable module → agents ingest → ontology-structured KB; ~2 wks to a testable version); two first ingestion test cases (Koi's **Gen Brasil Commons** artifacts + Durgadas's **Proof of Coordination**); **ingestion ≠ storage** design constraint (Durgadas). Matty → one more master-doc iteration (handoff + new ToC + Frame Language Analyzer + Idea Processor); **Options = core of a deployment**. Durgadas's **Frame 1 warning** ("structure beats intention 100%") + CSIS/Craft/Valcre links. Infra interop: **Geo Protocol** (IPFS + The Graph) + **AT Protocol**; more opinionated infra. Luiz needs website **publish permissions + dev environment** (Afo). Sequencing: Matty → Luiz → Afo.
- **2026-06-15** — [Work Session with Matty](../meetings/260615%20Toolkit%20Work%20Session%20with%20Matty.md) (RegenOS + Knowledge Commons Architecture). Ad-hoc 1-on-1. **Framework/instance split** (domain-agnostic framework + ReFi Web3 Toolkit as first instance); **house the toolkit under ReFi Commons**; RegenOS to be documented (+ public website, July); coordination model (small bites, CIDS + DAO IP5 + impact accounting, scale to high-trust orgs); Matty's compensation → Impact Vault.
- **2026-06-04** — [Planning Call](../meetings/260604%20Regen%20Web3%20Toolkit%20Planning%20Call.md) (V1 Site + Hub Post Strategy). Two paired deliverables: Heenal's 3-journey v1 public site (merged to main, live) + a hub post. "Public ≠ commons." Andrea + RegenOS thread opened. Afo → Greenpill Network integration. Matty's Regen Coordination budget doc.
- **2026-05-21** — [Planning Call](../meetings/260521%20Regen%20Web3%20Toolkit%20Planning%20Call.md) (Theory of Change Check-in). Persona-game superseded; Durgadas's "theory of build vs theory of change" challenge; author a revised problem/mission statement; journeys framing; Rather's Geo Protocol ontology. Luiz absent.
- **2026-05-15** — Master doc 2026-05-15 stabilization draft (10 layers; Tracks restored, Infrastructure added). Per-layer docs + canvases scaffolded. *(Processed to `memory/2026-05-15.md`; no separate planning-call note.)*
- **2026-05-07** — [Planning Call](../meetings/260507%20Regen%20Web3%20Toolkit%20Planning%20Call.md). OrgOS adopted as shared task layer; Obsidian Canvas as visual architecture map; persona/game format for next biweekly; Bonfires (KOI stack) as Evolution-layer model; Toolkit vs "Transformational Journeys" framing tension (Koi).
- **2026-04-23** — [Planning Call](../meetings/260423%20Regen%20Web3%20Toolkit%20Planning%20Call.md). Matt one push from master-doc completion → handoff. OrgoS adopted as consolidation framework. Frame-language critique (Durgadas) to be integrated. May hackathon outreach planning.
- **2026-03-12** — [Funding + Pipeline Sync](../meetings/260312%20Regen%20Toolkit%20%E2%80%94%20Funding%20%2B%20Pipeline%20Sync.md). Artisan funding strategy under Region Coordination profile (time-sensitive). AI pipeline broken — needs fix. Toolkit niche: hyper-specific for local nodes/chapters; link rather than duplicate. Co-op browser extension idea floated.
- **2026-02-25** — [Restructure + AI Pipeline Sync](../meetings/260225%20Regen%20Toolkit%20Restructure%20%2B%20AI%20Pipeline%20Sync.md). Tag-based architecture replaces track-based; 10 modules proposed. Ship-V1-imperfect stance adopted. AI pipeline 5-stage live with 5 pilot articles. Reach out to Ethereum Localism / ReFi Commons / Superbenefit before more structural decisions.
- **2026-02-12** — [Planning Call](../meetings/260212%20Regen%20Web3%20Toolkit%20Planning%20Call.md). ReFi DAO transitioning to distributed leadership / headless brand; possible Greenpill alignment. Submit content to Regen Web3 Toolkit repo (Local ReFi Toolkit becomes a subset). Branching workflow ratified. Artisan funding $300–5,600/month confirmed by Drew Simon.
- **2026-01-29** — [GitHub Workflow + Tier Prioritization](../meetings/260129%20Greenpill%20Toolkit%20Planning%20Call%20%28GitHub%20Workflow%29.md). 229 article placeholders created; tier-based prioritization adopted (Tier 1 = 3+ audiences). Two-week milestone: each participant writes ≥1 article. Matt's AI agent writing system in dev; LifeOS web editor as alt interface.
- **2026-01-15** — [Greenpill Toolkit Planning Call (Kickoff)](../meetings/260115%20Greenpill%20Toolkit%20Planning%20Call%20%28Kickoff%29.md). Project kickoff. Three target audiences agreed (university/governance education; communities needing onboarding; normie nonprofits). GitHub-based workflow chosen. Tools-first vs Comprehensive content tension surfaced. $2.5k available; $5k considered minimum. Biweekly cadence established.

## Open action items (from 2026-06-15 work session with Matty)

- [ ] Draft RegenOS documentation + a simple public website — Luiz, target July (plan `docs/plans/regen-os-documentation.md`)
- [ ] Write RegenOS description for the master-doc meeting-notes tab — Luiz, *external Google-Doc edit (draft-and-present)*
- [ ] Add OrgOS overlay GitHub link next to the RegenOS reference in the master doc — Luiz, *external edit*
- [ ] Write up RegenOS ↔ COOP / Geo Browser / COI / infra stack for the "More Opinionated Infrastructure" sub-tab — Luiz, *external edit*
- [ ] Review Geo Browser (geobrowser.io) — Luiz
- [ ] Explore housing the toolkit under ReFi Commons as organizational home — Luiz + Matty
- [ ] Surface the framework/instance split to the wider team — Luiz (next biweekly)
- [ ] Identify the first fundable working group + advance standards stack (CIDS + DAO IP5 + impact accounting); sketch the Impact Vault funding flow — Luiz + Matty
- [ ] Matty — import resources DB (Excel → shared Google Sheet) + share edit access

## Open action items (from 2026-04-23 planning call)

- [ ] Embed OrgoS into `repos/regen-toolkit/` as own org-os instance (per queued plan `regen-toolkit-org-os-embed`) — Luiz, validate on call first
- [ ] Initialize Bread Co-op OS instance using OrgoS template; surface CSIS power-distribution standards during deployment — Luiz + Durgadas
- [ ] Apply frame-language critique to master doc; produce companion doc on frame language — Durgadas, next iteration
- [ ] Encode Dunbar-number scaling research and six-directional responsibility model into next CSIS standards review — Durgadas
- [ ] Layer ownership: open invitation; Resources tab weakest, needs collaborative organization session — Team
- [ ] Send invite to Ethereum Localism via Telegram — Rather
- [ ] Join Open Civics Consortium chat via website — Luiz
- [ ] Run all meeting notes through LLM for additional master-doc insights — Luiz, ongoing
