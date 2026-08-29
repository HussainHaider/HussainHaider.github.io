/**
 * Medium posts, pulled from the public RSS feed at build time.
 *
 * The site is static and rebuilt on every push (plus the weekly cron in the
 * deploy workflow), so a new post on Medium reaches the site without a commit
 * here — nothing in this repo needs editing when a post goes up.
 *
 * The feed is fetched once per build and memoised: three outputs read it — the
 * rendered page, /index.html.md and /llms.txt.
 */

export type MediumPost = {
  title: string;
  url: string;
  /** ISO date, for <time datetime>. */
  date: string;
  /** 'October 2019' — what the card actually shows. */
  dateLabel: string;
  /** Medium tags, lower-cased as the feed gives them. Capped at three. */
  tags: string[];
  /** First real paragraph, trimmed to a card's worth of text. */
  excerpt: string;
  /** Whole-minute estimate from the post body; 0 when it can't be measured. */
  readingMinutes: number;
};

/** `https://medium.com/@handle` → `https://medium.com/feed/@handle`. */
function feedUrl(profileUrl: string): string {
  return profileUrl.replace(/^(https:\/\/medium\.com)\/(@?[^/?#]+)/, '$1/feed/$2');
}

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function decode(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => ENTITIES[name.toLowerCase()] ?? match);
}

function stripTags(html: string): string {
  return decode(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

/** Text of the first matching element, CDATA unwrapped. */
function tag(item: string, name: string): string {
  const match = item.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return match ? unwrap(match[1]) : '';
}

function tagAll(item: string, name: string): string[] {
  const matches = item.matchAll(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'g'));
  return [...matches].map((match) => unwrap(match[1]));
}

function unwrap(value: string): string {
  return value.replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, '$1').trim();
}

/** The first substantial paragraph — Medium opens most posts with a <figure>. */
function firstParagraph(body: string, limit = 190): string {
  const paragraphs = [...body.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => stripTags(m[1]));
  const text = paragraphs.find((p) => p.length > 40) ?? paragraphs[0] ?? '';
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s]+$/, '') + '…';
}

function parseFeed(xml: string): MediumPost[] {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => {
    const body = tag(item, 'content:encoded');
    const words = stripTags(body).split(/\s+/).filter(Boolean).length;
    const published = new Date(tag(item, 'pubDate'));

    return {
      title: decode(tag(item, 'title')),
      // Medium appends a `?source=rss-…` tracking query to every link.
      url: tag(item, 'link').split('?')[0],
      date: published.toISOString(),
      dateLabel: published.toLocaleDateString('en-GB', {
        month: 'long',
        year: 'numeric',
      }),
      tags: tagAll(item, 'category').slice(0, 3),
      excerpt: firstParagraph(body),
      readingMinutes: words ? Math.max(1, Math.round(words / 200)) : 0,
    };
  });
}

/**
 * Snapshot of the feed, used only when the fetch fails at build time — Medium
 * rate-limiting a CI runner, a network blip, an offline `astro build`. Without
 * it a transient failure would quietly ship a site with no writing section.
 * It is expected to go stale: the live feed wins whenever it is reachable.
 */
const FALLBACK_POSTS: MediumPost[] = [
  {
    title: 'Techniques for Crafting Effective Prompts in Generative AI',
    url: 'https://medium.com/@HussainZaidi14/techniques-for-crafting-effective-prompts-in-generative-ai-d13777f5962f',
    date: '2026-08-29T20:50:50.000Z',
    dateLabel: 'August 2026',
    tags: ['llm', 'prompt-engineering', 'writing-prompts'],
    excerpt:
      'In the rapidly evolving world of Generative AI, the quality of prompts can make or break the success of AI-driven projects. Prompts serve as the input…',
    readingMinutes: 5,
  },
  {
    title: 'Compiling Bitcoin Core in Windows 10 Environment',
    url: 'https://medium.com/@HussainZaidi14/compiling-bitcoin-core-in-windows-10-environment-4723255e88a7',
    date: '2019-10-10T15:19:36.000Z',
    dateLabel: 'October 2019',
    tags: ['bitcoin-code', 'ubuntu', 'windows-10'],
    excerpt:
      'My intention to write this blog is to provide exact information to the readers on how to run bitcoin core on windows 10 machine…',
    readingMinutes: 6,
  },
  {
    title: 'First Android Application',
    url: 'https://medium.com/@HussainZaidi14/first-android-application-da6d0b1e48db',
    date: '2016-11-04T14:25:04.000Z',
    dateLabel: 'November 2016',
    tags: ['mobile-app-development', 'androidarsenal', 'tech'],
    excerpt:
      'Well its a very new(amazing) experience when I enter in the field of computer Science. When I first got into tech, I felt overwhelmed…',
    readingMinutes: 2,
  },
];

let cached: Promise<MediumPost[]> | null = null;

async function loadPosts(profileUrl: string): Promise<MediumPost[]> {
  try {
    const response = await fetch(feedUrl(profileUrl), {
      headers: { 'user-agent': 'hussainhaider.github.io build' },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const posts = parseFeed(await response.text());
    if (!posts.length) throw new Error('feed contained no items');
    return posts;
  } catch (error) {
    // A build must never fail because Medium is having a bad day.
    console.warn(
      `[medium] using the committed snapshot: ${(error as Error).message}`,
    );
    return FALLBACK_POSTS;
  }
}

/** Newest first, capped. Fetched once per build, shared by every consumer. */
export function getMediumPosts(profileUrl: string, limit = 6): Promise<MediumPost[]> {
  cached ??= loadPosts(profileUrl);
  return cached.then((posts) =>
    [...posts].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).slice(0, limit),
  );
}
