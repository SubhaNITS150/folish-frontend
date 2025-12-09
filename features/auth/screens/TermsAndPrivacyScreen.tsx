import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { router } from "expo-router";

export default function TermsAndPrivacyScreen() {
  const [accepted, setAccepted] = useState(false);

  const handleContinue = () => {
    if (!accepted) return;

    // Continue registration → OTP screen
    router.push("/auth/otp");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Terms & Privacy Policy</Text>

      <ScrollView style={styles.textContainer}>
        <Text style={styles.sectionTitle}>Terms of Service</Text>
        <Text style={styles.body}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Suspendisse placerat justo quis risus hendrerit, eget bibendum 
          justo commodo. Integer fringilla, neque et porttitor lacinia,
          orci sem finibus sapien, vitae congue dolor sapien sed purus.
        </Text>

        <Text style={styles.sectionTitle}>Privacy Policy</Text>
        <Text style={styles.body}>
          We value your privacy. Your data will be stored securely and
          never shared without your consent. By continuing, you agree to
          our data usage and storage policies as described herein.
        </Text>
      </ScrollView>

      {/* Checkbox */}
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setAccepted(!accepted)}
      >
        <View style={[styles.checkbox, accepted && styles.checkboxChecked]} />
        <Text style={styles.checkboxText}>
          I agree to the Terms of Service & Privacy Policy
        </Text>
      </TouchableOpacity>

      {/* Continue Button */}
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: accepted ? "#007AFF" : "#9EC5FF" }
        ]}
        disabled={!accepted}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "white",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  textContainer: {
    flex: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: "600",
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: "#555",
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#007AFF",
    marginRight: 10,
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: "#007AFF",
  },
  checkboxText: {
    fontSize: 15,
    color: "#333",
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
