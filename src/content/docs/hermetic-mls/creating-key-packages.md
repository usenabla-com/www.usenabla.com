---
title: Creating Key Packages
description: Learn how to create and manage MLS key packages
---

# Creating Key Packages

Key packages are essential components in the MLS protocol that enable users to join groups. They contain the necessary cryptographic material for adding a client to an MLS group. This guide explains how to create and manage key packages with Hermetic MLS.

## What are Key Packages?

In MLS, key packages contain:

- The client's identity and credentials
- A signed encryption key that will be used in the group's key schedule
- Additional information needed for the client to join a group

Key packages are typically published to a directory service where they can be retrieved by group administrators or other members to add new participants to a group.

## Creating Basic Key Packages

To create a basic key package:

```javascript
import { Client } from '@hermeticlab/mls';

const client = new Client({
  identity: 'alice@example.com'
});

// Initialize the client
await client.initialize();

// Generate a key package
const keyPackage = await client.createKeyPackage();

console.log(`Key package created with ID: ${keyPackage.id}`);
```

## Key Package Configuration

When creating key packages, you can specify additional configurations:

```javascript
const keyPackage = await client.createKeyPackage({
  // Lifetime of the key package in seconds (default: 7 days)
  lifetime: 60 * 60 * 24 * 7,
  
  // Additional extensions to include in the key package
  extensions: [
    {
      type: 'external_senders',
      value: true
    },
    {
      type: 'capabilities',
      value: {
        versions: [1],
        ciphersuites: ['MLS_128_DHKEMX25519_AES128GCM_SHA256_Ed25519']
      }
    }
  ]
});
```

## Managing Key Package Lifecycle

Key packages have a limited lifetime and should be refreshed periodically:

```javascript
// Check if a key package is still valid
const isValid = client.isKeyPackageValid(keyPackage.id);

// Get all valid key packages for this client
const validPackages = await client.getValidKeyPackages();

// Refresh expiring key packages
await client.refreshExpiringKeyPackages();
```

## Exporting and Publishing Key Packages

After creating key packages, they need to be exported and published to a directory service:

```javascript
// Export a key package to bytes for transmission
const keyPackageBytes = await keyPackage.export();

// Publish to your key package directory service
await directoryService.publishKeyPackage(
  client.identity,
  keyPackageBytes
);
```

## Retrieving and Importing Key Packages

To add someone to a group, you would retrieve their key package:

```javascript
// Retrieve a key package from your directory service
const bobKeyPackageBytes = await directoryService.getKeyPackage('bob@example.com');

// Import the key package
const bobKeyPackage = await client.importKeyPackage(bobKeyPackageBytes);

// Now you can use this key package to add Bob to a group
await group.addMember(bobKeyPackage);
```

## Key Package Security Considerations

When working with key packages, consider these security practices:

1. **Regular Rotation**: Generate new key packages regularly to limit the impact of key compromise
2. **Verification**: Verify that key packages come from trusted sources
3. **Timely Expiry**: Set appropriate expiration times for key packages
4. **Secure Distribution**: Ensure secure transmission of key packages

## Next Steps

After creating key packages, you can:

1. Use them to join MLS groups
2. Add other members to groups using their key packages
3. Set up [persistence](/hermetic-mls/persistence/) for long-lived sessions

For more details on key package extensions and advanced configurations, refer to our API documentation. 