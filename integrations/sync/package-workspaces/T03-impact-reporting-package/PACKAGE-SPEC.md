# T03 Package Spec

Package: Impact Reporting Package  
Owner: Luiz (lead)  
Priority: P0  
Date: 2026-03-07

## Scope

### Audience
- Program coordinators (e.g., Regenerant Catalunya)
- Network/DAO treasurers who need to report on fund usage
- Grant recipients preparing deliverables

### Use cases
1. Program coordinator needs to generate activity reports from scattered files — needs AI-assisted workflow
2. Treasurer needs to document impact for compliance — needs standardized report format
3. Grantee needs to submit evidence — needs clear template and proof standards

### In-scope artifacts
- Impact reporting SOP (end-to-end workflow: capture → extract → report → evaluate)
- 3-step prompt chain package (file analysis → report generation → evaluation)
- Activity report template (deliverables + metrics + evidence)
- QA/evaluation checklist for report quality
- Example filled report (reference from Regenerant Catalunya, anonymized if needed)

### Out-of-scope
- Automated data ingestion pipelines (keep manual/AI-assisted for v1)
- Real-time dashboarding (separate package)
- Multi-language translation (defer to localization package)

## Target implementation
- regen-toolkit/integrations SOP (markdown)
- Reusable reporting templates (markdown + prompts)

## Acceptance criteria
- [ ] Reproducible from docs only
- [ ] All links/paths valid at time of publish
- [ ] Metrics defined: report completion time, evidence quality score, reviewer satisfaction
- [ ] Tested on at least one real dataset (Regenerant Catalunya example)
- [ ] Prompt chain runs successfully end-to-end (manual QA)
