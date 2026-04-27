# Quick Start

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd regen-toolkit

# Install dependencies
npm install
```

## Configuration

Create a `.env` file:

```bash
GITHUB_TOKEN=your_github_token
ORG_OS_ENDPOINT=https://api.org-os.example
```

## Development

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## First Run

The toolkit will initialize:

1. Load configuration from environment
2. Initialize adapters
3. Start agent coordinator
4. Ready for task execution

## Next Steps

- Read [Architecture](./ARCHITECTURE.md) to understand the design
- Check [API Reference](./API.md) for available functions
- Review [Integration Guide](./INTEGRATION.md) for external connections
