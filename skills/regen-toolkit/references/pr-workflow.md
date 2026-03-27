# PR Workflow

How to submit articles to the Regen Toolkit via pull request.

## Branch Naming

```
content/{your-name}/{slug}
```

Examples:
- `content/luis/gas-fees`
- `content/maya/conflict-resolution`
- `content/tej/batch-phase2` (for multiple articles)

## Step by Step

```bash
# 1. Start from latest main
git checkout main
git pull origin main

# 2. Create your branch
git checkout -b content/{your-name}/{slug}

# 3. Write the article (follow the pipeline)
# Edit src/content/docs/{slug}.md
# Create working/{slug}-research.md, factcheck.md, critique.md

# 4. Preview locally
npm run dev
# Check http://localhost:4321/{slug}/

# 5. Stage and commit
git add src/content/docs/{slug}.md
git add working/{slug}-*.md
git commit -m "Add article: {Title}

- Completed 5-stage pipeline (research, draft, fact-check, edit, critique)
- Sources: [list 2-3 key sources]
- Word count: ~{N}
- Audience: {Maya/Alex/Jordan}
- Maturity: {Beginner/Intermediate/Advanced}"

# 6. Push and create PR
git push origin content/{your-name}/{slug}
```

Then open a PR on GitHub targeting `main`.

## PR Description Template

Copy and fill in:

```markdown
## Article: {Title}

**Slug:** `{slug}`
**Word count:** ~{N}
**Audience:** {persona}
**Maturity:** {level}

### Sources
- [Source 1](url)
- [Source 2](url)

### Pipeline files
- `working/{slug}-research.md` - research brief
- `working/{slug}-factcheck.md` - fact-check report
- `working/{slug}-critique.md` - final critique

### Checklist
- [ ] All claims verified against sources
- [ ] No AI slop language
- [ ] Frontmatter complete (tags, audience, maturity, related)
- [ ] "Try This" exercises included
- [ ] References section with live links
- [ ] Description is a real sentence
- [ ] Reads well as Maya (no unexplained jargon)
```

## Batch PRs

For multiple articles in one PR:
- Use branch name like `content/{your-name}/batch-{topic}`
- List all articles in PR description
- One commit per article is ideal but not required

## Review Process

1. Maintainer reviews article quality and style compliance
2. May request changes (style, accuracy, frontmatter)
3. Once approved, merged to `main`
4. Vercel auto-deploys to production
