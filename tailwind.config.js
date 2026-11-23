export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#07181a', 900: '#0c2b2e', 800: '#123a3e', 700: '#1b4f54' },
        brass: { 400: '#e0a93f', 500: '#c58b2b', 600: '#a06f1d' },
        ember: '#b4441f',
        bone: '#f7f5f0'
      },
      fontFamily: {
        display: ['"Bricolage Grotesque Variable"', 'system-ui', 'sans-serif'],
        sans: ['"Manrope Variable"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
