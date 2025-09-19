---
title: "Nabla 1.2.0 Release Notes: "
summary: "Major CLI refresh with subscription-gated auth, richer scan options, SBOM from sources/dirs, and multi-framework assessments powered by a policy engine."
author: "Admin"
published: "2025-09-06"
image: "https://ipkeys.com/wp-content/uploads/2023/10/iStock-1456739978.jpg"
tags: ["Startups", "Governance", "Compliance", "Firmware", "Risk"]
---

**Highlights**
- New GitHub Device Flow authentication with organization selection and subscription checks.
- Revamped `scan` command: SARIF 2.1.0 output, CI gating via `--fail-on`, optional Markdown summaries, redaction, and filtering.
- SBOM generation now supports directories and source archives (zip/tar/tgz), deterministic CycloneDX 1.6 output, and basic license detection.
- Compliance assessments improved with a policy engine and multi-framework mapping (GSMA, ETSI EN 303 645, FIPS 140-3, FDA Premarket, NIST 800-193, NIST 800-53 Rev. 5).
- New config system merging user/workspace YAML and env vars; `nabla init` bootstraps `.nabla/config.yaml`.

**Breaking Changes**
- Authentication and an active subscription are required for most commands. `nabla auth <...>` remains available without auth.
- The `hardware` live‑boot evaluation command has been removed. Planned future replacements will be announced separately.
- CLI flags and subcommands have been reorganized. See “CLI Changes” and README for updated usage.

**CLI Changes**
- `scan` (new/expanded)
  - Flags: `--file`, `--output <sarif|json>`, `--summary markdown`, `--summary-out <path>`, `--fail-on <none|note|warning|error>`, `--min-level <note|warning|error>`, `--exclude-heuristics`, `--redact-paths`, `--include-host-info`, `--strings-limit <n>`, `--timeout-ms <n>`.
  - Emits SARIF 2.1.0 with fingerprints, CWE taxonomy, artifact hashes (sha-256, blake3), and optional Markdown summary.
  - CI gating: process exits non‑zero when highest finding ≥ `--fail-on`.
- `sbom`
  - `--from <dir|archive|file>` generates a CycloneDX 1.6 SBOM deterministically from directories or source archives; falls back to single binary.
  - Stable `bom-ref` and purl enrichment; optional upstream license detection for VCS sources.
- `assess`
  - `--framework <gsma-iot|etsi-en-303-645|fips-140-3|fda-premarket|nist-800-193|nist-800-53-rev5|all>` maps static evidence to framework controls.
  - Outputs concise JSON for CI/audit pipelines.
- `auth`
  - `login` launches GitHub Device Flow, lets you pick an organization, persists session to `~/.nabla/session.json` (24h), and validates subscription.
  - `status` shows user/org and subscription status; `logout` clears session.

**Configuration**
- New layered config: CLI flags > explicit `--config` > workspace `./.nabla/config.yaml` > user `~/.config/nabla/config.yaml` (or `~/.nabla/config.yaml`) > env vars.
- `nabla init` creates `.nabla/config.yaml` with sensible defaults.
- Env overrides include: `NABLA_MIN_LEVEL`, `NABLA_FAIL_ON`, `NABLA_SUMMARY`, `NABLA_SUMMARY_OUT`, `NABLA_REDACT_PATHS`, `NABLA_INCLUDE_HOST_INFO`, `NABLA_INCLUDE_HEURISTICS`, `NABLA_STRINGS_LIMIT`, `NABLA_ANALYSIS_TIMEOUT_MS`, `NABLA_POLICY_PATH`, `NABLA_RULEPACK_VERSION`, `NABLA_OUTPUT_PATH`, `NABLA_API_BASE_URL`.

**Engine & Analysis**
- Analyzer
  - Expanded binary analysis with improved architecture/format detection, artifact hashing (sha-256, blake3), and technology inference.
  - ESP‑IDF firmware heuristics: partition table scanning and app descriptor parsing (project/version/IDF version).
  - Ingestion pipeline for directories and SBOMs with support for common manifests (npm, Cargo, Python, Maven/Composer), PlatformIO, ESP‑IDF components, Zephyr west, and simple CMake parsing.
- Rules Engine
  - Embedded Rhai policies for scan findings and assessments, overridable via `policies/scan.rhai` and `policies/assess.rhai`.
  - Findings enriched with remediation hints, optional validation steps, and evidence tiers (observed/inferred/heuristic).

**SBOM Improvements**
- CycloneDX 1.6 with deterministic ordering, stable BOM references, and dependency graph.
- Generates from a directory or source archive (auto‑extract) with optional upstream license heuristics.
- Root component metadata includes purl, version fallback from hashes, and VCS external references when applicable.

**Security & Auth**
- GitHub Device Flow OIDC, session storage at `~/.nabla/session.json`, organization selection.
- Subscription API integration with friendly prompts and usage hooks.
- Sensitive path redaction and host info opt‑in in SARIF invocation metadata.

**Fixes & Chores**
- General cleanup, README overhaul, and removal of obsolete prompts/scripts and the Cloudflare worker `node_modules` directory.
- Minor formatting fixes and code modernization across crates.

**Upgrade Notes**
- Ensure you can authenticate: `nabla auth login` (select your org). Most commands require an active subscription.
- Replace any legacy `hardware` flows with offline scanning (`scan`) or assessments (`assess`).
- Create and tune `.nabla/config.yaml` via `nabla init`, then adjust CI with `--fail-on` and `--min-level`.
- Regenerate SARIF/Markdown artifacts in CI: `nabla scan --file <artifact> --output results/scan.sarif --summary markdown --fail-on warning`.

**Changelog Scope**
- Compared to tag `v1.1.0`, this release adds major CLI features, engine ingestion and firmware heuristics, policy‑driven findings/assessments, and subscription‑gated authentication. See `git log v1.1.0..v1.2.0` for full commit history.

**Thanks**
- Thanks to everyone testing early builds and providing feedback on SBOM and assessment outputs. Your input directly shaped the new config, policies, and CLI ergonomics.

