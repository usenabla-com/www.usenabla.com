# Nabla Homepage
**Streamlined GRC Tooling for Firmware Audits**

Save time and money on your next firmware audit with AI-powered binary analysis and automated OSCAL report generation.

## 🔍 What We Do

Nabla is a specialized GRC (Governance, Risk, and Compliance) platform that transforms complex firmware audits into streamlined processes. Our platform leverages large language models to automate compliance reporting and firmware analysis, helping organizations across IoT, Healthcare, Industrial, Automotive, and Manufacturing sectors.

## 🚀 Key Features

- **Automated OSCAL Report Generation** - Generate compliance reports automatically using industry-standard formats
- **Firmware Binary Analysis** - Deep analysis of firmware binaries with AI-powered insights  
- **SBOM Generation** - Create Software Bill of Materials in CycloneDX format
- **Live Hardware Support** - Analyze firmware directly from live systems with `--live-mode`
- **Flexible LLM Integration** - Compatible with hosted LLMs, GovCloud, and private models
- **Comprehensive Control Catalog** - Access over 122 different compliance controls

## 🏭 Industries We Serve

- **IoT Devices** - Connected device compliance and security assessment
- **Healthcare** - Medical device firmware validation and regulatory compliance
- **Industrial Systems** - Critical infrastructure security and compliance
- **Automotive** - Vehicle firmware security and safety standards compliance
- **Manufacturing** - Production system security and operational compliance

## 🎯 Why Choose Nabla?

- **Time-Saving** - Automated processes reduce audit time by up to 80%
- **Cost-Effective** - Significantly lower compliance costs compared to traditional methods
- **AI-Powered** - Advanced LLM analysis for deeper firmware insights
- **Standards-Compliant** - Full OSCAL and CycloneDX format support
- **Flexible Deployment** - Works with your existing infrastructure and preferred AI models

## 📞 Get Started Today

**Get a 30-day Pilot** - Email us for a 30-day pilot to try the CLI in your workflows.

### Contact Information
- **Email**: [trial@usenabla.com](mailto:trial@usenabla.com)
- **Discord Community**: [https://discord.gg/SYwGtsBT6S](https://discord.gg/SYwGtsBT6S)
- **Website**: [https://www.usenabla.com](https://www.usenabla.com)

### Ready to Transform Your Firmware Audits?
Talk to us about a Pilot today and experience the power of AI-driven firmware GRC tooling. Save thousands of compliance man hours by identifying the exact areas you're covered and need to work on to pass audits.

---

## Development Information

This repository contains the Nabla website built with modern web technologies.

### Tech Stack
- **Framework**: Next.js
- **Language**: TypeScript  
- **Styling**: Tailwind CSS
- **Package Manager**: Bun

### Local Development
```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local

# Start development server
bun dev

# Visit http://localhost:3000
```

### Scripts
- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run ESLint