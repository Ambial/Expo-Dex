import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { artworkUri, fetchDetails, PokemonDetails } from "../utils/pokeapi";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import { useAppTheme } from "../theme/ThemeProvider";
import { Colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "Details">;

export default function DetailsScreen({ route }: Props) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { id, name } = route.params;
  const [data, setData] = useState<PokemonDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchDetails(id).then(
      (d) => mounted && setData(d),
      (e) => mounted && setError(e?.message ?? "Failed to load")
    );
    return () => {
      mounted = false;
    };
  }, [id]);

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={{ color: "crimson" }}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: artworkUri(id) }} style={styles.art} />
        <Text style={styles.title}>
          #{String(id).padStart(4, "0")} {capitalize(name)}
        </Text>

        <View style={styles.row}>
          {data.types.map((t) => (
            <View key={t.type.name} style={styles.typeTag}>
              <Text style={styles.typeText}>{capitalize(t.type.name)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Info</Text>
          <Text>Height: {data.height / 10} m</Text>
          <Text>Weight: {data.weight / 10} kg</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Base Stats</Text>
          {data.stats.map((s) => (
            <View key={s.stat.name} style={styles.statRow}>
              <Text style={{ width: 120 }}>{capitalize(s.stat.name)}</Text>
              <Text style={{ fontWeight: "700" }}>{s.base_stat}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function capitalize(s: string) {
  return s[0].toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f4f5f7" },
  container: { padding: 16, alignItems: "center" },
  art: { width: 220, height: 220, marginVertical: 8 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 8 },
  row: { flexDirection: "row", gap: 8, marginBottom: 12 },
  typeTag: {
    backgroundColor: "#e8eef9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  typeText: { fontWeight: "600" },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginVertical: 6,
    gap: 6,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
});
const makeStyles = (c: import("../theme/colors").Colors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.background },
    container: { padding: 16, alignItems: "center" },
    art: { width: 220, height: 220, marginVertical: 8 },
    title: { fontSize: 22, fontWeight: "800", marginBottom: 8, color: c.text },
    row: { flexDirection: "row", gap: 8, marginBottom: 12 },
    typeTag: {
      backgroundColor: c.chip,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
    },
    typeText: { fontWeight: "600", color: c.text },
    card: {
      width: "100%",
      backgroundColor: c.surface,
      padding: 16,
      borderRadius: 16,
      marginVertical: 6,
      gap: 6,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 6,
      color: c.text,
    },
    statRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 4,
    },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
  });
