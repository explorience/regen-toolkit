/**
 * Knowledge Curator Tool
 * Manages knowledge base for agricultural research
 */

import { KnowledgeEntry, Citation } from '../../../types/index.js';

export interface KnowledgeQuery {
  category?: string;
  tags?: string[];
  searchQuery?: string;
  dateRange?: { start: Date; end: Date };
  agentId?: string;
  confidenceThreshold?: number;
}

export interface KnowledgeStoreRequest {
  category: string;
  tags: string[];
  content: string;
  confidence: number;
  citations: Citation[];
  relatedEntries?: string[];
  metadata?: Record<string, unknown>;
}

export interface KnowledgeRetrievalResult {
  entries: KnowledgeEntry[];
  totalCount: number;
  relevanceScores: Map<string, number>;
  suggestedTags: string[];
}

export class KnowledgeCuratorTool {
  private knowledgeBase: Map<string, KnowledgeEntry> = new Map();
  private tagIndex: Map<string, Set<string>> = new Map();
  private categoryIndex: Map<string, Set<string>> = new Map();

  async store(request: KnowledgeStoreRequest): Promise<KnowledgeEntry> {
    const entry: KnowledgeEntry = {
      id: this.generateId(),
      agentId: 'agriculture-researcher',
      category: request.category,
      tags: request.tags,
      content: request.content,
      confidence: request.confidence,
      citations: request.citations,
      createdAt: new Date(),
      relatedEntries: request.relatedEntries || [],
    };

    // Store in knowledge base
    this.knowledgeBase.set(entry.id, entry);

    // Update indices
    this.updateIndices(entry);

    return entry;
  }

  async query(query: KnowledgeQuery): Promise<KnowledgeRetrievalResult> {
    let results = Array.from(this.knowledgeBase.values());

    // Apply filters
    if (query.category) {
      results = results.filter(e => e.category === query.category);
    }

    if (query.tags && query.tags.length > 0) {
      results = results.filter(e => 
        query.tags!.some(tag => e.tags.includes(tag))
      );
    }

    if (query.agentId) {
      results = results.filter(e => e.agentId === query.agentId);
    }

    if (query.confidenceThreshold !== undefined) {
      results = results.filter(e => e.confidence >= query.confidenceThreshold);
    }

    if (query.dateRange) {
      results = results.filter(e => 
        e.createdAt >= query.dateRange!.start && 
        e.createdAt <= query.dateRange!.end
      );
    }

    if (query.searchQuery) {
      const searchLower = query.searchQuery.toLowerCase();
      results = results.filter(e => 
        e.content.toLowerCase().includes(searchLower) ||
        e.tags.some(t => t.toLowerCase().includes(searchLower))
      );
    }

    // Sort by confidence (descending)
    results.sort((a, b) => b.confidence - a.confidence);

    // Calculate relevance scores
    const relevanceScores = new Map<string, number>();
    for (const entry of results) {
      relevanceScores.set(entry.id, this.calculateRelevance(entry, query));
    }

    // Suggest related tags
    const suggestedTags = this.suggestRelatedTags(results, query.tags || []);

    return {
      entries: results,
      totalCount: results.length,
      relevanceScores,
      suggestedTags,
    };
  }

  async findRelated(entryId: string, limit: number = 5): Promise<KnowledgeEntry[]> {
    const entry = this.knowledgeBase.get(entryId);
    if (!entry) return [];

    // Direct relationships
    const related = entry.relatedEntries || [];
    const directRelated = related
      .map(id => this.knowledgeBase.get(id))
      .filter((e): e is KnowledgeEntry => e !== undefined);

    // Tag-based similarity
    const tagRelated = Array.from(this.knowledgeBase.values())
      .filter(e => e.id !== entryId)
      .filter(e => e.tags.some(tag => entry.tags.includes(tag)))
      .map(e => ({
        entry: e,
        similarity: this.calculateTagSimilarity(entry.tags, e.tags),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit - directRelated.length)
      .map(r => r.entry);

    return [...directRelated, ...tagRelated];
  }

  async getPracticeGuides(practice: string, region?: string): Promise<KnowledgeEntry[]> {
    const query: KnowledgeQuery = {
      category: 'practice-guide',
      tags: [practice],
    };

    if (region) {
      query.tags!.push(region);
    }

    const result = await this.query(query);
    return result.entries;
  }

  async getCaseStudies(practice?: string, region?: string): Promise<KnowledgeEntry[]> {
    const tags: string[] = [];
    if (practice) tags.push(practice);
    if (region) tags.push(region);

    const result = await this.query({
      category: 'case-study',
      tags: tags.length > 0 ? tags : undefined,
    });

    return result.entries;
  }

  async getResearchSynthesis(topic: string): Promise<{
    synthesis: string;
    keyFindings: string[];
    sources: Citation[];
    confidence: number;
  } | null> {
    const result = await this.query({
      category: 'research-summary',
      searchQuery: topic,
    });

    if (result.entries.length === 0) return null;

    const entry = result.entries[0];
    const related = await this.findRelated(entry.id, 10);

    // Compile synthesis
    const allFindings = [entry, ...related]
      .map(e => {
        try {
          const parsed = JSON.parse(e.content);
          return parsed.keyFindings || [];
        } catch {
          return [];
        }
      })
      .flat();

    const uniqueFindings = [...new Set(allFindings)];

    // Compile sources
    const allCitations = [entry, ...related].flatMap(e => e.citations);
    const uniqueSources = allCitations.filter((c, i, arr) => 
      arr.findIndex(t => t.source === c.source && t.title === c.title) === i
    );

    // Calculate average confidence
    const avgConfidence = [entry, ...related].reduce((sum, e) => sum + e.confidence, 0) 
      / (1 + related.length);

    return {
      synthesis: entry.content,
      keyFindings: uniqueFindings.slice(0, 10),
      sources: uniqueSources,
      confidence: Math.round(avgConfidence * 100) / 100,
    };
  }

  private generateId(): string {
    return `agri-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private updateIndices(entry: KnowledgeEntry): void {
    // Update tag index
    for (const tag of entry.tags) {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(entry.id);
    }

    // Update category index
    if (!this.categoryIndex.has(entry.category)) {
      this.categoryIndex.set(entry.category, new Set());
    }
    this.categoryIndex.get(entry.category)!.add(entry.id);
  }

  private calculateRelevance(entry: KnowledgeEntry, query: KnowledgeQuery): number {
    let score = entry.confidence;

    // Boost for matching tags
    if (query.tags) {
      const matchingTags = entry.tags.filter(t => query.tags!.includes(t));
      score += matchingTags.length * 0.1;
    }

    // Boost for recent entries
    const ageInDays = (Date.now() - entry.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    if (ageInDays < 365) {
      score += 0.05;
    }

    return Math.min(1, score);
  }

  private suggestRelatedTags(results: KnowledgeEntry[], currentTags: string[]): string[] {
    const tagCounts: Record<string, number> = {};

    for (const entry of results) {
      for (const tag of entry.tags) {
        if (!currentTags.includes(tag)) {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }
      }
    }

    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);
  }

  private calculateTagSimilarity(tagsA: string[], tagsB: string[]): number {
    const intersection = tagsA.filter(t => tagsB.includes(t));
    const union = [...new Set([...tagsA, ...tagsB])];
    return intersection.length / union.length;
  }
}
