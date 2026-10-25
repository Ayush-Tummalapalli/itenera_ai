/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        ivory: {
          DEFAULT: '#FAF7F0',
          light: '#FDFBF7',
          surface: '#FFFFFF',
          muted: '#F7F4EC',
          border: '#E8E1D5',
        },
        'editorial-blue': {
          DEFAULT: '#162842',
          light: '#223C5E',
          muted: '#526685',
          soft: '#EBF1F7',
          dark: '#0A121D',
        },
        coral: {
          DEFAULT: '#E05A3A',
          hover: '#C94A2D',
          light: '#F3785B',
          soft: '#FAECE8',
          badge: '#FEEAE5',
        },
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
      },
    },
  },
  plugins: [],
};


