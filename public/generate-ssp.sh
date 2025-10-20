#!/bin/bash
#
# FedRAMP SSP Generator - Convenience Wrapper
#
# This script is a simple wrapper around the Python FedRAMP SSP generator
# that provides sensible defaults and easy-to-use options.
#
# Usage:
#   ./scripts/generate-ssp.sh                    # Use defaults
#   ./scripts/generate-ssp.sh /path/to/state.b64 # Custom state file
#   NABLA_CUSTOMER_KEY=xxx ./scripts/generate-ssp.sh
#

set -euo pipefail

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_error() {
    echo -e "${RED}❌ Error: $1${NC}" >&2
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check for API key
if [[ -z "${NABLA_CUSTOMER_KEY:-}" ]]; then
    print_error "NABLA_CUSTOMER_KEY environment variable not set"
    echo ""
    echo "Please set your Nabla API key:"
    echo "  export NABLA_CUSTOMER_KEY='your-api-key-here'"
    echo ""
    echo "Or run this script with:"
    echo "  NABLA_CUSTOMER_KEY='your-key' $0"
    exit 1
fi

# Default Terraform state file
TFSTATE_FILE="${1:-$PROJECT_DIR/examples/fedramp-complex.tfstate.b64}"

# Check if Terraform state file exists
if [[ ! -f "$TFSTATE_FILE" ]]; then
    print_error "Terraform state file not found: $TFSTATE_FILE"
    echo ""
    print_info "If you have a Terraform state file, encode it with:"
    echo "  base64 -i terraform.tfstate -o terraform.tfstate.b64"
    echo ""
    print_info "Then run this script with:"
    echo "  $0 /path/to/terraform.tfstate.b64"
    exit 1
fi

# Output directory
OUTPUT_DIR="${2:-$PROJECT_DIR/output/fedramp-ssp}"

# Additional options
FORMAT="${NABLA_FORMAT:-json}"
ASSESSMENT_NAME="${NABLA_ASSESSMENT_NAME:-fedramp-production}"
NO_DIAGRAM="${NABLA_NO_DIAGRAM:-false}"

# Build command
CMD="$SCRIPT_DIR/generate-fedramp-ssp.py"
CMD="$CMD --tfstate \"$TFSTATE_FILE\""
CMD="$CMD --output-dir \"$OUTPUT_DIR\""
CMD="$CMD --format \"$FORMAT\""
CMD="$CMD --name \"$ASSESSMENT_NAME\""

if [[ "$NO_DIAGRAM" == "true" ]]; then
    CMD="$CMD --no-diagram"
fi

# Print configuration
echo ""
echo "========================================================================"
echo "  FedRAMP SSP Generator"
echo "========================================================================"
print_info "Terraform State: $TFSTATE_FILE"
print_info "Output Directory: $OUTPUT_DIR"
print_info "Format: $FORMAT"
print_info "Assessment Name: $ASSESSMENT_NAME"
echo "========================================================================"
echo ""

# Check Python version
if ! command -v python3 &> /dev/null; then
    print_error "python3 not found"
    echo "Please install Python 3.8 or later"
    exit 1
fi

PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
print_info "Using Python: $PYTHON_VERSION"

# Run the script
echo ""
print_info "Running FedRAMP SSP generator..."
echo ""

if eval "$CMD"; then
    echo ""
    print_success "FedRAMP SSP generation complete!"
    echo ""
    print_info "Generated files:"
    echo "  📄 SSP Document:      $OUTPUT_DIR/fedramp-ssp.json"
    echo "  📦 Asset Inventory:   $OUTPUT_DIR/asset-inventory.json"
    echo "  📊 Raw Assessment:    $OUTPUT_DIR/raw-assessment.json"
    echo ""
    print_info "View your SSP:"
    echo "  cat $OUTPUT_DIR/fedramp-ssp.json | jq ."
    echo ""
else
    echo ""
    print_error "FedRAMP SSP generation failed"
    echo ""
    print_info "For more details, run with verbose output:"
    echo "  python3 $SCRIPT_DIR/generate-fedramp-ssp.py --help"
    exit 1
fi

# Optional: Open output directory
if command -v open &> /dev/null && [[ -d "$OUTPUT_DIR" ]]; then
    echo ""
    read -p "Open output directory? [y/N] " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "$OUTPUT_DIR"
    fi
fi

exit 0
