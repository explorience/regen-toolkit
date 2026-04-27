// GitHub adapter

import { Octokit } from 'octokit';
import type { IssueData, Repository } from '@/types';

export class GitHubAdapter {
  private client: Octokit | null = null;

  authenticate(token: string): void {
    this.client = new Octokit({ auth: token });
  }

  async createIssue(owner: string, repo: string, data: IssueData): Promise<unknown> {
    if (!this.client) throw new Error('Not authenticated');
    const response = await this.client.rest.issues.create({
      owner,
      repo,
      title: data.title,
      body: data.body,
      labels: data.labels,
    });
    return response.data;
  }

  async listRepos(): Promise<Repository[]> {
    if (!this.client) throw new Error('Not authenticated');
    const response = await this.client.rest.repos.listForAuthenticatedUser();
    return response.data.map((r) => ({
      id: r.id,
      name: r.name,
      fullName: r.full_name,
    }));
  }
}
