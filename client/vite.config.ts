/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { replaceCodePlugin } from "vite-plugin-replace";
// import infos from './package.json'
const infos = require('./package.json')
import WindiCSS from 'vite-plugin-windicss'
const production = process.env.NODE_ENV != "development"

export default defineConfig({
  plugins: [WindiCSS(),
  svelte(),
  replaceCodePlugin({
    replacements: [
      {
        from: "isproduction",
        to: production.toString(),
      },
      {
        from: "WEBELEXIS_VERSION",
        to: infos.version,
      }, {
        from: "WEBELEXIS_BUILDDATE",
        to: new Date().toString()
      }
    ],
  }),],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  envDir: "../"
});
