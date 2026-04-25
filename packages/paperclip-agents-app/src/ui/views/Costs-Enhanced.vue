<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h3 font-weight-bold">Cost Tracking & Analytics</h1>
      <v-chip-group v-model="period" mandatory>
        <v-chip value="day">Day</v-chip>
        <v-chip value="week">Week</v-chip>
        <v-chip value="month">Month</v-chip>
        <v-chip value="year">Year</v-chip>
      </v-chip-group>
    </div>

    <!-- Summary Cards -->
    <v-row>
      <v-col cols="12" sm="6" lg="3">
        <v-card variant="outlined">
          <v-card-text>
            <div class="text-caption text-secondary">Total Cost</div>
            <div class="text-h4 font-weight-bold mt-2">
              {{ formatCurrency(totalCost) }}
            </div>
            <div
              :class="{
                'text-success': costTrendDirection === 'down',
                'text-error': costTrendDirection === 'up',
                'text-secondary': costTrendDirection === 'stable',
              }"
              class="text-caption mt-2"
            >
              <v-icon :size="14">
                {{
                  costTrendDirection === 'down'
                    ? 'mdi-trending-down'
                    : costTrendDirection === 'up'
                    ? 'mdi-trending-up'
                    : 'mdi-minus'
                }}
              </v-icon>
              {{ Math.abs(costTrend).toFixed(1) }}% vs last period
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card variant="outlined">
          <v-card-text>
            <div class="text-caption text-secondary">Avg per Transaction</div>
            <div class="text-h4 font-weight-bold mt-2">
              {{ formatCurrency(getCostStats.average) }}
            </div>
            <div class="text-caption text-secondary mt-2">
              {{ getCostStats.count }} transactions
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card variant="outlined">
          <v-card-text>
            <div class="text-caption text-secondary">Top Agent Cost</div>
            <div v-if="topAgentsByCost[0]" class="text-h4 font-weight-bold mt-2">
              {{ formatCurrency(topAgentsByCost[0].cost) }}
            </div>
            <div class="text-caption text-secondary mt-2">
              {{ topAgentsByCost[0]?.agentId || 'N/A' }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card
          v-if="budgetAlerts.length > 0"
          variant="outlined"
          color="warning"
        >
          <v-card-text>
            <div class="text-caption text-secondary">Budget Alerts</div>
            <div class="text-h4 font-weight-bold mt-2 text-error">
              {{ budgetAlerts.length }}
            </div>
            <div class="text-caption text-secondary mt-2">
              Agent(s) near budget limit
            </div>
          </v-card-text>
        </v-card>
        <v-card v-else variant="outlined">
          <v-card-text>
            <div class="text-caption text-secondary">Budget Status</div>
            <div class="text-h4 font-weight-bold mt-2 text-success">OK</div>
            <div class="text-caption text-secondary mt-2">
              All agents within budget
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Cost Breakdown -->
    <v-row class="mt-2">
      <v-col cols="12" md="6">
        <v-card variant="outlined">
          <v-card-title>Cost by Type</v-card-title>
          <v-card-text>
            <div v-for="breakdown in costBreakdownByType" :key="breakdown.type" class="mb-3">
              <div class="d-flex justify-space-between mb-1">
                <span class="text-caption">{{ breakdown.type }}</span>
                <strong class="text-caption">{{ breakdown.percentage.toFixed(1) }}%</strong>
              </div>
              <v-progress-linear
                :value="breakdown.percentage"
                color="secondary"
                height="6"
              ></v-progress-linear>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card variant="outlined">
          <v-card-title>Top Agents by Cost</v-card-title>
          <v-list density="compact">
            <v-list-item
              v-for="agent in topAgentsByCost"
              :key="agent.agentId"
            >
              <v-list-item-title>{{ agent.agentId }}</v-list-item-title>
              <template #append>
                <strong>{{ formatCurrency(agent.cost) }}</strong>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Budget Status -->
    <v-row v-if="budgets.length > 0" class="mt-2">
      <v-col cols="12">
        <v-card variant="outlined">
          <v-card-title>Agent Budget Status</v-card-title>
          <v-data-table
            :headers="budgetHeaders"
            :items="budgets"
            hide-default-footer
          >
            <template #item.budget="{ item }">
              {{ formatCurrency(item.budget) }}
            </template>
            <template #item.spent="{ item }">
              {{ formatCurrency(item.spent) }}
            </template>
            <template #item.remaining="{ item }">
              <strong :class="item.isOverBudget ? 'text-error' : 'text-success'">
                {{ formatCurrency(item.remaining) }}
              </strong>
            </template>
            <template #item.percentUsed="{ item }">
              <v-progress-linear
                :value="item.percentUsed"
                :color="item.isOverBudget ? 'error' : 'success'"
                height="6"
              ></v-progress-linear>
              <span class="text-caption">{{ item.percentUsed.toFixed(1) }}%</span>
            </template>
            <template #item.status="{ item }">
              <v-chip
                :color="item.isOverBudget ? 'error' : 'success'"
                size="small"
              >
                {{ item.isOverBudget ? 'OVER' : 'OK' }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Over Budget Alerts -->
    <v-row v-if="overBudgetAgents.length > 0" class="mt-2">
      <v-col cols="12">
        <v-alert type="error" variant="outlined" title="Budget Exceeded">
          <div v-for="agent in overBudgetAgents" :key="agent.agentId" class="mb-2">
            <strong>{{ agent.agentName }}</strong>: Spent
            {{ formatCurrency(agent.spent) }} of {{ formatCurrency(agent.budget) }}
            ({{ (agent.spent - agent.budget).toFixed(2) }} over)
          </div>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Recent Costs -->
    <v-row class="mt-2">
      <v-col cols="12">
        <v-card variant="outlined">
          <v-card-title>Recent Transactions</v-card-title>
          <v-data-table
            :headers="costHeaders"
            :items="costs.slice(0, 10)"
            hide-default-footer
          >
            <template #item.amount="{ item }">
              {{ formatCurrency(item.amount) }}
            </template>
            <template #item.timestamp="{ item }">
              {{ formatDate(new Date(item.timestamp)) }}
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCostAnalytics } from '../composables/useCostAnalytics';
import { useOrgStore } from '../stores/org';

const orgStore = useOrgStore();
const costs = useCostAnalytics();
const period = ref('month');

const budgetHeaders = [
  { title: 'Agent', key: 'agentName' },
  { title: 'Budget', key: 'budget' },
  { title: 'Spent', key: 'spent' },
  { title: 'Remaining', key: 'remaining' },
  { title: 'Usage', key: 'percentUsed' },
  { title: 'Status', key: 'status' },
];

const costHeaders = [
  { title: 'Agent', key: 'agentId' },
  { title: 'Type', key: 'type' },
  { title: 'Amount', key: 'amount' },
  { title: 'Time', key: 'timestamp' },
];

const formatCurrency = (value: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

onMounted(async () => {
  // Initialize
  if (!orgStore.org) {
    await orgStore.initializeOrg();
  }

  // Fetch costs and budgets
  await costs.fetchSummary('month');
  await costs.fetchCosts();

  // Fetch budgets for all agents
  if (orgStore.agents.length > 0) {
    const agentIds = orgStore.agents.map((a) => a.id);
    await costs.fetchBudgets(agentIds);
  }
});
</script>

<style scoped>
:deep(.v-card-text) {
  padding: 24px;
}
</style>
