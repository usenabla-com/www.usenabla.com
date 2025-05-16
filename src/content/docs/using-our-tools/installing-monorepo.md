---
title: Installing from the Monorepo
description: Guide to setting up our tools from the GitHub monorepo
---

# Installing from the Monorepo

Hermetic Lab maintains a monorepo containing all our open source projects. This guide will help you set up your development environment to work with our tools.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or later)
- **Yarn** or **npm** (we use Yarn in our examples)
- **Git**
- **Rust** (for some components)
- **Docker** (optional, for containerized development)

## Cloning the Repository

```bash
# Clone the repository
git clone https://github.com/hermeticlab/hermetic-tools.git

# Navigate to the cloned directory
cd hermetic-tools
```

## Installing Dependencies

Our monorepo uses Yarn workspaces to manage dependencies across multiple packages:

```bash
# Install all dependencies
yarn install
```

This will install dependencies for all packages in the monorepo.

## Building the Projects

To build all projects in the monorepo:

```bash
# Build all packages
yarn build
```

To build a specific package:

```bash
# Build just the MLS package
yarn workspace @hermeticlab/mls build
```

## Running Tests

We have comprehensive test suites for all our packages:

```bash
# Run all tests
yarn test

# Run tests for a specific package
yarn workspace @hermeticlab/mls test
```

## Project Structure

Our monorepo is organized into the following main directories:

- `/packages`: Contains our core libraries
  - `/packages/mls`: Hermetic MLS implementation
  - `/packages/fhe`: Hermetic FHE implementation (coming soon)
  - `/packages/common`: Shared utilities used across projects
- `/examples`: Example applications demonstrating usage of our libraries
- `/tools`: Development and build tools
- `/docs`: Documentation source files

## Available Scripts

- `yarn build`: Build all packages
- `yarn test`: Run tests for all packages
- `yarn lint`: Run linting across all code
- `yarn clean`: Clean build artifacts
- `yarn dev`: Start development mode for all packages

## Next Steps

Now that you have the monorepo set up, you can start working with specific packages:

- [Hermetic MLS](/hermetic-mls/installing/)
- [Hermetic FHE](/hermetic-fhe/coming-soon/) (coming soon)
- [Hermetic Cloud](/hermetic-cloud/openapi/)

For package-specific documentation, refer to the README files in each package directory or the dedicated sections in these docs. 