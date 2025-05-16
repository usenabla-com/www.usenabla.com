---
title: Creating MLS Clients
description: Learn how to create and configure MLS clients in your application
---

# Creating MLS Clients

MLS clients are the core components that handle encryption, decryption, and key management for MLS-based secure communication. This guide explains how to create and configure MLS clients using Hermetic MLS.

## Basic Client Creation

A basic MLS client can be created with minimal configuration:

```javascript
import { Client } from '@hermeticlab/mls';

// Create a client with default options
const client = new Client();

// Create a client with a specific identity
const identityClient = new Client({
  identity: 'alice@example.com'
});
```

## Client Configuration Options

The `Client` constructor accepts several configuration options:

```javascript
const client = new Client({
  // Identity for this client (usually a user identifier)
  identity: 'alice@example.com',
  
  // Cryptographic suite to use (defaults to MLS standard suite)
  cryptoSuite: 'MLS_128_DHKEMX25519_AES128GCM_SHA256_Ed25519',
  
  // Custom key store implementation
  keyStore: new CustomKeyStore(),
  
  // Credential type
  credentialType: 'basic',
  
  // Random number generator (defaults to platform secure RNG)
  randomGenerator: customRandomGenerator
});
```

## Client Identity and Credentials

Each MLS client needs a unique identity, which is typically a user identifier like an email address or username. The identity is associated with credentials that provide authentication within the MLS protocol:

```javascript
// Create a client with basic credentials
const basicClient = new Client({
  identity: 'alice@example.com',
  credentialType: 'basic'
});

// Create a client with X.509 certificate credentials
const x509Client = new Client({
  identity: 'bob@example.com',
  credentialType: 'x509',
  certificate: myCertificate,
  privateKey: myPrivateKey
});
```

## Client Lifecycle

MLS clients have a lifecycle that you should manage in your application:

```javascript
// Initialize the client (generates necessary keys)
await client.initialize();

// Use the client for MLS operations
// ...

// When done, properly close the client to clean up resources
await client.close();
```

## Client Events

Clients emit events that you can listen to for various operations:

```javascript
client.on('keyPackageCreated', (keyPackage) => {
  console.log('New key package created:', keyPackage.id);
});

client.on('groupJoined', (groupId) => {
  console.log('Joined group:', groupId);
});

client.on('messageReceived', (message, groupId) => {
  console.log(`Received message in group ${groupId}`);
});
```

## Client Security Considerations

When creating MLS clients, consider these security best practices:

1. **Secure Storage**: Use a secure keystore for persisting sensitive cryptographic material
2. **Identity Verification**: Implement proper identity verification mechanisms
3. **Key Rotation**: Regularly rotate client keys using the key schedule
4. **Secure Randomness**: Ensure your application has access to a secure random number generator

## Next Steps

After creating a client, you'll typically want to:

1. [Create Key Packages](/hermetic-mls/creating-key-packages/) for joining groups
2. Join or create MLS groups
3. Send and receive encrypted messages within groups

For more advanced client configurations, refer to our API documentation or check out the examples in our GitHub repository. 