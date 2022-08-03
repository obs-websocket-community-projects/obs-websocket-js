/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment */
import microbundle from 'microbundle';

// Somehow calling microbundle via API causes output file to match expected extension
// .js is wanted over .cjs due to CDN's
// https://github.com/obs-websocket-community-projects/obs-websocket-js/issues/282

const {output} = await microbundle({
	cwd: '.',
	format: 'iife',
	entries: ['src/unpkg.ts'],
	output: 'dist/obs-ws.js',
	external: 'none',
	generateTypes: false,
	compress: false,
});
console.log('Readable build', output);

const {output: outputMin} = await microbundle({
	cwd: '.',
	format: 'iife',
	entries: ['src/unpkg.ts'],
	output: 'dist/obs-ws.min.js',
	external: 'none',
	generateTypes: false,
});
console.log('Minified build', outputMin);
