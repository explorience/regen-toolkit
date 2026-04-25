/**
 * Egregore Opencode Adapter — Command Router
 * 
 * Maps OpenCode `/ask "Command: ..."` patterns to egregore actions
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class EgregoreOpencodeAdapter {
  constructor(options = {}) {
    this.memoryRepo = options.memoryRepo || process.env.EGREGORE_MEMORY_REPO || './egregore-memory';
    this.user = options.user || process.env.EGREGORE_USER || this.getGitUser();
    this.debug = options.debug || process.env.EGREGORE_ADAPTER_DEBUG === 'true';
    
    // Ensure memory repo exists
    this.ensureRepo();
  }

  getGitUser() {
    try {
      return execSync('git config user.name', { encoding: 'utf8' }).trim();
    } catch {
      return 'unknown';
    }
  }

  ensureRepo() {
    if (!fs.existsSync(this.memoryRepo)) {
      fs.mkdirSync(this.memoryRepo, { recursive: true });
      execSync('git init', { cwd: this.memoryRepo });
      this.log('Initialized egregore memory repo');
    }
  }

  log(...args) {
    if (this.debug) {
      console.log('[egregore-opencode]', ...args);
    }
  }

  // ── Command Handlers ─────────────────────────────────────────────────────

  /**
   * Reflect: Capture insights and decisions
   * OpenCode: /ask "Reflect: Your insight here"
   */
  async reflect(content) {
    const timestamp = new Date().toISOString();
    const date = timestamp.split('T')[0];
    const filename = `reflections/${date}-${Date.now()}.md`;
    
    const reflection = `# Reflection — ${timestamp}

**Author:** ${this.user}

${content}

---
*Captured via OpenCode adapter*
`;

    // Ensure directory exists
    const dir = path.join(this.memoryRepo, 'reflections');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    const filepath = path.join(this.memoryRepo, filename);
    fs.writeFileSync(filepath, reflection);

    // Git commit
    execSync('git add .', { cwd: this.memoryRepo });
    execSync(`git commit -m "egregore: reflection from ${this.user}"`, { 
      cwd: this.memoryRepo,
      stdio: this.debug ? 'inherit' : 'pipe'
    });

    this.log('Reflection captured:', filename);
    return { success: true, filename, timestamp };
  }

  /**
   * Handoff: Leave context for team/next session
   * OpenCode: /ask "Handoff: Context for the team..."
   */
  async handoff(content, options = {}) {
    const timestamp = new Date().toISOString();
    const date = timestamp.split('T')[0];
    const time = timestamp.split('T')[1].split('.')[0].replace(/:/g, '-');
    const filename = `handoffs/${date}-${time}.md`;

    const assignee = options.assignee ? `**Assignee:** @${options.assignee}\n` : '';
    
    const handoff = `# Handoff — ${timestamp}

**From:** ${this.user}
${assignee}
## Context

${content}

## Next Steps

- [ ] Review handoff
- [ ] Continue work or respond

---
*Handoff via OpenCode adapter*
`;

    // Ensure directory exists
    const dir = path.join(this.memoryRepo, 'handoffs');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    const filepath = path.join(this.memoryRepo, filename);
    fs.writeFileSync(filepath, handoff);

    // Git commit
    execSync('git add .', { cwd: this.memoryRepo });
    execSync(`git commit -m "egregore: handoff from ${this.user}"`, { 
      cwd: this.memoryRepo,
      stdio: this.debug ? 'inherit' : 'pipe'
    });

    this.log('Handoff created:', filename);
    return { success: true, filename, timestamp, assignee: options.assignee };
  }

  /**
   * Quest: Start or continue research exploration
   * OpenCode: /ask "Quest: Research topic..."
   */
  async quest(topic, options = {}) {
    const questId = options.continue || this.generateQuestId();
    const timestamp = new Date().toISOString();
    const filename = `quests/${questId}.md`;

    // Check if quest exists (continuing)
    const filepath = path.join(this.memoryRepo, filename);
    const exists = fs.existsSync(filepath);

    if (exists) {
      // Append to existing quest
      const entry = `\n## Update — ${timestamp}\n\n${topic}\n`;
      fs.appendFileSync(filepath, entry);
      
      execSync('git add .', { cwd: this.memoryRepo });
      execSync(`git commit -m "egregore: quest ${questId} update"`, { 
        cwd: this.memoryRepo,
        stdio: this.debug ? 'inherit' : 'pipe'
      });

      this.log('Quest updated:', questId);
      return { success: true, questId, status: 'continued', timestamp };
    } else {
      // Create new quest
      const dir = path.join(this.memoryRepo, 'quests');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const quest = `# Quest: ${topic}

**ID:** ${questId}  
**Started:** ${timestamp}  
**Owner:** ${this.user}

## Objective

${topic}

## Log

### ${timestamp} — Quest started

Exploration initiated via OpenCode.

## Resources

- [Links, references, discoveries]

## Status

🟢 Active

---
*Quest managed via egregore OpenCode adapter*
`;

      fs.writeFileSync(filepath, quest);

      execSync('git add .', { cwd: this.memoryRepo });
      execSync(`git commit -m "egregore: quest ${questId} started"`, { 
        cwd: this.memoryRepo,
        stdio: this.debug ? 'inherit' : 'pipe'
      });

      this.log('Quest created:', questId);
      return { success: true, questId, status: 'started', timestamp };
    }
  }

  /**
   * Activity: Show recent egregore activity
   * OpenCode: /ask "Show recent activity"
   */
  async activity(limit = 10) {
    try {
      const log = execSync(`git log --oneline -${limit}`, { 
        cwd: this.memoryRepo,
        encoding: 'utf8'
      });

      const stats = this.getStats();

      return {
        success: true,
        recentCommits: log.trim().split('\n'),
        stats,
        message: `Activity in ${this.memoryRepo}: ${stats.reflections} reflections, ${stats.handoffs} handoffs, ${stats.quests} quests`
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getStats() {
    const counts = { reflections: 0, handoffs: 0, quests: 0 };
    
    const dirs = ['reflections', 'handoffs', 'quests'];
    for (const dir of dirs) {
      const dirPath = path.join(this.memoryRepo, dir);
      if (fs.existsSync(dirPath)) {
        counts[dir] = fs.readdirSync(dirPath).filter(f => f.endsWith('.md')).length;
      }
    }
    
    return counts;
  }

  generateQuestId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id = '';
    for (let i = 0; i < 8; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  // ── OpenCode Integration ─────────────────────────────────────────────────

  /**
   * Parse OpenCode /ask input and route to appropriate handler
   */
  async handleAsk(input) {
    const patterns = [
      { prefix: 'Reflect:', handler: 'reflect' },
      { prefix: 'Handoff:', handler: 'handoff' },
      { prefix: 'Quest:', handler: 'quest' },
      { prefix: 'Show activity', handler: 'activity' },
      { prefix: 'Show recent', handler: 'activity' }
    ];

    for (const pattern of patterns) {
      if (input.startsWith(pattern.prefix)) {
        const content = input.slice(pattern.prefix.length).trim();
        return this[pattern.handler](content);
      }
    }

    // Not an egregore command, pass through
    return { passThrough: true, input };
  }
}

// Export for use in OpenCode integration
module.exports = { EgregoreOpencodeAdapter };

// CLI usage (if run directly)
if (require.main === module) {
  const adapter = new EgregoreOpencodeAdapter({ debug: true });
  
  // Demo/test
  console.log('Egregore OpenCode Adapter v1.0.0');
  console.log('Memory repo:', adapter.memoryRepo);
  console.log('User:', adapter.user);
  console.log('Stats:', adapter.getStats());
}
