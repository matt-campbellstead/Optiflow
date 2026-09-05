import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['./public/js/index.js'],
  bundle: true,
  outfile: './public/js/bundle.js',
  define: {
    'process.env.API_CALL_URL': '"http://localhost:8000"',
  },
});
console.log('hello from the ES config - build completed!');
