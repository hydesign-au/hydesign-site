import { ScriptOnce } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

type ThemeProviderProps = {
  children: ReactNode;
};

function getThemeScript() {
  return `(function(){try{var d=matchMedia('(prefers-color-scheme: dark)').matches;var r=d?'dark':'light';var e=document.documentElement;e.classList.remove('light','dark');e.classList.add(r);e.style.colorScheme=r}catch(e){}})();`;
}

function applySystemTheme() {
  const root = document.documentElement;
  const resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
}

function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applySystemTheme();

    applySystemTheme();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <ScriptOnce>{getThemeScript()}</ScriptOnce>
      {children}
    </>
  );
}

export { ThemeProvider };
