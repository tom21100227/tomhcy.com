// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Window {
		/** Exposed by static/metrics.js so client-side navigations can beacon a page view. */
		__metricsPageview?: () => void;
	}
}

export {};
