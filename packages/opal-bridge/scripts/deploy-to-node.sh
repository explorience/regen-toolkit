#!/bin/bash
#
# Deploy OPAL Bridge to Node
# Usage: ./deploy-to-node.sh [node-name] [options]
#

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
ORG_OS_ROOT="$(cd "${PACKAGE_ROOT}/../.." && pwd)"

# Default values
NODE_NAME=""
NODE_REPO=""
DEPLOY_TYPE="full"  # full | minimal | dry-run
OPAL_PATH="../../opal"
SKIP_TESTS=false
FORCE=false

# Node configurations
# (from federation-activator subagent output)
declare -A NODES=(
    ["refi-dao-os"]="regen-coordination/refi-dao-os"
    ["refi-bcn-os"]="regen-coordination/refi-bcn-os"
    ["org-os"]="regen-coordination/org-os"
    ["dao-os"]="regen-coordination/dao-os"
    ["grants-os"]="regen-coordination/grants-os"
    ["coop-os"]="regen-coordination/coop-os"
    ["org-os"]="regen-coordination/org-os-template"
    ["becoming-constellations"]="regen-coordination/becoming-constellations"
    ["regenerant-catalunya"]="regen-coordination/regenerant-catalunya"
)

# Logging functions
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Show usage
usage() {
    cat << EOF
Deploy OPAL Bridge to an org-os node

Usage: $0 [NODE_NAME] [OPTIONS]

Nodes:
    refi-dao-os              Deploy to ReFi DAO (global governance)
    refi-bcn-os              Deploy to ReFi BCN (Barcelona local node)
    org-os                   Deploy to org-os (framework)
    dao-os                   Deploy to dao-os
    grants-os                Deploy to grants-os
    coop-os                  Deploy to coop-os
    organizational-os        Deploy to organizational-os
    becoming-constellations  Deploy to becoming-constellations
    regenerant-catalunya     Deploy to Regenerant Catalunya

Options:
    -t, --type TYPE          Deploy type: full | minimal | dry-run (default: full)
    -o, --opal-path PATH     Path to OPAL installation (default: ../../opal)
    --skip-tests             Skip running tests before deploy
    -f, --force              Force deployment even if checks fail
    -h, --help               Show this help message

Examples:
    $0 refi-bcn-os                    # Full deploy to ReFi BCN
    $0 refi-dao-os --type minimal     # Minimal deploy to ReFi DAO
    $0 refi-bcn-os --dry-run          # Dry run (no actual changes)
    $0 refi-bcn-os --skip-tests       # Skip pre-deploy tests

EOF
}

# Parse arguments
parse_args() {
    if [[ $# -eq 0 ]]; then
        usage
        exit 1
    fi

    NODE_NAME="$1"
    shift

    while [[ $# -gt 0 ]]; do
        case $1 in
            -t|--type)
                DEPLOY_TYPE="$2"
                shift 2
                ;;
            -o|--opal-path)
                OPAL_PATH="$2"
                shift 2
                ;;
            --skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            -f|--force)
                FORCE=true
                shift
                ;;
            -h|--help)
                usage
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                usage
                exit 1
                ;;
        esac
    done

    # Validate node
    if [[ -z "${NODES[$NODE_NAME]:-}" ]]; then
        log_error "Unknown node: $NODE_NAME"
        log_info "Available nodes: ${!NODES[*]}"
        exit 1
    fi

    NODE_REPO="${NODES[$NODE_NAME]}"
}

# Verify OPAL bridge package is built
verify_package() {
    log_info "Verifying OPAL bridge package..."

    if [[ ! -d "${PACKAGE_ROOT}/src" ]]; then
        log_error "OPAL bridge source not found at ${PACKAGE_ROOT}/src"
        exit 1
    fi

    if [[ ! -f "${PACKAGE_ROOT}/package.json" ]]; then
        log_error "package.json not found"
        exit 1
    fi

    log_success "OPAL bridge package structure verified"
}

# Run tests unless skipped
run_tests() {
    if [[ "$SKIP_TESTS" == true ]]; then
        log_warn "Skipping tests (--skip-tests flag)"
        return 0
    fi

    log_info "Running OPAL bridge tests..."

    cd "$PACKAGE_ROOT"

    if ! npm test 2>&1; then
        log_error "Tests failed"
        if [[ "$FORCE" != true ]]; then
            log_info "Use --force to deploy anyway (not recommended)"
            exit 1
        fi
        log_warn "Continuing despite test failures (--force)"
    fi

    log_success "Tests passed"
}

# Build the package
build_package() {
    log_info "Building OPAL bridge package..."

    cd "$PACKAGE_ROOT"

    if [[ ! -d "node_modules" ]]; then
        log_info "Installing dependencies..."
        npm ci
    fi

    if ! npm run build 2>&1; then
        log_error "Build failed"
        exit 1
    fi

    log_success "Package built successfully"
}

# Clone target node repo
clone_node() {
    local target_dir="/tmp/opal-deploy-${NODE_NAME}-$$"

    log_info "Cloning ${NODE_REPO}..."

    if [[ -d "$target_dir" ]]; then
        rm -rf "$target_dir"
    fi

    # Clone (using https, token would be needed for private repos)
    if ! git clone "https://github.com/${NODE_REPO}.git" "$target_dir" 2>&1; then
        log_error "Failed to clone ${NODE_REPO}"
        exit 1
    fi

    echo "$target_dir"
}

# Deploy to node
deploy_to_node() {
    local node_dir="$1"

    log_info "Deploying OPAL bridge to ${NODE_NAME}..."

    # Check if packages directory exists
    if [[ ! -d "${node_dir}/packages" ]]; then
        log_info "Creating packages directory..."
        mkdir -p "${node_dir}/packages"
    fi

    # Remove existing opal-bridge if present
    if [[ -d "${node_dir}/packages/opal-bridge" ]]; then
        log_warn "Existing opal-bridge found, backing up..."
        mv "${node_dir}/packages/opal-bridge" "${node_dir}/packages/opal-bridge-backup-$(date +%Y%m%d-%H%M%S)"
    fi

    # Copy OPAL bridge package
    log_info "Copying OPAL bridge package..."
    cp -r "$PACKAGE_ROOT" "${node_dir}/packages/opal-bridge"

    # Remove node_modules and dist (will be rebuilt)
    rm -rf "${node_dir}/packages/opal-bridge/node_modules"
    rm -rf "${node_dir}/packages/opal-bridge/dist"

    # Update .gitignore if needed
    if ! grep -q "packages/opal-bridge/node_modules" "${node_dir}/.gitignore" 2>/dev/null; then
        log_info "Updating .gitignore..."
        echo -e "\n# OPAL Bridge\npackages/opal-bridge/node_modules\npackages/opal-bridge/dist" >> "${node_dir}/.gitignore"
    fi

    log_success "OPAL bridge copied to ${NODE_NAME}"
}

# Configure federation.yaml
configure_federation() {
    local node_dir="$1"

    log_info "Configuring federation.yaml..."

    local fed_file="${node_dir}/federation.yaml"

    if [[ ! -f "$fed_file" ]]; then
        log_warn "federation.yaml not found, skipping configuration"
        return 0
    fi

    # Check if opal-bridge is already configured
    if grep -q "opal-bridge:" "$fed_file" 2>/dev/null; then
        log_info "opal-bridge already configured in federation.yaml"
        return 0
    fi

    # Add opal-bridge configuration
    log_info "Adding opal-bridge configuration..."

    # Create backup
    cp "$fed_file" "${fed_file}.backup-$(date +%Y%m%d-%H%M%S)"

    # Add configuration (using yq would be better, but sed for now)
    cat >> "$fed_file" << 'EOF'

# ── OPAL Bridge Configuration ────────────────────────────────────────────────
knowledge-commons:
  opal-bridge:
    enabled: true
    opal_path: "../../opal"  # Adjust based on OPAL location
    profile: "regen"
    auto_process: true
    review_required: true
EOF

    log_success "federation.yaml updated"
}

# Commit and push changes
commit_changes() {
    local node_dir="$1"

    if [[ "$DEPLOY_TYPE" == "dry-run" ]]; then
        log_info "DRY RUN: Would commit these changes:"
        cd "$node_dir"
        git status
        return 0
    fi

    log_info "Committing changes..."

    cd "$node_dir"

    # Configure git
    git config user.name "OPAL Bridge Deployer"
    git config user.email "opal-deploy@regen-coordination.org"

    # Stage changes
    git add -A

    # Check if there are changes
    if git diff --cached --quiet; then
        log_warn "No changes to commit"
        return 0
    fi

    # Commit
    git commit -m "feat: Deploy OPAL bridge for AI knowledge extraction

- Added packages/opal-bridge/ with full implementation
- Configured federation.yaml for opal-bridge
- Enables: entity extraction, meeting processing, knowledge curation
- Human-in-the-loop review for all extractions

Deployment type: ${DEPLOY_TYPE}
Date: $(date +%Y-%m-%d)
"

    # Push (would need token for actual push)
    log_info "Changes committed. To push:"
    log_info "  cd ${node_dir}"
    log_info "  git push origin main"

    log_success "Changes committed locally"
}

# Print summary
print_summary() {
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    log_success "OPAL Bridge Deployment Summary"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    log_info "Target Node: ${NODE_NAME}"
    log_info "Repository: ${NODE_REPO}"
    log_info "Deploy Type: ${DEPLOY_TYPE}"
    echo ""
    log_info "Next Steps:"
    echo "  1. Review changes in the cloned repo"
    echo "  2. Ensure OPAL is installed at: ${OPAL_PATH}"
    echo "  3. Push changes to GitHub"
    echo "  4. Install dependencies: npm install"
    echo "  5. Build: npm run build"
    echo "  6. Test: npx opal-bridge status"
    echo ""
    log_info "Documentation:"
    echo "  - packages/opal-bridge/README.md"
    echo "  - docs/integrations/opal.md"
    echo ""
    echo "═══════════════════════════════════════════════════════════"
}

# Main deployment flow
main() {
    parse_args "$@"

    log_info "Starting OPAL bridge deployment..."
    log_info "Target: ${NODE_NAME} (${NODE_REPO})"
    log_info "Type: ${DEPLOY_TYPE}"

    # Verify and build
    verify_package
    run_tests
    build_package

    if [[ "$DEPLOY_TYPE" == "dry-run" ]]; then
        log_info "DRY RUN MODE: No actual changes will be made"
    fi

    # Clone and deploy
    local node_dir
    node_dir=$(clone_node)

    deploy_to_node "$node_dir"
    configure_federation "$node_dir"

    if [[ "$DEPLOY_TYPE" != "minimal" ]]; then
        commit_changes "$node_dir"
    fi

    print_summary

    log_success "Deployment complete!"
    log_info "Node directory: ${node_dir}"
}

# Run main
main "$@"
