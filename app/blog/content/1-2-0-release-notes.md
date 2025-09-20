---
title: "Nabla 1.2.0 Release Notes"
summary: "A major CLI refresh introducing subscription-gated authentication, expanded scan options, directory/source-based SBOM generation, and multi-framework compliance assessments powered by the new policy engine."
author: "Admin"
published: "2025-09-19"
image: "https://ipkeys.com/wp-content/uploads/2023/10/iStock-1456739978.jpg"
tags: ["Startups", "Governance", "Compliance", "Firmware", "Risk"]
---

## 🚀 Highlights

- **Authentication & Subscriptions**: GitHub Device Flow with org selection and subscription checks.  
- **Revamped Scanning**: SARIF 2.1.0 output, CI gating with `--fail-on`, Markdown summaries, filtering, and redaction.  
- **SBOM Generation**: Deterministic CycloneDX 1.6 output from directories or source archives (zip/tar/tgz), with license detection.  
- **Policy-Driven Assessments**: Evidence mapped to multiple frameworks (GSMA, ETSI EN 303 645, FIPS 140-3, FDA Premarket, NIST 800-193, NIST 800-53 Rev. 5).  
- **Configuration System**: Layered YAML/env var support; `nabla init` bootstraps `.nabla/config.yaml`.

---

## ⚠️ Breaking Changes
- Most commands now require authentication **and an active subscription**.  
- The legacy `hardware` live-boot command has been **removed** (replacement planned).  
- Several CLI flags/subcommands have been reorganized—see [CLI Changes](#-cli-changes) and the updated README.

---


## 🖥️ CLI Changes

### `scan`
- **Flags:**  
  `--file`, `--output <sarif|json>`, `--summary markdown`,  
  `--summary-out <path>`, `--fail-on <none|note|warning|error>`,  
  `--min-level <note|warning|error>`, `--exclude-heuristics`,  
  `--redact-paths`, `--include-host-info`,  
  `--strings-limit <n>`, `--timeout-ms <n>`.  
- **Features:**  
  - Emits SARIF 2.1.0 with fingerprints, CWE taxonomy, and artifact hashes (`sha-256`, `blake3`).  
  - Optional Markdown summary generation.  
  - CI gating: non-zero exit when findings ≥ chosen `--fail-on` level.  

### `sbom`
- `--from <dir|archive|file>` generates a deterministic CycloneDX 1.6 SBOM.  
- Supports directories and archives (zip/tar/tgz) with stable `bom-ref` and purl enrichment.  
- Optional license detection from VCS sources.  

### `assess`
- `--framework <gsma-iot|etsi-en-303-645|fips-140-3|fda-premarket|nist-800-193|nist-800-53-rev5|all>`  
- Maps evidence to multiple frameworks, outputs concise JSON for CI/audit pipelines.  

### `auth`
- **`login`**: GitHub Device Flow with org selection, persisted session (`~/.nabla/session.json`, 24h).  
- **`status`**: Displays current user/org and subscription state.  
- **`logout`**: Clears session.  

---

## ⚙️ Configuration
- **Priority order:** CLI flags → `--config` → workspace `./.nabla/config.yaml` → user config (`~/.config/nabla/config.yaml` or `~/.nabla/config.yaml`) → environment variables.  
- **Bootstrap:** `nabla init` generates `.nabla/config.yaml` with defaults.  
- **Key env vars:**  
  `NABLA_MIN_LEVEL`, `NABLA_FAIL_ON`, `NABLA_SUMMARY`, `NABLA_SUMMARY_OUT`,  
  `NABLA_REDACT_PATHS`, `NABLA_INCLUDE_HOST_INFO`,  
  `NABLA_INCLUDE_HEURISTICS`, `NABLA_STRINGS_LIMIT`,  
  `NABLA_ANALYSIS_TIMEOUT_MS`, `NABLA_POLICY_PATH`,  
  `NABLA_RULEPACK_VERSION`, `NABLA_OUTPUT_PATH`, `NABLA_API_BASE_URL`.  

---

## 🔍 Engine & Analysis

**Analyzer**  
- Enhanced binary analysis: improved format/architecture detection, hashing (`sha-256`, `blake3`), and technology inference.  
- ESP-IDF heuristics: partition table scan + app descriptor parsing (project, version, IDF version).  
- Broader ingestion: SBOMs, directories, npm, Cargo, Python, Maven/Composer, PlatformIO, ESP-IDF, Zephyr west, CMake.  

**Rules Engine**  
- Embedded [Rhai](https://rhai.rs) policies for findings and assessments.  
- Overridable via `policies/scan.rhai` and `policies/assess.rhai`.  
- Enriched findings: remediation hints, validation steps, evidence tiers (observed / inferred / heuristic).  

---

## 📦 SBOM Improvements
- Deterministic CycloneDX 1.6 with dependency graphs and stable refs.  
- Auto-extracts from directories/archives with upstream license heuristics.  
- Root metadata enriched with purl, version fallbacks, and VCS references.  

---

## 🔐 Security & Auth
- GitHub Device Flow OIDC with org selection.  
- Sessions stored in `~/.nabla/session.json` (24h).  
- Subscription checks integrated into workflows.  
- Sensitive paths redacted; host info opt-in for SARIF metadata.  

---

## 🛠️ Fixes & Chores
- Cleaned up legacy scripts/prompts.  
- Removed obsolete Cloudflare worker `node_modules`.  
- General modernization across crates.  
- README fully overhauled.  

---

## 📋 Upgrade Notes
1. Authenticate: `nabla auth login` → select org.  
2. Replace `hardware` workflows with `scan`/`assess`.  
3. Run `nabla init` to generate `.nabla/config.yaml`, then tune CI with `--fail-on` and `--min-level`.  
4. Update CI pipelines to regenerate SARIF/Markdown:  
   ```bash
   nabla scan --file <artifact> --output results/scan.sarif --summary markdown --fail-on warning

---

## 📜 Changelog Scope

Relative to v1.1.0:

- Major CLI features.
- Expanded (And deterministic) ingestion & firmware heuristics.
- Policy-driven findings/assessments.
- Subscription-gated authentication.

For full history:

```
git log v1.1.0..v1.2.0
```

---

## 🙏 Thanks

Special thanks to early testers for feedback on SBOMs and assessment outputs—your input shaped the new config system, policies, and CLI ergonomics.x