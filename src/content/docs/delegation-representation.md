---
title: Delegation and Representation in DAOs
description: How to design delegation systems that balance participation with practicality in community governance.
section: '2.7'
track: 2
status: draft
author: Tej
sources:
- DAO governance research
- Liquid democracy theory
- Representative democracy vs direct democracy
audience:
- grounded-regen
estimated_words: 1500
created: '2026-03-12T20:30:00.000Z'
last_updated: '2026-03-14T16:00:00.000Z'
research_done: true
draft_done: true
factcheck_done: true
review_done: true
critique_done: true
published_flag: true
issue: 0
category: applied
---

# Delegation and Representation in DAOs

*Balancing participation with practicality in community governance*

---

## The Participation Problem

Direct democracy sounds ideal: everyone votes on everything. In practice, it leads to voter fatigue. When every decision requires a vote, people stop participating. Turnout drops. A small group of highly engaged members makes all the decisions anyway — but without the legitimacy of formal delegation.

This is why most DAOs eventually consider delegation: allowing members to delegate their voting power to someone they trust.

---

## Types of Delegation

### Full Delegation
A member gives all their voting power to a delegate. The delegate votes on their behalf on all matters.

**Pros**: Simple, reduces voter fatigue
**Cons**: Concentrates power, delegate may not represent member's views on all issues

### Topic-Based Delegation
A member delegates voting power to different delegates for different topics (finance to Alice, technical to Bob, community to Carol).

**Pros**: Expertise-based, more granular representation
**Cons**: Complex to manage, requires clear topic boundaries

### Liquid Delegation
Members can delegate, re-delegate, or revoke at any time. Delegation can be transitive (Alice delegates to Bob, Bob delegates to Carol — Alice's vote flows through Bob to Carol).

**Pros**: Most flexible, responsive to changing circumstances
**Cons**: Can create complex power chains, requires sophisticated tooling

### Time-Limited Delegation
Delegation expires after a set period (quarterly, annually) and must be actively renewed.

**Pros**: Prevents set-and-forget, ensures accountability
**Cons**: Administrative burden, potential gaps during renewal

---

## Designing a Delegation System

### Key Questions
1. **Who can be a delegate?** Anyone, or only members who meet certain criteria?
2. **How is delegation recorded?** On-chain, off-chain, or hybrid?
3. **Can delegation be revoked?** Instantly, or with notice?
4. **Is there a cap?** Can one delegate hold unlimited voting power?
5. **Are delegates compensated?** Should they be paid for their service?

### Recommendations for Local Nodes

- **Start with optional delegation**: Don't force it. Let members who want to delegate do so.
- **Cap delegate power**: No delegate should hold more than 20-30% of total voting power. Prevents concentration.
- **Require transparency**: Delegates should explain their votes publicly.
- **Build in accountability**: Regular delegate reports, recall mechanisms.
- **Keep direct voting available**: Any member should be able to override delegation and vote directly on any issue.

---

## Accountability Mechanisms

### Delegate Reports
Delegates publish regular updates explaining how they voted and why. This creates transparency and allows delegators to evaluate their choice.

### Recall
Members can revoke delegation at any time, no questions asked.

### Term Limits
Delegates serve for fixed terms, preventing entrenchment.

### Conflict of Interest Disclosure
Delegates declare conflicts before voting on relevant issues.

---

## Common Mistakes

### Mistake 1: Delegation Without Accountability
If delegates don't report on their votes, delegators can't evaluate them. Build reporting into the process.

### Mistake 2: Permanent Delegation
"Set and forget" delegation leads to power concentration. Require periodic renewal.

### Mistake 3: No Power Caps
One popular delegate accumulating 60% of voting power defeats the purpose of distributed governance.

### Mistake 4: Making Delegation Too Complex
If the system requires a PhD to understand, people won't use it. Start simple.

---

## Moving Forward

Consider delegation when voter fatigue becomes a problem. Start with simple optional delegation, add complexity only as needed. Keep direct voting always available as a backstop.
