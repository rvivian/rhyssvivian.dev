export const site = {
  name: "Rhyss Vivian",
  domain: "rhyssvivian.dev",
  title: "Rhyss Vivian | Technology Infrastructure & Leadership",
  description:
    "Field notes on technology infrastructure, systems, architecture, leadership, and the business of building durable platforms.",
  email: "me@rhyssvivian.dev",
  linkedInUrl: "https://www.linkedin.com/in/rhyss-vivian",
  githubUrl: "https://github.com/rvivian",
  location: {
    label: "Alaska",
    latitude: 59,
  },
  nav: [
    { href: "/thinking", label: "Thinking" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
  ],
} as const;

export const formatLocation = (
  location: { label: string; latitude: number } = site.location,
) => {
  const hemisphere = location.latitude >= 0 ? "N" : "S";
  return `${location.label.toUpperCase()} · ${Math.abs(Math.round(location.latitude))}° ${hemisphere}`;
};

export const capabilityAreas = [
  {
    title: "Enterprise Infrastructure",
    description:
      "Leading resilient network, endpoint, identity, and operations work in environments where reliability and governance matter.",
  },
  {
    title: "Cybersecurity and Compliance",
    description:
      "Connecting practical controls, audit readiness, IAM, and risk reduction to the business outcomes they protect.",
  },
  {
    title: "Platform and Automation",
    description:
      "Moving infrastructure and configuration toward repeatable, code-driven practices without losing sight of change management.",
  },
  {
    title: "Technology Leadership",
    description:
      "Building trust across teams, translating technical constraints into executive context, and growing toward CIO/CTO-level scope.",
  },
] as const;

export const proofPoints = [
  "Senior Manager / Director-level leadership",
  "Enterprise IAM with Entra, Okta, and RSA",
  "CMMC Level 2 audit completion experience",
  "SD-WAN migration leadership",
  "Homelab moving toward Infrastructure as Code",
  "MBA program beginning Fall 2026",
] as const;
