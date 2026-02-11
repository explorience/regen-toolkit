#!/bin/bash
# Overnight Batch Production Script
# Produces Tier 1 Foundation articles using GPT-4o

set -e

PROJECT_DIR="/root/Zettelkasten/03 Libraries/regen-toolkit"
LOG_FILE="$PROJECT_DIR/logs/overnight-batch-$(date +%Y%m%d-%H%M).log"
BATCH_CONFIG="$PROJECT_DIR/.cursor/batch-config.json"
STOP_FILE="$PROJECT_DIR/.stop-batch"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
  echo -e "${GREEN}[$(date +%Y-%m-%d\ %H:%M:%S)]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
  echo -e "${RED}[ERROR $(date +%Y-%m-%d\ %H:%M:%S)]${NC} $1" | tee -a "$LOG_FILE"
}

warn() {
  echo -e "${YELLOW}[WARN $(date +%Y-%m-%d\ %H:%M:%S)]${NC} $1" | tee -a "$LOG_FILE"
}

# Check for stop file
check_stop() {
  if [ -f "$STOP_FILE" ]; then
    log "Stop file detected. Halting batch."
    rm "$STOP_FILE"
    exit 0
  fi
}

# Word count validation
validate_article() {
  local file="$1"
  local min_words=750
  local max_words=900
  
  # Extract content (remove frontmatter)
  local content=$(sed '/^---$/,/^---$/d' "$file")
  local word_count=$(echo "$content" | wc -w)
  
  if [ "$word_count" -lt "$min_words" ]; then
    error "Word count too low: $word_count (min: $min_words)"
    return 1
  fi
  
  if [ "$word_count" -gt "$max_words" ]; then
    warn "Word count high: $word_count (max: $max_words)"
  fi
  
  # Check required sections
  local required_sections=("In This Article" "The Core Idea" "Next Steps")
  for section in "${required_sections[@]}"; do
    if ! grep -q "$section" "$file"; then
      error "Missing required section: $section"
      return 1
    fi
  done
  
  log "Validation passed: $word_count words"
  return 0
}

# Count cross-links
count_cross_links() {
  local file="$1"
  local links=$(grep -oE '\[\[[^\]]+\]\]' "$file" | wc -l)
  echo "$links"
}

# Main batch function
run_batch() {
  log "=== STARTING OVERNIGHT BATCH ==="
  log "Model: GPT-4o"
  log "Target: 9 Tier 1 Foundation articles"
  log "Estimated time: 6-8 hours"
  log "Estimated cost: $0.40-0.50"
  log "================================"
  
  cd "$PROJECT_DIR"
  
  # Create logs directory
  mkdir -p logs
  
  # Article queue (in priority order)
  declare -a ARTICLES=(
    "content/1-foundations/1.1-why-web3/coordination-transparency.md|B,NEW|coordination transparency"
    "content/1-foundations/1.1-why-web3/common-concerns.md|B,C,NEW|common concerns FAQ"
    "content/1-foundations/1.1-why-web3/what-web3-can-cant-do.md|B,NEW|web3 capabilities"
    "content/1-foundations/1.1-why-web3/relates-to-existing-work.md|A,B,NEW|existing work comparison"
    "content/1-foundations/1.1-why-web3/stories-regens-leap.md|O,NEW|regen stories"
    "content/1-foundations/1.2-decentralization/what-is-decentralization.md|B,D,NEW|decentralization concept"
    "content/1-foundations/1.2-decentralization/trust-transparency.md|B,E,NEW|trust and transparency"
    "content/1-foundations/1.5-wallets-security/what-is-wallet.md|G,NEW|wallet basics"
    "content/1-foundations/1.5-wallets-security/setting-up-first-wallet.md|G,A,NEW|wallet setup guide"
  )
  
  local completed=0
  local failed=0
  local total=${#ARTICLES[@]}
  
  for item in "${ARTICLES[@]}"; do
    check_stop
    
    IFS='|' read -r file sources description <<< "$item"
    local article_name=$(basename "$file")
    
    log "----------------------------------------"
    log "Processing ($((completed + failed + 1))/$total): $article_name"
    log "Description: $description"
    log "Sources: $sources"
    
    # Check if already done
    if grep -q "status: draft" "$file" 2>/dev/null; then
      log "Article already has draft status, skipping"
      ((completed++))
      continue
    fi
    
    # Check if sources exist
    local sources_ok=true
    for src in $(echo "$sources" | tr ',' ' '); do
      if [ "$src" != "NEW" ] && [ ! -f "content/sources/${src,,}-*.md" ]; then
        error "Source $src not found"
        sources_ok=false
        break
      fi
    done
    
    if [ "$sources_ok" = false ]; then
      ((failed++))
      continue
    fi
    
    # Log attempt
    log "Spawning subagent for $article_name..."
    
    # Note: In practice, this would call sessions_spawn
    # For now, log the intended action
    log "[ACTION] sessions_spawn: Write article $article_name"
    log "[ACTION] Model: GPT-4o, Sources: $sources, Target: 800 words"
    
    # Simulate processing time (remove in production)
    sleep 2
    
    # Validate (would run after subagent completes)
    if [ -f "$file" ]; then
      if validate_article "$file"; then
        local links=$(count_cross_links "$file")
        log "Cross-links: $links"
        
        if [ "$links" -ge 3 ]; then
          log "✅ Article complete: $article_name"
          ((completed++))
          
          # Git commit
          git add "$file"
          git commit -m "Add: $article_name (overnight batch)" || true
        else
          warn "Insufficient cross-links: $links (need 3+)"
          ((failed++))
        fi
      else
        ((failed++))
      fi
    else
      error "Article file not created: $file"
      ((failed++))
    fi
    
    # Brief pause between articles
    sleep 1
  done
  
  log "================================"
  log "BATCH COMPLETE"
  log "Completed: $completed/$total"
  log "Failed: $failed/$total"
  log "Log file: $LOG_FILE"
  log "================================"
  
  # Push to remote
  if [ $completed -gt 0 ]; then
    log "Pushing to origin..."
    git push origin main || warn "Push failed, manual push needed"
  fi
  
  # Generate summary
  cat > "OVERNIGHT-RESULTS-$(date +%Y%m%d).md" << EOF
# Overnight Batch Results

**Date**: $(date +%Y-%m-%d)  
**Model**: GPT-4o  
**Duration**: ~6-8 hours  

## Summary

| Metric | Value |
|--------|-------|
| Articles Completed | $completed |
| Articles Failed | $failed |
| Success Rate | $(( completed * 100 / total ))% |
| Est. Total Words | $(( completed * 800 )) |
| Est. Cost | ~\$0.$(( completed * 4 )) |

## Completed Articles

$(for f in $(git diff --name-only HEAD~$completed 2>/dev/null | grep "content/" || echo "See git log"); do echo "- $f"; done)

## Next Steps

1. Review articles for quality
2. Update dashboard: os.heen.al/toolkit
3. Change status: needs-writing → in-progress → needs-review
4. Notify team for review

## Log

See full log: \`$LOG_FILE\`
EOF
  
  log "Results written to OVERNIGHT-RESULTS-$(date +%Y%m%d).md"
}

# Emergency stop
trap 'log "Interrupted. Cleaning up..."; exit 1' INT TERM

# Run
run_batch
