"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeCtx {
  theme: Theme;
  resolved: "light" | "dark";
  setTheme: (t: Theme) => void;
}

const Ctx = createContext<ThemeCtx>({
  theme: "system",
  resolved: "light",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(Ctx);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = (localStorage.getItem("air_theme") as Theme) ?? "system";
    setThemeState(saved);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    function apply() {
      const isDark =
        theme === "dark" || (theme === "system" && mq.matches);
      document.documentElement.classList.toggle("dark", isDark);
      setResolved(isDark ? "dark" : "light");
    }
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  function setTheme(t: Theme) {
    localStorage.setItem("air_theme", t);
    setThemeState(t);
  }

  return <Ctx.Provider value={{ theme, resolved, setTheme }}>{children}</Ctx.Provider>;
}
