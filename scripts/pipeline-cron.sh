#!/bin/bash
# Regen Toolkit Pipeline Cron - Runs every 10 minutes
# Checks pipeline state, advances stages, spawns agents

set -e

REPO="/root/workspace/regen-toolkit"
STATE_FILE="$REPO/.pipeline-state.json"
SKILL_PATH="$REPO/skills/SKILL.md"

cd "$REPO"

echo "=== Pipeline Cron Check ==="

# Load current state
if [ ! -f "$STATE_FILE" ]; then
    echo '{"version":"1.0","queue":[],"completed":[],"failed":[],"stats":{"totalProcessed":0,"completed":0,"failed":0,"inProgress":0}}' > "$STATE_FILE"
fi

STATE=$(cat "$STATE_FILE")
QUEUE_LENGTH=$(echo "$STATE" | jq '.queue | length')

echo "Queue length: $QUEUE_LENGTH"

# Check if we need to load more articles into queue
if [ "$QUEUE_LENGTH" -eq 0 ]; then
    echo "Queue empty, looking for placeholders..."
    
    # Find more placeholder articles
    PLACEHOLDERS=$(find content -name "*.md" -exec grep -l "^status: placeholder" {} \; 2>/dev/null | head -5)
    PLACEHOLDER_COUNT=$(echo "$PLACEHOLDERS" | wc -l | tr -d ' ')
    
    echo "Found $PLACEHOLDER_COUNT placeholders"
    
    if [ "$PLACEHOLDER_COUNT" -gt 0 ] && [ "$PLACEHOLDER_COUNT" -lt 100 ]; then
        # Add articles to queue
        NEW_QUEUE="[]"
        for file in $PLACEHOLDERS; do
            SLUG=$(basename "$file" .md)
            SECTION=$(dirname "$file" | sed 's|content/||')
            NEW_QUEUE=$(echo "$NEW_QUEUE" | jq --arg slug "$SLUG" --arg path "$file" --arg section "$SECTION" \
                '. += [{"slug": $slug, "path": $path, "section": $section, "status": "queued", "stage": "RESEARCH", "startedAt": "'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'"}]')
        done
        
        STATE=$(echo "$STATE" | jq --argjson queue "$NEW_QUEUE" '.queue = $queue')
        echo "Loaded $PLACEHOLDER_COUNT articles into queue"
    fi
fi

# Save updated state
STATE=$(echo "$STATE" | jq --arg now "$(date -u +%Y-%m-%dT%H:%M:%SZ)" '.lastUpdated = $now')
echo "$STATE" > "$STATE_FILE"

# Report current status
QUEUE_LENGTH=$(echo "$STATE" | jq '.queue | length')
COMPLETED_COUNT=$(echo "$STATE" | jq '.completed | length')

if [ "$QUEUE_LENGTH" -gt 0 ]; then
    CURRENT_ARTICLE=$(echo "$STATE" | jq -r '.queue[0].slug // "none"')
    CURRENT_STAGE=$(echo "$STATE" | jq -r '.queue[0].stage // "none"')
    
    echo "Current: $CURRENT_ARTICLE at $CURRENT_STAGE"
    echo "Completed: $COMPLETED_COUNT articles"
    
    # Check for any working files that indicate completed stages
    if [ -d "$REPO/content/1-foundations" ]; then
        WORKING_COUNT=$(find "$REPO/content" -name "working" -type d 2>/dev/null | wc -l | tr -d ' ')
        echo "Working dirs: $WORKING_COUNT"
    fi
    
    # Post to Discord if there's work
    curl -s -X POST "https://discord.com/api/v10/channels/1476588470792355900/messages" \
        -H "Authorization: Bot $(cat /root/.openclaw/credentials/discord-token)" \
        -H "Content-Type: application/json" \
        -d "{\"content\": \"🔄 **Pipeline Check**\n\n**Current:** $CURRENT_ARTICLE at \`$CURRENT_STAGE\`\n**Queue:** $QUEUE_LENGTH pending | **Completed:** $COMPLETED_COUNT\n\n_Use \`keep pipeline running\` to nudge._\"}"
else
    MORE=$(find content -name "*.md" -exec grep -l "^status: placeholder" {} \; 2>/dev/null | wc -l | tr -d ' ')
    echo "Pipeline idle. $MORE placeholders remaining."
fi

echo "=== Done ==="
