// Ambient (non-module) declarations. This file must not import or export anything.

/** Mermaid is loaded on demand from a CDN by the essay page; only the bits we call. */
declare module 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs' {
	const mermaid: {
		initialize(config: Record<string, unknown>): void;
		run(options: { querySelector?: string }): Promise<void>;
	};
	export default mermaid;
}
