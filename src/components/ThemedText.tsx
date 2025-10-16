import React from "react";
import { Text, TextProps } from "react-native";
import { useAppTheme } from "../theme/ThemeProvider";

export default function ThemedText(props: TextProps) {
  const { colors } = useAppTheme();
  return <Text {...props} style={[{ color: colors.text }, props.style]} />;
}
