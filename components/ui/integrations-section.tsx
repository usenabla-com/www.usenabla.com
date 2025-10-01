"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const integrations = [
  "https://icon.icepanel.io/Technology/svg/HashiCorp-Terraform.svg",
  "https://gdm-catalog-fmapi-prod.imgix.net/ProductLogo/74141f9b-e7b6-4cdf-ae13-13c127ee1b25.png", // LinkedIn
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1280px-Amazon_Web_Services_Logo.svg.png", // Slack
  "https://img.icons8.com/color/600/google-cloud.png", // Spotify
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Microsoft_Azure.svg/1200px-Microsoft_Azure.svg.png", // Stripe
  "https://app.ashbyhq.com/api/images/org-theme-logo/d7e68137-5dac-406c-9924-6e9d9df07856/1f2409f6-5294-4c37-8fbf-c60ac5761513/d43d0eb1-0f8b-41d3-a65d-3ce4fca1838b.png", 
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/1200px-Slack_icon_2019.svg.png", // Instagram
  "https://www.solodev.com/file/85641033-ad1b-11eb-b0f2-023b938ab155/auth0-logo-icon.png", // Dropbox
  "https://avatars.githubusercontent.com/u/21992475?s=200&v=4", // Jira
  "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
  "https://d7umqicpi7263.cloudfront.net/img/product/a7cb96be-1791-48a1-8cc2-1c6da1a021b5.com/47188b374d83ace5a7f93dd0f5ac30ef",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFLIn303hDEsa4u2PnlGpndl9cS5HvADEunQ&s", // Squ are
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt__gdZwhO3aSPCNy6b8HwnR5E5AARVCA1wQ&s", // Shopify
  "https://images.icon-icons.com/2699/PNG/512/servicenow_logo_icon_168835.png", // Zapier
  "https://www.svgrepo.com/show/354596/zapier-icon.svg", // Google Drive
  "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/n8n-color.png", // YouTube
  "https://s3-us-west-2.amazonaws.com/cbi-image-service-prd/modified/24e17992-ffc2-40d2-a0b8-a6e911d1cd27.png", // Airtable
  "https://images.prismic.io/sacra/0c5f18c1-0fb6-41f6-b4d3-0f9a8a60bd9b_CJ7Bu9j0lu8CEAE.png?auto=compress,format", // Discord
];

export default function IntegrationsSection() {
  return (
    <section className="max-w-7xl mx-auto my-10 sm:my-16 md:my-20 px-4 sm:px-6 grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-center border border-gray-200 dark:border-gray-700 p-4 sm:p-6 rounded-2xl sm:rounded-3xl">
      {/* Left Side */}
      <div>
        <p className="uppercase text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400">
          Integrations
        </p>
        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mt-2 mb-4">
          Relay critical <br /> <img className="inline-block h-10 sm:h-14 md:h-18 lg:h-20 align-middle mx-1 mb-3 sm:mx-2" src={"https://www.svgrepo.com/show/330422/fedramp.svg"} alt="FedRAMP" /> information
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
          Use your existing tools and IaC to automatically enrich your evidence and ConMon via API
        </p>
      </div>


      {/* Right Side */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 sm:gap-4">
        {integrations.map((url, idx) => (
          <div
            key={idx}
            className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 p-1.5 sm:p-2 bg-white dark:bg-gray-800 shadow-sm border-2 border-gray-200 dark:border-gray-700"
            style={{
              clipPath:
                "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)",
            }}
          >
            <Image
              src={url}
              alt={`integration-${idx}`}
              fill
              className="object-contain p-1 sm:p-1.5"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
