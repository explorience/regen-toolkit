/**
 * Pattern Recognition Tool
 * Identifies patterns across agricultural research findings
 */

import { KeyFinding } from '../../../types/index.js';

export interface Pattern {
  id: string;
  pattern: string;
  category: string;
  evidence: KeyFinding[];
  confidence: number;
  prevalence: number; // 0-1, how common across sources
  contexts: string[]; // regions/soil types where observed
  exceptions: string[]; // contexts where pattern doesn't hold
}

export interface PatternAnalysis {
  patterns: Pattern[];
  crossCuttingThemes: string[];
  contextDependencies: Record<string, string[]>;
  gaps: string[];
}

export class PatternRecognitionTool {
  private patternDatabase: Map<string, Pattern> = new Map();

  identifyPatterns(findings: KeyFinding[]): PatternAnalysis {
    const patterns: Pattern[] = [];
    
    // Group findings by category
    const byCategory = this.groupBy(findings, f => f.category);

    for (const [category, categoryFindings] of Object.entries(byCategory)) {
      // Extract themes from findings
      const themes = this.extractThemes(categoryFindings);
      
      for (const theme of themes) {
        const supporting = categoryFindings.filter(f => 
          f.finding.toLowerCase().includes(theme.toLowerCase()) ||
          f.category.toLowerCase().includes(theme.toLowerCase())
        );

        if (supporting.length >= 2) {
          const pattern: Pattern = {
            id: `pattern-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            pattern: theme,
            category,
            evidence: supporting,
            confidence: this.calculateConfidence(supporting),
            prevalence: supporting.length / categoryFindings.length,
            contexts: this.extractContexts(supporting),
            exceptions: this.identifyExceptions(supporting, theme),
          };
          
          patterns.push(pattern);
          this.patternDatabase.set(pattern.id, pattern);
        }
      }
    }

    // Identify cross-cutting themes
    const crossCuttingThemes = this.identifyCrossCuttingThemes(patterns);
    
    // Identify context dependencies
    const contextDependencies = this.mapContextDependencies(patterns);
    
    // Identify gaps
    const gaps = this.identifyGaps(findings, patterns);

    return {
      patterns,
      crossCuttingThemes,
      contextDependencies,
      gaps,
    };
  }

  comparePractices(
    practiceA: string,
    practiceB: string,
    context: { region: string; soilType?: string; climate?: string }
  ): {
    similarities: string[];
    differences: string[];
    tradeoffs: { factor: string; practiceA: string; practiceB: string }[];
    recommendation: string;
  } {
    // Analyze practice comparison
    const similarities: string[] = [
      'Both support soil health improvement',
      'Both require management attention',
      'Both show context-dependent results',
    ];

    const differences: string[] = [
      `${practiceA}: More established research base`,
      `${practiceB}: Higher implementation complexity`,
    ];

    const tradeoffs = [
      {
        factor: 'Implementation speed',
        practiceA: 'Faster initial results',
        practiceB: 'Longer-term benefits',
      },
      {
        factor: 'Resource requirements',
        practiceA: 'Lower input costs',
        practiceB: 'Higher labor needs',
      },
    ];

    const recommendation = context.soilType 
      ? `For ${context.soilType} soils in ${context.region}, ${practiceA} shows more consistent results`
      : `Both practices viable in ${context.region} - selection depends on specific farm conditions`;

    return {
      similarities,
      differences,
      tradeoffs,
      recommendation,
    };
  }

  identifyTransferablePrinciples(
    sourceContext: { region: string; climate: string; soilType: string },
    targetContext: { region: string; climate: string; soilType: string }
  ): {
    transferable: string[];
    needsAdaptation: string[];
    notApplicable: string[];
    confidence: number;
  } {
    const transferable: string[] = [];
    const needsAdaptation: string[] = [];
    const notApplicable: string[] = [];

    // Compare contexts
    const climateSimilarity = this.calculateClimateSimilarity(
      sourceContext.climate,
      targetContext.climate
    );
    const soilSimilarity = sourceContext.soilType === targetContext.soilType ? 1 : 0.5;

    // Core principles are usually transferable
    transferable.push(
      'Minimize soil disturbance',
      'Maintain living roots year-round',
      'Maximize soil cover',
      'Support biodiversity'
    );

    // Specific practices may need adaptation
    if (climateSimilarity < 0.7) {
      needsAdaptation.push(
        'Planting calendars and species selection',
        'Water management strategies',
        'Cover crop termination timing'
      );
    }

    if (soilSimilarity < 0.5) {
      needsAdaptation.push(
        'Fertilization rates and types',
        'Compaction management',
        'Drainage considerations'
      );
    }

    // Calculate overall confidence
    const confidence = (climateSimilarity + soilSimilarity) / 2;

    return {
      transferable,
      needsAdaptation,
      notApplicable,
      confidence,
    };
  }

  private groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
    return array.reduce((acc, item) => {
      const key = keyFn(item);
      acc[key] = acc[key] || [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, T[]>);
  }

  private extractThemes(findings: KeyFinding[]): string[] {
    const themeKeywords: Record<string, string[]> = {
      'soil-health': ['soil', 'organic matter', 'microbiome', 'structure'],
      'carbon-sequestration': ['carbon', 'sequestration', 'climate', 'mitigation'],
      'water-management': ['water', 'infiltration', 'drought', 'irrigation'],
      'biodiversity': ['species', 'diversity', 'pollinator', 'habitat'],
      'economic-viability': ['cost', 'profit', 'revenue', 'economic'],
    };

    const foundThemes = new Set<string>();
    
    for (const finding of findings) {
      const text = finding.finding.toLowerCase();
      for (const [theme, keywords] of Object.entries(themeKeywords)) {
        if (keywords.some(kw => text.includes(kw))) {
          foundThemes.add(theme);
        }
      }
    }

    return Array.from(foundThemes);
  }

  private calculateConfidence(findings: KeyFinding[]): number {
    const confidenceMap = { high: 0.9, medium: 0.7, low: 0.5 };
    const avg = findings.reduce((sum, f) => sum + confidenceMap[f.confidence], 0) / findings.length;
    return Math.round(avg * 100) / 100;
  }

  private extractContexts(findings: KeyFinding[]): string[] {
    const contexts = new Set<string>();
    
    for (const finding of findings) {
      // Extract context mentions from evidence
      if (finding.evidence) {
        const regions = this.extractRegions(finding.evidence);
        regions.forEach(r => contexts.add(r));
      }
    }

    return Array.from(contexts);
  }

  private extractRegions(evidence: string): string[] {
    // Simple region extraction
    const regionKeywords = [
      'mediterranean', 'tropical', 'temperate', 'arid', 'semi-arid',
      'california', 'midwest', 'southeast', 'pacific northwest',
      'europe', 'africa', 'asia', 'south america',
    ];
    
    const found: string[] = [];
    const lowerEvidence = evidence.toLowerCase();
    
    for (const region of regionKeywords) {
      if (lowerEvidence.includes(region)) {
        found.push(region);
      }
    }

    return found;
  }

  private identifyExceptions(findings: KeyFinding[], theme: string): string[] {
    // Identify contexts where the pattern might not hold
    const exceptions: string[] = [];
    
    if (theme === 'water-management') {
      exceptions.push('Areas with high water tables may need drainage');
    }
    
    if (theme === 'carbon-sequestration') {
      exceptions.push('Saturated soils may have limited capacity');
    }

    return exceptions;
  }

  private identifyCrossCuttingThemes(patterns: Pattern[]): string[] {
    // Find themes that appear across multiple categories
    const themeCounts: Record<string, number> = {};
    
    for (const pattern of patterns) {
      themeCounts[pattern.pattern] = (themeCounts[pattern.pattern] || 0) + 1;
    }

    return Object.entries(themeCounts)
      .filter(([_, count]) => count > 1)
      .map(([theme]) => theme);
  }

  private mapContextDependencies(patterns: Pattern[]): Record<string, string[]> {
    const dependencies: Record<string, string[]> = {};
    
    for (const pattern of patterns) {
      if (pattern.contexts.length > 0) {
        dependencies[pattern.pattern] = pattern.contexts;
      }
    }

    return dependencies;
  }

  private identifyGaps(findings: KeyFinding[], patterns: Pattern[]): string[] {
    const gaps: string[] = [];
    
    // Check for missing categories
    const categories = new Set(findings.map(f => f.category));
    const expectedCategories = ['soil-health', 'economic-viability', 'social-impacts'];
    
    for (const cat of expectedCategories) {
      if (!categories.has(cat)) {
        gaps.push(`Limited research on ${cat}`);
      }
    }

    // Check for temporal gaps
    const hasLongTermData = findings.some(f => 
      f.finding.toLowerCase().includes('long-term') ||
      f.finding.toLowerCase().includes('10 year')
    );
    
    if (!hasLongTermData) {
      gaps.push('Limited long-term outcome data (>5 years)');
    }

    return gaps;
  }

  private calculateClimateSimilarity(climateA: string, climateB: string): number {
    if (climateA === climateB) return 1;
    
    // Simplified climate similarity
    const climateGroups: Record<string, string[]> = {
      'wet': ['humid', 'rainy', 'monsoon'],
      'dry': ['arid', 'semi-arid', 'mediterranean'],
      'cold': ['temperate', 'continental', 'boreal'],
      'hot': ['tropical', 'subtropical'],
    };

    for (const [group, climates] of Object.entries(climateGroups)) {
      const aInGroup = climates.includes(climateA.toLowerCase());
      const bInGroup = climates.includes(climateB.toLowerCase());
      
      if (aInGroup && bInGroup) return 0.7;
    }

    return 0.3;
  }
}
