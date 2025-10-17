import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useLayoutEffect,
} from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PokemonCard from "../components/PokemonCard";
import SearchBar from "../components/SearchBar";
import {
  PAGE_SIZE,
  PokemonListItem,
  fetchPage,
  idFromUrl,
} from "../utils/pokeapi";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import { FlashList } from "@shopify/flash-list";
import { useAppTheme } from "../theme/ThemeProvider";
import { useTranslation } from "react-i18next";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const [items, setItems] = useState<PokemonListItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const { colors } = useAppTheme();
  const { t, i18n } = useTranslation();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("app.title") });
  }, [navigation, t, i18n.language]);

  const load = useCallback(async (nextOffset: number, replace = false) => {
    setLoading(true);
    setError(null);
    try {
      const page = await fetchPage(nextOffset);
      setItems((prev) => (replace ? page : [...prev, ...page]));
      setOffset(nextOffset + PAGE_SIZE);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Network error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(0, true);
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load(0, true);
    setRefreshing(false);
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => p.name.toLowerCase().includes(q));
  }, [items, query]);

  const onCardPress = useCallback(
    (id: number, name: string) => navigation.navigate("Details", { id, name }),
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: PokemonListItem }) => (
      <PokemonCard name={item.name} url={item.url} onPress={onCardPress} />
    ),
    [onCardPress]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.searchRow}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery("")}
          placeholder={t("home.searchPlaceholder")}
        />
      </View>

      {error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : (
        <FlashList
          data={filtered}
          keyExtractor={(item) => String(idFromUrl(item.url))}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={renderItem}
          onEndReachedThreshold={0.2}
          onEndReached={() => {
            if (!loading && query.length === 0) load(offset);
          }}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator style={{ marginVertical: 16 }} />
            ) : null
          }
          ListEmptyComponent={
            loading ? null : (
              <View style={styles.center}>
                <Text style={styles.text}>{t("home.empty")}</Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

const makeStyles = (c: import("../theme/colors").Colors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.background },
    searchRow: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 4 },
    search: {
      backgroundColor: c.surface,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      fontSize: 16,
      color: c.text,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
    },
    center: { alignItems: "center", justifyContent: "center", padding: 24 },
    text: { color: c.text },
    error: { color: c.danger },
  });
