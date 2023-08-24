/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode:'class',
  theme: {
    extend: {
      colors: {
        // background: "rgb(var(--bg))",
        goodFirstIssue: {
          DEFAULT: "rgb( var(--good-first-issue-label-color) / var(--bg-opacity) )",
          foreground: "rgb( var(--gf) / var(--text-opacity) )",
          border: "rgb( var(--good-first-issue-label-color) / var(--border-opacity) )",
        },
        backend: {
          DEFAULT: "rgb( var(--backend-issue-label-color) / var(--bg-opacity) )",
          foreground: "rgb( var(--be) / var(--text-opacity) )",
          border: "rgb( var(--backend-issue-label-color) / var(--border-opacity) )",
        },
        frontend: {
          DEFAULT: "rgb( var(--frontend-issue-label-color) / var(--bg-opacity) )",
          foreground: "rgb( var(--fe) / var(--text-opacity) )",
          border: "rgb( var(--frontend-issue-label-color) / var(--border-opacity) )",
        },
        microcontrollers: {
          DEFAULT: "rgb( var(--microcontrollers-issue-label-color) / var(--bg-opacity) )",
          foreground: "rgb( var(--mc) / var(--text-opacity) )",
          border: "rgb( var(--microcontrollers-issue-label-color) / var(--border-opacity) )",
        },
      },
    },
  },
  plugins: [],
};
