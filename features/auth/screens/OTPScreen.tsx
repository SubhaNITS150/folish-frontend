import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import OtpInput from "@/features/auth/components/OTPInput";

export default function OtpScreen() {
  const [otp, setOtp] = useState("");

  const handleSubmit = () => {
    console.log("OTP:", otp);
    alert("OTP Verified!");
    router.replace("/(tabs)");
  };

  const isComplete = otp.length === 6;

  return (
    <View style={styles.container}>
      <View style={styles.centerBox}>
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          Please enter the 6-digit code sent to your phone/email.
        </Text>

        <OtpInput length={6} onChangeOtp={setOtp} />

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isComplete ? "#007AFF" : "#9FC5FF" },
          ]}
          disabled={!isComplete}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Verify OTP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",   // ⬅ vertical centering
    alignItems: "center",       // ⬅ horizontal centering
    paddingHorizontal: 25,
  },
  centerBox: {
    width: "100%",
    alignItems: "center",        // center children horizontally
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
