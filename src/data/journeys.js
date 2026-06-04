// Ordered journey definitions, used by the homepage, journey landing pages,
// and the Starlight sidebar. Slugs map to /[slug] article routes.

export const journeys = {
  newcomer: {
    id: "newcomer",
    label: "Newcomer Orientation",
    emoji: "🌱",
    kicker: "If you're new to all of this",
    tagline: "From “I don't get any of this” to oriented, in an afternoon.",
    intro:
      "A guided walk for anyone arriving in regenerative web3 with no crypto background. No jargon left undefined, no hype, no assumptions. We start with why this matters for real-world work, give you the core ideas, get you set up safely, then point you at the regen world and how to find your people.",
    outcome: [
      "Explain blockchain, wallets and ReFi to a friend without flinching",
      "Set up a wallet and avoid the common scams",
      "Know where you fit and take a confident first step",
    ],
    minutes: 70,
    href: "/start/newcomer/",
    chapters: [
      {
        label: "Get your bearings",
        steps: [
          ["why-regens-interested", "Why regens are curious about web3", "Why people doing real-world good are looking at this at all."],
          ["what-web3-can-cant-do", "What web3 can and can't do", "An honest map of what the tech does well, and what it doesn't."],
          ["common-concerns", "The honest worries, answered", "Energy, scams, hype, complexity, addressed plainly."],
        ],
      },
      {
        label: "The core ideas",
        steps: [
          ["what-is-decentralization", "Decentralization, in plain terms", "The single idea underneath everything else."],
          ["what-is-blockchain", "What is a blockchain?", "A shared notebook the whole village keeps. No middleman."],
          ["what-is-cryptocurrency", "What is cryptocurrency?", "Money that lives on the blockchain, explained simply."],
          ["stablecoins", "Stablecoins: crypto that holds still", "Crypto designed to keep a steady, predictable value."],
        ],
      },
      {
        label: "Get set up safely",
        steps: [
          ["how-to-get-crypto", "How to actually get some crypto", "The realistic on-ramps for your first bit of crypto."],
          ["what-is-wallet", "What is a wallet?", "Your keychain for the on-chain world."],
          ["setting-up-first-wallet", "Set up your first wallet", "Step by step, with the safety bits that matter."],
          ["seed-phrases", "Seed phrases & staying safe", "The words that are everything. How to guard them."],
          ["common-scams", "Spotting common scams", "The traps, and the habits that keep you clear of them."],
        ],
      },
      {
        label: "Step into regen",
        steps: [
          ["what-is-dao", "What is a DAO?", "Communities that run on shared rules instead of a boss."],
          ["what-is-refi", "What is ReFi?", "Regenerative finance: money that tries to heal, not extract."],
          ["refi-vs-defi-tradfi", "ReFi vs DeFi vs traditional finance", "How ReFi differs from ordinary crypto and ordinary money."],
          ["find-your-community", "Find your community", "Where to land, who to meet, and how to take a first step."],
        ],
      },
    ],
  },

  "local-node": {
    id: "local-node",
    label: "Local Node Builder",
    emoji: "🔄",
    kicker: "If you're starting something local",
    tagline: "Everything you need to stand up a chapter, hub or local node.",
    intro:
      "A practical path for anyone forming a place-based regen group, a Greenpill chapter, a ReFi local node, a bioregional hub. It moves from “is our community ready?” through standing it up, funding it, growing it, and showing real impact. Built from patterns that have actually worked, with the pitfalls marked.",
    outcome: [
      "Decide whether a local node is right for your community",
      "Stand up a minimum viable node and fund it sustainably",
      "Grow a healthy community and show your impact",
    ],
    minutes: 110,
    href: "/start/local-node/",
    chapters: [
      {
        label: "Is this for us?",
        steps: [
          ["what-is-local-node", "What is a local node?", "What a local node actually is, in practice."],
          ["local-node-model", "The local node model", "The shape of the model and why it works."],
          ["why-local-matters", "Why local matters", "Why place-based action is the point, not a footnote."],
          ["local-nodes-and-daos", "Local nodes & the wider network", "How a node relates to DAOs and the global network."],
          ["is-community-ready", "Is your community ready?", "An honest readiness check before you start."],
        ],
      },
      {
        label: "Stand it up",
        steps: [
          ["minimum-viable-node", "The minimum viable node", "The smallest version that's still real."],
          ["building-founding-team", "Building your founding team", "Who you need around you, and the roles that matter."],
          ["legal-structures", "Legal structures & fiscal bridges", "Fiscal sponsorship and the legal options, demystified."],
          ["first-90-days", "Your first 90 days", "A concrete roadmap for the first three months."],
        ],
      },
      {
        label: "Fund it",
        steps: [
          ["funding-your-node", "Funding your node", "Building a mix that doesn't depend on one source."],
          ["funding-landscape", "The funding landscape", "The web3 funding world, mapped."],
          ["gitcoin-grants-qf", "Gitcoin & quadratic funding", "Quadratic funding rounds, start to finish."],
          ["giveth-donations", "Direct donations with Giveth", "Setting up to receive donations on Giveth."],
          ["writing-grant-proposals", "Writing grant proposals", "How to write a proposal that actually lands."],
        ],
      },
      {
        label: "Grow the community",
        steps: [
          ["building-trust", "Building trust", "Trust is the real infrastructure. How to build it."],
          ["onboarding-members", "Onboarding members", "Turning newcomers into contributors."],
          ["conflict-resolution", "Conflict & coordination", "Handling friction before it burns people out."],
          ["common-pitfalls", "Common pitfalls", "The mistakes that sink nodes, and how to dodge them."],
        ],
      },
      {
        label: "Gather & show impact",
        steps: [
          ["types-of-gatherings", "Types of gatherings", "The kinds of gatherings that build momentum."],
          ["planning-web3-events", "Planning your events", "Running an event that's worth people's time."],
          ["funding-gatherings", "Funding gatherings", "Paying for gatherings without going broke."],
          ["why-measurement-matters", "Showing your impact", "Measuring impact in a way people trust."],
        ],
      },
    ],
  },
};

journeys["knowledge-commons"] = {
  id: "knowledge-commons",
  label: "Knowledge Commons Builder",
  emoji: "🪴",
  kicker: "If you're building shared knowledge",
  tagline: "Turn scattered docs and links into a living knowledge commons.",
  badge: "New",
  intro:
    "A path for knowledge gardeners, documentation stewards and research teams who want to build something that stays alive, a wiki, knowledge garden, resource graph or source-aware archive. It moves from why a commons beats a doc-dump, through structuring knowledge well, using AI without losing the plot, the practical toolbox, and keeping it alive over time.",
  outcome: [
    "Structure knowledge so people and AI can actually use it",
    "Use AI to help without letting it invent false coherence",
    "Set up stewardship so the commons doesn't rot",
  ],
  minutes: 95,
  href: "/start/knowledge-commons/",
  chapters: [
    {
      label: "Why a commons, not a doc-dump",
      steps: [
        ["what-is-knowledge-commons", "What is a knowledge commons?", "Why a commons beats a folder full of docs."],
        ["knowledge-gardens", "Knowledge gardens", "Tending knowledge like a living plot, not a filing cabinet."],
        ["source-systems", "Source systems vs links", "The difference between a living source and a bare URL, and why it matters."],
      ],
    },
    {
      label: "Structure the knowledge",
      steps: [
        ["ontology-vs-taxonomy", "Ontology vs taxonomy", "Two ways to organise meaning, without the headache."],
        ["metadata-that-matters", "Metadata that matters", "The handful of fields actually worth the effort."],
        ["review-and-maturity", "Review & maturity states", "Marking what's reviewed, what's raw, and what's risky."],
      ],
    },
    {
      label: "AI in the commons",
      steps: [
        ["ai-community-tools", "AI tools for communities", "Where AI genuinely helps a knowledge community."],
        ["ai-assisted-classification", "AI-assisted classification", "Letting AI sort knowledge, with guardrails."],
        ["human-review-boundaries", "Keeping humans in the loop", "Where a person must stay in charge, and why."],
      ],
    },
    {
      label: "The toolbox & workflow",
      steps: [
        ["knowledge-tools-directory", "The knowledge-commons toolbox", "Obsidian, Quartz, GitHub, LinkML and friends, compared."],
        ["editorial-workflow", "An editorial workflow that scales", "Moving past the one-person bottleneck."],
        ["archive-compost", "Archive & compost", "Letting old knowledge go gracefully instead of rotting in place."],
      ],
    },
    {
      label: "Keep it alive",
      steps: [
        ["stewardship-roles", "Stewardship roles", "Who keeps the garden alive, and how the work is shared."],
        ["federation-portability", "Federation & portability", "Keeping your data free to move, KOI and beyond."],
      ],
    },
  ],
};

export const journeyList = [journeys.newcomer, journeys["local-node"], journeys["knowledge-commons"]];

export function journeyStats(j) {
  const count = j.chapters.reduce((n, c) => n + c.steps.length, 0);
  return { count, minutes: j.minutes, chapters: j.chapters.length };
}
