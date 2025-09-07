---
title: "Bringing GRC to your firmware: The chaotic path to Nabla's LLM-driven binary analysis methods"
summary: "Our approach to GRC at Nabla didn't happen overnight, and we didn't start out building a GRC tool. Here's the story and takeaways"
author: "Admin"
published: "2025-09-06"
image: "https://ipkeys.com/wp-content/uploads/2023/10/iStock-1456739978.jpg"
tags: ["Startups", "Governance", "Compliance", "Firmware", "Risk"]
---

In 2025, we started a journey to build a general binary composition analysis tool and ended up with a focused GRC CLI that can generate schema-compliant OSCAL documents by using OSS tools to deconstruct firmware binaries, then feed them into an LLM for analysis using fully typed Rust structs, and then filtering out false positives before generating the OSCAL documents.

But this transformation didn't happen overnight, and it certainly wasn't planned from day one. Like many startups, we started with one vision and pivoted based on what we learned from our users and the market reality. The firmware security landscape is fragmented, complex, and desperately needs tooling that bridges the gap between deep technical analysis and the governance frameworks that organizations actually need to comply with.

The problem we initially set out to solve was simple: firmware analysis is hard, time-consuming, and requires specialized knowledge that most organizations don't have in-house. Traditional static analysis tools are either too generic (missing firmware-specific insights) or too specialized (requiring deep reverse engineering expertise). Meanwhile, compliance frameworks like NIST SP 800-193, ISO/SAE 21434, and others demand specific evidence and documentation that current tools simply don't provide in the right format.

We didn't start out with this approach, and this blog is going to dive into some of the unique approaches to programming we took to build this tool while ensuring resiliency and code cleanliness. More importantly, we'll share the lessons we learned about building a product that serves both the technical teams doing the analysis and the compliance teams who need to present results to auditors.

## The firmware security compliance gap

Before diving into our technical approach, it's worth understanding the landscape that led us here. Firmware security isn't just about finding vulnerabilities anymore – it's about proving compliance with an ever-growing list of regulatory frameworks. Whether you're building IoT devices for the EU market (ETSI EN 303 645), automotive systems (ISO/SAE 21434), or federal systems (NIST SP 800-193), you need more than just a list of CVEs.

You need auditable evidence that your firmware meets specific security controls. You need documentation that maps technical findings to regulatory requirements. And you need this process to be repeatable, because compliance isn't a one-time event – it's an ongoing requirement that evolves with every firmware update.

The tools that existed when we started fell into two camps: heavyweight enterprise solutions that cost hundreds of thousands of dollars and required months of deployment, or open-source tools that were powerful but required significant expertise to interpret results in a compliance context. There was nothing in the middle that could provide both technical depth and governance-ready output. 

## The foundations of binary analysis are hard

Getting the initial binary data extracted out of firmware is a complex task, and there's a lot that can be missed, but once you extract the data (and assuming decent type theory), you can do a lot with the analysis.

### The extraction challenge

Firmware binaries come in dozens of formats: raw binary images, Intel HEX files, ELF executables, compressed archives, encrypted blobs, and proprietary formats specific to different chipsets. Each format requires different extraction techniques, and many real-world firmware images combine multiple formats in nested structures.

The challenge isn't just parsing the format correctly – it's identifying what's actually meaningful for security analysis. A typical firmware image might contain:

- Boot loaders and initialization code
- Operating system kernels or real-time operating systems (RTOS)
- Behavioral patterns such as JTAG and UART enablement
- Application code and business logic
- Configuration data and certificates
- Library dependencies and third-party components
- Debug symbols and metadata
- Padding, alignment data, and unused space

Traditional tools like `strings`, `objdump`, and `file` can give you basic information, but they don't understand the context of what they're finding. A hardcoded password might look identical to a legitimate configuration value without deeper analysis.

### Our structured approach

This is what we figured out once we successfully extracted the binary contents such as strings and code sections from dummy vulnerable firmware such as [IoTGoat](https://github.com/OWASP/IoTGoat). By using efficient type theory, we have been able to repeatably extract the binary contents from multiple formats using a structured approach centered around this Rust struct:

```
#[derive(Debug, Serialize, Deserialize, Clone, Default, PartialEq)]
pub struct BinaryAnalysis {
    pub id: Uuid,
    pub file_name: String,
    pub format: String,
    pub architecture: String,
    pub languages: Vec<String>,
    pub detected_technologies: Vec<String>,
    pub detected_symbols: Vec<String>,
    pub embedded_strings: Vec<String>,
    pub suspected_secrets: Vec<String>,
    pub imports: Vec<String>,
    pub exports: Vec<String>,
    pub hash_sha256: String,
    pub hash_blake3: Option<String>,
    pub size_bytes: u64,
    pub linked_libraries: Vec<String>,
    pub static_linked: bool,
}
```

What's more exciting is that we did about 85% of this using Claude Code. And if you were to ask me what made this possible I would tell you without hesitation that having the fully built out type system in advance is what made the LLM spit out repeatable suggestions to us when we needed them.

### The power of structured extraction

Each field in our `BinaryAnalysis` struct serves a specific purpose in the security assessment process:

- **Architecture detection** helps identify platform-specific vulnerabilities and attack vectors
- **Language detection** informs us about potential vulnerability classes (buffer overflows in C, memory safety in Rust, etc.)
- **Technology detection** reveals frameworks, libraries, and components that may have known vulnerabilities
- **Symbol analysis** can reveal debugging information that shouldn't be in production builds
- **String extraction** often reveals hardcoded credentials, API keys, or configuration details
- **Import/export analysis** maps the attack surface and identifies external dependencies

The hash values (`sha256` and `blake3`) provide cryptographic integrity verification, which is crucial for compliance frameworks that require evidence of tamper-free analysis.

### Handling the long tail of formats

One of the biggest challenges we faced was the diversity of firmware formats in the wild. While standards like ELF and PE are common, many embedded systems use proprietary or semi-proprietary formats. Our approach had to be extensible enough to handle:

- **Custom bootloader formats** used by specific chip manufacturers
- **Compressed and encrypted firmware** that requires multiple extraction passes
- **Multi-stage firmware** with different components loaded at different boot phases
- **Hybrid formats** that combine multiple file types in a single image

To handle this, we built a plugin architecture around the `BinaryAnalysis` struct. Each format handler implements a common trait that populates the struct fields based on what it can extract from that specific format. This means we can add support for new formats without breaking existing analysis pipelines.

### Integration with existing tools

Rather than reinventing the wheel, we built Nabla to leverage the existing ecosystem of binary analysis tools. Under the hood, we orchestrate tools like:

- **Binwalk** for format identification and extraction
- **Radare2** for disassembly and analysis
- **YARA** for pattern matching and signature detection
- **OpenAI Compatible LLM Layer** for AI analysis, false positive filtering, and OSCAL report generation

The key innovation is how we structure and normalize the output from these tools. Instead of requiring analysts to manually correlate results from different tools, our Rust type system enforces consistency and completeness across all analysis methods.  

## Extraction without insights is useless

Our initial concept was to extract the analysis and let users do what they wanted to with them, but we realized that just extracting a bunch of strings is useless when there's still so much to be done with the analysis.

The problem with raw extraction data is context. Finding the string "admin123" in a firmware binary could mean:

- A hardcoded default password (critical security issue)
- A test fixture in debug code (low risk if properly isolated)
- Part of a user manual or help text (not a security issue)
- A red herring from compressed data (false positive)

Without understanding the context, even sophisticated pattern matching produces too many false positives to be useful for compliance reporting.

### Enter LLM-driven analysis

This is where our LLM integration becomes crucial. Instead of just dumping raw extraction results, we feed our structured `BinaryAnalysis` data into a language model specifically prompted for firmware security assessment. The LLM doesn't replace human judgment – it augments it by providing contextual analysis at scale.

Our LLM pipeline works in several stages:

1. **Initial classification**: The model categorizes findings by severity and type
2. **Context analysis**: Using the full binary context, it determines if suspicious patterns are actually security issues
3. **Compliance mapping**: It maps technical findings to specific regulatory controls
4. **Risk assessment**: It provides risk ratings based on the specific deployment context

The key to making this work reliably is the structured input. Because our data is strongly typed and validated, the LLM gets consistent, clean input that it can reason about effectively.

### Deterministic signals: The foundation of reliable analysis

While LLMs provide powerful contextual analysis, they're only as good as the deterministic signals they're built upon. Our approach combines traditional static analysis with LLM reasoning, but the LLM never operates in isolation – it's always grounded in concrete, verifiable technical evidence.

**Binary-level signals we extract:**
- **Entropy analysis**: High entropy regions often indicate compressed or encrypted data, while low entropy can reveal hardcoded patterns
- **Cross-reference validation**: We verify that suspicious strings appear in executable code sections, not just data segments
- **Import/export dependency mapping**: Actual function calls and library dependencies, not just string mentions
- **Memory layout analysis**: Understanding how data structures are organized in memory helps distinguish real vulnerabilities from false positives
- **Cryptographic constant detection**: Mathematical constants and algorithm signatures that indicate specific crypto implementations

**Behavioral pattern detection:**
- **JTAG and UART Detection**: Detecting patterns that show debugger module enablement
- **Privilege boundary analysis**: Identifying where code transitions between security contexts
- **Network protocol fingerprinting**: Detecting communication patterns and protocols

**Compliance-specific indicators:**
- **Debug artifact detection**: Specific patterns that indicate debug code left in production builds
- **Hardcoded credential patterns**: Regular expressions tuned for different credential types (API keys, passwords, certificates)
- **Insecure random number generation**: Detection of weak PRNG implementations
- **Certificate and key validation**: Cryptographic validation of embedded certificates and keys

The LLM uses these deterministic signals as evidence when making assessments. For example, if it identifies a potential hardcoded password, it doesn't just rely on pattern matching – it verifies:

1. The string appears in an executable code section (not comments or data)
2. The string is referenced by authentication-related functions (via cross-reference analysis)
3. The surrounding code context suggests credential usage (via control flow analysis)
4. The entropy and character distribution match typical password patterns

This multi-signal approach is what allows us to achieve our low false positive rate while maintaining high confidence in our findings.

### False positive filtering: The make-or-break feature

In our early implementation, we found that relying solely on the LLM for analysis created a large amount of false positive identifications, but also drummed up issues that we weren't finding with deterministic analysis. So we decided to combine the two approaches for a more reliable compliance automation experience.

Our false positive filtering uses a multi-layer approach:

**Layer 1: Pattern validation**
We validate that suspicious patterns actually appear in executable code sections, not just data or comments.

**Layer 2: Context analysis**
The LLM analyzes surrounding code to determine if a finding is actually exploitable.

**Layer 3: Cross-reference validation**
We cross-reference findings against known false positive patterns specific to different development frameworks and toolchains.

**Layer 4: Confidence scoring**
Each finding gets a confidence score based on multiple factors, allowing users to focus on high-confidence issues first.

This approach reduced our false positive rate to under 15% while maintaining a 95% true positive rate on our test suite of intentionally vulnerable firmware samples.

### The GRC pivot

With our deterministic signal foundation proving reliable, we started exploring how to make our analysis output more useful for compliance teams. The feedback we received consistently pointed to the same problem: technical vulnerability reports don't map cleanly to regulatory requirements.

A conversation with a close friend of the company who has extensive GRC engineering experience proved transformative. During our discussion about NIST frameworks and firmware auditing requirements, we realized we were solving the wrong problem. Organizations don't just need better vulnerability detection – they need vulnerability detection that speaks the language of compliance frameworks.

This insight fundamentally shifted our approach. Instead of building a general-purpose binary analysis tool that happened to find security issues, we pivoted to building a compliance-focused tool that uses binary analysis as the foundation for regulatory reporting.

The key realization was that technical teams and compliance teams operate in completely different worlds. Technical teams think in terms of CVEs, attack vectors, and code quality metrics. Compliance teams think in terms of controls, evidence packages, and audit readiness. Most security tools serve the technical side well but leave compliance teams to manually translate findings into regulatory language.

We saw an opportunity to bridge this gap through structured documentation that automatically maps technical findings to regulatory requirements. OSCAL (Open Security Controls Assessment Language) became the cornerstone of this approach, providing a standardized format that both technical and compliance teams could work with. Currently, we cover several controls in [NIST SP 800-193](https://csrc.nist.gov/pubs/sp/800/193/final), with plans to expand across multiple frameworks.

## We plan to develop a "supercatalog" for firmware controls

Our long-term roadmap involves a few things, but the key focus we want to address at the moment is the development of a firmware-focused supercatalog that covers various rules and controls from all of these frameworks:

### Current coverage:
- **NIST SP 800-193** (Partial): Platform firmware resiliency controls
- **ETSI EN 303 645** (Partial): IoT cybersecurity provisions

### Planned coverage:
- **ISO/SAE 21434**: Automotive cybersecurity engineering
- **UNECE WP.29 R155**: Cybersecurity and software update management
- **NISTIR 8259A/B**: IoT device cybersecurity capability core baseline
- **GSMA IoT Security Guidelines**: Mobile IoT security assessment
- **FIPS 140-3**: Cryptographic module validation
- **NIST SP 800-147/147B**: BIOS protection guidelines
- **NASA-STD-8739.x series**: Software safety and reliability standards
- **ECSS-Q-ST-80**: Space software product assurance

### The supercatalog vision

The supercatalog isn't just about adding more frameworks – it's about creating intelligent mappings between overlapping requirements. Many firmware security controls appear across multiple frameworks but with different terminology, emphasis, or implementation requirements.

Our goal is to build a unified control library that:

- **Maps overlapping controls** across different frameworks automatically
- **Identifies conflicts** where frameworks have contradictory requirements
- **Prioritizes findings** based on which frameworks apply to the specific use case
- **Provides implementation guidance** that satisfies multiple framework requirements simultaneously

For example, cryptographic key management appears in FIPS 140-3, ISO/SAE 21434, and ETSI EN 303 645, but each framework has different requirements for key storage, rotation, and validation. Our supercatalog would identify these overlaps and provide guidance that satisfies all applicable frameworks.

## Why bring GRC into binary analysis?

What's missing is a bridge between **technical analysis** and **governance frameworks**. That's where we believe Nabla is carving a new path: not just surfacing vulnerabilities, but making them speak the language of auditors, regulators, and CISOs.

### The OSCAL advantage

OSCAL (Open Security Controls Assessment Language) is NIST's standardized format for representing security controls, assessments, and compliance data. It's designed to make security compliance machine-readable and interoperable across different tools and frameworks.

For firmware analysis, OSCAL provides several key benefits:

**Standardized Evidence**: Instead of custom reports that vary by vendor, OSCAL provides a consistent format that auditors and regulators can rely on.

**Automated Compliance Mapping**: Technical findings can be automatically mapped to specific controls in various frameworks (NIST, ISO, etc.).

**Traceability**: Every finding is linked back to the specific binary location and extraction method that discovered it.

**Interoperability**: OSCAL documents can be imported into GRC platforms, risk management tools, and other compliance software.

### Real-world compliance scenarios

Consider a typical compliance scenario: an automotive manufacturer needs to demonstrate compliance with ISO/SAE 21434 for their Electronic Control Unit (ECU) firmware. Traditional approaches might involve:

1. Manual code review (weeks of expert time)
2. Penetration testing (expensive, limited coverage)  
3. Document review (subjective, inconsistent)
4. Custom reporting (time-consuming, error-prone)

With Nabla's OSCAL output, the same process becomes:

1. Automated binary analysis (minutes)
2. AI-driven vulnerability assessment (automated)
3. Compliance mapping to ISO/SAE 21434 controls (automated)
4. OSCAL-formatted evidence package (ready for audit)

The auditor receives a standardized OSCAL document that clearly maps technical findings to specific ISO/SAE 21434 requirements, with full traceability back to the source code.

### Beyond compliance reporting

By outputting directly into **OSCAL**, we're building toward a world where firmware assessments don't need to be manually rewritten for every certification. Instead, the same binary analysis that engineers use can also become a governance artifact.

But the real power comes from integration. OSCAL-formatted results can feed directly into:

- **Risk management platforms** for ongoing risk assessment
- **Continuous compliance monitoring** that tracks changes across firmware versions  
- **Supply chain security tools** that assess third-party components
- **Incident response systems** that can quickly identify affected systems during security incidents  

## Lessons we learned along the way

1. **Types matter.** Rust’s strong type system gave us the guardrails we needed to make LLM-driven suggestions repeatable and testable. Without that structure, the results would have been chaos.  
2. **Extraction is just the beginning.** Pulling strings and symbols is table stakes — the real value is in mapping those results into risk frameworks.  
3. **GRC isn’t an afterthought.** Governance, risk, and compliance aren’t just paperwork. They’re a way to connect deep technical insights with organizational accountability.  

## Closing thoughts

Building Nabla wasn’t about deciding one day to create a GRC tool. It was about following the thread of binary analysis far enough to realize that the real bottleneck isn’t extraction, but translation. Translation from raw bytes into governance artifacts that matter at the boardroom table.  

If there’s one takeaway from our journey, it’s this: **firmware security can’t just be technical. It has to be auditable, repeatable, and communicable.** And that’s the gap we’re working to close.