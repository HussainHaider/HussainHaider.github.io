import type { APIRoute } from 'astro';
import { person, writingSection } from '../data/site';
import { renderSiteMarkdown } from '../lib/markdown';
import { getMediumPosts } from '../lib/medium';

/**
 * /index.html.md — the Markdown companion to `/`.
 *
 * llmstxt.org asks for a Markdown version of each page at the same URL with
 * `.md` appended, using `index.html.md` for URLs that have no filename.
 */
export const GET: APIRoute = async () => {
  const posts = await getMediumPosts(person.medium, writingSection.limit);

  return new Response(renderSiteMarkdown(posts), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
