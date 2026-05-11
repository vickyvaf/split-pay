#!/usr/bin/env bash
#
# Setup script for SplitPay (Celo Minipay Template)
# Run from root project directory:
#   ./setup.sh
#

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# Helpers
info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC} $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; }
header()  { 
    echo -e "${CYAN}${BOLD}========================================${NC}"
    echo -e "${CYAN}${BOLD}  $1${NC}"
    echo -e "${CYAN}${BOLD}========================================${NC}"
}

# ---------- 0. Welcome & Directory Check ----------
header "SPLITPAY SETUP"
ROOT_DIR="$(pwd)"

if [ ! -d "apps/web" ] || [ ! -d "apps/contracts" ]; then
  error "Project structure not recognized. Ensure you are in the root directory."
  exit 1
fi

info "Starting setup in: $ROOT_DIR"
echo ""

# ---------- 1. Check Prerequisites ----------
header "1. CHECKING PREREQUISITES"

# Git
if ! command -v git &> /dev/null; then
  error "Git is not installed. Please install git."
  exit 1
fi
success "Git $(git --version)"

# Node.js
if ! command -v node &> /dev/null; then
  error "Node.js is not installed. Download from https://nodejs.org (v18+)"
  exit 1
fi
success "Node.js $(node -v)"

# pnpm
if ! command -v pnpm &> /dev/null; then
  warn "pnpm not found. Installing via npm..."
  npm install -g pnpm
fi
success "pnpm $(pnpm -v)"

# Foundry
if ! command -v forge &> /dev/null; then
  error "Foundry (forge) is not installed."
  error "Install via: curl -L https://foundry.paradigm.xyz | bash && foundryup"
  exit 1
fi
success "Foundry $(forge --version | head -1)"
echo ""

# ---------- 2. Smart Contracts Setup ----------
header "2. SMART CONTRACTS SETUP"
cd "$ROOT_DIR/apps/contracts"

# Initialize submodules (essential for Foundry)
info "Initializing git submodules..."
git submodule update --init --recursive
success "Submodules initialized"

# Install forge-std if missing
if [ ! -d "lib/forge-std" ]; then
  info "Installing forge-std..."
  forge install foundry-rs/forge-std --no-commit
  success "forge-std installed"
else
  success "forge-std already exists"
fi

# Remappings
if [ ! -f "remappings.txt" ]; then
  info "Creating remappings.txt..."
  echo "forge-std/=lib/forge-std/src/" > remappings.txt
  success "remappings.txt created"
fi

# Build & Test
info "Verifying contracts with forge build..."
forge build
success "Contracts compiled successfully"

info "Running basic tests..."
if forge test > /tmp/forge-test.log 2>&1; then
  success "Foundry tests passed"
else
  error "Foundry tests failed. Check /tmp/forge-test.log"
  tail -n 15 /tmp/forge-test.log
  exit 1
fi
echo ""

# ---------- 3. Frontend Environment Setup ----------
header "3. FRONTEND ENVIRONMENT SETUP"
cd "$ROOT_DIR/apps/web"

if [ ! -f ".env.local" ]; then
  info "Configuring .env.local..."
  
  echo -e "${YELLOW}Wait! To use WalletConnect, you need a Project ID.${NC}"
  echo -e "Register for free at ${CYAN}https://cloud.walletconnect.com${NC}"
  echo -ne "${BOLD}Enter your WalletConnect Project ID (or press Enter to use placeholder): ${NC}"
  read -r WC_ID
  
  if [ -z "$WC_ID" ]; then
    WC_ID="your_project_id_here"
    warn "Using placeholder ID. Don't forget to update it later!"
  fi

  cat > .env.local <<EOF
# Celo RPC (Mainnet)
CELO_RPC_URL=https://forno.celo.org

# WalletConnect Configuration
# Minipay template uses NEXT_PUBLIC_WC_PROJECT_ID
NEXT_PUBLIC_WC_PROJECT_ID=$WC_ID
EOF
  success ".env.local created"
else
  success ".env.local already exists, skipping creation"
  if grep -q "your_project_id_here" .env.local; then
    warn ".env.local still contains placeholder Project ID!"
  fi
fi
echo ""

# ---------- 4. Install Dependencies ----------
header "4. INSTALLING DEPENDENCIES"
cd "$ROOT_DIR"
info "Running pnpm install (this may take a minute)..."
pnpm install
success "All dependencies installed"
echo ""

# ---------- 5. Conclusion ----------
header "SETUP COMPLETE!"
echo -e "${GREEN}${BOLD}SplitPay is ready for development!${NC}"
echo ""
echo -e "${BOLD}Next Steps:${NC}"
echo -e "  1. Start the development server:"
echo -e "     ${CYAN}pnpm dev${NC}"
echo ""
echo -e "  2. Open the app in your browser:"
echo -e "     ${CYAN}http://localhost:3000${NC}"
echo ""
echo -e "  3. Deployment & Testing:"
echo -e "     - Contracts: ${CYAN}cd apps/contracts && forge test${NC}"
echo -e "     - Frontend:  ${CYAN}cd apps/web && pnpm build${NC}"
echo ""
echo -e "${YELLOW}Happy Coding! 🚀${NC}"
echo ""
