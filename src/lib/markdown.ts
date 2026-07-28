/**
 * Renders the site's content as Markdown, from the same `src/data/site.ts` the
 * .astro components read. Nothing here restates copy, so the markdown version
 * served to LLM agents can't drift from the rendered page.
 */

import {
  caseStudies,
  certifications,
  contact,
  credentialsSection,
  education,
  flags,
  hero,
  person,
  results,
  resultsSection,
  services,
  servicesSection,
  stackGroups,
  stackSection,
  workSection,
} from '../data/site';

/** The data allows inline <strong> for emphasis inside case-study bullets. */
function toMarkdown(html: string): string {
  return html
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

export const SITE_URL = 'https://hussainhaider.github.io';

/** One-paragraph summary, reused as the llms.txt blockquote. */
export const summary =
  `Full-stack engineer in ${person.city}, ${person.country}. Builds multi-agent AI ` +
  `systems in LangGraph and CrewAI on top of six years shipping React, Next.js and ` +
  `Django platforms carrying real traffic at 99.9% uptime targets. Currently ` +
  `${person.jobTitle} at ${person.employer}` +
  (flags.showAvailability ? '; open to senior roles and agent builds.' : '.');

export function renderSiteMarkdown(): string {
  const out: string[] = [];
  const push = (...lines: string[]) => out.push(...lines, '');

  push(`# ${person.name}`);
  push(`> ${summary}`);
  push(`**Role:** ${person.role}`);

  if (flags.showAvailability) push(`**Availability:** ${hero.availability}`);

  push('## Overview');
  push(hero.headline);
  push(hero.intro);
  push(...hero.facts.map((f) => `- **${f.label}:** ${f.value}`));

  push('## Contact');
  push(
    `- Email: ${person.email}`,
    `- LinkedIn: ${person.linkedin}`,
    `- GitHub: ${person.github}`,
    `- Location: ${person.city}, ${person.country}`,
    `- CV (PDF): ${SITE_URL}${person.cv}`,
  );

  push(`## ${resultsSection.heading}`);
  push(resultsSection.note);
  push(
    ...results.map(
      (r) => `- **${r.figure}${r.unit ?? ''} — ${r.label}.** ${r.detail}`,
    ),
  );

  push(`## ${servicesSection.heading}`);
  for (const s of services) {
    push(`### ${s.key}. ${s.title}`);
    push(s.summary);
    push(...s.points.map((p) => `- ${p}`));
    push(`${s.proof.lead}**${s.proof.strong}**${s.proof.tail}`);
  }

  push(`## ${workSection.heading}`);
  for (const c of caseStudies) {
    push(`### ${c.company} — ${c.role}`);
    push(
      `*${c.period}*`,
      '',
      `**${c.headline}**`,
      '',
      `Technologies: ${c.tags.map((t) => t.label).join(', ')}`,
    );
    if (flags.fullCaseDetail) push(...c.points.map((p) => `- ${toMarkdown(p)}`));
  }

  push(`## ${stackSection.heading}`);
  push(stackSection.note);
  push(...stackGroups.map((g) => `- **${g.title}:** ${g.items}`));

  push(`## ${credentialsSection.heading}`);
  push('### Education');
  for (const e of education) {
    push(`- **${e.degree}** — ${e.school}. ${e.detail}`);
  }
  push('### Certifications');
  push(...certifications.map((c) => `- ${c}`));
  push(`### ${credentialsSection.beyondTitle}`);
  push(
    toMarkdown(credentialsSection.beyondBody),
    '',
    `Languages: ${credentialsSection.languages}`,
  );

  push(`## ${contact.heading}`);
  push(contact.body);

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}
