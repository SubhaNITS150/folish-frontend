// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image as RNImage,
  Platform,
} from 'react-native';
import { Image } from 'expo-image'; // keep existing import for header image
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  
  const [screenTimeToday, setScreenTimeToday] = useState<number>(0);
  const [greeting, setGreeting] = useState<string>('');

  useEffect(() => {
    loadScreenTime();
    setGreetingMessage();
  }, []);

  const setGreetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  };

  const loadScreenTime = async () => {
    try {
      const totalTime = await AsyncStorage.getItem('total_screen_time');
      if (totalTime) {
        setScreenTimeToday(parseInt(totalTime, 10));
      }
    } catch (error) {
      console.error('Error loading screen time:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
     <View style={styles.container}>
       
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}, Alex!</Text>
            <Text style={styles.subGreeting}>Ready to play and learn?</Text>
          </View>
          <TouchableOpacity style={styles.avatarContainer}>
            <RNImage
              source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Ethan' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.screenTimeCard}>
          <View style={styles.screenTimeHeader}>
            <Ionicons name="time" size={24} color="#6C63FF" />
            <Text style={styles.screenTimeTitle}>Screen Time Usage</Text>
          </View>
          <Text style={styles.screenTimeValue}>{formatTime(screenTimeToday)}</Text>
          <Text style={styles.screenTimeSubtext}>Today</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '65%' }]} />
          </View>
          <Text style={styles.limitText}>Daily limit: 2h 0m</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#FF6B6B' }]}
              onPress={() => router.push('./games')}
            >
              <Ionicons name="game-controller" size={32} color="#FFFFFF" />
              <Text style={styles.actionText}>Play Games</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#4ECDC4' }]}
              onPress={() => router.push('./videos')}
            >
              <Ionicons name="videocam" size={32} color="#FFFFFF" />
              <Text style={styles.actionText}>Watch Videos</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continue Playing</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.continueCard}>
              <RNImage
                source={{ uri: 'https://res.cloudinary.com/dg361q5uv/image/upload/v1765553938/gr_zydfjz.png' }}
                style={styles.continueImage}
              />
              <View style={styles.continueInfo}>
                <Text style={styles.continueName}>Goat Runner</Text>
                <Text style={styles.continueProgress}>Last played 2h ago</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.continueCard}>
              <RNImage
                source={{ uri: 'https://res.cloudinary.com/dg361q5uv/image/upload/v1765554831/Screenshot_2025-12-12_212318_ja7aih.png' }}
                style={styles.continueImage}
              />
              <View style={styles.continueInfo}>
                <Text style={styles.continueName}>Chess</Text>
                <Text style={styles.continueProgress}>Last played yesterday</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <View style={styles.achievementCard}>
            <View style={styles.achievementIcon}>
              <Ionicons name="trophy" size={32} color="#FFD700" />
            </View>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>First Win!</Text>
              <Text style={styles.achievementDesc}>Won your first chess game</Text>
            </View>
          </View>
        </View>
      </View>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  /***** New UI styles (merged) *****/
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subGreeting: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#6C63FF',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  screenTimeCard: {
    backgroundColor: '#16213E',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
  },
  screenTimeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  screenTimeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  screenTimeValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  screenTimeSubtext: {
    fontSize: 14,
    color: '#999',
    marginBottom: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#1A1A2E',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6C63FF',
    borderRadius: 4,
  },
  limitText: {
    fontSize: 12,
    color: '#999',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 15,
  },
  actionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
  },
  continueCard: {
    width: 200,
    backgroundColor: '#16213E',
    borderRadius: 15,
    marginRight: 15,
    overflow: 'hidden',
  },
  continueImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  continueInfo: {
    padding: 12,
  },
  continueName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  continueProgress: {
    fontSize: 12,
    color: '#999',
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: '#16213E',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1A1A2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 14,
    color: '#999',
  },

  /***** Existing demo styles (kept) *****/
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
