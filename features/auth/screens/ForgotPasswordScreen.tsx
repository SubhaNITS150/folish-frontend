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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  const handleReset = () => {
    if (!email) {
      alert("Please enter your email!");
      return;
    }

    console.log("Reset email:", email);
    alert("Password reset link sent!");
    router.push("/auth/login");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Forgot Password?</Text>

      <Text style={styles.subtitle}>
        Enter the email associated with your account and we'll send a reset link.
      </Text>

      <View style={styles.formCard}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#e89ab5"
          value={email}
          keyboardType="email-address"
          onChangeText={setEmail}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth/login")}>
        <Text style={styles.backToLogin}>Back to Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fde6ef",
    padding: 25,
    justifyContent: "center",
  },

  header: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: "#ff2e8b",
    marginBottom: 15,
  },

  subtitle: {
    textAlign: "center",
    color: "#b34d7d",
    marginBottom: 25,
    fontSize: 15,
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
    backgroundColor: "#ff2e8b",
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

  backToLogin: {
    marginTop: 20,
    textAlign: "center",
    color: "#ff2e8b",
    fontWeight: "500",
  },
});
