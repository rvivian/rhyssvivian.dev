// Runs before first paint to apply a stored light preference without a dark flash.
// It is rendered inline by BaseLayout and hashed in astro.config.mjs from this same string,
// so editing it here keeps the CSP hash in step automatically.
export const themeInitScript = `(() => {
  try {
    const storedTheme = localStorage.getItem("rhyssvivian-theme");
    document.documentElement.dataset.theme = storedTheme === "light" ? "light" : "dark";
  } catch {
    document.documentElement.dataset.theme = "dark";
  }
})();`;
