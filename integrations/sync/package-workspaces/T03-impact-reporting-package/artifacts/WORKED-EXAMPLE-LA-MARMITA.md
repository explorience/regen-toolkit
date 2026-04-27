# Worked Example — La Marmita (Impact Reporting Prompt Chain)

## Goal
Demonstrate the full T03 workflow using a real project folder from Regenerant Catalunya.

## Project context
- Project: La Marmita
- Network: Keras Buti
- Source folder: `03 Libraries/Regenerant-Catalunya/docs/project-reports/la-marmita/`

## Workflow execution map

### Step 1 — File analysis
- Prompt used: `03 Libraries/Regenerant-Catalunya/docs/project-reports/prompts/01-prepare-file-analysis.md`
- Output file: `03 Libraries/Regenerant-Catalunya/docs/project-reports/la-marmita/la-marmita-file-analysis.md`

### Step 2 — Report generation
- Prompt used: `03 Libraries/Regenerant-Catalunya/docs/project-reports/prompts/02-generate-report.md`
- Output file: `03 Libraries/Regenerant-Catalunya/docs/project-reports/la-marmita/la-marmita-report-draft.md`

### Step 3 — Report evaluation
- Prompt used: `03 Libraries/Regenerant-Catalunya/docs/project-reports/prompts/03-evaluate-report.md`
- Output behavior: evaluation section appended to report draft for corrective iteration

## Evidence files used in this example
- `03 Libraries/Regenerant-Catalunya/docs/project-reports/examples/workflow-example.md`
- `03 Libraries/Regenerant-Catalunya/docs/project-reports/examples/sample-output.md`

## QA notes for package users
- Keep activity claims evidence-bound to files/folders.
- Mark uncertainty explicitly: "Requiere verificación del proyecto".
- Keep deliverables separate from proofs (photos/files are proofs, not deliverables).
- Use evaluation pass to catch unsupported metrics or inferred details.

## Reusability
This worked example can be reused as the default demonstration dataset for T03 onboarding and training.
