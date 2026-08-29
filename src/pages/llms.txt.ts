import type { APIRoute } from 'astro';
import { person, writingSection } from '../data/site';
import { SITE_URL, summary } from '../lib/markdown';
import { getMediumPosts } from '../lib/medium';

/**
 * /llms.txt — https://llmstxt.org/
 *
 * Structure per the spec: H1 (the only required section), a blockquote summary,
 * free-form detail, then H2-delimited file lists of `[name](url): notes`.
 * The `## Optional` heading is special — its links may be skipped when a
 * shorter context is needed.
 */
export const GET: APIRoute = async () => {
  const posts = await getMediumPosts(person.medium, writingSection.limit);

  const body = `# ${person.name}

> ${summary}

This is a single-page personal site. The Markdown file linked below carries its
complete contents — every metric, case study, stack entry and credential — so it
can be read instead of the rendered HTML.

## Content

- [Full site content, Markdown](${SITE_URL}/index.html.md): The entire site as clean Markdown: results, services, case studies, stack, credentials and contact details.
- [Curriculum vitae, PDF](${SITE_URL}${person.cv}): Two-page CV.

## Profiles

- [LinkedIn](${person.linkedin}): Primary contact channel.
- [GitHub](${person.github}): Open-source work and the source of this site.
- [Medium](${person.medium}): Technical writing, pulled into the site's writing section at build time.

## Writing

${posts.map((post) => `- [${post.title}](${post.url}): ${post.dateLabel}. ${post.excerpt}`).join('\n')}

## Optional

- [Rendered homepage, HTML](${SITE_URL}/): The same content as the Markdown file above, with styling.
- [Sitemap](${SITE_URL}/sitemap-index.xml)
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
