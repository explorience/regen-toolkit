import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Regen Toolkit',
      description: 'Web3 tools and knowledge for regenerative communities',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/explorience/regen-toolkit' },
      ],
      sidebar: [
        {
          label: 'Why Web3?',
          items: [
            { slug: 'why-regens-interested' },
            { slug: 'what-web3-can-cant-do' },
            { slug: 'common-concerns' },
            { slug: 'what-is-refi' },
          ],
        },
        {
          label: 'Blockchain Basics',
          items: [
            { slug: 'what-is-blockchain' },
            { slug: 'what-is-cryptocurrency' },
            { slug: 'how-to-get-crypto' },
            { slug: 'stablecoins' },
            { slug: 'centralized-vs-decentralized' },
            { slug: 'decentralization-spectrum' },
            { slug: 'trust-transparency' },
            { slug: 'cooperative-commons' },
            { slug: 'decentralization-resilience' },
            { slug: 'other-chains' },
            { slug: 'layer-2s' },
          ],
        },
        {
          label: 'Ethereum & Smart Contracts',
          items: [
            { slug: 'what-is-ethereum' },
            { slug: 'ethereum-ecosystem' },
            { slug: 'smart-contracts-explained' },
            { slug: 'which-chain-right' },
          ],
        },
        {
          label: 'Wallets & Security',
          items: [
            { slug: 'what-is-wallet' },
            { slug: 'setting-up-first-wallet' },
            { slug: 'custodial-vs-noncustodial' },
            { slug: 'hot-vs-cold' },
            { slug: 'seed-phrases' },
            { slug: 'common-scams' },
            { slug: 'security-best-practices-orgs' },
            { slug: 'recovery-planning' },
            { slug: 'operational-security' },
            { slug: 'wallet-comparison-guide' },
          ],
        },
        {
          label: 'Tokens & Digital Assets',
          items: [
            { slug: 'what-are-tokens' },
            { slug: 'token-standards' },
            { slug: 'tokens-coordination-tools' },
            { slug: 'nfts-beyond-art' },
            { slug: 'why-accept-crypto' },
          ],
        },
        {
          label: 'DAOs & Governance',
          items: [
            { slug: 'what-is-dao' },
            { slug: 'is-dao-right' },
            { slug: 'dao-governance-models' },
            { slug: 'daos-vs-traditional' },
            { slug: 'voting-mechanisms' },
            { slug: 'dao-tooling' },
            { slug: 'examples-impact-daos' },
            { slug: 'legal-structures' },
            { slug: 'multisig-setup' },
          ],
        },
        {
          label: 'Local Nodes',
          items: [
            { slug: 'is-community-ready' },
            { slug: 'minimum-viable-node' },
            { slug: 'building-trust' },
            { slug: 'onboarding-members' },
            { slug: 'funding-your-node' },
            { slug: 'common-pitfalls' },
            { slug: 'local-currency' },
          ],
        },
        {
          label: 'Community Building',
          items: [
            { slug: 'inclusive-practices' },
            { slug: 'leadership-development' },
            { slug: 'conflict-resolution' },
            { slug: 'documentation-knowledge' },
            { slug: 'building-momentum' },
          ],
        },
        {
          label: 'Gatherings & Events',
          items: [
            { slug: 'types-of-gatherings' },
            { slug: 'gatherings-pattern' },
            { slug: 'planning-web3-events' },
            { slug: 'funding-gatherings' },
          ],
        },
        {
          label: 'Impact & Measurement',
          items: [
            { slug: 'why-measurement-matters' },
            { slug: 'dmrv' },
            { slug: 'onchain-attestations' },
            { slug: 'identity-verification' },
            { slug: 'credentials-certifications' },
            { slug: 'silvi-protocol' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { slug: 'key-terms-a-z' },
            { slug: 'what-you-can-do-ethereum' },
          ],
        },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
  ],
});
