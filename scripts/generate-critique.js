#!/usr/bin/env node
/**
 * generate-critique.js — Regen Toolkit CRITIQ Report Generator
 * 
 * Generates a standardized CRITIQ review report template for pipeline articles.
 * 
 * Usage:
 *   node scripts/generate-critique.js <slug>
 *   node scripts/generate-critique.js <slug> --review <path-to-review>
 *   node scripts/generate-critique.js --list
 *   node scripts/generate-critique.js --help
 * 
 * Example:
 *   node scripts/generate-critique.js 1.3-what-is-a-blockchain
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')

// Section templates for the CRITIQ review
const SECTION_TEMPLATES = {
  strategicAlignment: `## Strategic Alignment

**Verdict:** [ APPROVE / REVISE / REJECT ]

**Assessment:**
[TODAY] — Evaluate whether this article clearly and effectively supports the overall goals, mission, and values of the Regen Toolkit.

Consider:
- Does the article align with the Regen Toolkit's mission of making regenerative economics accessible?
- Is it timely and relevant to the target audience?
- Does it advance the educational goals of the current track?
- Are there any mission drift concerns?

**Recommendation:**
[Your recommendation here]`,

  impactAndResonance: `## Impact and Resonance

**Assessment:**
[TODAY] — Evaluate whether this article will effectively engage its intended audience and achieve its desired positive impact.

Consider:
- Will it resonate with the target audience (listed in frontmatter)?
- Is the hook strong enough to draw readers in?
- Does it avoid jargon without dumbing down?
- Is there a risk of misinterpretation by the audience?
- Does it inspire action or deeper engagement?

**Key Strengths:**
- [List what works well for engagement]

**Areas of Concern:**
- [List any resonance risks]`,

  completenessAndCoherence: `## Completeness and Coherence (Holistic)

**Assessment:**
[TODAY] — Evaluate whether there are any major knowledge gaps, structural weaknesses, or logical inconsistencies that undermine the core message.

Consider:
- Are all claims adequately supported?
- Is the logical flow clear and compelling?
- Are there any contradictions or gaps?
- Does it assume knowledge the audience may not have?
- Are the examples and sources appropriate?
- Does the article "hang together" as a whole?

**Structural Notes:**
- [Your structural assessment]

**Content Gaps:**
- [Any missing context or unsupported claims]`,

  ethicalAndBias: `## Ethical and Bias Review

**Assessment:**
[TODAY] — Evaluate whether the article contains any implicit biases, unintended negative consequences, potential for misinformation, or ethical concerns.

Consider:
- Does it perpetuate any harmful narratives or stereotypes?
- Is there extractive framing (e.g., "saving" communities vs. empowering them)?
- Are Indigenous perspectives appropriately represented or absent?
- Does it over-state blockchain as a solution (techno-solutionism)?
- Are there any misinformation risks?
- Does it acknowledge limitations honestly?

**Bias Flags:**
- [None / List any concerns]

**Misinformation Check:**
- [Pass / Concerns noted]

**Ethical Concerns:**
- [None / List any concerns]`,

  toneAndVoice: `## Tone and Voice (Final Check)

**Assessment:**
[TODAY] — Evaluate whether the article's tone is perfectly aligned with the Regen Toolkit's public persona and promotes trust.

Consider:
- Is it warm but rigorous — accessible without being condescending?
- Does it sound like a trusted guide, not a lecturer?
- Is the voice consistent throughout?
- Does it avoid corporate/venture-capital framing?
- Does it feel like it was written by someone who cares?

**Tone Verdict:**
[ APPROVE / REVISE ]

**Specific Notes:**
- [Your tone and voice notes]`,
}

// Final verdict template
const FINAL_VERDICT_TEMPLATE = `---

## Final Verdict

**CRITIQ Verdict:** [ **APPROVE for PUBLISH** / **REVISE** / **REJECT** ]

**Summary:**
[2-3 sentence summary of the overall assessment]

**Required Changes (if REVISE):**
1. [Specific, actionable change required]
2. [Specific, actionable change required]
3. [Specific, actionable change required]

**Optional Improvements (if any):**
1. [Nice-to-have but not blocking]

**Risk Assessment:**
- Misinterpretation risk: [ Low / Medium / High ]
- Community impact: [ Positive / Neutral / Negative / Needs Review ]
- Readiness for public consumption: [ Ready / Needs Revisions / Not Ready ]

---

*Critique completed: ${new Date().toISOString().split('T')[0]}*
*CRITIQ Agent — Regen Toolkit Pipeline*
`

/**
 * Find article file by slug
 */
function findArticleBySlug(slug) {
  const contentDir = path.join(ROOT, 'content')
  
  if (!fs.existsSync(contentDir)) {
    return null
  }
  
  // Search recursively for matching file
  function searchDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        const result = searchDir(fullPath)
        if (result) return result
      } else if (entry.isFile() && entry.name === `${slug}.md`) {
        return fullPath
      }
    }
    return null
  }
  
  return searchDir(contentDir)
}

/**
 * Get article frontmatter
 */
function getFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  
  const fm = {}
  match[1].split('\n').forEach(line => {
    const colonIdx = line.indexOf(':')
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim()
      let value = line.slice(colonIdx + 1).trim()
      // Handle quoted strings
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1)
      }
      fm[key] = value
    }
  })
  
  return fm
}

/**
 * Build the full critique document
 */
function buildCritiqueDocument(slug, articlePath, reviewPath, meta) {
  const articleFm = getFrontmatter(articlePath)
  const hasReview = reviewPath && fs.existsSync(reviewPath)
  const reviewFm = hasReview ? getFrontmatter(reviewPath) : null
  
  let doc = `# CRITIQ Review: ${articleFm.title || slug}\n\n`
  doc += `> **Pipeline Stage:** CRITIQ (Strategic & Ethical Review)\n`
  doc += `> **Slug:** ${slug}\n`
  doc += `> **Section:** ${articleFm.section || 'N/A'} — Track: ${articleFm.track || 'N/A'}\n`
  doc += `> **Author:** ${articleFm.author || 'Unknown'}\n`
  doc += `> **Status:** ${articleFm.status || 'drafting'}\n`
  doc += `> **Estimated Words:** ${articleFm.estimated_words || 'N/A'}\n`
  doc += `> **Target Audience:** ${(articleFm.audience || '').replace(/[\[\]]/g, '')}\n`
  
  if (reviewFm) {
    doc += `> **Review Stage:** ${reviewFm.status || 'reviewed'}\n`
  }
  
  doc += `\n---\n\n`
  
  // Add links to source files
  doc += `**Source Files:**\n`
  doc += `- Article: \`content/${path.relative(path.join(ROOT, 'content'), articlePath)}\`\n`
  if (hasReview) {
    doc += `- Review: \`working/${slug}-review.md\`\n`
  }
  
  doc += `\n---\n\n`
  
  // If no review exists, note this
  if (!hasReview) {
    doc += `> **⚠️ Note:** No review file found at \`working/${slug}-review.md\`.\n`
    doc += `> The CRITIQ agent should read the article directly before completing this critique.\n\n`
  }
  
  // Add each section
  doc += SECTION_TEMPLATES.strategicAlignment
  doc += '\n\n'
  doc += SECTION_TEMPLATES.impactAndResonance
  doc += '\n\n'
  doc += SECTION_TEMPLATES.completenessAndCoherence
  doc += '\n\n'
  doc += SECTION_TEMPLATES.ethicalAndBias
  doc += '\n\n'
  doc += SECTION_TEMPLATES.toneAndVoice
  doc += '\n\n'
  doc += FINAL_VERDICT_TEMPLATE
  
  return doc
}

/**
 * List available slugs (articles in content/)
 */
function listSlugs() {
  const contentDir = path.join(ROOT, 'content')
  if (!fs.existsSync(contentDir)) {
    console.log('No content directory found.')
    return
  }
  
  console.log('Available article slugs:\n')
  
  function walkDir(dir, prefix = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isDirectory()) {
        console.log(`  ${prefix}${entry.name}/`)
        walkDir(path.join(dir, entry.name), prefix + '  ')
      } else if (entry.name.endsWith('.md')) {
        const slug = entry.name.replace('.md', '')
        const fm = getFrontmatter(path.join(dir, entry.name))
        const status = fm.status ? `[${fm.status}]` : '[no status]'
        const title = fm.title || slug
        console.log(`  ${prefix}${slug} ${status} — "${title}"`)
      }
    }
  }
  
  walkDir(contentDir)
}

/**
 * Main
 */
function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Regen Toolkit — CRITIQ Report Generator

USAGE:
  node scripts/generate-critique.js <slug>     Generate critique for article by slug
  node scripts/generate-critique.js --list     List all available article slugs
  node scripts/generate-critique.js --help      Show this help

EXAMPLES:
  node scripts/generate-critique.js 1.3-what-is-a-blockchain
  node scripts/generate-critique.js --list

OUTPUT:
  Writes to: working/<slug>-critique.md
`)
    process.exit(0)
  }
  
  if (args.includes('--list')) {
    listSlugs()
    process.exit(0)
  }
  
  const slug = args[0]
  
  if (!slug) {
    console.error('Error: Slug required. Run with --help for usage.')
    process.exit(1)
  }
  
  // Find article
  const articlePath = findArticleBySlug(slug)
  if (!articlePath) {
    console.error(`Error: Article not found for slug "${slug}"`)
    console.error('Run with --list to see available slugs.')
    process.exit(1)
  }
  
  // Check for review
  const workingDir = path.join(ROOT, 'working')
  const reviewPath = path.join(workingDir, `${slug}-review.md`)
  const critiquePath = path.join(workingDir, `${slug}-critique.md`)
  
  // Ensure working directory exists
  if (!fs.existsSync(workingDir)) {
    fs.mkdirSync(workingDir, { recursive: true })
  }
  
  // Check if critique already exists
  if (fs.existsSync(critiquePath)) {
    console.warn(`Warning: Critique already exists at ${critiquePath}`)
    console.warn('Overwriting...')
  }
  
  // Build and write critique
  const doc = buildCritiqueDocument(slug, articlePath, reviewPath, {})
  fs.writeFileSync(critiquePath, doc, 'utf8')
  
  console.log(`✓ Critique template generated: working/${slug}-critique.md`)
  console.log(`  Article: ${path.relative(ROOT, articlePath)}`)
  console.log(`  Review: ${fs.existsSync(reviewPath) ? `working/${slug}-review.md` : 'NOT FOUND — read article directly'}`)
  console.log('\nNext step: Edit the critique template with your CRITIQ assessment.')
}

main()
