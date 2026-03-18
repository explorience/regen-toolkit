#!/bin/bash

REPO_PATH="/root/workspace/regen-toolkit"
STATE_FILE="$REPO_PATH/.pipeline-state.json"
ARCHIVE_DIR="$REPO_PATH/content/archive-pipeline-v1"

# Initialize state file
jq -n \
  --argjson queue "[]" \
  --argjson completed "[]" \
  --argjson failed "[]" \
  --arg version "1.0" \
  --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  '{version: $version, lastUpdated: $timestamp, sessionId: "current-session", queue: $queue, completed: $completed, failed: $failed, stats: {totalProcessed: 0, completed: 0, failed: 0, inProgress: 0}}' > "$STATE_FILE"

# Process each article
find "$REPO_PATH/content" -maxdepth 2 -name "*.md" ! -path "*/working/*" | sort | while read -r article_path; do
    # Skip archived articles
    if [[ "$article_path" == *"$ARCHIVE_DIR"* ]]; then
        continue
    fi

    name=$(basename "$article_path" .md)
    dir=$(dirname "$article_path")
    working_dir="$dir/working"
    slug=$(echo "$name" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

    stage="RESEARCH" # Default starting stage

    if [ -s "$working_dir/${name}-research.md" ]; then
        stage="DRAFT" # Research done, ready for Draft
        if [ -s "$article_path" ] && [ "$(stat -c%s "$article_path")" -gt 400 ]; then
            stage="FACT_CHECK" # Draft done, ready for Fact-Check
            if [ -s "$working_dir/${name}-factcheck.md" ]; then
                stage="EDIT" # Fact-Check done, ready for Edit
                if [ -s "$working_dir/${name}-critique.md" ]; then
                    stage="CRITIQUE" # Edit done, ready for Critique
                    if grep -q "^status: draft" "$article_path" 2>/dev/null; then
                        stage="PUBLISHED" # Critique done, ready for Publish
                    fi
                fi
            fi
        fi
    fi

    # Add to queue or completed based on stage
    if [ "$stage" == "PUBLISHED" ]; then
        jq --arg slug "$slug" \
           --arg path "$article_path" \
           --arg stage "$stage" \
           --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
           '.completed += [{slug: $slug, path: $path, status: $stage, completedAt: $timestamp}]' \
           "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
    else
        jq --arg slug "$slug" \
           --arg path "$article_path" \
           --arg stage "$stage" \
           --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
           '.queue += [{slug: $slug, path: $path, status: "in_progress", stage: $stage, startedAt: $timestamp}]' \
           "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
    fi
done

# Update stats
total_processed=$(jq '.queue | length' "$STATE_FILE")
completed_count=$(jq '.completed | length' "$STATE_FILE")
failed_count=$(jq '.failed | length' "$STATE_FILE")
in_progress_count=$(jq '.queue | map(select(.status == "in_progress")) | length' "$STATE_FILE")

jq --argjson total_processed "$((total_processed + completed_count + failed_count))" \
   --argjson completed_count "$completed_count" \
   --argjson failed_count "$failed_count" \
   --argjson in_progress_count "$in_progress_count" \
   '.stats = {totalProcessed: $total_processed, completed: $completed_count, failed: $failed_count, inProgress: $in_progress_count}' \
   "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"

echo "Pipeline state file rebuilt at $STATE_FILE"
cat "$STATE_FILE"
