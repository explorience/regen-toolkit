# Impact Reporting SOP (v0.1)

## Objective
Standardize evidence-based activity reporting using a 3-step prompt chain.

## Workflow
1. **Prepare file analysis**
   - Run prompt 1 on project folder to generate structured inventory.
2. **Generate activity report draft**
   - Run prompt 2 in Thaura using file analysis (+ existing Google Doc data when available).
3. **Evaluate and improve report quality**
   - Run prompt 3 to append evaluation and detect unsupported claims.

## Core principles
- Evidence-first: every claim should map to source files or project-provided text.
- Google Doc content has precedence when conflicts exist.
- Separate deliverables (what was done) from proof (what shows it was done).
- Mark uncertain items explicitly for verification.

## Outputs
- File analysis markdown
- Activity report draft
- Evaluated report draft with corrective actions
