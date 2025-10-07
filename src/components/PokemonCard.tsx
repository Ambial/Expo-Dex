import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { artworkUri, idFromUrl } from "../utils/pokeapi";

type Props = {
  name: string;
  url: string;
  onPress: (id: number, name: string) => void;
};

function PokemonCard({ name, url, onPress }: Props) {
  const id = idFromUrl(url);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <Pressable onPress={() => onPress(id, name)} style={styles.card}>
      <View style={styles.imageBox}>
        {(!loaded || errored) && (
          <MaterialIcons
            name={errored ? "broken-image" : "image"}
            size={36}
            color="#b0b0b0"
          />
        )}

        <Image
          priority="high"
          style={styles.image}
          source={{ uri: artworkUri(id) }}
          contentFit="contain"
          transition={150}
          cachePolicy="memory-disk"
          recyclingKey={String(id)}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      </View>

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
    gap: 12,
  },
  imageBox: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  number: { color: "#777", fontSize: 12, marginBottom: 4 },
  name: { fontSize: 18, fontWeight: "600" },
});

export default React.memo(PokemonCard);
