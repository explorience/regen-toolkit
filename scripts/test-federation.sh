#!/bin/bash
#
# Test Federation — Skill Distribution & Knowledge Aggregation
# Usage: ./test-federation.sh [test-type]
#

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[PASS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[FAIL]${NC} $1"; }

HUB_DIR="/root/Zettelkasten/03 Libraries/regen-coordination-os"

# Test configuration
TEST_NODE="refi-bcn-os"
TEST_NODE_REPO="regen-coordination/refi-bcn-os"

echo "═══════════════════════════════════════════════════════════"
echo "   Federation Test Suite"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Test 1: Verify hub structure
test_hub_structure() {
    log_info "Test 1: Hub directory structure..."

    local checks=0
    local passed=0

    # Check skills directory
    ((checks++))
    if [[ -d "${HUB_DIR}/skills" ]] || [[ -d "${HUB_DIR}/.agent/skills" ]]; then
        log_success "Skills directory exists"
        ((passed++))
    else
        log_warn "Skills directory not found (hub may not have skills)"
    fi

    # Check knowledge directory
    ((checks++))
    if [[ -d "${HUB_DIR}/knowledge" ]]; then
        log_success "Knowledge directory exists"
        ((passed++))
    else
        log_warn "Knowledge directory not found"
    fi

    # Check federation.yaml
    ((checks++))
    if [[ -f "${HUB_DIR}/federation.yaml" ]]; then
        log_success "federation.yaml exists"
        ((passed++))
    else
        log_error "federation.yaml not found"
    fi

    # Check GitHub Actions
    ((checks++))
    if [[ -d "${HUB_DIR}/.github/workflows" ]]; then
        log_success "GitHub Actions workflows directory exists"
        ((passed++))
    else
        log_error "GitHub Actions not configured"
    fi

    echo "  Result: ${passed}/${checks} checks passed"
    echo ""
}

# Test 2: Verify workflow files
test_workflows() {
    log_info "Test 2: Federation workflow files..."

    local workflows=(
        "distribute-skills.yml:Skill Distribution"
        "aggregate-knowledge.yml:Knowledge Aggregation"
        "peer-sync-refi.yml:Peer Sync (DAO ↔ BCN)"
        "council-coordination.yml:Council Coordination"
    )

    local passed=0

    for workflow in "${workflows[@]}"; do
        local file="${workflow%%:*}"
        local name="${workflow##*:}"

        if [[ -f "${HUB_DIR}/.github/workflows/${file}" ]]; then
            log_success "${name}: ${file}"
            ((passed++))
        else
            log_error "${name}: ${file} NOT FOUND"
        fi
    done

    echo "  Result: ${passed}/${#workflows[@]} workflows present"
    echo ""
}

# Test 3: Verify node configurations
test_node_configs() {
    log_info "Test 3: Node federation configurations..."

    local nodes=(
        "refi-dao-os:ReFi DAO"
        "refi-bcn-os:ReFi BCN"
    )

    local passed=0

    for node in "${nodes[@]}"; do
        local dir="${node%%:*}"
        local name="${node##*:}"
        local path="/root/Zettelkasten/03 Libraries/${dir}"

        if [[ -f "${path}/federation.yaml" ]]; then
            log_success "${name}: federation.yaml configured"
            ((passed++))
        else
            log_error "${name}: federation.yaml NOT FOUND"
        fi
    done

    echo "  Result: ${passed}/${#nodes[@]} nodes configured"
    echo ""
}

# Test 4: Knowledge directory structure
test_knowledge_structure() {
    log_info "Test 4: Knowledge folder structure..."

    local instances=(
        "regen-coordination-os:Hub"
        "refi-dao-os:ReFi DAO"
        "refi-bcn-os:ReFi BCN"
        "org-os:Framework"
    )

    local passed=0

    for instance in "${instances[@]}"; do
        local dir="${instance%%:*}"
        local name="${instance##*:}"
        local path="/root/Zettelkasten/03 Libraries/${dir}"

        if [[ -f "${path}/knowledge/INDEX.md" ]]; then
            log_success "${name}: knowledge/INDEX.md"
            ((passed++))
        else
            log_warn "${name}: knowledge/INDEX.md not found"
        fi
    done

    echo "  Result: ${passed}/${#instances[@]} instances have knowledge structure"
    echo ""
}

# Test 5: OPAL bridge deployment status
test_opal_bridge() {
    log_info "Test 5: OPAL Bridge status..."

    local opal_pkg="/root/Zettelkasten/03 Libraries/org-os/packages/opal-bridge"

    if [[ -d "${opal_pkg}/src" ]]; then
        log_success "OPAL bridge source code exists"
    else
        log_error "OPAL bridge source not found"
        return 1
    fi

    if [[ -f "${opal_pkg}/package.json" ]]; then
        log_success "OPAL bridge package.json exists"
    else
        log_error "OPAL bridge package.json not found"
    fi

    # Count source files
    local src_files
    src_files=$(find "${opal_pkg}/src" -name "*.ts" 2>/dev/null | wc -l)
    log_info "OPAL bridge TypeScript files: ${src_files}"

    echo "  Result: OPAL bridge ready for deployment"
    echo ""
}

# Test 6: Integration docs
test_integration_docs() {
    log_info "Test 6: Integration documentation..."

    local docs_dir="/root/Zettelkasten/03 Libraries/org-os/docs/integrations"
    local docs=(
        "opal.md:OPAL"
        "koi.md:KOI"
        "egregore.md:Egregore"
        "knowledge.md:Knowledge"
    )

    local passed=0

    for doc in "${docs[@]}"; do
        local file="${doc%%:*}"
        local name="${doc##*:}"

        if [[ -f "${docs_dir}/${file}" ]]; then
            log_success "${name}: ${file}"
            ((passed++))
        else
            log_error "${name}: ${file} NOT FOUND"
        fi
    done

    echo "  Result: ${passed}/${#docs[@]} integration docs present"
    echo ""
}

# Print manual test instructions
print_manual_tests() {
    echo "═══════════════════════════════════════════════════════════"
    log_info "Manual Test Instructions"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo "To fully test the federation, run these GitHub Actions:"
    echo ""
    echo "1. Skill Distribution Test:"
    echo "   cd ${HUB_DIR}"
    echo "   gh workflow run distribute-skills.yml -f target_node=regen-coordination/refi-bcn-os"
    echo ""
    echo "2. Knowledge Aggregation Test:"
    echo "   gh workflow run aggregate-knowledge.yml"
    echo ""
    echo "3. Peer Sync Test:"
    echo "   gh workflow run peer-sync-refi.yml -f sync_direction=bidirectional"
    echo ""
    echo "4. OPAL Bridge Deploy (to refi-bcn-os):"
    echo "   cd /root/Zettelkasten/03 Libraries/org-os/packages/opal-bridge"
    echo "   ./scripts/deploy-to-node.sh refi-bcn-os"
    echo ""
    echo "═══════════════════════════════════════════════════════════"
}

# Main test runner
main() {
    echo "Running federation tests..."
    echo ""

    test_hub_structure
    test_workflows
    test_node_configs
    test_knowledge_structure
    test_opal_bridge
    test_integration_docs

    echo "═══════════════════════════════════════════════════════════"
    log_success "Automated tests complete!"
    echo "═══════════════════════════════════════════════════════════"
    echo ""

    print_manual_tests
}

main "$@"
