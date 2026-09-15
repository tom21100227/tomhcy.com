import MarkdownIt from 'markdown-it';
import Shiki from '@shikijs/markdown-it';
import type { BundledLanguage } from 'shiki';

type Markdown = InstanceType<typeof MarkdownIt>;

let instance: Promise<Markdown> | null = null;

/** One shared markdown-it, with Shiki dual-theme highlighting and mermaid fences. */
function getMarkdown(): Promise<Markdown> {
	if (!instance) {
		instance = (async () => {
			const md = new MarkdownIt({ html: true, linkify: true, typographer: false });

			md.use(
				await Shiki({
					themes: { light: 'github-light', dark: 'github-dark-dimmed' },
					defaultColor: false,
					// 'text' is a built-in plain language at runtime; the type only lists grammars.
					fallbackLanguage: 'text' as BundledLanguage
				})
			);

			// ```mermaid blocks are left for the client to render (see essay page).
			const highlightFence = md.renderer.rules.fence!;
			md.renderer.rules.fence = (tokens, idx, options, env, self) => {
				const token = tokens[idx];
				if (token.info.trim() === 'mermaid') {
					return `<pre class="mermaid">${md.utils.escapeHtml(token.content)}</pre>\n`;
				}
				return highlightFence(tokens, idx, options, env, self);
			};

			return md;
		})();
	}
	return instance;
}

export async function renderMarkdown(source: string): Promise<string> {
	const md = await getMarkdown();
	return md.render(source);
}
