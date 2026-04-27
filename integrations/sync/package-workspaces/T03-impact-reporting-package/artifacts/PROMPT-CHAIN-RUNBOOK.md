# Prompt Chain Runbook (Analyze → Generate → Evaluate)

## Inputs
- Project files/folders (Google Drive export)
- Existing Google Doc report text (if any)

## Step 1: Analyze files
- Prompt: `docs/project-reports/prompts/01-prepare-file-analysis.md`
- Output: `[project]-file-analysis.md`

## Step 2: Generate report
- Prompt: `docs/project-reports/prompts/02-generate-report.md`
- Output: `[project]-report-draft.md`

## Step 3: Evaluate report
- Prompt: `docs/project-reports/prompts/03-evaluate-report.md`
- Output: Updated `[project]-report-draft.md` with evaluation section

## QA handoff
- Human reviewer checks flagged uncertainties
- Final report exported to target Google Doc template
