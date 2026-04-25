// Task Manager Webapp
// Loads tasks from projects.json and meetings.json

let allTasks = [];
let filteredTasks = [];

// Load tasks from schemas
async function loadTasks() {
    try {
        const [projectsRes, meetingsRes] = await Promise.all([
            fetch('/.well-known/projects.json'),
            fetch('/.well-known/meetings.json')
        ]);

        const projects = await projectsRes.json();
        const meetings = await meetingsRes.json();

        allTasks = [];

        // Extract tasks from projects
        if (projects.projects) {
            projects.projects.forEach(project => {
                if (project.tasks) {
                    project.tasks.forEach(task => {
                        allTasks.push({
                            ...task,
                            source: 'project',
                            projectId: project.id,
                            projectName: project.name,
                            type: 'task'
                        });
                    });
                }
            });
        }

        // Extract action items from meetings
        if (meetings.meetings) {
            meetings.meetings.forEach(meeting => {
                if (meeting.actionItems) {
                    meeting.actionItems.forEach(actionItem => {
                        allTasks.push({
                            id: actionItem.id,
                            description: actionItem.description,
                            assignee: actionItem.assignee,
                            status: actionItem.status === 'pending' ? 'todo' : actionItem.status,
                            dueDate: actionItem.dueDate,
                            priority: actionItem.priority || 'medium',
                            source: 'meeting',
                            meetingId: meeting.id,
                            meetingTitle: meeting.title,
                            type: 'action-item'
                        });
                    });
                }
            });
        }

        // Load from localStorage for any local changes
        const localChanges = localStorage.getItem('task-changes');
        if (localChanges) {
            const changes = JSON.parse(localChanges);
            allTasks = allTasks.map(task => {
                const change = changes[task.id];
                return change ? { ...task, ...change } : task;
            });
        }

        applyFilters();
    } catch (error) {
        console.error('Error loading tasks:', error);
        document.getElementById('task-list').innerHTML = '<div class="error">Error loading tasks. Please ensure schemas are generated.</div>';
    }
}

// Populate filter dropdowns
function populateFilters() {
    const projects = [...new Set(allTasks.map(t => t.projectName).filter(Boolean))];
    const assignees = [...new Set(allTasks.map(t => t.assignee).filter(Boolean))];

    const projectSelect = document.getElementById('filter-project');
    projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project;
        option.textContent = project;
        projectSelect.appendChild(option);
    });

    const assigneeSelect = document.getElementById('filter-assignee');
    assignees.forEach(assignee => {
        const option = document.createElement('option');
        option.value = assignee;
        option.textContent = assignee;
        assigneeSelect.appendChild(option);
    });
}

// Apply filters
function applyFilters() {
    const projectFilter = document.getElementById('filter-project').value;
    const assigneeFilter = document.getElementById('filter-assignee').value;
    const statusFilter = document.getElementById('filter-status').value;
    const priorityFilter = document.getElementById('filter-priority').value;

    filteredTasks = allTasks.filter(task => {
        if (projectFilter && task.projectName !== projectFilter) return false;
        if (assigneeFilter && task.assignee !== assigneeFilter) return false;
        if (statusFilter && task.status !== statusFilter) return false;
        if (priorityFilter && task.priority !== priorityFilter) return false;
        return true;
    });

    renderTasks();
}

// Render tasks
function renderTasks() {
    const taskList = document.getElementById('task-list');
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<div class="empty">No tasks found</div>';
        return;
    }

    taskList.innerHTML = filteredTasks.map(task => `
        <div class="task-card" data-task-id="${task.id}">
            <div class="task-header">
                <h3>${task.description}</h3>
                <span class="status-badge status-${task.status}">${task.status}</span>
            </div>
            <div class="task-meta">
                ${task.assignee ? `<span class="assignee">@${task.assignee}</span>` : ''}
                ${task.dueDate ? `<span class="due-date">Due: ${task.dueDate}</span>` : ''}
                ${task.priority ? `<span class="priority priority-${task.priority}">${task.priority}</span>` : ''}
            </div>
            <div class="task-context">
                ${task.source === 'project' ? `<span>Project: ${task.projectName}</span>` : ''}
                ${task.source === 'meeting' ? `<span>Meeting: ${task.meetingTitle}</span>` : ''}
            </div>
            <div class="task-actions">
                <button onclick="updateTaskStatus('${task.id}', 'done')" ${task.status === 'done' || task.status === 'completed' ? 'disabled' : ''}>Mark Complete</button>
            </div>
        </div>
    `).join('');
}

// Update task status
function updateTaskStatus(taskId, newStatus) {
    const changes = JSON.parse(localStorage.getItem('task-changes') || '{}');
    changes[taskId] = { ...changes[taskId], status: newStatus };
    localStorage.setItem('task-changes', JSON.stringify(changes));
    
    const task = allTasks.find(t => t.id === taskId);
    if (task) {
        task.status = newStatus;
    }
    
    applyFilters();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTasks().then(() => {
        populateFilters();
    });

    // Filter event listeners
    document.getElementById('filter-project').addEventListener('change', applyFilters);
    document.getElementById('filter-assignee').addEventListener('change', applyFilters);
    document.getElementById('filter-status').addEventListener('change', applyFilters);
    document.getElementById('filter-priority').addEventListener('change', applyFilters);

    // Modal handling
    const modal = document.getElementById('add-task-modal');
    const btn = document.getElementById('add-task-btn');
    const span = document.getElementsByClassName('close')[0];

    btn.onclick = () => modal.style.display = 'block';
    span.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target === modal) modal.style.display = 'none';
    };

    // Add task form
    document.getElementById('add-task-form').addEventListener('submit', (e) => {
        e.preventDefault();
        // TODO: Implement task addition
        alert('Task addition will be implemented to write to data/projects.yaml');
        modal.style.display = 'none';
    });
});
