import matter from 'gray-matter';
import { renderMarkdown } from './markdown';

/* ------------------------------------------------------------------
   Content lives in src/content as markdown with YAML front matter,
   carried over unchanged from the Jekyll site. Everything here runs at
   build time only (prerender), so the client never sees markdown.
   ------------------------------------------------------------------ */

const essayFiles = import.meta.glob('/src/content/essays/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

const projectFiles = import.meta.glob('/src/content/projects/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

const nowFiles = import.meta.glob('/src/content/now.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

/* ---- dates: YAML gives us Date | number | string | null ---- */

export interface When {
	/** What to print, e.g. "2025-07-06", "2024", "2024-12", "present". */
	display: string;
	/** ISO date for <time datetime>, when we have a real day. */
	iso: string | null;
	/** Sort key, larger is newer. "present" sorts first. */
	key: number;
}

const FAR_FUTURE = 8.64e15;

export function when(v: unknown): When {
	if (v instanceof Date && !isNaN(v.getTime())) {
		const iso = v.toISOString().slice(0, 10);
		return { display: iso, iso, key: v.getTime() };
	}
	if (typeof v === 'number') {
		return { display: String(v), iso: null, key: Date.UTC(v, 0, 1) };
	}
	if (typeof v === 'string') {
		const s = v.trim();
		if (/^present$/i.test(s)) return { display: 'present', iso: null, key: FAR_FUTURE };
		let m: RegExpMatchArray | null;
		if ((m = s.match(/^(\d{4})-(\d{1,2})$/))) {
			return { display: s, iso: null, key: Date.UTC(+m[1], +m[2] - 1, 1) };
		}
		if ((m = s.match(/^(\d{4})$/))) {
			return { display: s, iso: null, key: Date.UTC(+m[1], 0, 1) };
		}
		const t = Date.parse(s);
		if (!isNaN(t)) {
			const iso = new Date(t).toISOString().slice(0, 10);
			return { display: iso, iso, key: t };
		}
		return { display: s, iso: null, key: 0 };
	}
	return { display: '', iso: null, key: 0 };
}

/** "2022 – 2025", "2025 – present", or just "2025". */
export function span(start: When | null, end: When): string {
	if (start && start.display && start.display !== end.display) {
		return `${start.display} – ${end.display}`;
	}
	return end.display;
}

function slugOf(path: string): string {
	return path.split('/').pop()!.replace(/\.md$/, '');
}

function isPublished(data: Record<string, unknown>): boolean {
	return data.published !== false && data.draft !== true;
}

function labels(v: unknown): string[] {
	return Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean) : [];
}

/* ---- essays ---- */

export interface EssayMeta {
	slug: string;
	title: string;
	date: When;
	lastUpdated: When | null;
	labels: string[];
	mermaid: boolean;
	published: boolean;
}

export interface Essay extends EssayMeta {
	html: string;
}

function essayMeta(path: string, raw: string): EssayMeta {
	const { data } = matter(raw);
	return {
		slug: slugOf(path),
		title: String(data.title ?? slugOf(path)),
		date: when(data.date),
		lastUpdated: data.last_updated ? when(data.last_updated) : null,
		labels: labels(data.labels),
		mermaid: data.mermaid === true,
		published: isPublished(data)
	};
}

export function listEssays(): EssayMeta[] {
	return Object.entries(essayFiles)
		.map(([path, raw]) => essayMeta(path, raw))
		.filter((e) => e.published)
		.sort((a, b) => b.date.key - a.date.key);
}

export async function getEssay(slug: string): Promise<Essay | null> {
	const entry = Object.entries(essayFiles).find(([path]) => slugOf(path) === slug);
	if (!entry) return null;
	const [path, raw] = entry;
	const meta = essayMeta(path, raw);
	if (!meta.published) return null;
	const { content } = matter(raw);
	return { ...meta, html: await renderMarkdown(content) };
}

/* ---- projects ---- */

export interface ProjectMeta {
	slug: string;
	title: string;
	date: When;
	startDate: When | null;
	/** Pre-formatted "start – end" for lists. */
	dates: string;
	labels: string[];
	summary: string;
	projecturl: string | null;
	image: string | null;
	published: boolean;
	hasBody: boolean;
}

export interface Project extends ProjectMeta {
	html: string;
}

function projectMeta(path: string, raw: string): ProjectMeta {
	const { data, content } = matter(raw);
	const date = when(data.date);
	const startDate = data.startDate ? when(data.startDate) : null;
	const image = typeof data.image === 'string' && !/placeholder/.test(data.image) ? '/' + data.image.replace(/^\/+/, '') : null;
	return {
		slug: slugOf(path),
		title: String(data.title ?? slugOf(path)),
		date,
		startDate,
		dates: span(startDate, date),
		labels: labels(data.labels),
		summary: String(data.summary ?? '').trim(),
		projecturl: typeof data.projecturl === 'string' && data.projecturl.trim() ? data.projecturl.trim() : null,
		image,
		published: isPublished(data),
		hasBody: content.trim().length > 0
	};
}

export function listProjects(): ProjectMeta[] {
	return Object.entries(projectFiles)
		.map(([path, raw]) => projectMeta(path, raw))
		.filter((p) => p.published)
		.sort((a, b) => b.date.key - a.date.key || (b.startDate?.key ?? 0) - (a.startDate?.key ?? 0));
}

export async function getProject(slug: string): Promise<Project | null> {
	const entry = Object.entries(projectFiles).find(([path]) => slugOf(path) === slug);
	if (!entry) return null;
	const [path, raw] = entry;
	const meta = projectMeta(path, raw);
	if (!meta.published) return null;
	const { content } = matter(raw);
	return { ...meta, html: meta.hasBody ? await renderMarkdown(content) : '' };
}

/* ---- now ---- */

export async function getNow(): Promise<{ title: string; html: string }> {
	const raw = Object.values(nowFiles)[0] ?? '';
	const { data, content } = matter(raw);
	return { title: String(data.title ?? 'Now'), html: await renderMarkdown(content) };
}
