import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['./src/js/index.js'],
  bundle: true,
  outfile: './public/js/bundle.js',
  define: {
    'process.env.API_CALL_URL': '"http://localhost:8000"',
    'process.env.MAPBOX_TOKEN': '"myToken"',
  },
});
console.log('hello from the ES config - build completed!');
