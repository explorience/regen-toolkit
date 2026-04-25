import React from 'react';
import './styles.css';

export function App() {
  return (
    <div className="app">
      <nav className="sidebar">
        <h1>🦞 ReFi Barcelona</h1>
        <ul>
          <li><a href="/">Dashboard</a></li>
          <li><a href="/org">Organization</a></li>
          <li><a href="/tasks">Tasks</a></li>
          <li><a href="/agents">Agents</a></li>
        </ul>
      </nav>

      <main className="content">
        <h2>🎉 Dashboard is Live!</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Active Agents</h3>
            <div className="value">5</div>
          </div>
          <div className="stat-card">
            <h3>Available Skills</h3>
            <div className="value">12</div>
          </div>
          <div className="stat-card">
            <h3>Active Tasks</h3>
            <div className="value">8</div>
          </div>
          <div className="stat-card">
            <h3>Monthly Budget</h3>
            <div className="value">$950</div>
          </div>
        </div>

        <h3>Your Agents:</h3>
        <ul>
          <li>🤖 refi-bcn-coordinator (openclaw, $300/mo)</li>
          <li>💻 refi-bcn-cursor (cursor, $200/mo)</li>
          <li>⚖️ refi-bcn-legal-advisor (claude-code, $250/mo)</li>
          <li>💰 refi-bcn-funding-scout (openclaw, $150/mo)</li>
          <li>💬 telegram-bot (custom, $50/mo)</li>
        </ul>
      </main>
    </div>
  );
}

export default App;
