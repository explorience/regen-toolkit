# Integration Guide

## GitHub Integration

Connect to GitHub for repository management and issue tracking.

```typescript
import { GitHubAdapter } from '@/integrations/github';

const github = new GitHubAdapter();
github.authenticate(process.env.GITHUB_TOKEN);
```

## org-os Protocol

The org-os adapter enables coordination with organizational operating systems.

```typescript
import { OrgOsAdapter } from '@/integrations/org-os';

const orgOs = new OrgOsAdapter();
await orgOs.connect('https://api.org-os.example');
```

## egregore Integration

Connect to egregore for knowledge management.

```typescript
import { EgregoreAdapter } from '@/integrations/egregore';
```

## Environment Variables

- `GITHUB_TOKEN` - GitHub personal access token
- `ORG_OS_ENDPOINT` - org-os API endpoint
- `EGREGORE_URL` - egregore service URL
