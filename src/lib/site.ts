/** Site-wide constants that aren't part of the JSON Resume in bio.json. */
export const site = {
	url: 'https://tomhcy.com',
	title: 'Tom Han',
	description:
		'Research assistant at Talmo Lab, Salk Institute. Deep-learning tools for behavioral biomarkers of ALS in mouse models.',
	/** Clicking the name on the home page cycles through these. */
	names: ['Tom Han', 'Tom Han Chongye', 'Chongye Han', '韩重烨'],
	/** Now Playing worker. Response: { success, isPlaying, title, artist, album, source, songUrl, albumImageUrl }. */
	musicApi: 'https://music-api.tomhcy.workers.dev/',
	/**
	 * Optional fallback when nothing is playing. Leave empty until the worker has a
	 * Strava endpoint. Expected response: { name, distance, movingTime, elevation, when, url }.
	 */
	stravaApi: '',
	strava: 'https://www.strava.com/',
	shenanigans: 'https://tomtopia.com'
};
