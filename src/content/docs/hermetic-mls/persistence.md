---
title: MLS Persistence
description: Learn how to implement persistence for MLS clients and groups
---

# MLS Persistence

MLS clients and groups need to persist their state across application restarts. This guide explains how to implement persistence with Hermetic MLS.

## Why Persistence is Important

MLS operates on a continuous key schedule that evolves as members join, leave, or update their keys. Without proper persistence:

- Clients would lose access to their encrypted conversations
- Group state would be lost, requiring recreation of groups
- Historical messages would become undecryptable

## Basic Persistence

Hermetic MLS provides a simple persistence API that allows you to save and restore client and group state:

```javascript
import { Client, PersistenceManager } from '@hermeticlab/mls';

// Create a client
const client = new Client({
  identity: 'alice@example.com'
});

// Initialize the client
await client.initialize();

// Create a persistence manager with default storage
const persistence = new PersistenceManager();

// Save client state
await persistence.saveClientState(client);

// Later, restore the client state
const restoredClient = await persistence.loadClientState('alice@example.com');
```

## Custom Storage Backends

You can implement custom storage backends by creating a class that implements the `StorageBackend` interface:

```javascript
import { StorageBackend } from '@hermeticlab/mls';

class MyCustomStorage implements StorageBackend {
  async save(key, data) {
    // Save data to your storage system
    await myDatabase.set(key, data);
  }
  
  async load(key) {
    // Load data from your storage system
    return await myDatabase.get(key);
  }
  
  async delete(key) {
    // Delete data from your storage system
    await myDatabase.delete(key);
  }
  
  async list(prefix) {
    // List all keys with the given prefix
    return await myDatabase.keys(prefix);
  }
}

// Use the custom storage
const persistence = new PersistenceManager({
  backend: new MyCustomStorage()
});
```

## Persisting Group State

Group state persistence works similarly to client persistence:

```javascript
// Create or join a group
const group = await client.createGroup('My Secure Group');

// Save group state
await persistence.saveGroupState(group);

// Later, restore the group state
const restoredGroup = await persistence.loadGroupState(client, groupId);
```

## Persistence with Encryption

For additional security, you can encrypt the persisted data:

```javascript
const persistence = new PersistenceManager({
  encryption: {
    // Key derivation function to use
    kdf: 'HKDF-SHA256',
    
    // Master key (should be securely stored elsewhere)
    masterKey: securelyStoredMasterKey,
    
    // Salt for key derivation
    salt: randomSalt
  }
});
```

## Automatic Persistence

You can enable automatic persistence to keep state synchronized:

```javascript
const client = new Client({
  identity: 'alice@example.com',
  persistence: {
    enabled: true,
    manager: persistenceManager,
    autoSave: true,
    saveInterval: 60 * 1000 // save every minute
  }
});
```

## Migration Between Devices

Persistence is also useful for migrating MLS state between devices:

```javascript
// On device 1: Export the client state
const exportedState = await client.exportState({
  includeGroups: true,
  encryptionKey: userPassphraseKey
});

// On device 2: Import the client state
const newClient = await Client.importState(
  exportedState,
  { encryptionKey: userPassphraseKey }
);
```

## Backup and Recovery

Regular backups of the persistent state are recommended:

```javascript
// Create a backup of all client data
const backup = await persistence.createBackup(client);

// Later, restore from backup
await persistence.restoreFromBackup(backup);
```

## Security Considerations

When implementing persistence:

1. **Encrypt Stored Data**: Always encrypt sensitive cryptographic material
2. **Secure Key Management**: Properly manage encryption keys for the stored data
3. **Access Control**: Implement proper access controls for the stored data
4. **Backup Security**: Ensure backups are also encrypted and protected

## Next Steps

With persistence properly implemented, your MLS application can maintain secure communication across sessions and devices. Consider exploring:

- Advanced group management features
- Message encryption and decryption
- Implementing a secure transport layer for MLS messages

For more details on persistence options and advanced configurations, refer to our API documentation. 