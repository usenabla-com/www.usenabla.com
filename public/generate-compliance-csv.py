#!/usr/bin/env python3
"""
Generate Compliance CSV Reports from Terraform State

This script uses the Nabla API to:
1. Analyze a Terraform state file for NIST 800-53 compliance
2. Generate CSV reports for controls, findings, and asset inventory
3. Create summary statistics in CSV format

Usage:
    python generate-compliance-csv.py [--tfstate PATH] [--output-dir PATH]

Environment variables:
    NABLA_CUSTOMER_KEY: Customer API key (required)
    NABLA_API_URL: API endpoint (default: https://api.joindelta.com)

Examples:
    # Generate CSV reports from the example Terraform state
    python generate-compliance-csv.py

    # Use custom Terraform state file
    python generate-compliance-csv.py --tfstate /path/to/terraform.tfstate.b64
"""

import os
import sys
import json
import base64
import argparse
import csv
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any

# Add SDK to path
sdk_path = Path(__file__).parent.parent / 'sdks' / 'nabla-python' / 'src'
sys.path.insert(0, str(sdk_path))

from nabla_py.sdk import Nabla


class ComplianceCSVGenerator:
    """Generate CSV reports from compliance assessments"""

    def __init__(self, api_key: str, api_url: str = "https://api.joindelta.com"):
        self.client = Nabla(
            customer_key=api_key,
            server_url=api_url
        )

    def read_terraform_state_b64(self, file_path: str) -> str:
        """Read base64-encoded Terraform state file"""
        with open(file_path, 'r') as f:
            content = f.read().strip()
        return content

    def analyze_terraform_state(
        self,
        tfstate_b64: str,
        name: str = "compliance-assessment",
        include_diagram: bool = False
    ) -> Dict:
        """Call Nabla API to analyze Terraform state"""
        print(f"\n🔍 Analyzing Terraform state: {name}")
        print("=" * 70)

        # Make direct API call using urllib
        import urllib.request
        import urllib.error
        api_url = self.client.sdk_configuration.server_url
        api_key = self.client.sdk_configuration.security.customer_key

        request_data = json.dumps({
            "name": name,
            "format": "json",
            "content_base64": tfstate_b64,
            "include_diagram": include_diagram
        }).encode('utf-8')

        req = urllib.request.Request(
            f"{api_url}/v1/evidence/terraform",
            data=request_data,
            headers={
                "X-Customer-Key": api_key,
                "Content-Type": "application/json"
            }
        )

        try:
            with urllib.request.urlopen(req) as response:
                response_data = json.loads(response.read().decode('utf-8'))
        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8')
            raise Exception(f"API Error ({e.code}): {error_body}") from e

        print(f"✅ Assessment completed: {response_data.get('id', 'N/A')}")
        print(f"   Status: {response_data.get('status', 'N/A')}")
        print(f"   Created: {response_data.get('created_at', 'N/A')}")
        print("=" * 70)

        return response_data

    def extract_asset_inventory(self, tfstate_b64: str) -> List[Dict[str, Any]]:
        """Extract asset inventory from Terraform state"""
        try:
            tfstate_json = base64.b64decode(tfstate_b64).decode('utf-8')
            tfstate = json.loads(tfstate_json)
        except Exception as e:
            print(f"⚠️  Warning: Could not parse Terraform state for inventory: {e}")
            return []

        inventory = []
        resources = tfstate.get('resources', [])

        for resource in resources:
            resource_type = resource.get('type', 'unknown')
            resource_name = resource.get('name', 'unknown')
            instances = resource.get('instances', [])

            for idx, instance in enumerate(instances):
                attrs = instance.get('attributes', {})

                # Extract common attributes
                asset = {
                    'asset_id': f"{resource_type}.{resource_name}.{idx}",
                    'resource_type': resource_type,
                    'resource_name': resource_name,
                    'provider': resource.get('provider', 'unknown'),
                }

                # Add type-specific attributes
                if resource_type.startswith('aws_'):
                    asset.update(self._extract_aws_attributes(resource_type, attrs))
                elif resource_type.startswith('azurerm_'):
                    asset.update(self._extract_azure_attributes(resource_type, attrs))
                elif resource_type.startswith('google_'):
                    asset.update(self._extract_gcp_attributes(resource_type, attrs))

                inventory.append(asset)

        return inventory

    def _extract_aws_attributes(self, resource_type: str, attrs: Dict) -> Dict:
        """Extract AWS-specific attributes"""
        common = {
            'cloud_provider': 'AWS',
            'id': attrs.get('id', attrs.get('arn', 'N/A')),
            'region': attrs.get('region', attrs.get('availability_zone', 'N/A')),
            'tags': json.dumps(attrs.get('tags', {})),
        }

        if resource_type == 'aws_instance':
            common.update({
                'asset_type': 'EC2 Instance',
                'instance_type': attrs.get('instance_type', 'N/A'),
                'ami': attrs.get('ami', 'N/A'),
                'public_ip': attrs.get('public_ip', 'N/A'),
                'private_ip': attrs.get('private_ip', 'N/A'),
            })
        elif resource_type == 'aws_s3_bucket':
            # Handle versioning (can be a list or dict in Terraform state)
            versioning = attrs.get('versioning', [])
            versioning_enabled = False
            if isinstance(versioning, list) and len(versioning) > 0:
                versioning_enabled = versioning[0].get('enabled', False)
            elif isinstance(versioning, dict):
                versioning_enabled = versioning.get('enabled', False)

            common.update({
                'asset_type': 'S3 Bucket',
                'bucket_name': attrs.get('bucket', 'N/A'),
                'versioning': versioning_enabled,
                'encryption': 'Enabled' if attrs.get('server_side_encryption_configuration') else 'N/A',
            })
        elif resource_type == 'aws_db_instance':
            common.update({
                'asset_type': 'RDS Database',
                'engine': attrs.get('engine', 'N/A'),
                'engine_version': attrs.get('engine_version', 'N/A'),
                'instance_class': attrs.get('instance_class', 'N/A'),
                'storage_encrypted': attrs.get('storage_encrypted', False),
            })
        else:
            common['asset_type'] = resource_type

        return common

    def _extract_azure_attributes(self, resource_type: str, attrs: Dict) -> Dict:
        """Extract Azure-specific attributes"""
        return {
            'cloud_provider': 'Azure',
            'asset_type': resource_type,
            'id': attrs.get('id', 'N/A'),
            'location': attrs.get('location', 'N/A'),
            'resource_group': attrs.get('resource_group_name', 'N/A'),
            'tags': json.dumps(attrs.get('tags', {})),
        }

    def _extract_gcp_attributes(self, resource_type: str, attrs: Dict) -> Dict:
        """Extract GCP-specific attributes"""
        return {
            'cloud_provider': 'GCP',
            'asset_type': resource_type,
            'id': attrs.get('id', 'N/A'),
            'zone': attrs.get('zone', 'N/A'),
            'project': attrs.get('project', 'N/A'),
            'labels': json.dumps(attrs.get('labels', {})),
        }

    def generate_controls_csv(self, response: Dict, output_path: Path):
        """Generate CSV report for controls across all frameworks"""
        print(f"\n📝 Generating Controls CSV...")

        assessment = response.get('assessment', {})
        frameworks = ['nist_800_53', 'nist_800_171', 'nist_800_172', 'cmmc', 'fips_140_2', 'fips_140_3']

        rows = []
        for fw_key in frameworks:
            if fw_key not in assessment:
                continue

            fw_data = assessment[fw_key]
            framework_name = fw_key.upper().replace('_', ' ')
            version = fw_data.get('version', 'Unknown')
            controls = fw_data.get('controls', [])

            for control in controls:
                rows.append({
                    'framework': framework_name,
                    'version': version,
                    'control_id': control.get('control_id', 'N/A'),
                    'title': control.get('title', 'N/A'),
                    'status': control.get('status', 'unknown'),
                    'findings_count': len(control.get('findings', [])),
                    'evidence_count': len(control.get('evidence', [])),
                    'findings': ' | '.join(control.get('findings', [])),
                    'evidence': ' | '.join(control.get('evidence', [])),
                })

        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            if rows:
                writer = csv.DictWriter(f, fieldnames=rows[0].keys())
                writer.writeheader()
                writer.writerows(rows)
                print(f"✅ Controls CSV: {output_path} ({len(rows)} controls)")
            else:
                print(f"⚠️  No controls found to write to CSV")

    def generate_findings_csv(self, response: Dict, output_path: Path):
        """Generate CSV report for individual findings"""
        print(f"\n📝 Generating Findings CSV...")

        assessment = response.get('assessment', {})
        frameworks = ['nist_800_53', 'nist_800_171', 'nist_800_172', 'cmmc', 'fips_140_2', 'fips_140_3']

        rows = []
        for fw_key in frameworks:
            if fw_key not in assessment:
                continue

            fw_data = assessment[fw_key]
            framework_name = fw_key.upper().replace('_', ' ')
            version = fw_data.get('version', 'Unknown')
            controls = fw_data.get('controls', [])

            for control in controls:
                control_id = control.get('control_id', 'N/A')
                title = control.get('title', 'N/A')
                status = control.get('status', 'unknown')

                # Add each finding as a separate row
                findings = control.get('findings', [])
                if findings:
                    for finding in findings:
                        rows.append({
                            'framework': framework_name,
                            'version': version,
                            'control_id': control_id,
                            'control_title': title,
                            'status': status,
                            'finding': finding,
                            'severity': 'High' if status == 'not-satisfied' else 'Info',
                        })
                else:
                    # Add row even if no findings
                    rows.append({
                        'framework': framework_name,
                        'version': version,
                        'control_id': control_id,
                        'control_title': title,
                        'status': status,
                        'finding': 'No findings' if status == 'satisfied' else 'N/A',
                        'severity': 'Info',
                    })

        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            if rows:
                writer = csv.DictWriter(f, fieldnames=rows[0].keys())
                writer.writeheader()
                writer.writerows(rows)
                print(f"✅ Findings CSV: {output_path} ({len(rows)} findings)")
            else:
                print(f"⚠️  No findings to write to CSV")

    def generate_asset_inventory_csv(self, asset_inventory: List[Dict[str, Any]], output_path: Path):
        """Generate CSV report for asset inventory"""
        print(f"\n📝 Generating Asset Inventory CSV...")

        if not asset_inventory:
            print(f"⚠️  No assets to write to CSV")
            return

        # Get all unique keys across all assets
        all_keys = set()
        for asset in asset_inventory:
            all_keys.update(asset.keys())

        # Sort keys for consistent column order
        fieldnames = sorted(all_keys)

        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction='ignore')
            writer.writeheader()
            writer.writerows(asset_inventory)
            print(f"✅ Asset Inventory CSV: {output_path} ({len(asset_inventory)} assets)")

    def generate_summary_csv(self, response: Dict, asset_count: int, output_path: Path):
        """Generate CSV report for compliance summary"""
        print(f"\n📝 Generating Summary CSV...")

        assessment = response.get('assessment', {})
        frameworks = ['nist_800_53', 'nist_800_171', 'nist_800_172', 'cmmc', 'fips_140_2', 'fips_140_3']

        rows = []
        for fw_key in frameworks:
            if fw_key not in assessment:
                continue

            fw_data = assessment[fw_key]
            framework_name = fw_key.upper().replace('_', ' ')
            version = fw_data.get('version', 'Unknown')
            summary = fw_data.get('summary', {})

            total = summary.get('total_controls', 0)
            satisfied = summary.get('satisfied', 0)
            not_satisfied = summary.get('not_satisfied', 0)
            not_applicable = summary.get('not_applicable', 0)
            compliance_pct = (satisfied / total * 100) if total > 0 else 0

            rows.append({
                'assessment_id': response.get('id', 'N/A'),
                'framework': framework_name,
                'version': version,
                'timestamp': fw_data.get('timestamp', response.get('created_at', 'N/A')),
                'total_controls': total,
                'satisfied': satisfied,
                'not_satisfied': not_satisfied,
                'not_applicable': not_applicable,
                'compliance_percentage': f"{compliance_pct:.2f}%",
                'total_assets': asset_count,
            })

        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            if rows:
                writer = csv.DictWriter(f, fieldnames=rows[0].keys())
                writer.writeheader()
                writer.writerows(rows)
                print(f"✅ Summary CSV: {output_path} ({len(rows)} frameworks)")
            else:
                print(f"⚠️  No summary data to write to CSV")

    def print_summary(self, response: Dict, asset_count: int):
        """Print summary of the assessment"""
        assessment = response.get('assessment', {})
        frameworks = ['nist_800_53', 'nist_800_171', 'nist_800_172', 'cmmc', 'fips_140_2', 'fips_140_3']

        print(f"\n📊 Compliance Assessment Summary")
        print("=" * 70)
        print(f"Assessment ID: {response.get('id', 'N/A')}")
        print(f"Total Assets:  {asset_count}")
        print("=" * 70)

        for fw_key in frameworks:
            if fw_key not in assessment:
                continue

            fw_data = assessment[fw_key]
            framework_name = fw_key.upper().replace('_', ' ')
            version = fw_data.get('version', 'Unknown')
            summary = fw_data.get('summary', {})

            total = summary.get('total_controls', 0)
            satisfied = summary.get('satisfied', 0)
            compliance_pct = (satisfied / total * 100) if total > 0 else 0

            print(f"\n{framework_name} {version}")
            print(f"  Total Controls:     {total}")
            print(f"  ✅ Satisfied:       {satisfied}")
            print(f"  ❌ Not Satisfied:   {summary.get('not_satisfied', 0)}")
            print(f"  ⊘  Not Applicable:  {summary.get('not_applicable', 0)}")
            print(f"  Compliance Rate:    {compliance_pct:.2f}%")

        print("=" * 70)


def main():
    parser = argparse.ArgumentParser(
        description='Generate CSV reports from Terraform state compliance assessment',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument(
        '--tfstate',
        default='examples/fedramp-complex.tfstate.b64',
        help='Path to base64-encoded Terraform state file'
    )
    parser.add_argument(
        '--output-dir',
        default='output/compliance-csv',
        help='Output directory for CSV reports'
    )
    parser.add_argument(
        '--name',
        default='compliance-assessment',
        help='Name for the assessment'
    )

    args = parser.parse_args()

    # Get API key from environment
    api_key = os.environ.get('NABLA_CUSTOMER_KEY')
    if not api_key:
        print("❌ Error: NABLA_CUSTOMER_KEY environment variable not set")
        print("\nSet your API key:")
        print("  export NABLA_CUSTOMER_KEY='your-api-key-here'")
        sys.exit(1)

    # Get API URL from environment or use default
    api_url = os.environ.get('NABLA_API_URL', 'https://api.joindelta.com')

    # Resolve paths
    script_dir = Path(__file__).parent.parent
    tfstate_path = script_dir / args.tfstate
    output_dir = script_dir / args.output_dir

    if not tfstate_path.exists():
        print(f"❌ Error: Terraform state file not found: {tfstate_path}")
        sys.exit(1)

    print("=" * 70)
    print("🚀 Compliance CSV Report Generator")
    print("=" * 70)
    print(f"API URL:          {api_url}")
    print(f"Terraform State:  {tfstate_path}")
    print(f"Output Directory: {output_dir}")
    print("=" * 70)

    try:
        # Initialize generator
        generator = ComplianceCSVGenerator(api_key, api_url)

        # Read Terraform state
        print("\n📖 Reading Terraform state...")
        tfstate_b64 = generator.read_terraform_state_b64(tfstate_path)
        print(f"✅ Terraform state loaded ({len(tfstate_b64)} bytes)")

        # Extract asset inventory
        print("\n📦 Extracting asset inventory...")
        asset_inventory = generator.extract_asset_inventory(tfstate_b64)
        print(f"✅ Found {len(asset_inventory)} assets")

        # Analyze Terraform state
        response = generator.analyze_terraform_state(
            tfstate_b64,
            name=args.name,
            include_diagram=False
        )

        # Create output directory
        output_dir.mkdir(parents=True, exist_ok=True)

        # Generate CSV reports
        print(f"\n💾 Generating CSV reports...")
        print("=" * 70)

        generator.generate_controls_csv(
            response,
            output_dir / 'controls.csv'
        )

        generator.generate_findings_csv(
            response,
            output_dir / 'findings.csv'
        )

        generator.generate_asset_inventory_csv(
            asset_inventory,
            output_dir / 'assets.csv'
        )

        generator.generate_summary_csv(
            response,
            len(asset_inventory),
            output_dir / 'summary.csv'
        )

        print("=" * 70)

        # Print summary
        generator.print_summary(response, len(asset_inventory))

        print("\n✅ CSV report generation complete!")
        print(f"\n📂 All CSV files saved to: {output_dir}")
        print("\n📊 Generated CSV files:")
        print(f"  • Controls:  {output_dir / 'controls.csv'}")
        print(f"  • Findings:  {output_dir / 'findings.csv'}")
        print(f"  • Assets:    {output_dir / 'assets.csv'}")
        print(f"  • Summary:   {output_dir / 'summary.csv'}")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
