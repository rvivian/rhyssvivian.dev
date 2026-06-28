export const THEME_STORAGE_KEY = "rhyssvivian-theme";
export const THEMES = ["dark", "light"];

export function normalizeTheme(value) {
  return THEMES.includes(value) ? value : null;
}

export function getInitialTheme(storage) {
  try {
    return normalizeTheme(storage?.getItem(THEME_STORAGE_KEY)) ?? "dark";
  } catch {
    return "dark";
  }
}

export function getNextTheme(currentTheme) {
  return normalizeTheme(currentTheme) === "light" ? "dark" : "light";
}

export function applyTheme(root, button, theme) {
  const nextTheme = normalizeTheme(theme) ?? "dark";
  root.dataset.theme = nextTheme;

  if (!button) {
    return nextTheme;
  }

  const isLight = nextTheme === "light";
  const label = button.querySelector("[data-theme-toggle-label]");

  button.setAttribute("aria-pressed", String(isLight));
  button.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");

  if (label) {
    label.textContent = isLight ? "Dark" : "Light";
  }

  return nextTheme;
}

export function initThemeToggle({
  documentRef = globalThis.document,
  storage = globalThis.localStorage,
} = {}) {
  const root = documentRef?.documentElement;
  const button = documentRef?.querySelector("[data-theme-toggle]");

  if (!root) {
    return;
  }

  applyTheme(root, button, getInitialTheme(storage));

  button?.addEventListener("click", () => {
    const nextTheme = getNextTheme(root.dataset.theme);
    applyTheme(root, button, nextTheme);

    try {
      storage?.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Preference persistence is optional; the visual toggle still works.
    }
  });
}
