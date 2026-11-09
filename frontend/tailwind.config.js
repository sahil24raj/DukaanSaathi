/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff9ed',
          100: '#fff1d4',
          200: '#fedfa9',
          300: '#fdc673',
          400: '#fba43b',
          500: '#f98013',
          600: '#ea6409',
          700: '#c2480a',
          800: '#9a390f',
          900: '#7c3110',
        },
        kirana: {
          green: '#0b6623',
          emerald: '#138808',
          saffron: '#FF9933',
          navy: '#000080',
          cream: '#faf8f5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 1.5s cubic-bezier(0, 0.2, 0.8, 1) infinite',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}

