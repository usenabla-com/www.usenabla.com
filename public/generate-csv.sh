#!/bin/bash
#
# Generate Compliance CSV Reports from Terraform State
#
# This script generates CSV reports for compliance assessments including:
# - Controls summary across all frameworks
# - Individual findings
# - Asset inventory
# - Compliance summary statistics
#
# Usage:
#   ./scripts/generate-csv.sh [TFSTATE_PATH] [OUTPUT_DIR] [ASSESSMENT_NAME]
#
# Examples:
#   ./scripts/generate-csv.sh
#   ./scripts/generate-csv.sh examples/fedramp-production.tfstate.b64
#   ./scripts/generate-csv.sh examples/custom.tfstate.b64 output/my-csv
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Default values
TFSTATE_PATH="${1:-examples/fedramp-complex.tfstate.b64}"
OUTPUT_DIR="${2:-output/compliance-csv}"
ASSESSMENT_NAME="${3:-compliance-assessment}"

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Python script path
PYTHON_SCRIPT="$SCRIPT_DIR/generate-compliance-csv.py"

echo ""
echo "========================================================================"
echo "  Compliance CSV Report Generator"
echo "========================================================================"
echo -e "${BLUE}ℹ️  Terraform State: $PROJECT_ROOT/$TFSTATE_PATH${NC}"
echo -e "${BLUE}ℹ️  Output Directory: $PROJECT_ROOT/$OUTPUT_DIR${NC}"
echo -e "${BLUE}ℹ️  Assessment Name: $ASSESSMENT_NAME${NC}"
echo "========================================================================"
echo ""

# Check for required environment variable
if [ -z "$NABLA_CUSTOMER_KEY" ]; then
    echo -e "${RED}❌ Error: NABLA_CUSTOMER_KEY environment variable not set${NC}"
    echo ""
    echo "Please set your API key:"
    echo "  export NABLA_CUSTOMER_KEY='your-api-key-here'"
    echo ""
    exit 1
fi

# Check if Python script exists
if [ ! -f "$PYTHON_SCRIPT" ]; then
    echo -e "${RED}❌ Error: Python script not found: $PYTHON_SCRIPT${NC}"
    exit 1
fi

# Check if Terraform state file exists
if [ ! -f "$PROJECT_ROOT/$TFSTATE_PATH" ]; then
    echo -e "${RED}❌ Error: Terraform state file not found: $PROJECT_ROOT/$TFSTATE_PATH${NC}"
    exit 1
fi

# Detect Python version
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo -e "${RED}❌ Error: Python not found${NC}"
    echo "Please install Python 3.7 or higher"
    exit 1
fi

PYTHON_VERSION=$($PYTHON_CMD --version 2>&1 | awk '{print $2}')
echo -e "${BLUE}ℹ️  Using Python: $PYTHON_VERSION${NC}"
echo ""

# Run the Python script
echo -e "${BLUE}ℹ️  Running CSV report generator...${NC}"
echo ""

cd "$PROJECT_ROOT"

if $PYTHON_CMD "$PYTHON_SCRIPT" \
    --tfstate "$TFSTATE_PATH" \
    --output-dir "$OUTPUT_DIR" \
    --name "$ASSESSMENT_NAME"; then

    echo ""
    echo -e "${GREEN}✅ CSV report generation complete!${NC}"
    echo ""
    echo -e "${BLUE}ℹ️  Generated CSV files:${NC}"
    echo "  📊 Controls:  $PROJECT_ROOT/$OUTPUT_DIR/controls.csv"
    echo "  📋 Findings:  $PROJECT_ROOT/$OUTPUT_DIR/findings.csv"
    echo "  📦 Assets:    $PROJECT_ROOT/$OUTPUT_DIR/assets.csv"
    echo "  📈 Summary:   $PROJECT_ROOT/$OUTPUT_DIR/summary.csv"
    echo ""
    echo -e "${BLUE}ℹ️  Open in spreadsheet:${NC}"
    echo "  open $PROJECT_ROOT/$OUTPUT_DIR/summary.csv"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Error: CSV report generation failed${NC}"
    echo ""
    echo -e "${BLUE}ℹ️  For more details, run with verbose output:${NC}"
    echo "  python3 $PYTHON_SCRIPT --help"
    echo ""
    exit 1
fi
