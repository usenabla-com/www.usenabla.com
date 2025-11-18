#!/usr/bin/env python3
"""
Generate FedRAMP System Security Plan (SSP) and Asset Inventory from Terraform State

This script uses the Nabla API to:
1. Analyze a Terraform state file for NIST 800-53 compliance
2. Generate a FedRAMP-compatible SSP document
3. Extract and format an Asset Inventory
4. Save all artifacts (OSCAL, diagrams, reports)

Usage:
    python generate-fedramp-ssp.py [--tfstate PATH] [--output-dir PATH] [--format FORMAT]

Environment variables:
    NABLA_CUSTOMER_KEY: Customer API key (required)
    NABLA_API_URL: API endpoint (default: https://api.joindelta.com)

Examples:
    # Generate SSP from the example Terraform state
    python generate-fedramp-ssp.py

    # Use custom Terraform state file
    python generate-fedramp-ssp.py --tfstate /path/to/terraform.tfstate.b64

    # Generate OSCAL format output
    python generate-fedramp-ssp.py --format oscal
"""

import os
import sys
import json
import base64
import argparse
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any

# Add SDK to path
sdk_path = Path(__file__).parent.parent / 'sdks' / 'nabla-python' / 'src'
sys.path.insert(0, str(sdk_path))

from nabla_py.sdk import Nabla
from nabla_py import models


class FedRAMPSSPGenerator:
    """Generate FedRAMP SSP and Asset Inventory from Terraform state"""

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
        name: str = "fedramp-production",
        output_format: str = "json",
        include_diagram: bool = True
    ) -> Dict:
        """Call Nabla API to analyze Terraform state"""
        print(f"\n🔍 Analyzing Terraform state: {name}")
        print("=" * 70)

        # Map format string to literal format value
        format_map = {
            "oscal": "oscal",
            "yaml": "yaml",
            "json": "json",
        }
        format_value = format_map.get(output_format.lower(), "json")

        # Make direct API call to bypass SDK validation issues
        import urllib.request
        import urllib.error
        api_url = self.client.sdk_configuration.server_url
        api_key = self.client.sdk_configuration.security.customer_key

        request_data = json.dumps({
            "name": name,
            "format": format_value,
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
        # Decode the base64 Terraform state
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
            'tags': attrs.get('tags', {}),
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

            # Handle encryption configuration (can be a list or dict)
            encryption = attrs.get('server_side_encryption_configuration', 'N/A')
            if isinstance(encryption, list) and len(encryption) > 0:
                encryption = encryption[0]

            common.update({
                'asset_type': 'S3 Bucket',
                'bucket_name': attrs.get('bucket', 'N/A'),
                'versioning': versioning_enabled,
                'encryption': encryption,
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
            'tags': attrs.get('tags', {}),
        }

    def _extract_gcp_attributes(self, resource_type: str, attrs: Dict) -> Dict:
        """Extract GCP-specific attributes"""
        return {
            'cloud_provider': 'GCP',
            'asset_type': resource_type,
            'id': attrs.get('id', 'N/A'),
            'zone': attrs.get('zone', 'N/A'),
            'project': attrs.get('project', 'N/A'),
            'labels': attrs.get('labels', {}),
        }

    def generate_ssp_document(
        self,
        response: Dict,
        asset_inventory: List[Dict[str, Any]]
    ) -> str:
        """Generate FedRAMP SSP document from assessment"""
        assessment = response.get('assessment', {})

        # Handle both single assessment and multi-framework responses
        # If assessment contains framework keys, extract the first one
        frameworks = ['nist_800_53', 'nist_800_171', 'nist_800_172', 'cmmc', 'fips_140_2', 'fips_140_3']
        actual_assessment = None
        framework_name = 'Unknown'

        for fw in frameworks:
            if fw in assessment:
                actual_assessment = assessment[fw]
                framework_name = fw.upper().replace('_', ' ')
                break

        # If still no assessment found, try using assessment directly
        if not actual_assessment:
            actual_assessment = assessment

        # Safely extract values with defaults
        assessment_id = actual_assessment.get('id', response.get('id', 'N/A'))
        timestamp = actual_assessment.get('timestamp', response.get('created_at', datetime.now().isoformat()))
        version = actual_assessment.get('version', assessment.get('version', 'Unknown'))
        controls = actual_assessment.get('controls', [])
        summary = actual_assessment.get('summary', {})

        ssp = {
            'system_security_plan': {
                'metadata': {
                    'title': 'FedRAMP System Security Plan',
                    'version': '1.0',
                    'oscal_version': '1.0.0',
                    'last_modified': datetime.now().isoformat(),
                    'published': response.get('created_at', datetime.now().isoformat()),
                    'assessment_id': response.get('id', 'N/A'),
                },
                'system_information': {
                    'system_name': assessment_id,
                    'system_id': response.get('id', 'N/A'),
                    'description': f'Compliance assessment against {framework_name} {version}',
                    'authorization_boundary': 'Cloud infrastructure defined by Terraform state',
                },
                'compliance_framework': {
                    'framework': framework_name,
                    'version': version,
                    'timestamp': timestamp,
                },
                'asset_inventory': {
                    'total_assets': len(asset_inventory),
                    'assets': asset_inventory,
                },
                'control_implementation': self._format_controls(controls),
                'compliance_summary': {
                    'total_controls': summary.get('total_controls', 0),
                    'satisfied': summary.get('satisfied', 0),
                    'not_satisfied': summary.get('not_satisfied', 0),
                    'not_applicable': summary.get('not_applicable', 0),
                    'compliance_percentage': round(
                        (summary.get('satisfied', 0) / summary.get('total_controls', 1) * 100)
                        if summary.get('total_controls', 0) > 0 else 0,
                        2
                    ),
                },
            }
        }

        return json.dumps(ssp, indent=2, default=str)

    def _format_controls(self, controls: List[Dict]) -> List[Dict]:
        """Format control assessments for SSP"""
        formatted = []
        for control in controls:
            formatted.append({
                'control_id': control.get('control_id', 'N/A'),
                'control_title': control.get('title', 'N/A'),
                'implementation_status': control.get('status', 'unknown'),
                'findings': control.get('findings', []),
                'evidence': control.get('evidence', []),
            })
        return formatted

    def generate_asset_inventory(self, asset_inventory: List[Dict[str, Any]]) -> str:
        """Generate standalone Asset Inventory document"""
        inventory_doc = {
            'asset_inventory': {
                'metadata': {
                    'title': 'FedRAMP Asset Inventory',
                    'version': '1.0',
                    'generated': datetime.now().isoformat(),
                },
                'summary': {
                    'total_assets': len(asset_inventory),
                    'by_cloud_provider': self._count_by_field(asset_inventory, 'cloud_provider'),
                    'by_asset_type': self._count_by_field(asset_inventory, 'asset_type'),
                },
                'assets': asset_inventory,
            }
        }
        return json.dumps(inventory_doc, indent=2, default=str)

    def _count_by_field(self, inventory: List[Dict], field: str) -> Dict[str, int]:
        """Count assets by a specific field"""
        counts = {}
        for asset in inventory:
            value = asset.get(field, 'Unknown')
            counts[value] = counts.get(value, 0) + 1
        return counts

    def save_artifacts(
        self,
        response: Dict,
        ssp_doc: str,
        inventory_doc: str,
        output_dir: Path
    ):
        """Save all generated artifacts"""
        output_dir.mkdir(parents=True, exist_ok=True)

        print(f"\n💾 Saving artifacts to: {output_dir}")
        print("=" * 70)

        # Save SSP document
        ssp_path = output_dir / 'fedramp-ssp.json'
        with open(ssp_path, 'w') as f:
            f.write(ssp_doc)
        print(f"✅ SSP Document: {ssp_path}")

        # Save Asset Inventory
        inventory_path = output_dir / 'asset-inventory.json'
        with open(inventory_path, 'w') as f:
            f.write(inventory_doc)
        print(f"✅ Asset Inventory: {inventory_path}")

        # Save raw assessment
        assessment_path = output_dir / 'raw-assessment.json'
        with open(assessment_path, 'w') as f:
            json.dump(response, f, indent=2, default=str)
        print(f"✅ Raw Assessment: {assessment_path}")

        # Save artifacts from API response
        artifacts = response.get('artifacts', [])
        for idx, artifact in enumerate(artifacts):
            filename = artifact.get('filename') or f'artifact-{idx}'
            artifact_path = output_dir / filename

            # Decode and save artifact content
            content_base64 = artifact.get('content_base64')
            if content_base64:
                try:
                    content = base64.b64decode(content_base64)
                    with open(artifact_path, 'wb') as f:
                        f.write(content)
                    size_bytes = artifact.get('size_bytes', len(content))
                    print(f"✅ Artifact: {artifact_path} ({size_bytes} bytes)")
                except Exception as e:
                    print(f"⚠️  Warning: Could not save artifact {filename}: {e}")

            # Save diagram if present
            diagram = artifact.get('diagram')
            if diagram:
                diagram_path = output_dir / f'{filename}.mmd'
                with open(diagram_path, 'w') as f:
                    f.write(diagram)
                print(f"✅ Diagram: {diagram_path}")

        print("=" * 70)

    def print_summary(
        self,
        response: Dict,
        asset_count: int
    ):
        """Print summary of the assessment"""
        assessment = response.get('assessment', {})

        # Handle both single assessment and multi-framework responses
        frameworks = ['nist_800_53', 'nist_800_171', 'nist_800_172', 'cmmc', 'fips_140_2', 'fips_140_3']
        actual_assessment = None
        framework_name = 'Unknown'

        for fw in frameworks:
            if fw in assessment:
                actual_assessment = assessment[fw]
                framework_name = fw.upper().replace('_', ' ')
                break

        if not actual_assessment:
            actual_assessment = assessment

        summary = actual_assessment.get('summary', {})
        version = actual_assessment.get('version', assessment.get('version', 'Unknown'))
        controls = actual_assessment.get('controls', [])

        print(f"\n📊 FedRAMP SSP Summary")
        print("=" * 70)
        print(f"Framework:          {framework_name} {version}")
        print(f"Assessment ID:      {response.get('id', 'N/A')}")
        print(f"Total Controls:     {summary.get('total_controls', 0)}")
        print(f"  ✅ Satisfied:     {summary.get('satisfied', 0)}")
        print(f"  ❌ Not Satisfied: {summary.get('not_satisfied', 0)}")
        print(f"  ⊘  Not Applicable: {summary.get('not_applicable', 0)}")

        total = summary.get('total_controls', 0)
        satisfied = summary.get('satisfied', 0)
        compliance_pct = (satisfied / total * 100) if total > 0 else 0
        print(f"Compliance Rate:    {compliance_pct:.2f}%")
        print(f"Total Assets:       {asset_count}")
        print("=" * 70)

        # Show controls that need attention
        not_satisfied = [c for c in controls if c.get('status') == 'not-satisfied']
        if not_satisfied:
            print(f"\n⚠️  Controls Requiring Attention ({len(not_satisfied)}):")
            for control in not_satisfied[:10]:  # Show first 10
                control_id = control.get('control_id', 'N/A')
                title = control.get('title', 'N/A')
                print(f"  • {control_id}: {title}")
                findings = control.get('findings', [])
                if findings:
                    for finding in findings[:2]:  # Show first 2 findings
                        print(f"    - {finding}")
            if len(not_satisfied) > 10:
                print(f"  ... and {len(not_satisfied) - 10} more")


def main():
    parser = argparse.ArgumentParser(
        description='Generate FedRAMP SSP and Asset Inventory from Terraform state',
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
        default='output/fedramp-ssp',
        help='Output directory for generated artifacts'
    )
    parser.add_argument(
        '--format',
        choices=['json', 'yaml', 'oscal'],
        default='json',
        help='Output format for assessment'
    )
    parser.add_argument(
        '--name',
        default='fedramp-production',
        help='Name for the assessment'
    )
    parser.add_argument(
        '--no-diagram',
        action='store_true',
        help='Disable architecture diagram generation'
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
    print("🚀 FedRAMP SSP and Asset Inventory Generator")
    print("=" * 70)
    print(f"API URL:          {api_url}")
    print(f"Terraform State:  {tfstate_path}")
    print(f"Output Directory: {output_dir}")
    print(f"Output Format:    {args.format}")
    print("=" * 70)

    try:
        # Initialize generator
        generator = FedRAMPSSPGenerator(api_key, api_url)

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
            output_format=args.format,
            include_diagram=not args.no_diagram
        )

        # Generate documents
        print("\n📝 Generating FedRAMP SSP document...")
        ssp_doc = generator.generate_ssp_document(response, asset_inventory)

        print("📝 Generating Asset Inventory document...")
        inventory_doc = generator.generate_asset_inventory(asset_inventory)

        # Save artifacts
        generator.save_artifacts(response, ssp_doc, inventory_doc, output_dir)

        # Print summary
        generator.print_summary(response, len(asset_inventory))

        print("\n✅ FedRAMP SSP and Asset Inventory generation complete!")
        print(f"\n📂 All artifacts saved to: {output_dir}")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
