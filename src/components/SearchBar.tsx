import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppTheme } from "../theme/ThemeProvider";

type Props = {
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function SearchBar({
  value,
  placeholder,
  onChangeText,
  onClear,
  style,
}: Props) {
  const { colors, isDark } = useAppTheme();
  const s = makeStyles(colors);

  const clearIconColor = isDark ? colors.text : colors.textMuted;

  return (
    <View style={[s.container, style]}>
      <MaterialIcons
        name="search"
        size={18}
        color={colors.textMuted}
        style={s.leftIcon}
      />
      <TextInput
        testID="searchbar.input"
        style={s.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.tint}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable
          testID="searchbar.clear"
          onPress={onClear}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={12}
          style={[s.clearBtn, isDark && s.clearBtnDark]}
          android_ripple={{ color: colors.border, radius: 18 }}
        >
          <MaterialIcons name="close" size={18} color={clearIconColor} />
        </Pressable>
      )}
    </View>
  );
}

const makeStyles = (c: import("../theme/colors").Colors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: c.surface,
      borderRadius: 12,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    leftIcon: { marginRight: 6 },
    input: {
      flex: 1,
      fontSize: 16,
      color: c.text,
      paddingVertical: 0,
    },
    clearBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.surfaceAlt,
      marginLeft: 6,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.border,
    },
    clearBtnDark: {
      backgroundColor: "rgba(255,255,255,0.08)",
    },
  });
