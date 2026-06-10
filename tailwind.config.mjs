/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        orange: '#E8500A',
        'orange-dark': '#C7440A',
        'orange-tint': '#FBEFE7',
        ink: '#1A1714',
        'ink-soft': '#57514B',
        'ink-faint': '#8C857E',
        paper: '#FFFFFF',
        'paper-warm': '#FAF7F4',
        'paper-warm-2': '#F4EFE9',
        line: '#E7E0D8',
        'line-strong': '#D8CFC4',
        green: '#1E7A47',
        'green-tint': '#E7F2EB',
        red: '#B23A2E',
        'red-tint': '#F6E9E7',
      },
      fontFamily: {
        serif: ['"Bricolage Grotesque"', 'Inter', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
