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

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    if (!name || !email || !password) {
      alert("Please fill all fields!");
      return;
    }

    console.log("Signup data:", { name, email, password });
    router.push("/auth/termsandpolicy");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create Account</Text>

      <View style={styles.formCard}>
        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#e89ab5"
          value={name}
          onChangeText={setName}
        />

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="your@email.com"
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

      {/* Signup Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth/login")}>
        <Text style={styles.loginText}>
          Already have an account? Login
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
    color: "#ff2e8b", // strong pink title
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
    backgroundColor: "#ff2e8b", // darker pink
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


  loginText: {
    marginTop: 20,
    textAlign: "center",
    color: "#ff2e8b",
    fontWeight: "500",
  },
});
