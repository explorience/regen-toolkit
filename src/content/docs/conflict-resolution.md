---
title: "Conflict Resolution for Local Nodes"
description: "A practitioner's playbook for handling disagreements in a local regen node or chapter, with real DAO examples and the tooling that backs it up."
---

# Conflict Resolution for Local Nodes

Six months into your local node, two of your most active members stop speaking. One thinks the treasury should fund a real-world planting day; the other thinks every cent should go to the people doing the work. The group chat goes quiet. People start sending you DMs instead of posting in the open. You can feel the node start to thin out.

This is the moment that decides whether your node survives its first year. Not the smart contract, not the token, not the grant. The conflict.

Run a community long enough and you will hit this — because you are asking people to share resources, make collective decisions, and trust strangers with money. Conflict is not a failure signal. It is proof that people care enough to disagree. The question is never whether you face it, only whether you face it well.

## Most conflict is not about what it looks like

A fight about treasury allocation is usually a fight about trust. A fight about governance process is usually about power. A heated thread about token weights is usually someone who feels unheard.

The surface issue is rarely the real issue. Marshall Rosenberg's **Nonviolent Communication** — a framework for talking through conflict by naming observations, feelings, needs, and requests instead of trading blame — notes that most arguments stall at the observation level ("you spent too much") and never reach the need underneath ("I get scared when the treasury drops").

You can watch a disagreement climb a ladder:

1. **Disagreement** — different views, still respectful
2. **Criticism** — "that was a bad call"
3. **Complaint** — "you always do this"
4. **Contempt** — "you have no idea what you are doing"
5. **Defensiveness** — "not my fault"
6. **Stonewalling** — silence, withdrawal, members ghosting the group chat

Caught at rungs 1 and 2, almost anything is resolvable. By rungs 5 and 6, the relationship itself is damaged, and no governance vote fixes that. Your job is to catch conflict low on the ladder, in public, before it goes to DMs.

## The pitfall that kills nodes: letting structure decide what relationships should

Here is the trap that catches new node builders. When a disagreement gets uncomfortable, you reach for a mechanism — a vote, a rule, a tool — to make the discomfort go away. It feels decisive. It is usually a mistake.

The most expensive governance blow-up in DAO history is a warning here. In 2023 the **Aragon** project — one of the original toolkits for spinning up an on-chain organization — tried to hand its roughly $200M treasury to ANT token holders. A cluster of investors bought up tokens to force a payout, which the team called a "51% attack" by "risk-free-value raiders." Aragon cancelled the handover, then dissolved its association and redeemed the treasury — about 86,000 ETH, then worth around $155M — without a community vote, and the remaining DAO voted to fund legal action against its own founders ([CoinDesk](https://www.coindesk.com/business/2023/05/09/aragon-cancels-planned-community-control-of-200m-treasury-amid-battle-with-activist-investors/), [Cointelegraph](https://cointelegraph.com/news/aragon-association-dissolves-disburse-assets-token-holders)).

The lesson for a local node is not "avoid bad actors." It is that no clever mechanism saves you once trust is gone, and that reaching for a unilateral structural lever to end a fight tends to detonate the relationship instead. Protect the relationship first; the structure is a backstop, not a referee.

## Five principles for community money fights

**1. Separate the person from the problem.** It is easy to slide from "you voted against my proposal" to "you do not care about this community." Train the node to split **positions** (what someone wants) from **interests** (why they want it), and decisions from the people who made them. A no vote is data, not a verdict on someone's character.

**2. Acknowledge the feeling before you solve the problem.** When someone is upset they need to feel heard before they can think. "It sounds like the treasury draw really worried you" costs thirty seconds and de-escalates more conflicts than any framework. Skip it and your fix lands as a dismissal.

**3. Chase the need, not the position.** "We should fund more grants" is a position. The need under it might be "I need to show real impact or I will burn out defending this node to skeptics." Find the need and you usually find three ways to meet it. Ask, genuinely: "what does that get for you?"

**4. Build real containers for hard talks.** Some conflicts need more than a thread. Use a **mediated conversation** (a neutral member helps both sides be heard), written reflections where each party drafts their view and reads the other's before talking, or a **restorative circle** if real harm was done, so the harmed person can name the impact and the other can take responsibility.

**5. Let process depersonalize the deadlock.** This is where mechanism belongs. "If we cannot agree, the working group decides through our consent process" removes the pressure to win every argument. Losing a transparent process feels survivable; being overruled by a friend does not.

## The clean conflict process

When a fight flares, run these six steps in order. Do not skip to step five.

1. **Pause.** Name what you feel and what you need before you reply. A hot reply in the group chat is a rung-3 move that invites a rung-4 answer.
2. **Check intent.** Ask "what are you hoping for here?" This drags the conversation from positions toward interests.
3. **Acknowledge.** Reflect their view back before you give yours. Acknowledge is not agree: "I hear you are worried we are spending faster than we can sustain. Given last quarter, that is fair."
4. **Share your need.** Now your side, framed as a need, not a demand.
5. **Co-create.** Brainstorm out loud, write down every idea, judge none yet. Look for the option that meets both needs.
6. **Agree and follow up.** Write down what you decided and set a check-in date. Agreements drift without one.

## When mechanism does help: optimistic challenges

There is a healthy way to put tooling behind your social process, and the regen space already built it. **1Hive's Gardens** — a conviction-voting DAO framework — pairs **conviction voting** (support for a proposal builds over time, like interest, so funding flows to what the community consistently backs, not to whoever wins a single noisy day) with a written **covenant**: a plain-language agreement of the community's values and what proposals are out of bounds.

The clever part is the challenge. Anyone can flag a proposal as violating the covenant, which pauses it and sends the question to **Celeste**, a dispute-resolution layer where a random set of token-holders rules on whether the challenge holds. This "act first, get challenged if you crossed a line" pattern is **optimistic governance**, and it scales because most proposals are fine and only the contested few need adjudication ([Celeste docs](https://1hive.gitbook.io/celeste/), [Gardens v2](https://github.com/1Hive/gardens-v2)).

For genuinely intractable, high-stakes disputes — a contested payout, an accusation of bad faith — some DAOs escalate to **Kleros**, a decentralized arbitration protocol that acts as a "Supreme Court" by paying randomly drawn jurors to rule on a case ([Kleros 2026 update](https://blog.kleros.io/kleros-project-update-2026/)). For a young node this is overkill, but knowing it exists lets you tell members there is a path even if you cannot resolve a fight yourselves.

## The slow-burn conflict: contributor rewards and burnout

Not every conflict explodes. Some corrode. The most common one in regen nodes is about who deserves what — where two of your fears, burnout and central overreach, meet.

**SourceCred** is the cautionary tale. Its algorithm scored contributions and paid out a token called Grain, meant to run quietly so people could just contribute. In practice, members optimized for cred instead of the mission, the few people steering the weights became a soft center of power, and managing rewards consumed the energy meant for the work. The "CredSperiment" had wound down by 2022 ([Ellie Rennie's ethnography](https://ellierennie.medium.com/an-ethnography-of-sourcecreds-credsperiment-396a81efe355)).

**Gitcoin** lived the same pattern in its volunteer **steward** model — governance power, but no clear duties, no pay, no accountability. A handful did the work, most went passive, the active few burned out. Its 2025 governance revamp replaced unpaid stewards with compensated delegates who have explicit, renewable responsibilities ([Gitcoin Governance Manual](https://manual.gitcoin.co/introduction-and-overview/2025-revamp)).

For your node: do not bolt a rewards algorithm onto a group that has not agreed what it values. Name the contribution norms in words first. Pay for real responsibility instead of leaning on the same three volunteers until they quit. And watch for quiet capture, where "whoever steers the weights" becomes "whoever runs the place."

## When to escalate, and when to stop

Some conflicts do not belong at the node level. Pull in outside help when there is a legal or liability question, when someone feels genuinely unsafe (their wellbeing outranks your process), or when the same fight keeps recurring — a repeated conflict is a structural problem wearing a personal costume. Saying "we need outside help" is not failure; it keeps the node alive.

And accept the limit: not everyone has to be friends. If two members grate on each other but the work is fine, do not force reconciliation. Sometimes the cleanest fix is structural — reorganize responsibilities so they interact less.

## Try This

> **Start here:** Run the preemptive agreement today. Gather the node for 30 minutes — separate from any regular meeting — and answer four questions together, in writing: When someone upsets us, what should they expect from us? What does a respectful disagreement look like here? Who can people go to when they feel stuck? What behavior gets someone asked to leave? That document is your conflict agreement. Revisit it every six months.

> **Go deeper:** Write your node's **covenant** — one page of plain-language values and out-of-bounds behavior — and post it where every member can see it. Model it on the Gardens covenant pattern. Even unwired to an on-chain challenge, agreeing what is in bounds prevents the fights where everyone assumed a different rulebook.

> **Stretch:** Stand up a real optimistic-governance backstop. Spin up a [Gardens v2](https://app.gardens.fund/) community — live on Gnosis Chain, Optimism, Arbitrum, Base, Polygon, and Celo — attach your covenant, and run a mock proposal-and-challenge cycle so members see the full path from proposal to dispute before they need it in anger. Pair it with a [Snapshot](https://snapshot.box/) space for low-stakes temperature checks: Snapshot's gasless, off-chain voting carries the large majority of major DAO votes, and a temp-check-first, binding-vote-second flow keeps signaling cheap and decisions legitimate.

## References

- [Aragon Cancels Planned Community Control of $200M Treasury (CoinDesk, 2023)](https://www.coindesk.com/business/2023/05/09/aragon-cancels-planned-community-control-of-200m-treasury-amid-battle-with-activist-investors/) — the governance-raider attack and the unilateral response that broke community trust.
- [Aragon Association to Dissolve, Disburse $155M (Cointelegraph, 2023)](https://cointelegraph.com/news/aragon-association-dissolves-disburse-assets-token-holders) — how the treasury was redeemed and why the DAO sued its founders.
- [Celeste documentation, 1Hive](https://1hive.gitbook.io/celeste/) — the optimistic dispute-resolution protocol behind covenant challenges in Gardens.
- [Gardens v2 (1Hive)](https://app.gardens.fund/) — conviction-voting DAO framework with covenant-based dispute resolution you can deploy yourself.
- [Kleros Project Update 2026](https://blog.kleros.io/kleros-project-update-2026/) — current status of Kleros 2.0 / Court V2 decentralized arbitration.
- [An Ethnography of SourceCred's CredSperiment (Ellie Rennie)](https://ellierennie.medium.com/an-ethnography-of-sourcecreds-credsperiment-396a81efe355) — how a contributor-reward algorithm reshaped behavior and relationships, for worse.
- [Gitcoin 2025 Governance Revamp](https://manual.gitcoin.co/introduction-and-overview/2025-revamp) — replacing unaccountable volunteer stewards with compensated delegates to fix burnout and unclear authority.
- [Snapshot](https://snapshot.box/) — gasless off-chain voting used for temperature checks across most major DAOs.
- Rosenberg, Marshall B. *Nonviolent Communication: A Language of Life* (PuddleDancer Press, 2015) — the observations-feelings-needs-requests framework underpinning this whole approach.
- Lederach, John Paul. *The Little Book of Conflict Transformation* (Good Books, 2003) — treating conflict as a relationship to transform rather than a problem to eliminate.
