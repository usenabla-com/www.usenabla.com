---
title: "Worried about CISA ED 26-01? We have a scanner for that"
summary: "Announcing our new F5 BIG-IP scanner for CISA ED 26-01 compliance. With Mermaid reachability diagrams and no LLMs"
author: "Admin"
published: "2025-10-17"
image: "https://images.axios.com/dwRXG8By3INLtYE_8ynqUVOYI34=/0x0:5000x2813/1920x1080/2025/10/15/1760544444881.jpeg?w=3840"
tags: ["Startups", "Governance", "Compliance", "FedRamp", "Risk"]
---

The Department of Homeland Security’s **CISA Emergency Directive 26-01** dropped like a thunderclap this week, mandating agencies to identify and report all instances of **F5 BIG-IP** products within their networks by **October 29th** (summary) and **December 3rd, 2025** (detailed inventory).

For many security and compliance teams, those dates are *tomorrow* in infrastructure time.

If you’re staring down those deadlines wondering how to discover F5 assets, extract version data, and produce a verifiable inventory **without babysitting spreadsheets or guessing from network logs**, Nabla has you covered.

## Introducing the Nabla ED 26-01 Scanner

We’re releasing a new **F5 BIG-IP detection and evidence module** purpose-built for **CISA ED 26-01 compliance**, available today after a short into call. 

The scanner dynamically:

- Assesses F5 BIG-IP appliances via provided `qkview` files
- Extracts **firmware version**, **module signatures**, and **SSL/TLS configuration evidence**
- Visualizes reachability and dependency paths as **Mermaid diagrams**, no LLMs or black-box inference required

A request usually looks like this:

```json
{
  "assets": [
    {"hostname":"bigip-a.agency.gov","mgmt_ip":"203.0.113.10","labels":["prod"]},
    {"hostname":"bigip-b.agency.gov","mgmt_ip":"10.0.10.20","labels":["internal"]}
  ],
  "inputs": {
    "qkview": {
      "kind": "presigned-url",
      "url": "https://customer-bucket/.../bigip-a.qkview?X-Amz-Expires=600"
    },
    "terraform_states": [
      {"kind":"presigned-url","url":"https://customer-bucket/.../bigip.tfstate?sig=..."}
    ]
  },
  "access": {
    "icontrol": [
      {
        "base_url":"https://bigip-a.mgmt",
        "token": "eyJhbGciOi...",            // <= short-lived (<=10 min)
        "scope": "read-only"
      }
    ]
  },
  "checks": {
    "inventory": true,
    "qkview_runtime": true,
    "internet_exposure": {"ports":[22,443,8443],"vantage_points":["us-east"]},
    "cve_mapping": true,
    "eos_check": true,
    "report_cisa": true
  },
  "output": {
    "deliver_to": "presigned-url",
    "url": "https://customer-bucket/.../result.json?X-Amz-Expires=600" // optional
  }
}
```

Each scan generates structured evidence compatible with FedRAMP, CMMC, and ED 26-01 reporting workflows, making it trivial to crosswalk between technical data and compliance deliverables.

## Why It Matters

Emergency directives like ED 26-01 aren’t just about compliance checkboxes they’re stress tests for visibility.

When CISA asks, “What’s running on your network?”, your answer can’t depend on tribal knowledge, Slack threads, or ticket archaeology. It has to come from data-driven, verifiable evidence that can stand up to scrutiny cryptographically signed, timestamped, and reproducible.

That’s exactly what Nabla’s Evidence Relay model was built for: to convert live system and binary telemetry into **machine-verifiable control mappings**, ready for auditors, 3PAOs, or agency reviewers.

## How It Works (In Plain English)

When you run a scan, Nabla uses the provided assets, qkview, and tools like TokioStream to assess vulnerability to the critical issues found in ED 26-01. Then maps evidence into an output response like this:

```json
{
  "summary": { "devices": 2, "exposed": 1, "needs_patch": 1, "eos_public": 0 },
  "findings": [...],
  "artifacts": {
    "qkview": [{"device":"bigip-a","sha256":"..."}],
    "terraform": [{"sha256":"..."}]
  },
  "attestation": {
    "algo": "RS256",
    "jws": "eyJhbGciOiJSUzI1NiIsInR5..."
  }
}
```

You can use this output to build your own reports, and attach them directly to your CISA summary template. 

## Deadlines Are Looming

- **October 29, 2025 (11:59 PM ET)**: Submit summary of affected products to CISA
- **December 3, 2025 (11:59 PM ET)**: Submit detailed inventory of all affected instances

If your agency or vendor environment touches F5 BIG-IP, you’ll want to generate your first scan before October 25th to allow time for validation and report packaging.

## Built for Evidence, Not AI Guesswork

We love AI, but when it comes to federal compliance, the bar is higher.
ED 26-01 reports must reflect verifiable system states, not inferred guesses.

That’s why our scanner operates entirely on deterministic analysis: parsing binaries, signatures, and configurations directly. Every artifact can be rechecked, hashed, and audited.

Evidence should be reproducible, not interpretive.

## Final Thoughts

Emergency directives like ED 26-01 highlight a growing truth: **Governance has to evolve at the speed of zero-days.**

At Nabla, we’re building the tooling that turns those panic moments into push-button workflows, connecting binary evidence, network posture, and compliance mapping into one seamless relay.

So if your inbox says “CISA ED 26-01” and your calendar says “two weeks,” you can say, “we have a scanner for that.” 

Reach out to start your ED 26-01 pilot.