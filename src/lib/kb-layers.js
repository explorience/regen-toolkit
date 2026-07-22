// Shared layer vocabulary — imported by both KbGraph.astro's frontmatter (legend
// chips) and its bundled client script (node fill/hover colors) so the two copies
// can never drift out of sync.
export const LAYER_COLORS = {
  1: '#6b7280', 2: '#3f7d5a', 3: '#2f6f6f', 4: '#8a6d3b', 5: '#9c5a3c',
  6: '#7d5a9c', 7: '#3f6d9c', 8: '#4a7d3f', 9: '#9c3f6d', 10: '#5a5a5a',
  unmapped: '#b0b0b0',
};
export const LAYER_NAMES = {
  1: 'Ontology', 2: 'Knowledge', 3: 'Resource graph', 4: 'Concept ecology', 5: 'Option library',
  6: 'Deployment', 7: 'Tracks', 8: 'Implementation', 9: 'Evolution', 10: 'Infrastructure',
};
export const colorForLayer = (layer) => LAYER_COLORS[layer ?? 'unmapped'] ?? LAYER_COLORS.unmapped;
