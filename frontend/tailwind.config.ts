import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: '#E50914',
          dark: '#141414',
          darker: '#000000',
          gray: '#808080',
          light: '#E5E5E5',
        }
      },
      backgroundImage: {
        'gradient-to-b': 'linear-gradient(to bottom, rgba(20,20,20,0) 0%, rgba(20,20,20,0.15) 15%, rgba(20,20,20,0.35) 29%, rgba(20,20,20,0.58) 44%, #141414 68%, #141414 100%)',
      }
    },
  },
  plugins: [],
}
export default config
