<script lang="ts">
	import bio from '$lib/data/bio.json';
	import { site } from '$lib/site';

	const b = bio.basics;
	const bare = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');
	const withScheme = (url: string) => (/^https?:\/\//.test(url) ? url : `https://${url}`);
	const year = (d: string) => (d ? String(d).slice(0, 4) : '');
	const range = (start: string, end: string) => {
		const a = year(start);
		const e = end === 'Present' ? 'present' : year(end);
		return a && e && a !== e ? `${a} – ${e}` : a || e;
	};
</script>

<svelte:head>
	<title>Resume · {site.title}</title>
	<meta name="description" content="Resume of Tom Han Chongye." />
	<link rel="canonical" href="{site.url}/resume" />
</svelte:head>

<h2 class="page-title">{b.name}</h2>
<p class="cv-contact">
	<a href={`mailto:${b.email}`}>{b.email}</a>
	<a href={b.website}>{bare(b.website)}</a>
	{#each b.profiles as p (p.network)}
		<a href={withScheme(p.url)}>{p.network}/{p.username}</a>
	{/each}
	<span>{b.location.city}, {b.location.region}</span>
</p>
<p class="lede">{@html b.summary}</p>

<section class="cv-section">
	<h2>Experience</h2>
	{#each bio.work as job (job.company + job.position)}
		<div class="cv-item">
			<span class="when">{range(job.startDate, job.endDate)}</span>
			<div>
				<h3>{job.position}</h3>
				<p class="org">
					{#if job.url}<a href={withScheme(job.url)}>{job.company}</a>{:else}{job.company}{/if}
					· {job.location}
				</p>
				{#if job.summary}<p>{@html job.summary}</p>{/if}
				{#if job.highlights?.length}
					<ul>
						{#each job.highlights as h}<li>{@html h}</li>{/each}
					</ul>
				{/if}
			</div>
		</div>
	{/each}
</section>

<section class="cv-section">
	<h2>Education</h2>
	{#each bio.education as ed (ed.institution)}
		<div class="cv-item">
			<span class="when">{range(ed.startDate, ed.endDate)}</span>
			<div>
				<h3>{ed.studyType}, {ed.area}</h3>
				<p class="org">{ed.institution}</p>
				{#if ed.gpa}<p class="muted">GPA {ed.gpa}</p>{/if}
				{#if ed.courses?.length}
					<p class="tags">{ed.courses.join(' · ')}</p>
				{/if}
			</div>
		</div>
	{/each}
</section>

<section class="cv-section">
	<h2>Skills</h2>
	<dl class="cv-skills">
		{#each bio.skills as group (group.name)}
			<dt>{group.name}</dt>
			<dd>{group.keywords.join(', ')}</dd>
		{/each}
	</dl>
</section>

<section class="cv-section">
	<h2>Awards</h2>
	{#each bio.awards as award (award.title)}
		<div class="cv-item">
			<span class="when">{award.date}</span>
			<div>
				<h3>{award.title}</h3>
				<p class="org">{award.awarder}</p>
				{#if award.summary}<p>{award.summary}</p>{/if}
			</div>
		</div>
	{/each}
</section>

<section class="cv-section">
	<h2>Volunteering</h2>
	{#each bio.volunteer as v (v.organization)}
		<div class="cv-item">
			<span class="when">{range(v.startDate, v.endDate)}</span>
			<div>
				<h3>{v.position}</h3>
				<p class="org">{v.organization}</p>
				{#if v.summary}<p>{v.summary}</p>{/if}
			</div>
		</div>
	{/each}
</section>

<section class="cv-section">
	<h2>Languages</h2>
	<dl class="cv-skills">
		{#each bio.languages as l (l.language)}
			<dt>{l.language}</dt>
			<dd>{l.fluency}</dd>
		{/each}
	</dl>
</section>

<section class="cv-section">
	<h2>Interests</h2>
	<p>{@html bio.interests.map((i) => i.name).join(' · ')}</p>
</section>
