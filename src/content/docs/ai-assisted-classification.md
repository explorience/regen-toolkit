---
title: "AI-Assisted Classification for Your Knowledge Commons"
description: "A practical, opinionated guide to using AI to sort and tag a growing knowledge base, for small teams who run on docs and GitHub but aren't ontologists."
---

# AI-Assisted Classification for Your Knowledge Commons

Your shared folder has 400 documents now. Half are untagged, three people have invented three different words for the same idea, and the one person who knew where everything lived just rolled off the team. You don't need a librarian; you need the pile to sort itself without quietly inventing its own categories.

That is what AI-assisted classification can do for you, and where it will hurt you if you let it run unsupervised. This article is about using it on purpose.

## What "Classification" Actually Means Here

**Classification** is sorting things into categories you can navigate later: putting each note, resource, or doc into a bucket so future-you can find it. **AI-assisted** means a language model or an embedding model does the first pass, and a human keeps the final say.

Two jobs hide inside that word, and they need different tools:

- **Typing** answers *what kind of thing is this?* A guide, a tool, a case study, a meeting note. The set of types is small and stable.
- **Tagging** answers *what is this about, and how might I want to filter it?* Topics, domains, audiences. The set of tags is large and grows.

The Regen Toolkit's own ontology layer is blunt about why this split matters: "A type defines what something is. A tag describes how something may be classified, interpreted, filtered, or used. Confusing tags with types creates ontology sprawl." Keep them in separate fields and AI has a much easier job, because you're asking it two clear questions instead of one mushy one.

## Pick Your Approach: Discover, or Sort Into Buckets

There are two honest ways to point AI at a pile of documents, and choosing wrong wastes weeks.

**Discovery (unsupervised)** is for when you don't yet know your categories. You let the machine find clusters and tell you what themes already exist. The standard open-source tool here is **BERTopic** (MIT-licensed, by Maarten Grootendorst), which turns each document into an embedding, groups the embeddings into clusters, and labels each cluster with its most distinctive words. An **embedding** is just a list of numbers representing a document's meaning, so that things about similar topics sit near each other. Run BERTopic once on your whole archive and you get a map of the themes you actually have, not the ones you assumed.

> 💡 **Going Deeper:** BERTopic also supports *guided* topic modeling. You pass a `seed_topic_list` of terms you already care about, and it nudges clusters toward them. That gives you a middle path: let the data surprise you, but anchor it to the vocabulary your team already uses.

**Bucketing (supervised)** is for when you *do* know your categories and just need each item sorted into them. This is where large language models shine. Instead of asking an algorithm to discover clusters, you define your candidate categories from your own domain knowledge and ask a model to pick the right one for each entry. It works because the model reads for meaning, not just matching keywords.

The opinionated take: run discovery **once** to design your taxonomy, then switch to bucketing for everything after. Discovery is a workshop, not a daily driver. A taxonomy that quietly re-clusters itself every week is a taxonomy nobody can learn.

## The Single Most Important Trick: Constrain the Output

Left alone, an LLM will happily invent a new tag for every document, and you'll be back to your three-words-for-one-idea problem within a month. The fix is to force its answer to come from a fixed list.

OpenAI's **Structured Outputs** feature does exactly this: you give the model a JSON schema with an `enum` of allowed values, and it cannot return anything outside that set. As OpenAI puts it, the model will not "hallucinat[e] an invalid enum value." Claude and Gemini offer the same through schema-constrained or JSON output modes. Practically, you hand the model your list of types and your list of approved tags, and it must choose from them.

This is the difference between AI that *maintains* your taxonomy and AI that *replaces* it nightly. Use it.

> 🔧 **For Practitioners:** Keep "new tag" as a deliberate escape hatch, not the default. The [`obsidian-ai-tagger`](https://github.com/lucagrippa/obsidian-ai-tagger) plugin models this well: it returns up to five tags you've used before and at most three genuinely new ones, so existing vocabulary is reused first and novelty is rationed. Review the new ones in a weekly batch before they become "real."

## Real Tools You Can Use This Week

You do not need to build a pipeline to start. Several working tools sit right on top of the docs-and-GitHub stack a small team already uses.

- **Auto Classifier** (Obsidian plugin by HyeonseoNam) lets you classify notes against three reference modes: *all tags* in the vault, a *filtered* subset via regex, or a *manual* hand-curated list of categories. That manual-list mode is the supervised bucketing pattern, built in. It works with any OpenAI-compatible API, so you can point it at OpenAI, a local **Ollama** model, or LocalAI, and it can also use the **Jina AI Classifier**, which has a free tier.
- **AI Tagger** (the `obsidian-ai-tagger` plugin above) does one-click and batch tagging across many providers, including OpenAI, Anthropic, Google, Groq, Mistral, and local Ollama models, while staying aware of your existing tags to avoid duplicates.
- **BERTopic** for the one-time discovery pass that designs your taxonomy in the first place.

Running models locally through Ollama matters more than it sounds for a commons. It keeps unreviewed community material on your own machine instead of shipping it to a third-party API, which is the same public/private boundary the Toolkit's infrastructure layer asks you to respect: high-risk or sensitive material stays private.

## Keep the Human in the Loop, On Purpose

Here is the rule that protects everything else: **AI synthesis is not reviewed knowledge until a human reviews it.** A machine-assigned tag is a *suggestion*, not a fact about your commons.

The Regen Toolkit names this as a cross-cutting principle, "AI-assisted but human-governed": AI helps; humans review and steward. The matching discipline from data-science practice is **human-in-the-loop labeling** — let the model handle the easy, high-confidence cases and route the ambiguous ones to a person. You are not checking every tag. You are checking the ones the model was unsure about.

Two cheap habits make this real:

- **Store confidence.** When the model is allowed to say how sure it is, sort by that and only eyeball the bottom of the list. Most of your review effort goes to 10% of the items.
- **Stamp provenance.** Mark which tags were AI-suggested versus human-confirmed, with a date. This is the Toolkit's claim-evidence discipline applied to your own metadata: never let an unreviewed AI guess masquerade as a settled decision. When the next person inherits the commons, they can see exactly what's been checked and what hasn't.

That second habit is what makes the knowledge base survive turnover. The categories outlive any one person not because they're perfect, but because everyone can see how each label got there and trust it.

## Try This

> **Start here:** Open one folder of 20-ish notes. Write down, by hand, the five to eight categories you actually use to find things. That list is your taxonomy v0.1 — and you needed no AI to make it. Most teams skip this and regret it.
>
> **Go deeper:** Install the Auto Classifier or AI Tagger plugin in Obsidian, point it at a local Ollama model or a Jina free-tier key, and run it on those 20 notes in *manual list* / existing-tag mode using the taxonomy you just wrote. Compare its tags to your own. Where it disagrees, decide who was right and fix the list, not just the note.
>
> **Stretch:** Run BERTopic across your entire archive to discover the themes you already have. Reconcile its clusters against your hand-made taxonomy: merge duplicates, split overloaded buckets, and turn the result into a fixed `enum` you feed to an LLM via Structured Outputs for all future intake. Store a `tagged_by` and `reviewed` field on every entry so AI suggestions never pass as confirmed knowledge.

## References

- [BERTopic (GitHub)](https://github.com/MaartenGr/BERTopic) — MIT-licensed Python library for embedding-based topic discovery; supports guided modeling with seed topics.
- [BERTopic paper (arXiv 2203.05794)](https://arxiv.org/abs/2203.05794) — the class-based TF-IDF method behind the tool.
- [Auto Classifier (GitHub)](https://github.com/HyeonseoNam/auto-classifier) — Obsidian plugin that classifies into all-tags, filtered, or manual category lists via OpenAI-compatible APIs or the Jina AI Classifier.
- [AI Tagger (GitHub)](https://github.com/lucagrippa/obsidian-ai-tagger) — Obsidian plugin for one-click and batch tagging across many LLM providers, reusing existing tags before inventing new ones.
- [OpenAI Structured Outputs guide](https://developers.openai.com/api/docs/guides/structured-outputs) — how to constrain a model's output to a fixed `enum` of allowed labels so it can't invent categories.
- [Ollama](https://ollama.com) — run open models locally to keep sensitive community material off third-party APIs.
- [Hands-On: Labeling with LLM and Human-in-the-Loop (arXiv 2411.04637)](https://arxiv.org/pdf/2411.04637) — practical patterns for hybrid human-plus-model labeling.
