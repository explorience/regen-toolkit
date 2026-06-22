import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { journeyList } from './src/data/journeys.js';

// Build the sidebar from the journey definitions. Use `link` (not `slug`) so the
// build never breaks on an article that's still being generated; the link simply
// resolves once the file lands.
const journeySidebar = journeyList.map((j) => ({
  label: `${j.emoji} ${j.label}`,
  collapsed: j.id !== 'newcomer',
  items: j.chapters.map((c) => ({
    label: c.label,
    items: c.steps.map(([slug, title]) => ({ label: title, link: `/${slug}/` })),
  })),
}));

export default defineConfig({
  site: 'https://regen-toolkit-site.vercel.app',
  integrations: [
    starlight({
      title: 'Regen Web3 Toolkit',
      description: 'A jargon-free field guide to using web3 for regeneration.',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/explorience/regen-toolkit' },
      ],
      customCss: ['./src/styles/starlight.css'],
      head: [
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true } },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,640&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Hanken+Grotesk:wght@400;500;600;700&family=Spline+Sans+Mono:wght@400;500;600&display=swap',
          },
        },
      ],
      sidebar: [
        { label: 'Start here', items: [{ label: 'All journeys', link: '/' }, { label: 'Knowledge map', link: '/explorer/' }] },
        { label: 'About the system', items: [{ label: 'The framework', link: '/framework/' }, { label: 'This instance', link: '/regen-toolkit-os/' }] },
        ...journeySidebar,
      ],
      pagination: true,
      lastUpdated: false,
    }),
  ],
});
