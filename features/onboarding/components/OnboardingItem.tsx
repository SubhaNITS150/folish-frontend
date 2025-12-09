import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { OnboardingItemType } from "../types";

const { width } = Dimensions.get("window");

export default function OnboardingItem({ item }: { item: OnboardingItemType }) {
  return (
    <View style={[styles.container, { width }]}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />

      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
    backgroundColor: "#1F6FEB",
  },
  image: {
    width: "80%",
    height: "45%",
    marginBottom: 30,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#E8ECF3",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 15,
  },
});
