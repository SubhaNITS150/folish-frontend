import React, { useRef, useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";

type OtpInputProps = {
  length?: number;
  onChangeOtp: (otp: string) => void;
};

export default function OtpInput({ length = 6, onChangeOtp }: OtpInputProps) {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    if (/^\d$/.test(text) || text === "") {
      const updatedOtp = [...otp];
      updatedOtp[index] = text;
      setOtp(updatedOtp);
      onChangeOtp(updatedOtp.join(""));

      if (text && index < length - 1) {
        inputs.current[index + 1]?.focus();
      }
      if (!text && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View style={styles.otpContainer}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputs.current[index] = ref;
          }}
          style={styles.otpBox}
          keyboardType="number-pad"
          maxLength={1}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",      // center horizontally
    alignItems: "center",          // center vertically within row
    gap: 12,                        // spacing between boxes
  },
  otpBox: {
    width: 50,
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "600",
  },
});
