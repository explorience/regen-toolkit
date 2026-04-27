# Canonical Ownership Rules v1

Date: 2026-02-18  
Scope: overlapping artifacts across:
- `regen-toolkit`
- `Local-ReFi-Toolkit`
- `ReFi DAO`
- `Regen Coordination`
- `Regenerant-Catalunya`
- `quartz-refi-template`
- Greenpill Network, SuperBenefit, OpenCivics, Bloom, BioFi (external sources)

Purpose: define source-of-truth rules so shared content can be reused without drift.

---

## Ownership principles

1. **Origin-first rule**
   - The repository where an artifact is authored and actively maintained is canonical.
   - Other repositories may publish adapted versions, but must preserve attribution.

2. **Adaptation transparency rule**
   - If adapted content is edited for audience/format, mark it as an adaptation and link canonical source path.

3. **No silent fork rule**
   - Do not maintain two independent “master” versions of the same artifact.
   - If divergence is required, split into two clearly named artifacts with separate ownership.

4. **Operational over narrative for procedures**
   - For workflows/checklists/SOPs, canonical version must live where execution happens most often.

5. **Unknown ownership rule**
   - If ownership is unclear, mark `ownership: unknown` and escalate in weekly sync before publishing derivative content.

---

## Canonical ownership matrix

| Artifact type | Canonical source repository | Secondary usage rule |
|---|---|---|
| Regen Toolkit modules/playbooks/case-study modules used in toolkit tracks | `/root/Zettelkasten/03 Libraries/regen-toolkit` | Reuse externally with explicit source path + adaptation note |
| Local playbooks/frameworks/case studies and Notion-driven content pipeline docs | `/root/Zettelkasten/03 Libraries/Local-ReFi-Toolkit` | Import into regen-toolkit only as adapted module or mirrored reference |
| DAO governance specs, onboarding flows, role/process docs | `/root/Zettelkasten/03 Libraries/ReFi DAO` | Convert into toolkit-facing implementation guides; keep governance spec source in ReFi DAO |
| Strategic framing, round retrospectives, methodology narratives (ImpactQF/CIDS/localism) | `/root/Zettelkasten/03 Libraries/Regen Coordination` | Derive playbooks/explainers with clear “derived from” attribution |
| Integration crosswalks, sync SOPs, integration status boards, source packets | `/root/Zettelkasten/03 Libraries/regen-toolkit/integrations` | Reference from other repos; do not duplicate as independent canonical docs |
| Greenpill content (Local Regen Guide, Eth Localism, planning docs) | Greenpill Network (external); toolkit is co-builder | Shared collaboration; preserve Greenpill attribution; coordinate with Blake on ontology |
| SuperBenefit patterns, Reimagining Power case studies | SuperBenefit Knowledge Garden (external) | Derive with clear attribution; verify licensing before extraction |
| OpenCivics / Regen Commons mapping tools, governance wiki | OpenCivics, Regen Commons org (external) | Derive with attribution; await knowledge commons starter links |
| Regenerant Catalunya case studies, Phase 2 patterns | `03 Libraries/Regenerant-Catalunya` (ReFi BCN) | Case study source owned by ReFi BCN; toolkit publishes adapted versions with attribution; coordinate before publication |
| ReFi DAO Blog posts | blog.refidao.com (ReFi DAO) | Derive style guide and content with attribution; blog is canonical for historical posts |
| Bloom Network organizing knowledge | Bloom Network (external) | Derive when content available; coordinate via Regen Coordination |
| BioFi Project eBook and materials | BioFi Project (external, biofi.earth) | Derive with attribution; verify licensing |
| Quartz publishing pipeline, template overrides | `03 Libraries/quartz-refi-template` | Canonical for deploy operations; content repo must align with Quartz expectations |

---

## Conflict resolution rules

When two repos contain overlapping artifacts:

1. Compare timestamps and maintenance signal (recent edits, references, usage in workflows).
2. If one file is procedural and one is narrative, procedural file is canonical for execution steps.
3. If both are procedural but differ, canonical remains the file in the operational repo listed in matrix above.
4. Record conflict and resolution note in weekly diff log.

---

## Required attribution block for derived artifacts

Use this block in derived docs:

```md
Source-of-truth: <absolute source path>
Canonical repository: <repo name>
Derivative location: <current file path>
Adaptation type: <direct mirror | contextual adaptation | synthesis>
Last sync date: <YYYY-MM-DD>
```

---

## Change control

- Proposed ownership rule changes are reviewed during weekly sync.
- Update this file when:
  - a new integration target is added, or
  - canonical ownership shifts due to process/tooling changes.
- Versioning:
  - breaking changes increment major (`v2`)
  - clarifications increment minor (`v1.x` in filename/body note if adopted).
