import { PageLayout } from "@/components/page-layout"
import { Feature } from "@/components/ui/feature-with-advantages"
import { CTA } from "@/components/ui/call-to-action"
import { Badge } from "@/components/ui/badge"
import { TerraformMermaidComparison } from "@/components/ui/terraform-mermaid-comparison"

const terraformExample = `# Minimal Terraform example
provider "aws" {
  region = "us-east-1"
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
}

resource "aws_security_group" "web" {
  name   = "web-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "app" {
  ami                    = "ami-0123456789abcdef0"
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web.id]
  tags = { Name = "web-app" }
}`

const mermaidExample = `%% Auto-generated Architecture Boundary Diagram (Mermaid)
graph TD
  subgraph AWS Account
    VPC["VPC: 10.0.0.0/16"]
    SUBNET["Public Subnet: 10.0.1.0/24"]
    SG["SG: web-sg (443)"]
    EC2["EC2: web-app (t3.micro)"]
  end

  VPC --> SUBNET
  SUBNET --> EC2
  SG -. allows .-> EC2
`

export default function DiagramsAsCodePage() {
  return (
    <PageLayout>
      {/* Hero */}
      <div className="w-full py-20 lg:py-40">
        <div className="container mx-auto">
          <div className="flex flex-col gap-10">
            <div className="flex gap-4 flex-col items-center text-center">
              <Badge>Diagrams as Code</Badge>
              <div className="flex gap-4 flex-col">
                <h1 className="text-4xl md:text-6xl lg:text-7xl max-w-4xl tracking-tighter font-regular">
                  Generate diagrams from your IaC and firmware progratically
                </h1>
                <p className="text-lg md:text-xl max-w-2xl leading-relaxed tracking-tight text-muted-foreground mx-auto">
                  Turn Terraform and other IaC into consistent, version-controlled diagrams. Eliminate manual diagramming; keep architecture documentation always in sync with code.
                </p>
              </div>
              <div className="flex flex-row gap-3">
                <a
                  href="https://docs.usenabla.com"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-8"
                >
                  Get API Access
                </a>
                <a
                  href="https://cal.com/jbohrman/45-min-meeting"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 px-8"
                >
                  Book a Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo: IaC to Diagram */}
      <div className="w-full py-20 lg:py-40 bg-muted/40">
        <div className="container mx-auto">
          <div className="flex flex-col gap-6">
            <div>
              <Badge>From IaC to Diagrams</Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-3xl font-regular">
                Parse Terraform, generate boundary diagrams
              </h2>
              <p className="text-lg max-w-3xl leading-relaxed tracking-tight text-muted-foreground">
                Feed your Terraform into the API and receive a clear, standards-aligned architecture boundary diagram you can embed in docs, PRs, or wikis. Drag the slider to compare the input and generated output.
              </p>
            </div>

            <div className="pt-6">
              <TerraformMermaidComparison
                terraform={terraformExample}
                mermaid={mermaidExample}
                leftLabel="Terraform (input)"
                rightLabel="Mermaid (output)"
                height={560}
                lightTheme="github-light"
                darkTheme="github-dark"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Advantages */}
      <Feature
        badge="Why it matters"
        title="Always-relevant diagrams that match production"
        description="Diagram generation that follows your source of truth – infrastructure as code. No more stale draw.io files or screenshot archaeology."
        features={[
          {
            title: "Parse popular IaC",
            description: "Analyze Terraform modules, resources, security groups, and relationships to infer boundaries and data flows."
          },
          {
            title: "Deterministic outputs",
            description: "Produce consistent diagrams that are version-control friendly and repeatable across environments."
          },
          {
            title: "Boundary grouping",
            description: "Automatically cluster resources into VPCs, subnets, accounts, and services for clear architecture views."
          },
          {
            title: "Export-friendly",
            description: "Generate diagram syntax (e.g., Mermaid) you can render anywhere, or export to static assets."
          },
          {
            title: "API-first & CI-ready",
            description: "Integrate into pipelines to regenerate diagrams on every change—no manual steps required."
          },
          {
            title: "Audit and compliance",
            description: "Use diagrams to communicate boundaries and data flows for threat modeling and compliance reviews."
          }
        ]}
      />

      {/* CTA */}
      <CTA
        badge="Ready to start?"
        title="Turn IaC into accurate diagrams"
        description="Start a 30-day pilot to evaluate architecture diagram generation in your workflows. Keep docs and reviews in sync with your code."
      />
    </PageLayout>
  )
}
