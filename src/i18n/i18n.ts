import i18n, { type Resource } from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "./locales/en/translation.json";
import de from "./locales/de/translation.json";
import id from "./locales/id/translation.json";

const LANG_KEY = "pref:lang";

const resources = {
  en: { translation: en },
  de: { translation: de },
  id: { translation: id },
} as const satisfies Resource;

function deviceToSupported(): "en" | "de" | "id" {
  const code =
    Localization.getLocales?.()[0]?.languageCode?.toLowerCase() ?? "en";
  if (code === "de") return "de";
  if (code === "id") return "id";
  return "en";
}

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  supportedLngs: ["en", "de", "id"],
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
  compatibilityJSON: "v4",
});

// Bootstrap saved/device language asynchronously
(async () => {
  try {
    const saved = await AsyncStorage.getItem(LANG_KEY);
    const initial = (saved as "en" | "de" | "id") || deviceToSupported();
    if (i18n.language !== initial) {
      await i18n.changeLanguage(initial);
    }
  } catch {
    // no-op
  }
})();

export async function setAppLanguage(lng: "en" | "de" | "id") {
  await AsyncStorage.setItem(LANG_KEY, lng);
  await i18n.changeLanguage(lng);
}

export default i18n;
