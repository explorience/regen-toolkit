---
title: "AI Tools for Community Knowledge"
description: "A practical, opinionated guide to the AI tools that help a small team build a knowledge commons that survives turnover, for people comfortable with docs and GitHub."
---

# AI Tools for Community Knowledge

Your best contributor just left. She held three years of context in her head: why you dropped the first treasury model, who to call at the local council, which "finished" doc is actually out of date. None of that was written down, and now it is gone.

This is the problem AI tools can actually help with. Not running your community, not making your decisions. Capturing, organizing, and surfacing the knowledge a small team generates so it outlives the people who made it. That is the job. Everything below is judged against it.

## The one principle to hold onto

Before any tool, one rule from the toolkit's own thinking: **infrastructure should serve the work, not define it.** A tool can make a workflow easier. A tool can also quietly bend your commons around its own assumptions, until you are organizing knowledge the way the software prefers rather than the way your community thinks.

So ask the question first, the tool second. *What work does this part of your commons need to do?* Capture a meeting? Find an old decision? Draft an onboarding doc? Each of those is a different job with a different best tool. No single app does all of it well, and you do not need one that pretends to.

The matching rule from the toolkit is simple and worth taping to your wall: architectural explanation belongs in documents, a resource inventory belongs in a table, and AI retrieval belongs on a structured corpus with clear source lineage. Pick the substrate that fits the job.

## Capture: get knowledge out of people's heads

The cheapest knowledge to lose is the knowledge spoken aloud and never written down. **Transcription** (software that turns recorded speech into searchable text) is where most teams should start, because meetings are where your real decisions and context live.

**Otter.ai** is the common default. Its free tier gives you 300 transcription minutes a month, capped at 30 minutes per conversation, with automated summaries and action items. That is enough for a small team's weekly call. The Pro plan ($8.33/month billed annually) lifts you to 1,200 minutes if you outgrow it. Verify the current limits before you commit; transcription pricing changes often.

The catch: a transcript is raw material, not knowledge. An hour of talk becomes 9,000 words nobody will reread. The value comes from the next step: summarizing the transcript into a short record of *what was decided and who owns what*, then filing that where people will find it. The AI can draft that summary. A human has to confirm it is true.

## Synthesize: turn sources into grounded answers

Once you have documents, the next job is making sense of them without a person rereading everything. This is where **RAG** (retrieval-augmented generation, where an AI answers only from documents you give it instead of its general training) earns its place. It is the single most useful pattern for a knowledge commons, because answers come with receipts.

**Google NotebookLM** is the most accessible entry point. It is free with a Google account, and you load it with your own sources, up to 50 on the free tier, then ask questions and get answers grounded in *those* documents, with citations back to the exact passage. Drop in your governance docs, past meeting summaries, and your founding agreement, and a new member can ask "how do we make spending decisions?" and get a sourced answer instead of pinging you on Discord.

The discipline that makes this safe: NotebookLM only answers from what you upload, so it cannot invent a policy you never wrote. When it cites nothing, the knowledge is not there. That gap is a feature. It tells you what to document next.

## Search your own commons: local, private, durable

NotebookLM is excellent, but it lives on Google's servers, and you upload copies. If your commons holds sensitive community data, or you simply want it to outlive any one company, you want search that runs on files you control.

**Obsidian** is a notes app that stores everything as plain Markdown files in a folder on your disk. That plainness is the durability story: no proprietary format, no lock-in, and the whole vault drops straight into a Git repository for version history. The **Smart Connections** plugin adds AI on top. It builds **embeddings** (numerical fingerprints of meaning that let software find related notes even when the words differ) entirely on your own device, so you can semantically search and chat with your vault offline, free, without sending a byte to the cloud.

This is the closest thing to a knowledge commons you actually own. Markdown in Git means the history of every change is recoverable, the files open in any text editor twenty years from now, and no vendor can revoke your access or your archive.

> 🔧 **For practitioners:** **SuperBenefit's Knowledge Garden** is a working example of exactly this pattern at community scale. It is an Obsidian vault (docs, a lexicon of defined terms, a curated link library, and design patterns) maintained as Markdown in a public Git repository and published to the web with **Quartz**, a free static-site generator for digital gardens. Markdown plus Git plus a static publisher is a stack a small team can run for years with no platform bill and full ownership of the archive.

## Where AI stops and you start

Here is the line, and the toolkit is blunt about it: **AI-assisted, but human-governed.** AI helps; humans review and steward. The commons stays accountable to people, not to a model.

That line matters most for one trap. **Polished writing is not reviewed knowledge.** An AI summary reads clean and confident whether it is right or wrong, which makes it more dangerous than a messy human note, not less. A fluent paragraph of governance guidance that misstates your actual rule will be trusted *because* it reads well. Separate the two states in your commons: mark what an AI drafted versus what a human has checked and signed off. Polish is not provenance.

Three more guardrails, each tied to a real failure mode:

- **Privacy.** Your discussions hold things members shared in confidence. Before a transcript or doc goes into a cloud tool, ask whether everyone in it consented to that. Default to local tools (Obsidian, on-device search) for anything sensitive.
- **Attribution.** When AI synthesizes across sources, the original authors and communities can vanish from the result. Keep links back to who said what and where it came from. Synthesis that erases its sources is extraction, not stewardship.
- **One person owns it.** If everyone owns the knowledge base, no one does. Name a steward responsible for the system working, not for writing everything, but for making sure summaries get filed, AI drafts get reviewed, and stale docs get marked. A commons without a gardener becomes a junk drawer.

The teams that handle conflict and trust well, the kind of practice GravityDAO has built its work around for DAOs, treat coordination as something you actively tend, not something a tool delivers. The same holds here. The tool captures and surfaces. The tending is yours.

## A starter stack

You do not need all of this. A defensible small-team setup that respects everything above:

- **Capture:** Otter.ai (free) for meeting transcripts, summarized to a short decision record each week.
- **Find answers:** NotebookLM (free) loaded with your governance and history docs, so members can self-serve.
- **Own the archive:** an Obsidian vault in a Git repository for anything sensitive or meant to last, with Smart Connections for private semantic search.

Three free tools, one human steward, one rule: AI drafts, a person confirms. That is enough to make sure the next person who leaves takes far less out the door with them.

## Try This

> **Start here:** Open a free NotebookLM notebook. Upload three documents: your community agreements, your last meeting notes, and one onboarding doc. Ask it a question a new member would ask, like "how do decisions get made here?" Notice what it answers well and where it cites nothing. The gaps are your documentation to-do list.
>
> **Go deeper:** Record your next team call (with everyone's consent) and run it through Otter.ai's free tier. Then write the summary yourself from the AI draft: three bullets of decisions, who owns each, by when. File it somewhere shared and searchable. You have just turned an hour of talk into durable institutional memory.
>
> **Stretch:** Stand up an Obsidian vault, put it in a Git repository, and install Smart Connections for local, private semantic search. Move your most sensitive or longest-lived knowledge there. For a public-facing version, follow SuperBenefit's pattern and publish the vault with Quartz: a knowledge commons you fully own, with every change in version history.

## References

- [Otter.ai Pricing](https://otter.ai/pricing) - Current transcription plans and free-tier limits; verify before relying on specific minutes.
- [Google NotebookLM](https://notebooklm.google/) - Free source-grounded research tool; answers come with citations to your own uploaded documents.
- [Obsidian](https://obsidian.md/) - Local-first notes app storing everything as plain Markdown files you own.
- [Smart Connections](https://github.com/brianpetro/obsidian-smart-connections) - Obsidian plugin for on-device AI semantic search and chat with your vault, no data sent to the cloud.
- [SuperBenefit Knowledge Garden](https://knowledge.superbenefit.org/) - A working community knowledge commons built as an Obsidian vault and published with Quartz.
- [Quartz](https://github.com/jackyzha0/quartz) - Free static-site generator for publishing a Markdown digital garden to the web.
- [GravityDAO](https://gravitydao.org/) - Conflict-management and trust-building practice for Web3 communities; coordination as something you tend, not automate.
