import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";

export default function SettingsScreen() {
  const [useSystemTheme, setUseSystemTheme] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

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
            value={darkMode}
            onValueChange={setDarkMode}
            disabled={useSystemTheme}
          />
        </View>

        <Text style={styles.hint}>These switches are placeholders for now.</Text>
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

      <View style={styles.card}>
        <Text style={styles.cardTitle}>About</Text>
        <Text>Pokédex demo app</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f4f5f7", paddingVertical: 8 },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 },
  rowDisabled: { opacity: 0.4 },
  label: { fontSize: 16 },
  value: { color: "#555" },
  hint: { color: "#888", fontSize: 12 },
});
