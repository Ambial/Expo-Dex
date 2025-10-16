import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { useAppTheme } from "../theme/ThemeProvider";

export default function SettingsScreen() {
  const {
    colors,
    useSystemTheme,
    setUseSystemTheme,
    themeName,
    setTheme,
  } = useAppTheme();

  const styles = makeStyles(colors);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Appearance</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Use system theme</Text>
          <Switch value={useSystemTheme} onValueChange={setUseSystemTheme} />
        </View>

        <View style={[styles.row, useSystemTheme && styles.rowDisabled]}>
          <Text style={styles.label}>Dark mode</Text>
          <Switch
            value={themeName === "dark"}
            onValueChange={(v) => setTheme(v ? "dark" : "light")}
            disabled={useSystemTheme}
          />
        </View>

        <Text style={styles.hint}>Toggles are persisted for the next launch.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Language</Text>
        <Pressable
          style={styles.row}
          onPress={() =>
            Alert.alert("Coming soon", "Language selection will be added later.")
          }
        >
          <Text style={styles.label}>App language</Text>
          <Text style={styles.value}>System default ›</Text>
        </Pressable>
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
    cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4, color: c.text },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8,
    },
    rowDisabled: { opacity: 0.4 },
    label: { fontSize: 16, color: c.text },
    value: { color: c.textMuted },
    hint: { color: c.textMuted, fontSize: 12 },
  });
