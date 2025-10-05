import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PokemonCard from "../components/PokemonCard";
import { PAGE_SIZE, PokemonListItem, fetchPage, idFromUrl } from "../utils/pokeapi";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const [items, setItems] = useState<PokemonListItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const load = useCallback(
    async (nextOffset: number, replace = false) => {
      setLoading(true);
      setError(null);
      try {
        const page = await fetchPage(nextOffset);
        setItems(prev => (replace ? page : [...prev, ...page]));
        setOffset(nextOffset + PAGE_SIZE);
      } catch (e: any) {
        setError(e.message ?? "Network error");
      } finally {
        setLoading(false);
      }
    },
    []
  );

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
    return items.filter(p => p.name.includes(q));
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
        <TextInput
          placeholder="Search Pokémon..."
          value={query}
          onChangeText={setQuery}
          style={styles.search}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>

      {error ? (
        <View style={styles.center}>
          <Text style={{ color: "crimson" }}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(idFromUrl(item.url))}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={renderItem}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (!loading && query.length === 0) load(offset);
          }}
          ListFooterComponent={
            loading ? <ActivityIndicator style={{ marginVertical: 16 }} /> : null
          }
          ListEmptyComponent={
            loading ? null : (
              <View style={styles.center}>
                <Text>No Pokémon found.</Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f4f5f7" },
  searchRow: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  search: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    fontSize: 16,
  },
  center: { alignItems: "center", justifyContent: "center", padding: 24 },
});
