import React from 'react';

interface Task {
  id: string;
  title: string;
  status: 'backlog' | 'in-progress' | 'review' | 'done';
  assignedAgents?: string[];
  estimatedCost?: number;
}

const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Set up cooperative legal structure', status: 'in-progress', assignedAgents: ['coop-legal-advisor'], estimatedCost: 150 },
  { id: '2', title: 'Draft governance charter', status: 'backlog', assignedAgents: [], estimatedCost: 100 },
  { id: '3', title: 'Design member onboarding flow', status: 'review', assignedAgents: ['refi-bcn-coordinator'], estimatedCost: 75 },
];

export const TaskBoard: React.FC = () => {
  const columns = [
    { id: 'backlog', title: 'Backlog', tasks: MOCK_TASKS.filter(t => t.status === 'backlog') },
    { id: 'in-progress', title: 'In Progress', tasks: MOCK_TASKS.filter(t => t.status === 'in-progress') },
    { id: 'review', title: 'Review', tasks: MOCK_TASKS.filter(t => t.status === 'review') },
    { id: 'done', title: 'Done', tasks: MOCK_TASKS.filter(t => t.status === 'done') },
  ];

  return (
    <div>
      <h2>Task Board</h2>
      <div className="task-board">
        {columns.map(column => (
          <div key={column.id} className="column">
            <h3>{column.title}</h3>
            {column.tasks.map(task => (
              <div key={task.id} className="task-card">
                <h4>{task.title}</h4>
                <div className="meta">
                  {task.assignedAgents?.length > 0 && (
                    <span>👤 {task.assignedAgents.join(', ')}</span>
                  )}
                  {task.estimatedCost && (
                    <span>💰 ${task.estimatedCost}</span>
                  )}
                </div>
              </div>
            ))}
            {column.tasks.length === 0 && (
              <p style={{ color: '#71717a', fontSize: '0.875rem' }}>No tasks</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};