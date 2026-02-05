module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          900: '#0a0f1a',
          800: '#131a2a',
          700: '#1c2438',
          200: '#d6deea',
          100: '#f5f7fb',
        },
        ember: {
          500: '#ff8a3d',
          400: '#ff9f5c',
        },
      },
      boxShadow: {
        glow: '0 20px 60px -40px rgba(255, 138, 61, 0.7)',
      },
    },
  },
  plugins: [],
};
