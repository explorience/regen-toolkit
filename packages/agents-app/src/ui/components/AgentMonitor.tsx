import React, { useEffect, useState } from 'react';

interface Agent {
  id: string;
  name: string;
  runtime: string;
  capabilities: string[];
  budget?: number;
  status?: 'idle' | 'working' | 'error';
}

export const AgentMonitor: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    fetch('/api/agents')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          // Add mock status for now
          setAgents((data.data || []).map((a: Agent) => ({
            ...a,
            status: Math.random() > 0.5 ? 'working' : 'idle',
          })));
        }
      });
  }, []);

  return (
    <div>
      <h2>Agent Monitor</h2>
      <div className="stats-grid">
        {agents.map(agent => (
          <div key={agent.id} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>{agent.name}</h3>
              <span style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: agent.status === 'working' ? '#22d3ee' : agent.status === 'error' ? '#ef4444' : '#10b981',
              }} />
            </div>
            <p style={{ color: '#a1a1aa', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              {agent.runtime}
            </p>
            <p style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.5rem' }}>
              {agent.capabilities.join(', ')}
            </p>
            {agent.budget && (
              <p style={{ color: '#22d3ee', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Budget: ${agent.budget}/month
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};