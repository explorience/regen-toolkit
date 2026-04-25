/**
 * Costs Store
 * Global state for cost tracking and analytics
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useApi } from '../composables/useApi';

export interface CostData {
  totalCost: number;
  costTrend: number;
  byAgent: Record<string, number>;
  byType: Record<string, number>;
  period: 'day' | 'week' | 'month' | 'year';
}

export const useCostsStore = defineStore('costs', () => {
  const api = useApi();

  const costData = ref<CostData>({
    totalCost: 0,
    costTrend: 0,
    byAgent: {},
    byType: {},
    period: 'month',
  });

  const alerts = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const totalCost = computed(() => costData.value.totalCost);
  const costTrend = computed(() => costData.value.costTrend);

  async function loadCostSummary(period: 'day' | 'week' | 'month' | 'year' = 'month') {
    loading.value = true;
    try {
      const data = await api.getCostsSummary(period);
      if (data) {
        costData.value = {
          totalCost: data.total,
          costTrend: data.trend,
          byAgent: data.byAgent,
          byType: data.byType,
          period,
        };
        error.value = null;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load costs';
    } finally {
      loading.value = false;
    }
  }

  async function recordCost(
    agentId: string,
    type: string,
    amount: number,
    currency = 'USD'
  ) {
    try {
      const response = await api.post('/costs', {
        agentId,
        type,
        amount,
        currency,
      });

      if (response.success) {
        // Refresh summary
        await loadCostSummary(costData.value.period);
        return response.data;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to record cost';
      throw err;
    }
  }

  return {
    costData,
    alerts,
    loading,
    error,
    totalCost,
    costTrend,
    loadCostSummary,
    recordCost,
  };
});
