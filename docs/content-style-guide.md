# Regen Web3 Toolkit: Content Style Guide

This guide establishes the writing style, voice, tone, structure, and language rules for all articles within the Regen Web3 Toolkit. Its purpose is to ensure clarity, consistency, and effectiveness in communicating with our diverse audience, enabling both human contributors and AI agents to produce high-quality content.

## 1. Core Principles

The Regen Web3 Toolkit aims to be a comprehensive, open-source resource for regenerative practitioners entering the Web3 space. Our core principles are:

*   **Curate, don't recreate:** Leverage existing quality resources where appropriate.
*   **Multiple entry points:** Tailor pathways for each distinct persona.
*   **Practical over theoretical:** Focus on "how-to" and actionable steps.
*   **Build in public:** Maintain an open process that welcomes community contributions.
*   **Broad, not deep (initial pass):** Establish a solid scaffolding across many articles before diving deep (to provide comprehensive initial coverage and avoid early bottlenecks).

## 2. Audience Personas

Our content caters to three primary personas:

### 2.1. 🌱 The Grounded Regen (e.g., Amara)

*   **Description:** Permaculturists, community organizers, non-profit workers, and activists new to crypto.
*   **Language:** No jargon; explain everything. Use analogies to nature and community.
*   **Focus:** Address "Why should I care about blockchain? How does this help my on-the-ground work?" Address fears of scams, appearing uninformed, or wasting time on hype.
*   **Content Type:** Prioritize practical "how-to" guides over theory, basic concepts, wallet setup, and common scam awareness.

### 2.2. 💰 The Curious Degen (e.g., Kai)

*   **Description:** Crypto-native individuals seeking impact projects.
*   **Language:** Can use technical terms, but maintain clarity.
*   **Focus:** Address "I get the tech, but how do I find legit impact projects? How do I avoid greenwashing?" Focus on legitimacy signals and due diligence.
*   **Content Type:** Applied Web3 for impact, funding mechanisms, governance, and deeper dives into protocols.

### 2.3. 🔄 The On-Chain Regen (e.g., Priya)

*   **Description:** Existing ReFi/Web3 impact space participants looking to go deeper or start local initiatives.
*   **Language:** Can assume Web3 basics.
*   **Focus:** Address "How do I start a local node? What patterns work? How do I bring others in?" Address fears of burnout or building something ineffective.
*   **Content Type:** Advanced concepts, playbooks, implementation patterns, regional case studies, and community building strategies.

## 3. General Writing Style

### 3.1. Voice

*   **Informative and Educational:** Provide clear, accurate, and well-researched information.
*   **Empathetic and Supportive:** Acknowledge potential user anxieties (e.g., complexity, security) and guide them confidently.
*   **Enthusiastic and Forward-Looking:** Convey the positive potential and impact of Web3 for regeneration.
*   **Community-Oriented:** Use inclusive language (e.g., "we," "our community," "your journey").

### 3.2. Tone

*   **Friendly and Approachable:** Avoid condescension or overly academic language.
*   **Practical and Actionable:** Focus on "Here's how to do X" rather than just theoretical explanations.
*   **Balanced:** Acknowledge complexity and challenges without being overwhelming or overly pessimistic.
*   **Optimistic and Solution-Oriented:** Frame problems with an emphasis on how Web3/ReFi can provide solutions.

### 3.3. Overall Style Guidelines

*   **Clarity and Simplicity:** Prioritize easy-to-understand language.
*   **Conciseness:** Avoid verbose sentences and paragraphs. Cut fluff ruthlessly.
*   **Direct Address:** Use "you" to create a personal connection.
*   **Active Voice:** Promote direct and clear communication.
*   **Relatable Analogies:** Use analogies, especially for "Grounded Regens" (e.g., nature/community, sports metaphors, shared scorebook for blockchain).
*   **Visual-Friendly:** Content should be easily digestible with visual aids and clear formatting (e.g., step-by-step guides, screenshots).

## 4. Content Structure & Formatting

### 4.1. Article Structure

Every article should follow a clear and logical flow:

*   **Hook:** An engaging opening in the first two sentences that captures attention.
*   **Clear Sections:** Organize content into distinct sections, with one main idea per section.
*   **Practical Examples:** Integrate real-world examples throughout the content.
*   **Action/Transition:** End sections with an action item or a clear transition to the next topic.
*   **Action Items / Next Steps:** Conclude articles with clear guidance on what to do next (e.g., "Try This" exercises, further reading).

### 4.2. Markdown & Frontmatter

All content will be written in Markdown files and include structured YAML frontmatter at the beginning of each file:

```yaml
---
title: "Article Title Here"
section: "1.1" # e.g., 1.1 (Chapter.Subsection for categorization)
track: "foundations" # Options: foundations, applied, playbooks
status: "drafting" # Options: placeholder (idea), drafting (in progress), review (ready for feedback), published (live)
author: "Author Name"
reviewer: "Reviewer Name" # Can be blank if not yet reviewed
sources:
  - code: "SourceA"
    name: "Name of Resource A"
    url: "https://example.com/resource-a"
    section: "Optional specific section in resource"
  - code: "SourceB"
    name: "Name of Resource B"
    url: "https://example.com/resource-b"
audience: ["grounded-regen"] # Can be an array: ["grounded-regen", "curious-degen"]
estimated_words: 1000
actual_words: 980
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
---
```

### 4.3. Length Targets

*   **Foundations (Track 1):** 800-1200 words
*   **Applied (Track 2):** 1500-2000 words
*   **Playbooks/Patterns (Track 3):** Varies, generally more detailed (e.g., 2000+ words).

### 4.4. Source Citation

*   **Inline citations:** All factual claims must be supported by inline source citations (e.g., `[SourceA]`) using the `code` from the article's frontmatter `sources` field.

## 5. Language Rules & What to Avoid

### 5.1. Language Rules

*   **Define Jargon:** Define all technical jargon and acronyms on their first use within an article. Ensure consistent terminology by always referencing the centralized glossary.
*   **Short Paragraphs:** Limit paragraphs to a maximum of 3-4 sentences for readability.
*   **Active Voice:** Use active voice predominantly.
*   **Inclusive Language:** Use language that is welcoming and accessible to all, avoiding gendered terms unless specifically referring to individuals, and being mindful of cultural contexts.

### 5.2. What to Avoid

*   **Meta-commentary:** Do not include phrases like "In this article, we will...", "It's important to note that...", or "As we discussed above...". Get straight to the point.
*   **Hedge Words:** Avoid words such as "somewhat," "relatively," "fairly." Be direct and confident in your assertions.
*   **Unsourced Superlatives:** Do not use words like "best," "most popular," "leading" without clear, verifiable sources.
*   **Hallucinations:** All facts presented must be sourced and verifiable. Do not invent information.

## 6. Glossary Development

The consistent use of a centralized glossary is crucial. All authors should refer to and contribute to the glossary to ensure uniform definitions of Web3 and regenerative terms across all articles.

## 7. Review and Contribution

All content will undergo a review process. Community contributions are welcome and will be guided by this style guide.

## 8. Writing Pipeline

All articles are produced through a multi-agent writing pipeline defined in `writing-system.md`. This style guide governs the content standards; the writing system governs the production process.

## 9. Writing for Multiple Audiences

Since each article covers one topic and serves multiple audience levels, use a layered content architecture:

- **Lead with accessibility:** Open every article assuming the reader is a Grounded Regen (🌱). Use plain language, analogies, and no unexplained jargon.
- **Progressive depth:** Use clearly marked callout sections for deeper content:
  - `> 💡 **Going Deeper:**` for technical details that Curious Degens (💰) will appreciate
  - `> 🔧 **For Practitioners:**` for implementation specifics that On-Chain Regens (🔄) need
- **Audience tags:** Use the frontmatter `audience` field to mark primary and secondary audiences, enabling pathway filtering.
- **Cross-links:** End articles with persona-tagged 'You might also like' suggestions pointing to related content.

This approach ensures one article serves all three audiences without duplicating content.
