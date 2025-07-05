module.exports = {
  locales: ["en", "ar"],
  defaultLocale: "en",
  pages: {
    "/": ["home"],
    "*": ["header", "footer", "course", "profile", "checkout", "test"],
    // "/courses/*": ["course"],
    "/auth/login": ["auth"],
    "/auth/signup": ["auth"],
    "/auth/forget-password": ["auth"],
  },
};
