export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Bebas Neue'", "cursive"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        cardFlip: {
          "0%": { opacity: 0, transform: "rotateY(-15deg) scale(0.95)" },
          "100%": { opacity: 1, transform: "rotateY(0deg) scale(1)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.6s ease forwards",
        cardFlip: "cardFlip 0.5s ease forwards",
      },
    },
  },
  plugins: [],
};
