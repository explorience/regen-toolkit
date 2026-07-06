# Content structure — Heenal ontology v1 snapshot (frozen 2026-07-05)

Immutable record of the content surfaces as they stood on 2026-07-05, for the
framework-comparison baseline. All counts are real (measured with `find … | wc -l`
and `journeyStats()` from `src/data/journeys.js`), not estimated.

## The 3 journeys (`src/data/journeys.js`)

Ordered reader paths that drive the homepage, the journey landing pages, and the
Starlight sidebar. Each step is a `[slug, title, blurb]` tuple pointing at a live
`/[slug]` article route.

| id | label | emoji | chapters | steps | minutes |
|----|-------|-------|---------:|------:|--------:|
| `newcomer` | Newcomer Orientation | 🌱 | 4 | 16 | 70 |
| `local-node` | Local Node Builder | 🔄 | 5 | 22 | 110 |
| `knowledge-commons` | Knowledge Commons Builder | 🪴 | 5 | 14 | 95 |

Totals: **3 journeys, 14 chapters, 52 steps.** (`knowledge-commons` carries a "New"
badge and is defined by a separate assignment after the main `journeys` object;
`journeyList` exports the three in the order above.)

## The 254-article `content/` taxonomy (legacy production tree)

Section-numbered research/production corpus under `content/`, split into 3 tracks.
Counts below **exclude** each section's `working/` draft folder and **exclude** the
`archive-pipeline-v1/` tree; they count published section articles only.

**Track totals (excl. `working/`): 63 + 121 + 70 = 254.**

### `1-foundations` — 63 articles
| section | files |
|---------|------:|
| 1.1-what-is-refi | 1 |
| 1.1-why-web3 | 3 |
| 1.2-decentralization | 6 |
| 1.3-blockchain-fundamentals | 7 |
| 1.4-cryptocurrency-essentials | 7 |
| 1.5-wallets-security | 9 |
| 1.6-ethereum-smart-contracts | 7 |
| 1.7-tokens-nfts-digital-assets | 6 |
| 1.8-daos | 8 |
| 1.9-refi-landscape | 8 |
| 1.10-crypto-philanthropy | 1 |

(Note: two sections share the `1.1` prefix — `1.1-what-is-refi` and `1.1-why-web3`.
`1-foundations` also holds 71 additional drafts under `working/` that are excluded
from the 63.)

### `2-applied` — 121 articles
| section | files |
|---------|------:|
| 2.1-local-nodes | 10 |
| 2.2-joining-local-node | 10 |
| 2.3-starting-local-node | 8 |
| 2.4-community-building | 11 |
| 2.5-gatherings-events | 8 |
| 2.6-funding-mechanisms | 7 |
| 2.7-decentralized-governance | 7 |
| 2.8-impact-measurement | 9 |
| 2.9-tokenomics-community-currencies | 10 |
| 2.10-blockchain-program-delivery | 9 |
| 2.10-identity-credentials | 2 |
| 2.11-operational-security | 1 |
| 2.11-web3-safety-security | 10 |
| 2.12-ai-web3 | 7 |
| 2.13-web3-marketing | 6 |
| 2.14-web3-action-plan | 6 |

(Note: duplicate section prefixes exist — two `2.10-*` and two `2.11-*` sections —
evidence of a mid-flight renumbering. `2-applied` has no `working/` folder.)

### `3-playbooks` — 70 articles
| section | files |
|---------|------:|
| 3.1-protocol-playbooks | 7 |
| 3.2-implementation-patterns | 12 |
| 3.3-case-studies-region | 20 |
| 3.4-case-studies-theme | 10 |
| 3.5-tools-directories | 1 |
| 3.5-tools-resources | 12 |
| 3.6-glossary | 7 |
| 3.6-reference | 1 |

(Note: duplicate prefixes again — two `3.5-*` and two `3.6-*` sections.
`3-playbooks` has no `working/` folder.)

## The 254 legacy tree ↔ the 119 live articles

The `content/` tree (254 articles, section-numbered, 3 tracks × N sub-sections,
plus per-section `working/` drafts, `sources/`, and an `archive-pipeline-v1/`) is the
**legacy research-and-production corpus** — the raw pipeline where articles were
drafted, fact-checked, and staged. The **119 live articles** in `src/content/docs/`
are the **published Starlight layer**: a flat, slug-routed set (0 subdirectories)
that is a curated, rewritten distillation of roughly half the 254. 98 of the 119
live articles share a filename with a `content/`-tree section article (direct
promotion/rewrite), while ~21 are new or renamed at publication. Crucially, the live
layer is organized by the **3 reader journeys** (`journeys.js`), not by the numbered
tracks — so the live site's navigation (journeys → steps) is an editorial overlay on
top of, and much smaller than, the 254-article production taxonomy.
