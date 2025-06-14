/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: '#root', // Ensure styles take precedence
  theme: {
    extend: {
      textShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.5)',
        DEFAULT: '0 2px 4px rgba(0, 0, 0, 0.5)',
        lg: '0 4px 8px rgba(0, 0, 0, 0.5)',
      },
      
      // Calendar specific styles
      colors: {
        primary: {
          50: '#f5f0ff',
          100: '#e9d8ff',
          200: '#d6bcfa',
          300: '#b794f4',
          400: '#9f7aea',
          500: '#805ad5',
          600: '#6b46c1',
          700: '#553c9a',
          800: '#44337a',
          900: '#322659',
        },
        // Custom colors for calendar using the new color scheme
        calendar: {
          bg: '#150050',
          bgSecondary: '#3F0071',
          accent: '#610094',
          border: 'rgba(255, 255, 255, 0.1)',
          event: {
            default: 'rgba(97, 0, 148, 0.7)',
            hover: 'rgba(123, 44, 191, 0.8)',
            border: '#9F7AEA',
          },
          header: '#150050',
          today: 'rgba(63, 0, 113, 0.5)',
          timeIndicator: '#9F7AEA',
          selected: 'rgba(97, 0, 148, 0.3)',
          text: {
            primary: '#FFFFFF',
            secondary: '#E2E8F0',
            muted: '#A0AEC0',
          },
        },
        'event': 'rgba(76, 29, 149, 0.8)',
        'event-border': 'rgba(76, 29, 149, 0.5)',
      },
      keyframes: {
        shine: {
          '0%': { 'background-position': '200% 50%' },
          '100%': { 'background-position': '-200% 50%' },
        }
      },
      animation: {
        shine: 'shine 3s linear infinite',
      },
      fontFamily: {
        sans: ['"SF Pro Display"', '"SF Pro Text"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'move': 'move 15s ease-in-out infinite',
      },
      keyframes: {
        move: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-10px) rotate(2deg)' },
          '50%': { transform: 'translateY(0) rotate(0deg)' },
          '75%': { transform: 'translateY(10px) rotate(-2deg)' },
        },
      },
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      extend: {
        colors: {
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          primary: {
            DEFAULT: "hsl(var(--primary))",
            foreground: "hsl(var(--primary-foreground))",
          },
          secondary: {
            DEFAULT: "hsl(var(--secondary))",
            foreground: "hsl(var(--secondary-foreground))",
          },
          destructive: {
            DEFAULT: "hsl(var(--destructive))",
            foreground: "hsl(var(--destructive-foreground))",
          },
          muted: {
            DEFAULT: "hsl(var(--muted))",
            foreground: "hsl(var(--muted-foreground))",
          },
          accent: {
            DEFAULT: "hsl(var(--accent))",
            foreground: "hsl(var(--accent-foreground))",
          },
          popover: {
            DEFAULT: "hsl(var(--popover))",
            foreground: "hsl(var(--popover-foreground))",
          },
          card: {
            DEFAULT: "hsl(var(--card))",
            foreground: "hsl(var(--card-foreground))",
          },
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
        keyframes: {
          "accordion-down": {
            from: { height: 0 },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: 0 },
          },
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
        },
      },
    }
  },
  plugins: [
    function({ addUtilities, theme }) {
      const textShadow = theme('textShadow', {});
      const utilities = Object.entries(textShadow).map(([name, value]) => ({
        [`.text-shadow${name === 'DEFAULT' ? '' : `-${name}`}`]: {
          'text-shadow': value,
        },
      }));
      addUtilities(utilities, ['responsive', 'hover']);
    },
    require("tailwindcss-animate"),
  ],
};