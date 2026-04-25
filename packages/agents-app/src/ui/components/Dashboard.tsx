import React, { useEffect, useState } from 'react';

interface OrgData {
  name: string;
  identifier: string;
  agents?: any[];
  skills?: any[];
}

export const Dashboard: React.FC = () => {
  const [org, setOrg] = useState<OrgData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/org')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrg(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="dashboard"><p>Loading...</p></div>;
  }

  if (!org) {
    return (
      <div className="dashboard">
        <h2>Dashboard</h2>
        <div className="stat-card">
          <p>No organization detected. Run setup first:</p>
          <code>npx org-os-agents setup</code>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>{org.name}</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Active Agents</h3>
          <div className="value">{org.agents?.length || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Available Skills</h3>
          <div className="value">{org.skills?.length || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Active Tasks</h3>
          <div className="value">-</div>
        </div>
        <div className="stat-card">
          <h3>Monthly Spend</h3>
          <div className="value">$0</div>
        </div>
      </div>

      <div className="section">
        <h3>Quick Actions</h3>
        <div className="actions">
          <button onClick={() => window.location.href = '/agents'}>
            Manage Agents
          </button>
          <button onClick={() => window.location.href = '/tasks'}>
            View Tasks
          </button>
        </div>
      </div>
    </div>
  );
};