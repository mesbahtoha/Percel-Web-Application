import { useEffect, useState } from "react";

const THEME_KEY = "profast-theme";

export const getStoredTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY) || "light";
  } catch {
    return "light";
  }
};

export const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
};

export const useTheme = () => {
  const [theme, setTheme] = useState(getStoredTheme);

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return { theme, toggleTheme, setTheme };
};
