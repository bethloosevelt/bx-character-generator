module.exports = {
  purge: {
    mode: "all",
    content: ["./src/index.html", "./src/**/*.svelte"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      mint: {
        DEFAULT: "#dbe8d4",
      },
      "dark-gray": {
        DEFAULT: "#19161c",
      },
      white: {
        DEFAULT: "#ffffff",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
