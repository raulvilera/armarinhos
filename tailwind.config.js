/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./App.tsx",
        "./index.tsx",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "hsl(35 72% 44%)",
                "selected": "hsl(142 65% 38%)",
                "background-light": "hsl(40 20% 97%)",
                "background-dark": "hsl(215 38% 9%)",
                "neutral-light": "hsl(38 25% 88%)",
                "text-main": "hsl(25 50% 12%)",
                "text-muted": "hsl(25 20% 45%)",
            },
            fontFamily: {
                "sans": ["DM Sans", "sans-serif"],
                "display": ["DM Sans", "sans-serif"],
                "serif": ["Playfair Display", "serif"],
                "mono": ["DM Mono", "monospace"],
            },
            borderRadius: {
                "DEFAULT": "0.75rem",
                "lg": "1rem",
                "xl": "1.25rem",
                "2xl": "1.5rem",
                "full": "9999px",
            },
            animation: {
                'fade-in': 'fade-in 0.5s cubic-bezier(0.16,1,0.3,1)',
            }
        },
    },
    plugins: [],
}
