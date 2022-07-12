const path = require('path')
const preprocess = require('svelte-preprocess')
const WindiCSS = require("vite-plugin-windicss").default;

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx|svelte)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  "framework": "@storybook/svelte",
  "core": {
    "builder": "@storybook/builder-vite"
  },
  "features": {
    "storyStoreV7": false
  },
  svelteOptions: {
    preprocess: preprocess({
      typescript: true,
      sourceMap: true
    })
  },
  async viteFinal(config, { configType }) {
    config.plugins = config.plugins ?? [];
    config.plugins.push(
      WindiCSS({
        config: path.join(__dirname, "..", "windi.config.ts")
      })
    )
    return config
  }
}
