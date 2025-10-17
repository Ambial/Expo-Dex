import React, { useState, useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { useAppTheme } from "../theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import { setAppLanguage } from "../i18n/i18n";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";

const LANGUAGE_NAMES: Record<"en" | "de" | "id", string> = {
  en: "English",
  de: "Deutsch",
  id: "Bahasa Indonesia",
};

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

export default function SettingsScreen({ navigation }: Props) {
  const { colors, useSystemTheme, setUseSystemTheme, themeName, setTheme } =
    useAppTheme();
  const { t, i18n } = useTranslation();
  const [showLangs, setShowLangs] = useState(false);

  const styles = makeStyles(colors);

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("settings.title") });
  }, [navigation, t, i18n.language]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t("settings.appearance")}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>{t("settings.useSystemTheme")}</Text>
          <Switch value={useSystemTheme} onValueChange={setUseSystemTheme} />
        </View>

        <View style={[styles.row, useSystemTheme && styles.rowDisabled]}>
          <Text style={styles.label}>{t("settings.darkMode")}</Text>
          <Switch
            value={themeName === "dark"}
            onValueChange={(v) => setTheme(v ? "dark" : "light")}
            disabled={useSystemTheme}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t("settings.language")}</Text>

        <Pressable style={styles.row} onPress={() => setShowLangs((s) => !s)}>
          <Text style={styles.label}>{t("settings.appLanguage")}</Text>
          <Text style={styles.value}>
            {LANGUAGE_NAMES[(i18n.language as "en" | "de" | "id") || "en"]} ›
          </Text>
        </Pressable>

        {showLangs && (
          <View style={{ marginTop: 4 }}>
            {(["en", "de", "id"] as const).map((lng) => {
              const active = i18n.language === lng;
              return (
                <Pressable
                  key={lng}
                  style={[styles.row, { paddingVertical: 10 }]}
                  onPress={async () => {
                    await setAppLanguage(lng);
                    setShowLangs(false);
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={styles.label}>{LANGUAGE_NAMES[lng]}</Text>
                  <Text style={[styles.value, active && { fontWeight: "700" }]}>
                    {active ? "●" : "○"}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t("settings.about")}</Text>
        <Text style={styles.value}>{t("settings.aboutText")}</Text>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (c: import("../theme/colors").Colors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.background, paddingVertical: 8 },
    card: {
      backgroundColor: c.surface,
      marginHorizontal: 12,
      marginVertical: 6,
      borderRadius: 16,
      padding: 12,
      gap: 8,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 4,
      color: c.text,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8,
    },
    rowDisabled: { opacity: 0.4 },
    label: { fontSize: 16, color: c.text },
    value: { color: c.textMuted },
  });
