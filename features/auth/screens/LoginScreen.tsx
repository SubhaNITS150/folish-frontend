import { router } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please enter both email and password!");
      return;
    }

    console.log("Login data:", { email, password });
    alert("Login successful!");
    router.replace("/(tabs)");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Welcome Back</Text>

      <View style={styles.formCard}>
        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#e89ab5"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor="#e89ab5"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth/forgotpassword")}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth/register")}>
        <Text style={styles.registerText}>
          Don’t have an account?{" "}
          <Text style={{ fontWeight: "600" }}>Register</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fde6ef", // soft pink background
    padding: 25,
    justifyContent: "center",
  },

  header: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: "#ff2e8b", // strong pink
    marginBottom: 30,
  },

  formCard: {
    backgroundColor: "#f8dbe6",
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
  },

  label: {
    color: "#ff2e8b",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    backgroundColor: "#fbe9f1",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#f3c4d4",
  },

  button: {
    backgroundColor: "#ff2e8b", // darker pink button
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  forgotText: {
    marginTop: 15,
    textAlign: "center",
    color: "#ff2e8b",
    fontWeight: "500",
  },

  registerText: {
    marginTop: 20,
    textAlign: "center",
    color: "#b34d7d",
  },
});
