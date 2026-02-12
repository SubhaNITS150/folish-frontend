import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.centerBox}>
        <Text style={styles.header}>Enter Verification Code</Text>

        <Text style={styles.subtitle}>
          Please enter the 6-digit code sent to your phone/email.
        </Text>

        <View style={styles.formCard}>
          <OtpInput length={6} onChangeOtp={setOtp} />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isComplete ? "#ff2e8b" : "#f3a6c4" },
          ]}
          disabled={!isComplete}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Verify OTP</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fde6ef",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },

  centerBox: {
    width: "100%",
    alignItems: "center",
  },

  header: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: "#ff2e8b",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#b34d7d",
    marginBottom: 25,
  },

  formCard: {
    width: "100%",
    backgroundColor: "#f8dbe6",
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: "center",
  },


  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 30,
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
