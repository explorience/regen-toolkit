// Regenerate the knowledge-map data from the live journey definitions.
// Run: node scripts/gen-graph.mjs
import { journeyList } from '../src/data/journeys.js';
import { writeFileSync } from 'node:fs';

const COLORS = {
  newcomer: '#74B58A',          // moss
  'local-node': '#DD8C5C',      // clay
  'knowledge-commons': '#79B5AB' // teal
};

const nodes = [];
const links = [];
const journeys = [];

for (const j of journeyList) {
  const steps = [];
  let prev = null;
  for (const ch of j.chapters) {
    for (const [slug, title, blurb] of ch.steps) {
      if (!nodes.find((n) => n.id === slug)) {
        nodes.push({ id: slug, label: title, journey: j.id, chapter: ch.label, blurb, color: COLORS[j.id] });
      }
      steps.push(slug);
      if (prev) links.push({ source: prev, target: slug, journey: j.id });
      prev = slug;
    }
  }
  journeys.push({ id: j.id, label: j.label, emoji: j.emoji, color: COLORS[j.id], tagline: j.tagline, count: steps.length, steps });
}

const graph = { journeys, nodes, links, stats: { topics: nodes.length, paths: journeys.length, links: links.length } };
writeFileSync(new URL('../public/explorer/knowledge-graph.json', import.meta.url), JSON.stringify(graph, null, 2));
console.log(`graph: ${nodes.length} nodes · ${links.length} links · ${journeys.length} journeys`);
