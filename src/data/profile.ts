export const site = {
  name: "Rhyss Vivian",
  domain: "rhyssvivian.dev",
  title: "Rhyss Vivian | Infrastructure, Cybersecurity, and Platform Leadership",
  description:
    "Senior technology leader with enterprise infrastructure, cybersecurity, IAM, and hands-on platform building experience.",
  email: "hello@rhyssvivian.dev",
  linkedInUrl: "https://www.linkedin.com/in/rhyssvivian",
  githubUrl: "https://github.com/rhyssvivian",
  nav: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],
} as const;

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
