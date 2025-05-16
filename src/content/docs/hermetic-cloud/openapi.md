---
title: Hermetic Cloud API
description: OpenAPI specification for Hermetic Cloud services
---

# Hermetic Cloud API

Hermetic Cloud provides hosted infrastructure and API endpoints for our cryptographic services. This page will contain the OpenAPI specification for interacting with Hermetic Cloud.

## API Overview

Hermetic Cloud offers RESTful API endpoints for:

- MLS group management
- Key package repository services
- Authentication and authorization
- FHE computation services (coming soon)
- Metrics and monitoring

## Authentication

All API requests require authentication using one of the following methods:

- API keys (for server-to-server communication)
- OAuth2 (for user-authenticated requests)
- JWT tokens (for session management)

## API Endpoints

The full OpenAPI specification will be integrated here, providing detailed documentation for all available endpoints, request/response formats, and examples.

### Core Endpoints

Some of the core endpoints include:

- `/v1/mls/groups` - MLS group management
- `/v1/mls/key-packages` - Key package repository
- `/v1/auth` - Authentication services
- `/v1/admin` - Administration APIs

## Rate Limiting

API requests are subject to rate limiting based on your service tier. Rate limit information is included in response headers:

- `X-RateLimit-Limit`: The maximum number of requests allowed in a time window
- `X-RateLimit-Remaining`: The number of requests remaining in the current window
- `X-RateLimit-Reset`: The time when the current rate limit window resets

## Error Handling

Errors are returned with appropriate HTTP status codes and include a JSON body with:

- `error`: Error code
- `message`: Human-readable description
- `details`: Additional error details when available

## Client Libraries

We provide client libraries for interacting with the Hermetic Cloud API in several languages:

- JavaScript/TypeScript
- Python
- Rust
- Go
- Java

## Testing and Sandbox Environment

A sandbox environment is available for testing your integration:

```
https://sandbox-api.hermeticlab.com/v1/
```

## Coming Soon

The complete OpenAPI specification will be integrated into this page, providing interactive documentation for exploring and testing the Hermetic Cloud API. 