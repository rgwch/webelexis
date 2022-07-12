import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { replaceCodePlugin } from "vite-plugin-replace";
import infos from './package.json'
import WindiCSS from 'vite-plugin-windicss'
const production=false

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
      },{
        from: "WEBELEXIS_BUILDDATE",
        to: new Date().toString()
      }
    ],
  }),]
});
