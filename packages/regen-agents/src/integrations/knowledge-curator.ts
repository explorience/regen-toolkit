/**
 * Knowledge Curator Integration
 * 
 * Manages knowledge storage and retrieval for all regen agents.
 */

import { KnowledgeEntry, KnowledgeQuery } from '../types/index.js';

export class KnowledgeCurator {
  private entries: Map<string, KnowledgeEntry> = new Map();

  /**
   * Store a knowledge entry
   */
  async store(entry: KnowledgeEntry): Promise<void> {
    this.entries.set(entry.id, entry);
    // In a real implementation, this would persist to a database
    console.log(`[KnowledgeCurator] Stored entry: ${entry.id}`);
  }

  /**
   * Query knowledge entries
   */
  async query(criteria: KnowledgeQuery): Promise<KnowledgeEntry[]> {
    let results = Array.from(this.entries.values());

    if (criteria.category) {
      results = results.filter(e => e.category === criteria.category);
    }

    if (criteria.tags && criteria.tags.length > 0) {
      results = results.filter(e => 
        criteria.tags!.some(tag => e.tags.includes(tag))
      );
    }

    if (criteria.agentId) {
      results = results.filter(e => e.agentId === criteria.agentId);
    }

    if (criteria.dateRange) {
      results = results.filter(e => 
        e.createdAt >= criteria.dateRange!.start && 
        e.createdAt <= criteria.dateRange!.end
      );
    }

    if (criteria.searchQuery) {
      const query = criteria.searchQuery.toLowerCase();
      results = results.filter(e => 
        e.content.toLowerCase().includes(query) ||
        e.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    return results.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Get a specific entry by ID
   */
  async get(id: string): Promise<KnowledgeEntry | null> {
    return this.entries.get(id) || null;
  }

  /**
   * Update an existing entry
   */
  async update(id: string, updates: Partial<KnowledgeEntry>): Promise<void> {
    const entry = this.entries.get(id);
    if (entry) {
      this.entries.set(id, { ...entry, ...updates });
    }
  }

  /**
   * Find related entries based on tags
   */
  async findRelated(entryId: string, limit: number = 5): Promise<KnowledgeEntry[]> {
    const entry = this.entries.get(entryId);
    if (!entry) return [];

    return Array.from(this.entries.values())
      .filter(e => e.id !== entryId)
      .filter(e => e.tags.some(tag => entry.tags.includes(tag)))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit);
  }

  /**
   * Get entries by agent
   */
  async getByAgent(agentId: string): Promise<KnowledgeEntry[]> {
    return Array.from(this.entries.values())
      .filter(e => e.agentId === agentId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Delete an entry
   */
  async delete(id: string): Promise<boolean> {
    return this.entries.delete(id);
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<string[]> {
    const categories = new Set<string>();
    for (const entry of this.entries.values()) {
      categories.add(entry.category);
    }
    return Array.from(categories);
  }

  /**
   * Get all tags
   */
  async getTags(): Promise<string[]> {
    const tags = new Set<string>();
    for (const entry of this.entries.values()) {
      entry.tags.forEach(tag => tags.add(tag));
    }
    return Array.from(tags);
  }
}
