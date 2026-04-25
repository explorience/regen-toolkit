/**
 * Cost Analytics Composable
 * Comprehensive cost tracking and analysis for agents
 */

import { ref, computed, watch } from 'vue';
import { useApi } from './useApi';

export interface CostSummary {
  period: 'day' | 'week' | 'month' | 'year';
  total: number;
  byAgent: Record<string, number>;
  byType: Record<string, number>;
  trend: number;
}

export interface CostRecord {
  id: string;
  agentId: string;
  type: 'api_call' | 'compute' | 'storage' | 'bandwidth';
  amount: number;
  currency: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface AgentBudget {
  agentId: string;
  agentName: string;
  budget: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  isOverBudget: boolean;
  alertThreshold: number;
}

export const useCostAnalytics = () => {
  const api = useApi();

  const costs = ref<CostRecord[]>([]);
  const summary = ref<CostSummary | null>(null);
  const budgets = ref<AgentBudget[]>([]);
  const period = ref<'day' | 'week' | 'month' | 'year'>('month');
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed properties
  const totalCost = computed(() => summary.value?.total || 0);
  const costTrend = computed(() => summary.value?.trend || 0);
  const costTrendDirection = computed(() => {
    const trend = costTrend.value;
    if (trend > 0) return 'up';
    if (trend < 0) return 'down';
    return 'stable';
  });

  const topAgentsByCost = computed(() => {
    const entries = Object.entries(summary.value?.byAgent || {});
    return entries
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([agentId, cost]) => ({ agentId, cost }));
  });

  const costBreakdownByType = computed(() => {
    const entries = Object.entries(summary.value?.byType || {});
    return entries.map(([type, cost]) => ({
      type,
      cost,
      percentage: (cost / (totalCost.value || 1)) * 100,
    }));
  });

  const overBudgetAgents = computed(() => {
    return budgets.value.filter((b) => b.isOverBudget);
  });

  const budgetAlerts = computed(() => {
    return budgets.value.filter((b) => b.percentUsed > 80);
  });

  // Methods
  const fetchCosts = async (agentId?: string, type?: string) => {
    loading.value = true;
    error.value = null;
    try {
      const filter: any = {};
      if (agentId) filter.agentId = agentId;
      if (type) filter.type = type;

      const data = await api.getCosts(filter);
      costs.value = data || [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch costs';
    } finally {
      loading.value = false;
    }
  };

  const fetchSummary = async (p: typeof period.value = 'month') => {
    period.value = p;
    loading.value = true;
    error.value = null;
    try {
      const data = await api.getCostsSummary(p);
      summary.value = data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch summary';
    } finally {
      loading.value = false;
    }
  };

  const fetchBudgets = async (agentIds: string[]) => {
    loading.value = true;
    error.value = null;
    try {
      const budgetData = await Promise.all(
        agentIds.map((id) => api.getAgentBudget(id))
      );
      budgets.value = budgetData.filter((b) => b !== null);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch budgets';
    } finally {
      loading.value = false;
    }
  };

  const recordCost = async (
    agentId: string,
    type: CostRecord['type'],
    amount: number,
    currency: string = 'USD'
  ) => {
    try {
      const response = await api.post('/costs', {
        agentId,
        type,
        amount,
        currency,
      });
      if (response.success) {
        // Refresh summary
        await fetchSummary(period.value);
        // Refresh budgets if cost recorded
        return response.data;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to record cost';
      throw err;
    }
  };

  const getCostStats = computed(() => {
    const records = costs.value;
    if (records.length === 0) {
      return {
        count: 0,
        average: 0,
        min: 0,
        max: 0,
        total: 0,
      };
    }

    const amounts = records.map((r) => r.amount);
    const total = amounts.reduce((a, b) => a + b, 0);
    const average = total / amounts.length;
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);

    return {
      count: records.length,
      average,
      min,
      max,
      total,
    };
  });

  const getAgentCostBreakdown = (agentId: string) => {
    return costs.value
      .filter((c) => c.agentId === agentId)
      .reduce(
        (acc, cost) => {
          acc[cost.type] = (acc[cost.type] || 0) + cost.amount;
          return acc;
        },
        {} as Record<string, number>
      );
  };

  const getDateRangeCosts = (startDate: Date, endDate: Date) => {
    return costs.value.filter(
      (c) => new Date(c.timestamp) >= startDate && new Date(c.timestamp) <= endDate
    );
  };

  const estimateMonthlyCost = (dailyAverage: number) => {
    return dailyAverage * 30;
  };

  const estimateYearlyCost = (monthlyAverage: number) => {
    return monthlyAverage * 12;
  };

  // Watch for period changes
  watch(period, (newPeriod) => {
    fetchSummary(newPeriod);
  });

  return {
    // State
    costs,
    summary,
    budgets,
    period,
    loading,
    error,

    // Computed
    totalCost,
    costTrend,
    costTrendDirection,
    topAgentsByCost,
    costBreakdownByType,
    overBudgetAgents,
    budgetAlerts,
    getCostStats,

    // Methods
    fetchCosts,
    fetchSummary,
    fetchBudgets,
    recordCost,
    getAgentCostBreakdown,
    getDateRangeCosts,
    estimateMonthlyCost,
    estimateYearlyCost,
  };
};
