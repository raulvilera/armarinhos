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
                "primary": "#1e3a8a",
                "selected": "#064e3b",
                "background-light": "#f8fafd",
                "background-dark": "#0f172a",
                "neutral-light": "#e2e8f0",
                "text-main": "#0f172a",
                "text-muted": "#64748b",
            },
            fontFamily: {
                "display": ["Manrope", "sans-serif"],
            },
            borderRadius: {
                "DEFAULT": "0.5rem",
                "lg": "1rem",
                "xl": "1.5rem",
                "full": "9999px",
            },
        },
    },
    plugins: [],
}
