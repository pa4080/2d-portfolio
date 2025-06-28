import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  // build: {
  //   minify: 'terser', // this is because of a bug with kaboom, but we can test does we need it with kaplay
  // },
  plugins: [],
});
