---
title: "Nabla October Changelog"
summary: "Self-service trial keys ⚙️, templates being cooked 🧑‍🍳, and /v1/firmware endpoints"
author: "Admin"
published: "2025-10-15"
image: "/october.png"
tags: ["Startups", "Governance", "Compliance", "FedRamp", "Risk"]
---

# 🧩 Nabla October Changelog

### ⚙️ Self-Service Provisioning

Trial provisioning is now **fully self-serve** — no human in the loop.  
Generate your own API key, start scanning, and integrate Nabla into your build or compliance pipeline instantly.  

This forms the foundation of the trial for our Relay and Fabric plans, designed for teams who want to instrument evidence automation programmatically.

---

### 🧠 Firmware Intelligence Endpoints

The new [`/v1/firmware`](https://api.usenabla.com/docs#/firmware) endpoint supports **automatic Binary Composition Analysis (BCA)** for ELF, PE, Mach-O, and raw binary images.  

Each upload can produce:

- A **CycloneDX 1.6 SBOM**
- A **SARIF vulnerability summary**
- A **control-aligned OSCAL artifact**

This makes **hardware compliance and IoT evidence generation** fully automatable.  

> 💡 **Pro tip:** Add `include_diagram=true` to your request to generate call-graph and binary feature diagrams automatically.

---

### 🧑‍🍳 Templates Being Cooked

We’re assembling reproducible **evidence templates** to show how Nabla operates across **FedRAMP**, **CMMC**, and **FDA Premarket** workflows — from IaC scanning to continuous monitoring.

#### Example Recipes

```text
aws_foundation.tfstate → FedRAMP Moderate OSCAL component
firmware.bin           → NIST 800-193 results + CFG diagram
Azure Connection       → Architecture Boundary Diagram