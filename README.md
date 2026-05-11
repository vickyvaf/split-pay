# Split Pay

Split bills instantly with friends.

A modern Celo blockchain application built with Next.js, TypeScript, and Turborepo.

## 🚀 Quick Start

The easiest way to get started is by running the setup script:

```bash
./setup.sh
```

This script will:
- Check for prerequisites (Node.js, pnpm, Foundry)
- Setup smart contract dependencies and remappings
- Run contract tests
- Configure initial environment variables
- Install all project dependencies

## 🛠️ Getting Started (Manual)

If you prefer manual setup:

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Configure environment**:
   Create `apps/web/.env.local` based on the requirements:
   ```env
   NEXT_PUBLIC_WC_PROJECT_ID=your_project_id_here
   CELO_RPC_URL=https://forno.celo.org
   ```

3. **Start the development server**:
   ```bash
   pnpm dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## 📂 Project Structure

This is a monorepo managed by Turborepo:

- `apps/web`: Next.js 16 application with React 19.
- `apps/contracts`: Foundry-based smart contracts (Solidity).

## 📜 Available Scripts

- `pnpm dev`: Start development servers for all apps.
- `pnpm build`: Build all packages and apps.
- `pnpm lint`: Lint all packages and apps.
- `pnpm type-check`: Run TypeScript type checking.

## 🧱 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI/UX**: [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Blockchain**: [Celo](https://celo.org/), [Wagmi](https://wagmi.sh/), [Viem](https://viem.sh/), [RainbowKit](https://www.rainbowkit.com/)
- **Contracts**: [Foundry](https://book.getfoundry.sh/)
- **Monorepo**: [Turborepo](https://turbo.build/repo)
- **Package Manager**: [PNPM](https://pnpm.io/)

## 📄 Learn More

- [Celo Documentation](https://docs.celo.org/)
- [Foundry Book](https://book.getfoundry.sh/)
- [Next.js Documentation](https://nextjs.org/docs)
