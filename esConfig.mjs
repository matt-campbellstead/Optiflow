import * as esbuild from 'esbuild';

process.loadEnvFile('./config.env');

await esbuild.build({
  entryPoints: ['./src/js/index.js'],
  bundle: true,
  outfile: './public/js/bundle.js',
  define: {
    'process.env.API_CALL_URL': '"http://localhost:8000"',
    'process.env.MAPBOX_TOKEN': `"${process.env.MAPBOX_TOKEN}"`,
  },
});
console.log('hello from the ES config - build completed!');
