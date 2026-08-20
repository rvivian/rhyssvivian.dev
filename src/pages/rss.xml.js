import { getCollection } from "astro:content";
import { site } from "../data/profile";

export const prerender = true;

const escapeXml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

export async function GET() {
  const posts = (await getCollection("blog", ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  const origin = `https://${site.domain}`;
  const items = posts.map((post) => `<item><title>${escapeXml(post.data.title)}</title><description>${escapeXml(post.data.description)}</description><link>${origin}/thinking/${post.id}</link><guid>${origin}/thinking/${post.id}</guid><pubDate>${post.data.pubDate.toUTCString()}</pubDate></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(site.name)} — Thinking</title><description>${escapeXml(site.description)}</description><link>${origin}/thinking</link>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
