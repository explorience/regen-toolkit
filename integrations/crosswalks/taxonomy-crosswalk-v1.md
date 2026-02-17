# Taxonomy Crosswalk v1 (draft)

Date: 2026-02-17  
Scope: first-pass mapping across `regen-toolkit`, `Local-ReFi-Toolkit`, `ReFi DAO`, `Regen Coordination`, and KOI stack docs.

## Notes
- This is a **draft interoperability aid**, not a final ontology.
- Terms below are based on currently observed docs; some systems use narrative language rather than strict tags.

## Concept crosswalk

| Canonical concept (proposed) | regen-toolkit (observed) | Local-ReFi-Toolkit (observed) | ReFi DAO (observed) | Regen Coordination (observed) | KOI / KOI-integration (observed) |
|---|---|---|---|---|---|
| audience / persona | Grounded Regen, Curious Degen, On-Chain Regen | target_audience, beginner/intermediate/advanced context | Network Members, Local Node Leads, Core Stewards | communities, local actors, evaluators | node roles (full/partial), org/member context in RID types |
| content type | foundations / applied / playbooks / case studies | playbook, case-study, framework (tags/frontmatter) | guides, specs, proposals, onboarding docs | retrospectives, methodology docs, strategy narratives | RID types + knowledge object classes |
| region / locality | local nodes, bioregional context | region tags (global, europe, etc.) | local node network | global + regional rounds (Mediterranean, Rio) | federation members / org scope |
| impact area | regen finance, local impact focus | impact_area tags (environmental/social/economic/governance/education) | mission alignment + contribution categories | ecological/social/economic impact, TVF | metadata fields in manifests (custom) |
| governance | decentralized governance track | governance-related frameworks | optimistic/consent-based governance, role workflows | council review and evaluation processes | network coordination rules, event handling logic |
| onboarding | track-based pathways | quick-start playbooks + assessment guides | Guild onboarding + Hats + Charmverse access | onboarding support for rounds/reporting | node setup/first contact/handler registration |
| funding / allocation | funding mechanisms track | QF implementation playbook | Gardens pools, treasury tooling, funding guides | QF + ImpactQF rounds | can model as RID/entity + events |
| impact measurement | impact verification sections | impact measurement frameworks | Karma GAP references | Common Approach/CIDS, AI+human evaluations, ImpactQF | schema/metadata processors + queryable stores |
| workflow state | planned scaffolding + tracks | notion content stage, draft/publish | proposal workflows and review steps | retrospective → learnings → next steps | NEW/UPDATE/FORGET event lifecycle |
| technical integration | toolkit content structure | Quartz + Notion sync + frontmatter mapping | mixed tooling stack docs | primarily narrative + external tools | TS bridge + Python nodes + graph/vector processors |

## Minimal shared tag set (proposed v0)

- `content-type`: `guide | playbook | case-study | framework | spec | retrospective`
- `audience`: `beginner | practitioner | technical | governance`
- `region-scope`: `global | bioregional | local`
- `impact-domain`: `ecological | social | economic | governance | education`
- `workflow-stage`: `draft | review | published | active | archived`
- `integration-mode`: `content | taxonomy | workflow | technical`

## Immediate implementation recommendation
1. Adopt the minimal shared tag set in new integration artifacts.
2. Keep source-native metadata intact; map to canonical fields during indexing.
3. Validate crosswalk against 10–15 representative docs before expanding scope.
