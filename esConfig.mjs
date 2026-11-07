import * as esbuild from 'esbuild';

process.loadEnvFile('./config.env');

await esbuild.build({
  entryPoints: ['./src/js/index.js'],
  bundle: true,
  outfile: './public/js/bundle.js',
  define: {
    // 'process.env.API_CALL_URL': '"http://localhost:8000"',
    'process.env.API_CALL_URL': '"https://test.matthewcampbellstead.com"',
    'process.env.MAPBOX_TOKEN': `"${process.env.MAPBOX_TOKEN}"`,
  },
});
logger.info('hello from the ES config - build completed!');
console.log('hello from the ES config - build completed!');
