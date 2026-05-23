// App.tsx

import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppNavigator from "./src/navigation/AppNavigator";
import AuthNavigator from "./src/navigation/AuthNavigator";
import { useAuthStore } from "./src/store/authStore";

export default function App() {
  const { isLoggedIn, login, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const status = await AsyncStorage.getItem("isLoggedIn");

    if (status === "true") {
      login();
    } else {
      logout();
    }

    setLoading(false);
  };

  if (loading) return null;

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}