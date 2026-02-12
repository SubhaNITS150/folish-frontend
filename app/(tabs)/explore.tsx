import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image as RNImage,
  Platform,
} from 'react-native';

import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

// ---------------- NEW UI LIST ----------------
const EXPLORE_CATEGORIES = [
  {
    id: 'trending',
    title: 'Trending Now',
    icon: 'trending-up',
    color: ['#FFB6D9', '#FF8DC7'],
    items: ['Goat Runner', 'Chess Master', 'Space Adventure'],
  },
  {
    id: 'new',
    title: 'New Releases',
    icon: 'sparkles',
    color: ['#A8E6CF', '#7FD1AE'],
    items: ['Basket Hoop', 'Stickman Parkour', 'Love Tester'],
  },
  {
    id: 'popular',
    title: 'Most Popular',
    icon: 'star',
    color: ['#FFE985', '#FFD700'],
    items: ['Stack Fire Ball', 'Get On Top', 'Drift King'],
  },
  {
    id: 'educational',
    title: 'Learn & Play',
    icon: 'school',
    color: ['#B8B5FF', '#9D8FFF'],
    items: ['Math Games', 'Word Puzzles', 'Science Fun'],
  },
];

// ---------------- MAIN COMPONENT ----------------

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFE5F1', dark: '#553144' }}
      headerImage={
        <IconSymbol
          size={260}
          color="#FF9BCF"
          name="sparkles"
          style={styles.headerIcon}
        />
      }
    >

      {/* NEW UI BELOW */}
      <View style={styles.container}>

        {/* Header */}
        <LinearGradient colors={['#FFE5F1', '#FFF0F8']} style={styles.header}>
          <Text style={styles.headerTitle}>✨ Explore</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={24} color="#FF69B4" />
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Hero Banner */}
          <View style={styles.heroSection}>
            <LinearGradient
              colors={['#FFB6D9', '#FF8DC7']}
              style={styles.heroBanner}
            >
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>🎮 Discover Amazing Games!</Text>
                <Text style={styles.heroSubtitle}>
                  Explore hundreds of fun and educational games
                </Text>

                <TouchableOpacity
                  style={styles.heroButton}
                  onPress={() => router.push('/games')}
                >
                  <Text style={styles.heroButtonText}>Browse All Games</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FF69B4" />
                </TouchableOpacity>
              </View>

              <Ionicons
                name="game-controller"
                size={80}
                color="rgba(255, 255, 255, 0.3)"
              />
            </LinearGradient>
          </View>

          {/* Categories */}
          {EXPLORE_CATEGORIES.map((category) => (
            <View key={category.id} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryTitleRow}>
                  <View style={styles.categoryIconBubble}>
                    <Ionicons name={category.icon as any} size={20} color="#FF69B4" />
                  </View>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                </View>

                <TouchableOpacity onPress={() => router.push('/games')}>
                  <Text style={styles.seeAllText}>See All →</Text>
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {category.items.map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.exploreCard}
                    onPress={() => router.push('/games')}
                  >
                    <LinearGradient
                      colors={category.color}
                      style={styles.exploreCardGradient}
                    >
                      <View style={styles.exploreCardIcon}>
                        <Ionicons name="play-circle" size={32} color="#FFFFFF" />
                      </View>
                      <Text style={styles.exploreCardTitle}>{item}</Text>

                      <View style={styles.exploreCardFooter}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={styles.exploreCardRating}>
                          4.{Math.floor(Math.random() * 5 + 5)}
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ))}

          {/* Quick Links */}
          <View style={styles.quickLinksSection}>
            <Text style={styles.sectionTitle}>⚡ Quick Links</Text>

            <View style={styles.quickLinksGrid}>
              <TouchableOpacity
                style={styles.quickLinkCard}
                onPress={() => router.push('/videos')}
              >
                <LinearGradient colors={['#A8E6CF', '#7FD1AE']} style={styles.quickLinkGradient}>
                  <Ionicons name="videocam" size={28} color="#FFFFFF" />
                  <Text style={styles.quickLinkText}>Videos</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickLinkCard}
                onPress={() => router.push('/profile/achievements')}
              >
                <LinearGradient colors={['#FFE985', '#FFD700']} style={styles.quickLinkGradient}>
                  <Ionicons name="trophy" size={28} color="#FFFFFF" />
                  <Text style={styles.quickLinkText}>Achievements</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickLinkCard}
                onPress={() => router.push('/profile/edit-profile')}
              >
                <LinearGradient colors={['#B8B5FF', '#9D8FFF']} style={styles.quickLinkGradient}>
                  <Ionicons name="person" size={28} color="#FFFFFF" />
                  <Text style={styles.quickLinkText}>Profile</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickLinkCard}
                onPress={() => router.push('/settings')}
              >
                <LinearGradient colors={['#FFB6D9', '#FF8DC7']} style={styles.quickLinkGradient}>
                  <Ionicons name="settings" size={28} color="#FFFFFF" />
                  <Text style={styles.quickLinkText}>Settings</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* SPACER */}
          <View style={{ height: 20 }} />

          {/* ORIGINAL EXPLORE TEMPLATE BELOW THIS POINT */}

          <ThemedView style={styles.titleContainerOld}>
            <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
              Explore Examples
            </ThemedText>
          </ThemedView>

          <Collapsible title="File-based routing">
            <ThemedText>
              This app has two screens:{' '}
              <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
              <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
            </ThemedText>
          </Collapsible>

          <Collapsible title="Images">
            <Image
              source={require('@/assets/images/react-logo.png')}
              style={{ width: 100, height: 100, alignSelf: 'center' }}
            />
          </Collapsible>

          <Collapsible title="Animations">
            <ThemedText>
              The ParallaxScrollView provides a parallax effect for the header.
            </ThemedText>
          </Collapsible>

          <View style={{ height: 100 }} />

        </ScrollView>
      </View>
    </ParallaxScrollView>
  );
}

// ---------------- STYLES ----------------

const styles = StyleSheet.create({
  headerIcon: {
    position: 'absolute',
    bottom: -90,
    left: -30,
  },

  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },

  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FF1493',
  },

  searchButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  heroSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },

  heroBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 25,
    borderRadius: 25,
    elevation: 5,
  },

  heroContent: {
    flex: 1,
  },

  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },

  heroSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 15,
  },

  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    gap: 8,
  },

  heroButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF69B4',
  },

  categorySection: {
    marginBottom: 25,
  },

  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },

  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  categoryIconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF0F8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoryTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FF1493',
  },

  seeAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF69B4',
  },

  exploreCard: {
    width: 140,
    height: 140,
    marginLeft: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
  },

  exploreCardGradient: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },

  exploreCardIcon: {
    alignSelf: 'flex-start',
  },

  exploreCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  exploreCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  exploreCardRating: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  quickLinksSection: {
    paddingHorizontal: 20,
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FF1493',
    marginBottom: 15,
  },

  quickLinksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  quickLinkCard: {
    width: '48%',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
  },

  quickLinkGradient: {
    padding: 25,
    alignItems: 'center',
    gap: 10,
  },

  quickLinkText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  titleContainerOld: {
    paddingHorizontal: 20,
    marginTop: 40,
    flexDirection: 'row',
    gap: 8,
  },
});
