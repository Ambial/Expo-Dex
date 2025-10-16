import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Appearance, ColorSchemeName } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as C from "./colors";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  Theme as NavigationTheme,
} from "@react-navigation/native";

type Scheme = "light" | "dark";
type Ctx = {
  colors: C.Colors;
  isDark: boolean;
  themeName: Scheme;
  useSystemTheme: boolean;
  setUseSystemTheme: (v: boolean) => void;
  setTheme: (scheme: Scheme) => void;
  navTheme: NavigationTheme;
};

const ThemeContext = createContext<Ctx | undefined>(undefined);
const STORAGE_KEY = "pref:theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [useSystemTheme, setUseSystemThemeState] = useState(true);
  const [scheme, setScheme] = useState<Scheme>("light");

  // load saved preference
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as {
            useSystem: boolean;
            scheme: Scheme;
          };
          setUseSystemThemeState(saved.useSystem);
          setScheme(saved.scheme);
        } else {
          setUseSystemThemeState(true);
          setScheme(Appearance.getColorScheme() === "dark" ? "dark" : "light");
        }
      } catch {}
    })();
  }, []);

  // follow system when enabled
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      if (useSystemTheme) setScheme(colorScheme === "dark" ? "dark" : "light");
    });
    return () => sub.remove();
  }, [useSystemTheme]);

  const persist = useCallback(
    async (pref: { useSystem: boolean; scheme: Scheme }) => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pref));
      } catch {}
    },
    []
  );

  const setUseSystemTheme = useCallback(
    (v: boolean) => {
      setUseSystemThemeState(v);
      const next: Scheme = v
        ? Appearance.getColorScheme() === "dark"
          ? "dark"
          : "light"
        : scheme;
      if (v) setScheme(next);
      persist({ useSystem: v, scheme: next });
    },
    [persist, scheme]
  );

  const setTheme = useCallback(
    (next: Scheme) => {
      setScheme(next);
      setUseSystemThemeState(false);
      persist({ useSystem: false, scheme: next });
    },
    [persist]
  );

  const themeName: Scheme = scheme;
  const colors = themeName === "dark" ? C.dark : C.light;
  const isDark = themeName === "dark";

  const base = isDark ? NavigationDarkTheme : NavigationDefaultTheme;

  const navTheme: NavigationTheme = useMemo(
    () => ({
      ...base,
      colors: {
        ...base.colors,
        primary: colors.tint,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
        notification: colors.tint,
      },
    }),
    [isDark, colors, base]
  );

  const value: Ctx = {
    colors,
    isDark,
    themeName,
    useSystemTheme,
    setUseSystemTheme,
    setTheme,
    navTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useAppTheme must be used within ThemeProvider");
  return ctx;
}
