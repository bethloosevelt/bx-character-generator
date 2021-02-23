const sveltePreprocess = require("svelte-preprocess");

module.exports = {
  compilerOptions: {
    css: false,
  },
  preprocess: sveltePreprocess({}),
};
