/**
 * org-os Loading Hook
 * 
 * Parallel loading of org structure with smart caching
 */

import { useEffect, useState, useCallback } from 'react';
import type { OrgOsOrganization, OrgOsAgent, OrgOsSkill, OrgState } from '@/core/types';

export function useOrgOsLoader() {
  const [state, setState] = useState<OrgState>({
    org: { name: '', identifier: '', uri: '', path: '', agents: [], skills: [] },
    agents: new Map(),
    skills: new Map(),
    lastRefresh: 0,
    isLoading: true,
  });

  /**
   * Load organization in parallel (metadata, agents, skills all at once)
   */
  const loadOrg = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true }));

    try {
      // Parallel load: org + agents + skills
      const [orgRes, agentsRes, skillsRes] = await Promise.all([
        fetch('/api/org'),
        fetch('/api/agents'),
        fetch('/api/skills'),
      ]);

      if (!orgRes.ok) throw new Error('Failed to load organization');

      const org = (await orgRes.json()).data as OrgOsOrganization;
      const agents = (await agentsRes.json()).data as OrgOsAgent[];
      const skills = (await skillsRes.json()).data as OrgOsSkill[];

      // Build maps for fast lookup
      const agentMap = new Map(agents.map((a) => [a.id, a]));
      const skillMap = new Map(skills.map((s) => [s.id, s]));

      setState({
        org,
        agents: agentMap,
        skills: skillMap,
        lastRefresh: Date.now(),
        isLoading: false,
      });

      // Save to localStorage for persistence
      localStorage.setItem('orgState', JSON.stringify({ org, agents, skills }));
    } catch (e) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: (e as Error).message,
      }));
    }
  }, []);

  /**
   * Load with fallback to localStorage cache
   */
  const loadWithCache = useCallback(async () => {
    // Try cache first
    const cached = localStorage.getItem('orgState');
    if (cached) {
      try {
        const { org, agents, skills } = JSON.parse(cached);
        setState({
          org,
          agents: new Map(agents),
          skills: new Map(skills),
          lastRefresh: Date.now(),
          isLoading: false,
        });

        // Load fresh in background (don't block UI)
        loadOrg();
        return;
      } catch (e) {
        // Cache invalid, load fresh
      }
    }

    // No cache, load fresh
    await loadOrg();
  }, [loadOrg]);

  /**
   * Auto-refresh on interval (every 30 seconds for agent status)
   */
  useEffect(() => {
    loadWithCache();

    const interval = setInterval(() => {
      // Only refresh agents (status changes), not whole org
      fetch('/api/agents')
        .then((r) => r.json())
        .then((data) => {
          const agents = data.data as OrgOsAgent[];
          const agentMap = new Map(agents.map((a) => [a.id, a]));
          setState((s) => ({ ...s, agents: agentMap }));
        });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [loadWithCache]);

  return { ...state, reload: loadOrg };
}

/**
 * Hook for listening to agent status updates via WebSocket
 */
export function useAgentStream() {
  const [agents, setAgents] = useState<Map<string, OrgOsAgent>>(new Map());
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3100/ws/agents');

    ws.onopen = () => {
      setConnected(true);
      console.log('✓ Agent stream connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'agent-status-update') {
        setAgents((prev) => {
          const updated = new Map(prev);
          updated.set(data.agentId, {
            ...prev.get(data.agentId),
            status: data.status,
            lastHeartbeat: data.timestamp,
          } as OrgOsAgent);
          return updated;
        });
      }
    };

    ws.onerror = () => setConnected(false);
    ws.onclose = () => setConnected(false);

    return () => ws.close();
  }, []);

  return { agents, connected };
}

/**
 * Hook for task operations
 */
export function useTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await fetch('/api/tasks');
        const data = await res.json();
        setTasks(data.data || []);
      } catch (e) {
        console.error('Failed to load tasks:', e);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();

    // Refresh every 10 seconds
    const interval = setInterval(loadTasks, 10000);
    return () => clearInterval(interval);
  }, []);

  return { tasks, loading };
}
