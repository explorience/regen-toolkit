# T01 Package Spec

Package: Local Node Onboarding Package  
Owner: Luiz (lead)  
Priority: P0  
Date: 2026-03-07

## Scope

### Audience
- Prospective local node leaders (any region)
- ReFi DAO coordination team onboarding new nodes
- Existing nodes seeking to refresh or standardize their onboarding

### Use cases
1. New leader wants to start a local node — needs step-by-step checklist
2. ReFi DAO ops wants to verify a node is fully onboarded — needs validation checklist
3. Node wants to localize onboarding materials — needs template they can adapt

### In-scope artifacts
- Short guide (1-page quick start)
- Long guide (comprehensive onboarding manual)
- Operator-ready checklist ( printable/screen-friendly)
- Website-ready onboarding block (markdown for ReFi-DAO-Website)
- Validation checklist (QA for completion)

### Out-of-scope
- Governance policy design (covered in other packages)
- Treasury setup (Safe package handles this)
- Funding proposal writing (kept minimal; link to Gardens docs)

## Target implementation
- regen-toolkit module (content + templates)
- ReFi-DAO-Website community/local-nodes updates

## Acceptance criteria
- [ ] Reproducible from docs only (no implicit knowledge required)
- [ ] All links/paths valid at time of publish
- [ ] Metrics defined: time-to-onboard, completion rate per step
- [ ] Reviewed by at least one active local node leader
- [ ] Deployed on ReFi-DAO-Website without breaking existing content
