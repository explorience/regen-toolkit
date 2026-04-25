import React, { useEffect, useState } from 'react';

interface Agent {
  id: string;
  name: string;
  runtime: string;
  capabilities: string[];
  budget?: number;
}

export const OrgChart: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [org, setOrg] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/org').then(r => r.json()),
      fetch('/api/agents').then(r => r.json()),
    ]).then(([orgData, agentsData]) => {
      if (orgData.success) setOrg(orgData.data);
      if (agentsData.success) setAgents(agentsData.data || []);
    });
  }, []);

  return (
    <div className="org-chart">
      <h2>Organization: {org?.name}</h2>
      
      <div className="level">
        <h3>Coordination Layer</h3>
        {agents.filter(a => a.capabilities.includes('coordination')).map(agent => (
          <div key={agent.id} className="agent-card">
            <h4>{agent.name}</h4>
            <span className="runtime">{agent.runtime}</span>
            <div className="capabilities">
              {agent.capabilities.map(c => (
                <span key={c} className="capability">{c}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="level">
        <h3>Execution Layer</h3>
        {agents.filter(a => !a.capabilities.includes('coordination')).map(agent => (
          <div key={agent.id} className="agent-card">
            <h4>{agent.name}</h4>
            <span className="runtime">{agent.runtime}</span>
            <div className="capabilities">
              {agent.capabilities.map(c => (
                <span key={c} className="capability">{c}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};