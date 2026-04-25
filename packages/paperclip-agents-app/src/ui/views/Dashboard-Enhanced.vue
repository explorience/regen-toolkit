<template>
  <div>
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <h1 class="text-h3 font-weight-bold">Control Panel</h1>
          <div class="d-flex align-center gap-2">
            <v-chip
              v-if="ws.isConnected"
              size="small"
              color="success"
              label
            >
              <v-icon left size="small">mdi-wifi</v-icon>
              Live
            </v-chip>
            <v-chip
              v-else
              size="small"
              color="warning"
              label
            >
              <v-icon left size="small">mdi-wifi-off</v-icon>
              Connecting...
            </v-chip>
            <v-chip
              v-if="syncStatus.syncing"
              size="small"
              color="info"
              label
            >
              <v-icon left size="small">mdi-sync</v-icon>
              Syncing
            </v-chip>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row v-if="loading" class="mt-4">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate></v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else-if="org" class="mt-2">
      <!-- Organization Summary -->
      <v-col cols="12" md="4">
        <v-card variant="outlined">
          <v-card-title class="d-flex align-center">
            <v-icon left>mdi-home-city</v-icon>
            Organization
          </v-card-title>
          <v-card-text>
            <div class="text-h5 font-weight-bold">{{ org.name }}</div>
            <div class="text-caption text-secondary mt-2">{{ org.identifier }}</div>
            <v-divider class="my-3"></v-divider>
            <div class="text-caption">
              <div class="d-flex justify-space-between mb-1">
                <span>Agents:</span>
                <strong>{{ agentCount }}</strong>
              </div>
              <div class="d-flex justify-space-between">
                <span>Skills:</span>
                <strong>{{ skillCount }}</strong>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Real-time Status -->
      <v-col cols="12" md="4">
        <v-card variant="outlined">
          <v-card-title class="d-flex align-center">
            <v-icon left>mdi-pulse</v-icon>
            Real-time Status
          </v-card-title>
          <v-card-text>
            <div class="mb-2">
              <div class="text-caption text-secondary">Server</div>
              <div class="d-flex align-center gap-2">
                <v-icon small color="success">mdi-check-circle</v-icon>
                <span class="text-body2">Connected</span>
              </div>
            </div>
            <div class="mb-2">
              <div class="text-caption text-secondary">WebSocket</div>
              <div class="d-flex align-center gap-2">
                <v-icon
                  small
                  :color="ws.isConnected ? 'success' : 'warning'"
                >
                  {{ ws.isConnected ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                </v-icon>
                <span class="text-body2">
                  {{ ws.isConnected ? 'Live' : 'Reconnecting...' }}
                </span>
              </div>
            </div>
            <div>
              <div class="text-caption text-secondary">Sync Status</div>
              <div class="d-flex align-center gap-2">
                <v-icon
                  small
                  :color="syncStatus.syncing ? 'info' : 'success'"
                  :class="syncStatus.syncing ? 'spin' : ''"
                >
                  {{ syncStatus.syncing ? 'mdi-sync' : 'mdi-check-circle' }}
                </v-icon>
                <span class="text-body2">
                  {{ syncStatus.syncing ? 'Syncing' : 'In Sync' }}
                </span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Recent Events -->
      <v-col cols="12" md="4">
        <v-card variant="outlined">
          <v-card-title>Recent Events</v-card-title>
          <v-card-text>
            <div v-if="recentEvents.length === 0" class="text-caption text-secondary">
              No recent events
            </div>
            <div v-for="event in recentEvents" :key="event.id" class="mb-2">
              <div class="text-caption text-secondary">
                {{ formatTime(event.timestamp) }}
              </div>
              <div class="text-body2">{{ event.type }}: {{ event.category }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Agents Overview -->
    <v-row v-if="org" class="mt-2">
      <v-col cols="12">
        <v-card variant="outlined">
          <v-card-title>Recent Agents</v-card-title>
          <v-data-table
            :headers="agentHeaders"
            :items="org.agents.slice(0, 5)"
            hide-default-footer
          >
            <template #item.status="{ item }">
              <v-chip size="small" color="success">active</v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useOrgStore } from '../stores/org';
import { useWebSocket } from '../composables/useWebSocket';

const orgStore = useOrgStore();
const ws = useWebSocket();

const org = computed(() => orgStore.org);
const loading = computed(() => orgStore.loading);
const agentCount = computed(() => orgStore.agentCount);
const skillCount = computed(() => orgStore.skillCount);

const syncStatus = ref({
  syncing: false,
});

const recentEvents = ref<any[]>([]);

const agentHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Runtime', key: 'runtime' },
  { title: 'Status', key: 'status' },
  { title: 'Capabilities', key: 'capabilities' },
];

const formatTime = (date: Date) => {
  const d = new Date(date);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

onMounted(() => {
  orgStore.initializeOrg();

  // Subscribe to real-time updates
  ws.subscribe('sync');
  ws.subscribe('agents');
  ws.subscribe('skills');

  // Listen for sync events
  const handleMessage = () => {
    const msg = ws.lastMessage.value;
    if (msg?.type === 'sync_event') {
      const data = msg.data as any;
      syncStatus.value.syncing = data.syncing || false;

      // Add to recent events
      recentEvents.value.unshift({
        id: `${Date.now()}-${Math.random()}`,
        type: data.type,
        category: data.category,
        timestamp: new Date(),
      });

      if (recentEvents.value.length > 5) {
        recentEvents.value.pop();
      }

      // Refresh agents/skills if needed
      if (data.category === 'agents') {
        orgStore.refreshAgents();
      } else if (data.category === 'skills') {
        orgStore.refreshSkills();
      }
    }
  };

  // Watch for message changes
  const watchInterval = setInterval(() => {
    if (ws.lastMessage.value) {
      handleMessage();
    }
  }, 100);

  onUnmounted(() => {
    clearInterval(watchInterval);
  });
});

import { onUnmounted } from 'vue';
</script>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spin {
  animation: spin 2s linear infinite;
}
</style>
