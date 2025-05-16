---
title: Installing Hermetic MLS
description: Get started with Hermetic MLS in your projects
---

# Installing Hermetic MLS

Hermetic MLS provides a developer-friendly implementation of the Messaging Layer Security (MLS) protocol for secure group messaging. This guide will help you install and set up Hermetic MLS in your project.

## Installation Options

Hermetic MLS is available as:

1. An NPM package for JavaScript/TypeScript applications
2. A Rust crate for Rust applications
3. WebAssembly bindings for browser applications

## JavaScript/TypeScript Installation

```bash
# Using npm
npm install @hermeticlab/mls

# Using yarn
yarn add @hermeticlab/mls

# Using pnpm
pnpm add @hermeticlab/mls
```

## Rust Installation

Add the following to your `Cargo.toml`:

```toml
[dependencies]
hermetic-mls = "0.1.0"
```

## WebAssembly Installation

For browser applications, you can include our WebAssembly build:

```bash
# Using npm
npm install @hermeticlab/mls-wasm

# Using yarn
yarn add @hermeticlab/mls-wasm
```

Then import it in your application:

```javascript
import initMLS from '@hermeticlab/mls-wasm';

async function setup() {
  const mls = await initMLS();
  // Now you can use MLS functionality
}
```

## Verifying Installation

To verify that Hermetic MLS has been installed correctly, you can run a simple test:

```javascript
import { Client } from '@hermeticlab/mls';

// Create a basic client
const client = new Client();
console.log(`MLS Client created with ID: ${client.id}`);
```

## Dependencies

Hermetic MLS has the following dependencies:

- For cryptographic operations: We use platform-native cryptographic libraries where available, with fallbacks for environments without native support.
- For serialization: Protocol Buffers or a similar binary format for efficient message encoding.

## Next Steps

Now that you have Hermetic MLS installed, you can:

1. [Create MLS Clients](/hermetic-mls/creating-clients/) for your application
2. [Create Key Packages](/hermetic-mls/creating-key-packages/) for group membership
3. Set up [Persistence](/hermetic-mls/persistence/) for long-lived sessions

## Troubleshooting

If you encounter issues during installation:

- Ensure your development environment meets the minimum requirements
- Check that all dependencies are correctly installed
- Verify that you're using a compatible version for your platform

For platform-specific issues, refer to our GitHub repository for the latest known issues and workarounds. 