// tailwind.config.ts
import { Config } from "tailwindcss";

const defaultTheme = require("tailwindcss/defaultTheme");

export default <Config>{
  content: [
    // Add all files that contain Tailwind classes
    // e.g. './modules/**/*.{vue,js,ts}',
    "app.vue",
    "./pages/**/*.{html,js,vue}",
    "./components/**/*.{html,js,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        museo: ["Museo", "sans-serif"],
      },
    },
  },
  plugins: [],
};
