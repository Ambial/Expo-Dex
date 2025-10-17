import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Pressable, StatusBar } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import HomeScreen from "./src/screens/HomeScreen";
import DetailsScreen from "./src/screens/DetailsScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import { ThemeProvider, useAppTheme } from "./src/theme/ThemeProvider";
import "./src/i18n/i18n";

export type RootStackParamList = {
  Home: undefined;
  Details: { id: number; name: string };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppInner() {
  const { navTheme, isDark, colors } = useAppTheme();

  return (
    <>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.text,
            headerTitleStyle: { color: colors.text },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              title: "Pokédex",
              headerRight: () => (
                <Pressable
                  onPress={() => navigation.navigate("Settings")}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel="Open settings"
                  style={{ paddingHorizontal: 4 }}
                >
                  <MaterialIcons name="settings" size={22} color={colors.text} />
                </Pressable>
              ),
            })}
          />
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={({ route }) => ({ title: route.params.name })}
          />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppInner />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
