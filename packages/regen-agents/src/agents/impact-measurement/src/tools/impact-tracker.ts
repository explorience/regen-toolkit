/**
 * Impact Tracker Tool
 * Tracks impact metrics over time with trend analysis and anomaly detection
 */

export interface MetricDataPoint {
  timestamp: Date;
  value: number;
  unit: string;
  source: string;
  confidence: number;
  metadata?: Record<string, unknown>;
}

export interface MetricHistory {
  metricId: string;
  metricName: string;
  projectId: string;
  dataPoints: MetricDataPoint[];
  baseline?: number;
  target?: number;
  unit: string;
}

export interface TrendAnalysis {
  direction: 'increasing' | 'decreasing' | 'stable';
  magnitude: number; // percentage change
  confidence: number;
  seasonality: 'strong' | 'moderate' | 'none';
  forecast: {
    nextPeriod: number;
    confidenceInterval: { lower: number; upper: number };
  };
}

export interface Anomaly {
  timestamp: Date;
  value: number;
  expected: number;
  deviation: number; // standard deviations
  severity: 'low' | 'medium' | 'high';
  possibleCauses: string[];
}

export interface MetricPerformance {
  metricId: string;
  currentValue: number;
  changeFromBaseline: number;
  percentOfTarget: number | null;
  onTrack: boolean;
  trend: TrendAnalysis;
  anomalies: Anomaly[];
  dataQuality: 'high' | 'medium' | 'low';
}

export class ImpactTrackerTool {
  private metricDatabase: Map<string, MetricHistory> = new Map();

  async trackMetric(
    projectId: string,
    metricId: string,
    dataPoint: MetricDataPoint
  ): Promise<void> {
    const key = `${projectId}-${metricId}`;
    let history = this.metricDatabase.get(key);

    if (!history) {
      history = {
        metricId,
        metricName: metricId, // Would be looked up from metric definition
        projectId,
        dataPoints: [],
        unit: dataPoint.unit,
      };
      this.metricDatabase.set(key, history);
    }

    history.dataPoints.push(dataPoint);
    
    // Sort by timestamp
    history.dataPoints.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async getMetricHistory(projectId: string, metricId: string): Promise<MetricHistory | null> {
    const key = `${projectId}-${metricId}`;
    return this.metricDatabase.get(key) || null;
  }

  async analyzeTrend(
    projectId: string, 
    metricId: string,
    periods: number = 6
  ): Promise<TrendAnalysis> {
    const history = await this.getMetricHistory(projectId, metricId);
    if (!history || history.dataPoints.length < 2) {
      return {
        direction: 'stable',
        magnitude: 0,
        confidence: 0,
        seasonality: 'none',
        forecast: {
          nextPeriod: 0,
          confidenceInterval: { lower: 0, upper: 0 },
        },
      };
    }

    const recent = history.dataPoints.slice(-periods);
    const values = recent.map(d => d.value);

    // Calculate trend
    const first = values[0];
    const last = values[values.length - 1];
    const change = last - first;
    const percentChange = first !== 0 ? (change / first) * 100 : 0;

    // Determine direction
    let direction: TrendAnalysis['direction'] = 'stable';
    if (percentChange > 5) direction = 'increasing';
    else if (percentChange < -5) direction = 'decreasing';

    // Detect seasonality
    const seasonality = this.detectSeasonality(history.dataPoints);

    // Calculate confidence based on data consistency
    const confidence = Math.min(0.95, history.dataPoints.length * 0.05 + 0.5);

    // Simple forecast (linear extrapolation)
    const avgChange = change / (values.length - 1);
    const nextPeriod = last + avgChange;
    const stdDev = this.calculateStdDev(values);

    return {
      direction,
      magnitude: Math.abs(percentChange),
      confidence,
      seasonality,
      forecast: {
        nextPeriod,
        confidenceInterval: {
          lower: nextPeriod - stdDev * 1.96,
          upper: nextPeriod + stdDev * 1.96,
        },
      },
    };
  }

  async identifyAnomalies(
    projectId: string,
    metricId: string,
    threshold: number = 2
  ): Promise<Anomaly[]> {
    const history = await this.getMetricHistory(projectId, metricId);
    if (!history || history.dataPoints.length < 3) return [];

    const values = history.dataPoints.map(d => d.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = this.calculateStdDev(values);

    const anomalies: Anomaly[] = [];

    for (let i = 0; i < history.dataPoints.length; i++) {
      const dp = history.dataPoints[i];
      const deviation = stdDev > 0 ? Math.abs(dp.value - mean) / stdDev : 0;

      if (deviation > threshold) {
        anomalies.push({
          timestamp: dp.timestamp,
          value: dp.value,
          expected: mean,
          deviation,
          severity: deviation > 3 ? 'high' : deviation > 2.5 ? 'medium' : 'low',
          possibleCauses: this.suggestAnomalyCauses(metricId, dp.value > mean ? 'high' : 'low'),
        });
      }
    }

    return anomalies;
  }

  async getMetricPerformance(
    projectId: string,
    metricId: string
  ): Promise<MetricPerformance | null> {
    const history = await this.getMetricHistory(projectId, metricId);
    if (!history || history.dataPoints.length === 0) return null;

    const current = history.dataPoints[history.dataPoints.length - 1];
    const baseline = history.baseline;
    const target = history.target;

    // Calculate changes
    const changeFromBaseline = baseline !== undefined ? current.value - baseline : 0;
    const percentOfTarget = target !== undefined && target !== 0 
      ? (current.value / target) * 100 
      : null;

    // Determine if on track
    let onTrack = true;
    if (target !== undefined) {
      // Assuming higher is better (can be customized)
      const percentProgress = (current.value / target);
      const timeProgress = this.calculateTimeProgress(history);
      onTrack = percentProgress >= timeProgress * 0.8; // Within 20% of expected progress
    }

    // Get trend
    const trend = await this.analyzeTrend(projectId, metricId);

    // Get anomalies
    const anomalies = await this.identifyAnomalies(projectId, metricId);

    // Assess data quality
    const dataQuality = this.assessDataQuality(history);

    return {
      metricId,
      currentValue: current.value,
      changeFromBaseline,
      percentOfTarget,
      onTrack,
      trend,
      anomalies,
      dataQuality,
    };
  }

  async getProjectDashboard(projectId: string): Promise<{
    metrics: MetricPerformance[];
    overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
    atRiskMetrics: string[];
    highlights: string[];
  }> {
    // Find all metrics for project
    const projectMetrics: MetricPerformance[] = [];
    
    for (const [key, history] of this.metricDatabase) {
      if (key.startsWith(`${projectId}-`)) {
        const metricId = key.replace(`${projectId}-`, '');
        const performance = await this.getMetricPerformance(projectId, metricId);
        if (performance) {
          projectMetrics.push(performance);
        }
      }
    }

    // Calculate overall health
    const onTrackCount = projectMetrics.filter(m => m.onTrack).length;
    const totalMetrics = projectMetrics.length;
    const healthRatio = totalMetrics > 0 ? onTrackCount / totalMetrics : 0;

    let overallHealth: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';
    if (healthRatio >= 0.9) overallHealth = 'excellent';
    else if (healthRatio >= 0.7) overallHealth = 'good';
    else if (healthRatio >= 0.5) overallHealth = 'fair';

    // Identify at-risk metrics
    const atRiskMetrics = projectMetrics
      .filter(m => !m.onTrack || m.trend.direction === 'decreasing')
      .map(m => m.metricId);

    // Generate highlights
    const highlights = this.generateHighlights(projectMetrics);

    return {
      metrics: projectMetrics,
      overallHealth,
      atRiskMetrics,
      highlights,
    };
  }

  async compareMetrics(
    projectId: string,
    metricIds: string[],
    timeRange: { start: Date; end: Date }
  ): Promise<{
    comparisons: { metricId: string; average: number; peak: number; trend: string }[];
    correlations: { metricA: string; metricB: string; correlation: number }[];
    insights: string[];
  }> {
    const comparisons: { metricId: string; average: number; peak: number; trend: string }[] = [];

    for (const metricId of metricIds) {
      const history = await this.getMetricHistory(projectId, metricId);
      if (!history) continue;

      const filtered = history.dataPoints.filter(dp => 
        dp.timestamp >= timeRange.start && dp.timestamp <= timeRange.end
      );

      if (filtered.length === 0) continue;

      const values = filtered.map(d => d.value);
      const average = values.reduce((a, b) => a + b, 0) / values.length;
      const peak = Math.max(...values);
      
      const trend = await this.analyzeTrend(projectId, metricId);

      comparisons.push({
        metricId,
        average,
        peak,
        trend: trend.direction,
      });
    }

    // Calculate correlations (simplified)
    const correlations: { metricA: string; metricB: string; correlation: number }[] = [];
    for (let i = 0; i < metricIds.length; i++) {
      for (let j = i + 1; j < metricIds.length; j++) {
        correlations.push({
          metricA: metricIds[i],
          metricB: metricIds[j],
          correlation: 0.5, // Placeholder - would calculate actual correlation
        });
      }
    }

    // Generate insights
    const insights = this.generateComparisonInsights(comparisons, correlations);

    return {
      comparisons,
      correlations,
      insights,
    };
  }

  private detectSeasonality(dataPoints: MetricDataPoint[]): TrendAnalysis['seasonality'] {
    if (dataPoints.length < 12) return 'none';

    // Simple seasonality detection based on monthly grouping
    const byMonth: Record<number, number[]> = {};
    
    for (const dp of dataPoints) {
      const month = dp.timestamp.getMonth();
      if (!byMonth[month]) byMonth[month] = [];
      byMonth[month].push(dp.value);
    }

    // Check if some months consistently differ
    const monthMeans = Object.entries(byMonth).map(([month, values]) => ({
      month: parseInt(month),
      mean: values.reduce((a, b) => a + b, 0) / values.length,
    }));

    const overallMean = dataPoints.reduce((a, b) => a + b.value, 0) / dataPoints.length;
    const maxDeviation = Math.max(...monthMeans.map(m => Math.abs(m.mean - overallMean)));

    if (maxDeviation > overallMean * 0.3) return 'strong';
    if (maxDeviation > overallMean * 0.15) return 'moderate';
    return 'none';
  }

  private calculateStdDev(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private calculateTimeProgress(history: MetricHistory): number {
    if (history.dataPoints.length < 2) return 0;
    
    const first = history.dataPoints[0].timestamp.getTime();
    const last = history.dataPoints[history.dataPoints.length - 1].timestamp.getTime();
    const total = Date.now() - first;
    
    // Assume 3-year project as default
    const assumedDuration = 3 * 365 * 24 * 60 * 60 * 1000;
    
    return (last - first) / assumedDuration;
  }

  private assessDataQuality(history: MetricHistory): 'high' | 'medium' | 'low' {
    const count = history.dataPoints.length;
    const avgConfidence = history.dataPoints.reduce((a, b) => a + b.confidence, 0) / count;

    if (count >= 12 && avgConfidence >= 0.8) return 'high';
    if (count >= 6 && avgConfidence >= 0.6) return 'medium';
    return 'low';
  }

  private suggestAnomalyCauses(metricId: string, direction: 'high' | 'low'): string[] {
    const commonCauses: Record<string, string[]> = {
      'high': [
        'Seasonal variation',
        'One-time event or intervention',
        'Data collection error',
        'Change in measurement methodology',
      ],
      'low': [
        'External shock or disruption',
        'Seasonal variation',
        'Data collection error',
        'Beneficiary dropout',
      ],
    };

    return commonCauses[direction];
  }

  private generateHighlights(metrics: MetricPerformance[]): string[] {
    const highlights: string[] = [];

    // Find best performing
    const bestPerformers = metrics
      .filter(m => m.percentOfTarget !== null && m.percentOfTarget >= 100)
      .map(m => m.metricId);
    
    if (bestPerformers.length > 0) {
      highlights.push(`${bestPerformers.length} metrics meeting or exceeding targets`);
    }

    // Find positive trends
    const positiveTrends = metrics.filter(m => m.trend.direction === 'increasing');
    if (positiveTrends.length > metrics.length * 0.5) {
      highlights.push('Majority of metrics showing positive trends');
    }

    // Find concerns
    const concerns = metrics.filter(m => !m.onTrack);
    if (concerns.length > 0) {
      highlights.push(`${concerns.length} metrics require attention`);
    }

    return highlights;
  }

  private generateComparisonInsights(
    comparisons: { metricId: string; trend: string }[],
    correlations: { metricA: string; metricB: string; correlation: number }[]
  ): string[] {
    const insights: string[] = [];

    const increasing = comparisons.filter(c => c.trend === 'increasing');
    const decreasing = comparisons.filter(c => c.trend === 'decreasing');

    if (increasing.length > decreasing.length) {
      insights.push('Overall positive trajectory across key metrics');
    } else if (decreasing.length > increasing.length) {
      insights.push('Concerning downward trends in multiple areas');
    } else {
      insights.push('Mixed performance across metrics');
    }

    // Note strong correlations
    const strongCorrelations = correlations.filter(c => Math.abs(c.correlation) > 0.7);
    if (strongCorrelations.length > 0) {
      insights.push('Strong relationships detected between certain metrics');
    }

    return insights;
  }
}
