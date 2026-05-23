import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "../store/authStore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      Alert.alert("Required Fields", "Please fill in both fields.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      Alert.alert(
        "Invalid Email Format", 
        "Please enter a valid email address (e.g., name@domain.com)."
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert("Invalid Credentials", "The password configuration entered does not meet security criteria.");
      return;
    }

    try {
      const usersJSON = await AsyncStorage.getItem("users_list");
      
      if (!usersJSON) {
        Alert.alert("Account Not Found", "No registered accounts exist on this device. Please register first.");
        return;
      }

      const usersArray = JSON.parse(usersJSON);

      const foundUser = usersArray.find((u: any) => u.email === cleanEmail);

      if (!foundUser) {
        Alert.alert("Account Not Found", "No profile matches this email.");
        return;
      }

      if (foundUser.password === password) {
        await AsyncStorage.setItem("isLoggedIn", "true");
        
        await AsyncStorage.setItem("current_user_email", cleanEmail);
        setEmail("");
        setPassword("");
        login();
      } else {
        Alert.alert("Authentication Failed", "Incorrect password. Please try again.");
      }
    } catch (error) {
      Alert.alert("System Error", "An error occurred during account verification.");
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <Image 
              source={require("../assets/aeonbank.png")} 
              style={styles.brandLogo} 
              resizeMode="contain" 
            />
            <Text style={styles.brandTitle}>AEON Bank</Text>
            <Text style={styles.brandSubtitle}>Digital Islamic Banking</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              placeholder="name@example.com"
              placeholderTextColor="#9EA0A6"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              placeholder="Enter your secure password"
              placeholderTextColor="#9EA0A6"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
              <Text style={styles.primaryButtonText}>Secure Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => {
                setEmail("");
                setPassword("");
                navigation.navigate("Register")
              }}
            >
              <Text style={styles.registerText}>
                New to AEON Bank? <Text style={styles.registerHighlight}>Register Now</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}``

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#F9FAFC",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerSection: {
    alignItems: "center",
    marginTop: 40,
  },
  brandLogo: {
    width: 90,
    height: 90,
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2C313B", 
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
    fontWeight: "500",
  },
  formCard: {
    marginTop: 40,
    flex: 1,
    justifyContent: "center",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 8,
    paddingLeft: 2,
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
    color: "#1F2937",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionSection: {
    marginTop: 24,
    width: "100%",
  },
  primaryButton: {
    backgroundColor: "#B72773",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#B72773",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  registerLink: {
    marginTop: 24,
    alignItems: "center",
    paddingVertical: 8,
  },
  registerText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  registerHighlight: {
    color: "#B72773",
    fontWeight: "700",
  },
});