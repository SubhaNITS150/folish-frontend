import React, { useRef, useState } from "react";
import {
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    Text,
} from "react-native";
import { router } from "expo-router";
import OnboardingItem from "../components/OnboardingItem";
import { onboardingData } from "../data/onboardingData";
import { ViewToken } from "react-native";
import { OnboardingItemType } from "../types";


const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef<FlatList<OnboardingItemType>>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const viewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems && viewableItems.length > 0) {
                setCurrentIndex(viewableItems[0].index ?? 0);
            }
        }
    ).current;


    const viewConfig = useRef({
        viewAreaCoveragePercentThreshold: 50,
    }).current;

    const nextSlide = () => {
        if (currentIndex < onboardingData.length - 1) {
            slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            router.replace("/auth/register");
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={onboardingData}
                renderItem={({ item }) => <OnboardingItem item={item} />}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                keyExtractor={(item) => item.id}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={32}
                onViewableItemsChanged={viewableItemsChanged}
                viewabilityConfig={viewConfig}
                ref={slidesRef}
            />

            {/* Pagination dots */}
            <View style={styles.dotsContainer}>
                {onboardingData.map((_, i) => {
                    const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [8, 18, 8],
                        extrapolate: "clamp",
                    });

                    return (
                        <Animated.View
                            key={i}
                            style={[styles.dot, { width: dotWidth }]}
                        />
                    );
                })}
            </View>

            {/* Button */}
            <TouchableOpacity style={styles.button} onPress={nextSlide}>
                <Text style={styles.buttonText}>
                    {currentIndex === onboardingData.length - 1 ? "Get Started" : "Continue"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1F6FEB",
    },
    dotsContainer: {
        position: "absolute",
        bottom: 100,
        flexDirection: "row",
        alignSelf: "center",
        gap: 8,
    },
    dot: {
        height: 8,
        borderRadius: 5,
        backgroundColor: "white",
    },
    button: {
        position: "absolute",
        bottom: 40,
        alignSelf: "center",
        backgroundColor: "white",
        width: width * 0.85,
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: "center",
    },
    buttonText: {
        color: "#1F6FEB",
        fontSize: 16,
        fontWeight: "700",
    },
});
