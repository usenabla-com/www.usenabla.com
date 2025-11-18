---
title: "Deep Dive: Programmatic Reports with the Nabla API, Python, and Bash"
summary: "Using the Nabla API to automatically generate compliance reports in the time it takes to have breakfast"
author: "Admin"
published: "2025-10-17"
image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo3nbos_xP8KMpK5M44KHxGovdx7a01LYjow&s"
tags: ["Startups", "Governance", "Compliance", "FedRamp", "Risk"]
---

Anyone who's ever had to generate compliance reports for FedRAMP, CMMC, or NIST 800-53 knows that the biggest pain lies in the hours of copying and pasting from various tools, cross-referencing control requirements, and manually mapping your infrastructure to compliance frameworks. This is part of the problem that compliance dashboards **try** to solve, but often end up becoming checkbox engines that don't have the full context of the underlying controls and configs. What if I told you that you could automate all of these reports programmatically across multiple frameworks in under 60 seconds?

In this tutorial, I'll walk you through using the Nabla API to automatically generate compliance reports from your Terraform state files. We'll cover the entire workflow from API authentication to generating production-ready CSV exports for your security and compliance teams.

## The Problem: Manual Compliance is a Time Sink

Most organizations spend 80–100 hours per month on compliance reporting. A [survey by Zluri](https://www.zluri.com/blog/key-compliance-statistics-and-insights-for-2024?utm_source=chatgpt.com) found that 62% of compliance officers spend between 1 and 7 hours per week tracking regulatory developments. Security teams often manually:

- Export infrastructure configurations from cloud providers
- Map resources to compliance controls (SC-13, AC-2, etc.)
- Track which controls are satisfied vs. not-satisfied
- Generate reports for auditors in Excel or Word
- Update these reports every month for continuous monitoring

This manual process is error-prone, time-consuming, and doesn't scale. When you're managing multi-cloud environments with hundreds of resources across AWS, Azure, and GCP, manual compliance tracking becomes a full-time job.

## The Solution: Programmatic Evidence Generation

The Nabla API provides a REST endpoint that accepts your infrastructure-as-code (Terraform state, Kubernetes manifests, etc.) and returns structured compliance assessments across multiple frameworks such as:

- **NIST 800-53 Rev. 5** (332 controls)
- **NIST 800-171** (110 controls)
- **NIST 800-172** (32 controls)
- **CMMC 2.0** (all levels)
- **FIPS 140-2/140-3** (cryptographic compliance)

Instead of manually mapping your infrastructure, the API analyzes your Terraform state, identifies all resources (EC2 instances, S3 buckets, RDS databases, networking configs, etc.), and automatically generates findings for each relevant control.

## Getting Started: API Authentication

First, you'll need a Nabla API key. You can sign up for a 14-day trial [here](/onboarding). Once you have your key, set it as an environment variable:

```bash
export NABLA_CUSTOMER_KEY='your-api-key-here'
```

The Nabla API uses simple API key authentication via the `X-Customer-Key` header. All requests are made over HTTPS to ensure your infrastructure data is encrypted in transit.

## The Terraform Evidence Endpoint

The core endpoint we'll be using is `POST /v1/evidence/terraform`. This endpoint accepts a base64-encoded Terraform state file and returns a comprehensive compliance assessment. Here's what the request looks like:

```json
{
  "name": "production-infrastructure",
  "format": "json",
  "content_base64": "eyJ2ZXJzaW9uIjo0LCJ0ZXJyYWZvcm1fdmVyc2lvbiI6IjEuMC4wIi4uLg==",
  "include_diagram": false
}
```

The response includes:

- **Assessment ID**: Unique identifier for tracking
- **Controls**: Detailed findings for each control across all frameworks
- **Summary Statistics**: Total controls, satisfied, not-satisfied, compliance percentage
- **Evidence**: Specific infrastructure resources that satisfy or violate controls
- **Artifacts**: Downloadable assessment files (JSON, YAML, OSCAL)

## Building the CSV Report Generator

Let's walk through the Python script that automates this entire workflow. The full script is available on request to customers and users on a 14-day trial. The following Python module will be published within the next week. 

### Step 1: Initialize the Nabla Client

```python
from nabla_py.sdk import Nabla

class ComplianceCSVGenerator:
    def __init__(self, api_key: str, api_url: str = "https://api.joindelta.com"):
        self.client = Nabla(
            customer_key=api_key,
            server_url=api_url
        )
```

The Nabla Python SDK handles authentication and request formatting automatically. You just need to provide your API key.

### Step 2: Read and Encode the Terraform State

```python
def read_terraform_state_b64(self, file_path: str) -> str:
    """Read base64-encoded Terraform state file"""
    with open(file_path, 'r') as f:
        content = f.read().strip()
    return content
```

For security, Terraform state files should be base64-encoded before transmission. If you have a raw JSON state file, you can encode it with:

```bash
base64 -i terraform.tfstate -o terraform.tfstate.b64
```

### Step 3: Call the Nabla API

```python
def analyze_terraform_state(self, tfstate_b64: str, name: str = "assessment") -> Dict:
    """Call Nabla API to analyze Terraform state"""

    request_data = json.dumps({
        "name": name,
        "format": "json",
        "content_base64": tfstate_b64,
        "include_diagram": False
    }).encode('utf-8')

    req = urllib.request.Request(
        f"{api_url}/v1/evidence/terraform",
        data=request_data,
        headers={
            "X-Customer-Key": api_key,
            "Content-Type": "application/json"
        }
    )

    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode('utf-8'))
```

The API typically responds in 10-30 seconds depending on the size of your infrastructure. For a typical production environment with 50-100 resources, expect around 15 seconds.

### Step 4: Extract Asset Inventory

Before generating compliance reports, we extract an asset inventory from the Terraform state. This gives us a complete list of all infrastructure resources:

```python
def extract_asset_inventory(self, tfstate_b64: str) -> List[Dict[str, Any]]:
    """Extract asset inventory from Terraform state"""
    tfstate = json.loads(base64.b64decode(tfstate_b64))
    inventory = []

    for resource in tfstate.get('resources', []):
        asset = {
            'asset_id': f"{resource['type']}.{resource['name']}",
            'resource_type': resource['type'],
            'cloud_provider': 'AWS' if resource['type'].startswith('aws_') else 'Other',
            # ... extract provider-specific attributes
        }
        inventory.append(asset)

    return inventory
```

This inventory becomes the **assets.csv** file, which is incredibly useful for:

- Security teams tracking all infrastructure
- Finance teams calculating cloud spend
- Compliance teams maintaining asset registers

### Step 5: Generate CSV Reports

Now comes the magic—transforming the API response into actionable CSV reports. We generate four distinct CSV files:

#### 1. Controls CSV

Lists every control across all frameworks with its status and findings:

```python
def generate_controls_csv(self, response: Dict, output_path: Path):
    frameworks = ['nist_800_53', 'nist_800_171', 'cmmc', 'fips_140_2']
    rows = []

    for fw_key in frameworks:
        fw_data = response['assessment'][fw_key]
        for control in fw_data['controls']:
            rows.append({
                'framework': fw_key.upper(),
                'control_id': control['control_id'],
                'title': control['title'],
                'status': control['status'],
                'findings': ' | '.join(control['findings']),
                'evidence': ' | '.join(control['evidence'])
            })
```

**Example output:**

| Framework | Control ID | Title | Status | Findings | Evidence |
|-----------|------------|-------|--------|----------|----------|
| NIST 800-53 | SC-13 | Cryptographic Protection | Satisfied | TLS 1.2 on ALB | aws_lb.main |
| NIST 800-53 | AC-2 | Account Management | Not Satisfied | No MFA on IAM users | aws_iam_user.admin |


#### 2. Findings CSV

Breaks down individual findings for each control:

```python
def generate_findings_csv(self, response: Dict, output_path: Path):
    for control in controls:
        for finding in control['findings']:
            rows.append({
                'framework': framework_name,
                'control_id': control['control_id'],
                'finding': finding,
                'severity': 'High' if control['status'] == 'not-satisfied' else 'Info'
            })
```

This CSV is perfect for issue tracking systems like Jira or Linear. Each finding becomes a ticket.

#### 3. Assets CSV

Complete inventory with provider-specific attributes:

```
asset_id,resource_type,cloud_provider,region,instance_type,encryption
aws_instance.web,aws_instance,AWS,us-east-1,t3.medium,false
aws_s3_bucket.logs,aws_s3_bucket,AWS,us-east-1,N/A,true
aws_db_instance.main,aws_db_instance,AWS,us-east-1,db.t3.large,true
```

#### 4. Summary CSV

High-level compliance metrics for executive reporting:

```
framework,total_controls,satisfied,not_satisfied,compliance_percentage
NIST 800-53,332,287,45,86.45%
NIST 800-171,110,98,12,89.09%
CMMC,110,102,8,92.73%
```

## Running the Full Workflow

Now that we've built the Python script, let's wrap it in a convenient Bash script for easy execution. The full script is at `/public/generate-csv.sh`:

```bash
#!/bin/bash
set -e

# Configuration
TFSTATE_PATH="${1:-examples/fedramp-complex.tfstate.b64}"
OUTPUT_DIR="${2:-output/compliance-csv}"
ASSESSMENT_NAME="${3:-compliance-assessment}"

# Check for API key
if [ -z "$NABLA_CUSTOMER_KEY" ]; then
    echo "❌ Error: NABLA_CUSTOMER_KEY not set"
    exit 1
fi

# Run Python script
python3 generate-compliance-csv.py \
    --tfstate "$TFSTATE_PATH" \
    --output-dir "$OUTPUT_DIR" \
    --name "$ASSESSMENT_NAME"

echo "✅ CSV reports generated at: $OUTPUT_DIR"
```

Run it with:

```bash
./generate-csv.sh examples/fedramp-complex.tfstate.b64
```

The script will:

1. Validate your API key
2. Load and encode your Terraform state
3. Call the Nabla API
4. Generate 4 CSV files in under 60 seconds
5. Print a summary of compliance status

## Real-World Example: FedRAMP Assessment

Let's look at a real example using a complex FedRAMP-ready infrastructure (available at `/public/fedramp-complex.tfstate.b64`). This Terraform state includes:

- 12 EC2 instances with various configurations
- 5 S3 buckets with different security settings
- 2 RDS databases (one encrypted, one not)
- VPC with public and private subnets
- Application Load Balancer with TLS
- CloudTrail for audit logging
- KMS keys for encryption

Running the analysis:

```bash
$ ./generate-csv.sh examples/fedramp-complex.tfstate.b64

========================================================================
🚀 Compliance CSV Report Generator
========================================================================
📖 Reading Terraform state...
✅ Terraform state loaded (45,234 bytes)

📦 Extracting asset inventory...
✅ Found 47 assets

🔍 Analyzing Terraform state: compliance-assessment
========================================================================
✅ Assessment completed: a7c3f8e2-4b1d-4c9e-b2a8-1f3e7c9d2a5b
   Status: completed
   Created: 2025-10-17T10:23:45Z
========================================================================

📊 Compliance Assessment Summary
========================================================================
Assessment ID: a7c3f8e2-4b1d-4c9e-b2a8-1f3e7c9d2a5b
Total Assets:  47
========================================================================

NIST 800-53 Rev. 5
  Total Controls:     332
  ✅ Satisfied:       287
  ❌ Not Satisfied:   38
  ⊘  Not Applicable:  7
  Compliance Rate:    86.45%

NIST 800-171
  Total Controls:     110
  ✅ Satisfied:       98
  ❌ Not Satisfied:   12
  ⊘  Not Applicable:  0
  Compliance Rate:    89.09%

CMMC Level 2
  Total Controls:     110
  ✅ Satisfied:       102
  ❌ Not Satisfied:   8
  ⊘  Not Applicable:  0
  Compliance Rate:    92.73%
========================================================================

✅ CSV report generation complete!

📂 All CSV files saved to: output/compliance-csv
```

## What You Can Do With These Reports

The generated CSV files are immediately useful for:

### 1. Auditor Packages

Send the `summary.csv` and `controls.csv` to auditors. These files contain all the evidence needed for FedRAMP, CMMC, or SOC 2 audits.

### 2. Continuous Monitoring Dashboards

Import the CSVs into Tableau, PowerBI, or Google Data Studio to create real-time compliance dashboards. Track compliance trends over time and identify controls that frequently fail.

### 3. Automated Remediation

Parse the `findings.csv` to automatically create Jira tickets or GitHub issues. Each finding includes the specific resource and recommended remediation.

### 4. Executive Reporting

Use `summary.csv` for monthly board presentations. Show compliance percentage trends and demonstrate security posture improvements.

### 5. Asset Management

Import `assets.csv` into your CMDB (Configuration Management Database) for complete infrastructure visibility.

## Beyond Terraform: Other Evidence Sources

While we focused on Terraform in this tutorial, the Nabla API supports multiple evidence sources:

- **Azure Live Environments** (`/v1/evidence/azure`): Connect via Workload Identity Federation
- **Firmware Binaries** (`/v1/evidence/firmware`): Analyze embedded system firmware for NIST SP 800-193
- **Multi-Source FIPS Assessments** (`/v1/fips`): Upload ZIPs containing SBOMs, manifests, and package locks

Each endpoint follows the same pattern: send evidence, receive structured compliance assessment, export to CSV.

## Performance and Cost Considerations

### API Response Times

- Small infrastructure (<20 resources): 5-10 seconds
- Medium infrastructure (20-100 resources): 10-30 seconds
- Large infrastructure (>100 resources): 30-60 seconds

### Best Practices

- Cache assessment results for 24 hours (compliance doesn't change hourly)
- Run assessments in CI/CD pipelines on merge to main
- Use webhook triggers instead of polling

## Integrating with CI/CD Pipelines

The real power comes from automation. Here's a GitHub Actions workflow that generates compliance reports on every infrastructure change:

```yaml
name: Compliance Check
on:
  push:
    paths:
      - 'terraform/**'

jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Generate Terraform State
        run: |
          cd terraform
          terraform init
          terraform plan -out=plan.tfplan
          terraform show -json plan.tfplan | base64 > state.b64

      - name: Run Compliance Assessment
        env:
          NABLA_CUSTOMER_KEY: ${{ secrets.NABLA_API_KEY }}
        run: |
          ./scripts/generate-csv.sh terraform/state.b64 output/compliance

      - name: Upload Reports
        uses: actions/upload-artifact@v3
        with:
          name: compliance-reports
          path: output/compliance/*.csv

      - name: Check Compliance Threshold
        run: |
          COMPLIANCE=$(cat output/compliance/summary.csv | grep "NIST 800-53" | cut -d',' -f9)
          if (( $(echo "$COMPLIANCE < 85.0" | bc -l) )); then
            echo "❌ Compliance below 85%: $COMPLIANCE"
            exit 1
          fi
```

This workflow:

1. Generates a Terraform plan on every push
2. Runs compliance assessment via Nabla API
3. Uploads CSV reports as artifacts
4. Fails the build if compliance drops below 85%

## Wrapping Up

In this post, we've covered how to:

- ✅ Authenticate with the Nabla API
- ✅ Submit Terraform state for compliance analysis
- ✅ Extract asset inventory from infrastructure code
- ✅ Generate CSV reports for multiple frameworks
- ✅ Automate the entire workflow with Python and Bash
- ✅ Integrate compliance checks into CI/CD pipelines

### Next Steops

Want to try it yourself? Sign up for a [14-day trial](https://www.usenabla.co/onboarding) and get your API key. You'll be generating compliance reports in minutes.

Have questions or want to share how you're using the Nabla API? Drop a comment below or reach out on [LinkedIn](https://www.linkedin.com/company/usenabla).

---

**Next Post Preview:** In the next post, we'll dive into firmware security analysis—using the `/v1/evidence/firmware` endpoint to analyze embedded binaries, extract control flow graphs, and map security features to NIST 800-53 controls. Stay tuned!