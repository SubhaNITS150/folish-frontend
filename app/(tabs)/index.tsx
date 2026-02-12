// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
} from 'react-native';

import { useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { HelloWave } from '@/components/hello-wave';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// -----------------------------------------------------------------------------
// MAIN HOME SCREEN
// -----------------------------------------------------------------------------
export default function HomeScreen() {
  const router = useRouter();
  const [screenTimeToday, setScreenTimeToday] = useState(0);
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('Alex');

  const bounceAnim = new Animated.Value(0);

  useEffect(() => {
    loadScreenTime();
    setGreetingMessage();

    // Avatar bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const setGreetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  };

  const loadScreenTime = async () => {
    try {
      const totalTime = await AsyncStorage.getItem('total_screen_time');
      if (totalTime) setScreenTimeToday(parseInt(totalTime, 10));
    } catch (error) {
      console.error('Error loading screen time:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // ---------------------------------------------------------------------------
  // UI RETURN
  // ---------------------------------------------------------------------------
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFE5F1', dark: '#1D3D47' }}
      headerImage={null} // removed react logo
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* ------------------------ HEADER ------------------------ */}
        <LinearGradient
          colors={['#FFE5F1', '#FFF0F8', '#FFFFFF']}
          style={styles.header}
        >
          <View>
            <Text style={styles.greeting}>👋 {greeting}!</Text>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.tagline}>Ready for fun today?</Text>
          </View>

          <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Ethan&backgroundColor=ffb6c1',
                }}
                style={styles.avatar}
              />
            </View>
          </Animated.View>
        </LinearGradient>

        {/* ------------------- SCREEN TIME CARD ------------------- */}
        <View style={styles.screenTimeCard}>
          <LinearGradient
            colors={['#FFD6E8', '#FFF0F8']}
            style={styles.screenTimeGradient}
          >
            <View style={styles.screenTimeHeader}>
              <View style={styles.iconBubble}>
                <Ionicons name="time" size={24} color="#FF69B4" />
              </View>
              <Text style={styles.screenTimeTitle}>Today's Screen Time</Text>
            </View>

            <Text style={styles.screenTimeValue}>
              {formatTime(screenTimeToday)}
            </Text>

            <View style={styles.progressBar}>
              <LinearGradient
                colors={['#FF69B4', '#FFB6C1']}
                style={[styles.progressFill, { width: '45%' }]}
              />
            </View>
            <Text style={styles.limitText}>Daily limit: 2h 0m</Text>
          </LinearGradient>
        </View>

        {/* --------------------- QUICK ACTIONS --------------------- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Quick Actions</Text>

          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/games')}
            >
              <LinearGradient colors={['#FFB6D9', '#FF8DC7']} style={styles.actionGradient}>
                <Ionicons name="game-controller" size={32} color="#FFFFFF" />
                <Text style={styles.actionText}>Play Games</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/videos')}
            >
              <LinearGradient colors={['#A8E6CF', '#7FD1AE']} style={styles.actionGradient}>
                <Ionicons name="videocam" size={32} color="#FFFFFF" />
                <Text style={styles.actionText}>Watch Videos</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* -------------------- CONTINUE PLAYING ------------------- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎮 Continue Playing</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.continueCard}
              onPress={() => router.push('/games')}
            >
              <Image
                source={{ uri: 'https://res.cloudinary.com/dg361q5uv/image/upload/v1765553938/gr_zydfjz.png' }}
                style={styles.continueImage}
              />
              <LinearGradient colors={['transparent', 'rgba(255,182,193,0.9)']} style={styles.continueOverlay}>
                <Text style={styles.continueName}>Goat Runner</Text>
                <Text style={styles.continueTime}>Last played 2h ago</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.continueCard}
              onPress={() => router.push('/games')}
            >
              <Image
                source={{ uri: 'https://res.cloudinary.com/dg361q5uv/image/upload/v1765554831/Screenshot_2025-12-12_212318_ja7aih.png' }}
                style={styles.continueImage}
              />
              <LinearGradient colors={['transparent', 'rgba(168,230,207,0.9)']} style={styles.continueOverlay}>
                <Text style={styles.continueName}>Chess</Text>
                <Text style={styles.continueTime}>Last played yesterday</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* --------------------- ACHIEVEMENTS ---------------------- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Recent Achievements</Text>

          <TouchableOpacity
            style={styles.achievementCard}
            onPress={() => router.push('/profile/achievements')}
          >
            <LinearGradient colors={['#FFE985', '#FFD700']} style={styles.achievementGradient}>
              <View style={styles.achievementIcon}>
                <Ionicons name="trophy" size={32} color="#FF8C00" />
              </View>

              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>First Win! 🎉</Text>
                <Text style={styles.achievementDesc}>Won your first chess game</Text>
              </View>

              <Ionicons name="chevron-forward" size={24} color="#FF8C00" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* KEEPING THE OLD TEMPLATE CONTENT BELOW */}
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome!</ThemedText>
          <HelloWave />
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 1: Try it</ThemedText>
          <ThemedText>Open app/(tabs)/index.tsx and edit to see changes.</ThemedText>
        </ThemedView>

        <View style={{ height: 100 }} />

      </ScrollView>
    </ParallaxScrollView>
  );
}

// -----------------------------------------------------------------------------
// STYLES
// -----------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF69B4',
  },
  userName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FF1493',
  },
  tagline: {
    fontSize: 16,
    color: '#FF69B4',
  },

  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    padding: 5,
    elevation: 8,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },

  screenTimeCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
  },
  screenTimeGradient: { padding: 20 },
  screenTimeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  iconBubble: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  screenTimeTitle: { fontSize: 18, fontWeight: '700', color: '#FF1493' },
  screenTimeValue: { fontSize: 42, fontWeight: '900', color: '#FF1493' },
  progressBar: { height: 10, backgroundColor: '#FFE5F1', borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 5 },
  limitText: { marginTop: 5, color: '#FF69B4' },

  section: { padding: 20 },
  sectionTitle: { fontSize: 24, fontWeight: '800', color: '#FF1493', marginBottom: 15 },

  quickActions: { flexDirection: 'row', gap: 15 },
  actionCard: { flex: 1, borderRadius: 20, overflow: 'hidden', elevation: 5 },
  actionGradient: { padding: 20, alignItems: 'center', minHeight: 140, justifyContent: 'center' },
  actionText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },

  continueCard: {
    width: 200,
    height: 150,
    borderRadius: 20,
    marginRight: 15,
    overflow: 'hidden',
    elevation: 5,
  },
  continueImage: { width: '100%', height: '100%' },
  continueOverlay: { position: 'absolute', bottom: 0, width: '100%', padding: 12 },
  continueName: { color: '#fff', fontSize: 16, fontWeight: '800' },
  continueTime: { color: '#fff', fontSize: 12 },

  achievementCard: { borderRadius: 20, overflow: 'hidden' },
  achievementGradient: { flexDirection: 'row', padding: 18, alignItems: 'center' },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementInfo: { flex: 1 },
  achievementTitle: { fontSize: 18, fontWeight: '800', color: '#FF8C00' },
  achievementDesc: { fontSize: 14, color: '#FF8C00' },

  titleContainer: { paddingHorizontal: 20, marginTop: 30, flexDirection: 'row', alignItems: 'center' },
  stepContainer: { paddingHorizontal: 20, marginBottom: 15 },
});
