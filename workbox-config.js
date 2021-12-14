module.exports = {
	globDirectory: 'public/',
	globPatterns: [
		'**/*.{ico,html,png,json,webp,js}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'public/sw.js'
};