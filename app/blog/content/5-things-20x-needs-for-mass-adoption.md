---
title: "5 things FedRamp 20x needs to mass adoption"
summary: "FedRamp 20x is coming fast, and 2025 is almost over already (I know right?). This means 20x is going to be here sooner than many care to admit, with NIST 800-53 being phased out in nearly a year and 1/2. Here's what FedRamp needs to do to make GRC-as-code work seamlessly"
author: "Admin"
published: "2025-10-1"
image: "https://www.thoughtco.com/thmb/AYbUjTimPcywFrxPLTFBJ7Jo3Zg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Getty_capital_and_capitol-2062515-57b3edb15f9b58b5c23ba3c4.jpg"
tags: ["Startups", "Governance", "Compliance", "FedRamp", "Risk"]
---

The new FedRamp 20x initiative from the GSA has been steadily chugging along the nail down the details and standards of the revamped authorization process for cloud service offerings that seek to do business with the federal government. By increasing automation and leaning on “machine-readable” OSCAL concepts developed by NIST, the GSA hopes to reduce authorization timelines from years to weeks and lower costs.

While the initiative has made great progress, there are definitely some things that have to take place before mass adoption of the 20x initiative. The pilot programs are directly useful in this effort as that allow the CSPs to experience the process and provide feedback. As outside observers, we've seen some areas that are great for pilot, but a few that need some massaging out before mass adoption.

These are not criticisms in any way of the amazing work done by the GSA team, just observations that can be used or ignored by anyone per their relationship with the FedRamp 20x initiative.

## Nail down how a standardization is reached 🧑‍⚖️

The standardization of the FedRamp 20x process is critical for ensuring that all Cloud Service Providers (CSPs) are evaluated consistently. Currently based on my own discussions with people in the Phase One pilot, there seems to be varying interpretations of requirements that result in submissions that fail to meet the benchmark. The GSA needs to create clear guidance documents and training and use them to improve the quality in of submissions in the upcoming Pilots. 

Within this standardization effort, it's essential to establish a clear process for resolving discrepancies in interpretations. Currently, CSPs may spend significant time creating submissions based on their understanding of requirements, only to find they've missed the mark. A formalized feedback loop with quick turnaround times would help CSPs adjust their approaches efficiently and avoid costly delays. Currently, we have the KSI’s, but what’s still a bit opaque is things like:

- **Composition**: What KSIs make up a standard system
- **Dealbreakers:** What *lack* of KSIs will fail a system

## Communicate how assessments happen on the gov side 🏛️

The assessment process on the government side also remains somewhat opaque. Greater transparency about how evaluations are conducted, and how decisions are ultimately made would help CSPs better prepare their submissions. 

Additionally, providing CSPs with access to example assessments (Besides just the Pilots) or anonymized feedback from successful authorizations would establish clearer benchmarks. This transparency would not only improve the quality of initial submissions but would also build greater trust in the overall process.

## Support tools that turn X to OSCAL 😏

This obviously is a bit of a self-serving point to mention considering Nabla's market position, but it's still important to highligt that if every company that wants to hop on FedRamp 20x has their infrastructure in a million different places, they need easy wants to generate the machine-readable content and evidence that 20x expects.

Nabla not only creates the OSCAL from `.tfstate` files, we output ABD's as well. And that's only our starting point. But I see a ton of room in the market for other FedRamp 20s integration tools, since the ConMon aspect will have continuing monitoring needs.

## Conclusion

This initiative represents a significant step forward for cloud service authorization in the federal space. While challenges remain in standardization, transparency, and tooling, the GSA's commitment to streamlining the process is clearer than ever, with a group of people who are dedicated to propelling the mission forward as a group. As the program moves beyond the pilot phase, addressing these key areas will be essential for achieving the ambitious goal of drastically reducing authorization timelines. To the people working on this, thank you for all you do!