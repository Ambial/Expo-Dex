import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { artworkUri, idFromUrl } from "../utils/pokeapi";

type Props = {
  name: string;
  url: string;
  onPress: (id: number, name: string) => void;
};

function PokemonCard({ name, url, onPress }: Props) {
  const id = idFromUrl(url);
  return (
    <Pressable onPress={() => onPress(id, name)} style={styles.card}>
      <Image
        source={{ uri: artworkUri(id) }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.number}>#{String(id).padStart(4, "0")}</Text>
        <Text style={styles.name}>{capitalize(name)}</Text>
      </View>
    </Pressable>
  );
}

function capitalize(s: string) {
  return s[0].toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 2,
  },
  image: { width: 72, height: 72 },
  number: { color: "#777", fontSize: 12, marginBottom: 4 },
  name: { fontSize: 18, fontWeight: "600" },
});

export default React.memo(PokemonCard);
