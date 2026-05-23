import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterScreen({ navigation }: any) {

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const handleRegister = async () => {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanName || !cleanEmail || !password || !confirmPassword) {
    Alert.alert("Required Fields", "Please complete all fields to register your account.");
    return;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleanEmail)) {
    Alert.alert("Invalid Email", "Please provide a valid email format.");
    return;
  }

  if (password.length < 6) {
    Alert.alert("Weak Password", "Passwords must be at least 6 characters long.");
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert("Password Mismatch", "The passwords you entered do not match.");
    return;
  }

  try {
    const existingUsersJSON = await AsyncStorage.getItem("users_list");
    let usersArray = [];
    
    if (existingUsersJSON) {
      usersArray = JSON.parse(existingUsersJSON);
    }

    const userExists = usersArray.some((u: any) => u.email === cleanEmail);
    if (userExists) {
      Alert.alert("Account Exists", "This email address is already registered. Please login instead.");
      return;
    }

    const newUser = {
      name: cleanName,
      email: cleanEmail,
      password,
    };
    
    usersArray.push(newUser);

    await AsyncStorage.setItem("users_list", JSON.stringify(usersArray));

    Alert.alert(
      "Registration Successful", 
      "Your profile has been added to this device.",
      [{ text: "Proceed to Login", onPress: () => navigation.goBack() }]
    );
  } catch (error) {
    Alert.alert("Registration Error", "Failed to securely write user account profile data.");
  }
};

  return (
    <SafeAreaView style={styles.safeContainer} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join AEON Bank Digital Islamic Banking</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              placeholder="As per MyKad / Passport"
              placeholderTextColor="#9EA0A6"
              style={styles.input}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />

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
              placeholder="Create a strong password"
              placeholderTextColor="#9EA0A6"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              placeholder="Re-enter password"
              placeholderTextColor="#9EA0A6"
              secureTextEntry
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
              <Text style={styles.primaryButtonText}>Agree & Register</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginHighlight}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#F9FAFC",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerSection: {
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2C313B",
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 6,
    fontWeight: "500",
  },
  formCard: {
    marginVertical: 16,
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
    marginBottom: 16,
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
  loginLink: {
    marginTop: 24,
    alignItems: "center",
    paddingVertical: 8,
  },
  loginText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  loginHighlight: {
    color: "#B72773",
    fontWeight: "700",
  },
});