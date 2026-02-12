
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VIDEO_DATA = [
  {
    id: '1',
    title: 'Fun with Friends',
    thumbnail: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400',
    duration: '5:23',
    category: 'Entertainment',
  },
  {
    id: '2',
    title: 'The Magical Forest',
    thumbnail: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=400',
    duration: '8:15',
    category: 'Adventure',
  },
  {
    id: '3',
    title: 'Learning Colors',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
    duration: '3:45',
    category: 'Educational',
  },
  {
    id: '4',
    title: 'Space Adventure',
    thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400',
    duration: '6:30',
    category: 'Educational',
  },
];

export default function VideosScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Videos</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Featured Video */}
      <View style={styles.featuredSection}>
        <TouchableOpacity style={styles.featuredCard}>
          <Image
            source={{ uri: VIDEO_DATA[0].thumbnail }}
            style={styles.featuredImage}
          />
          <View style={styles.playIconContainer}>
            <Ionicons name="play-circle" size={64} color="#FFFFFF" />
          </View>
          <View style={styles.featuredOverlay}>
            <Text style={styles.featuredCategory}>{VIDEO_DATA[0].category}</Text>
            <Text style={styles.featuredTitle}>{VIDEO_DATA[0].title}</Text>
            <View style={styles.featuredMeta}>
              <Ionicons name="time-outline" size={16} color="#CCCCCC" />
              <Text style={styles.featuredDuration}>{VIDEO_DATA[0].duration}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Video Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended for You</Text>
        <View style={styles.videoGrid}>
          {VIDEO_DATA.slice(1).map((video) => (
            <TouchableOpacity key={video.id} style={styles.videoCard}>
              <View style={styles.thumbnailContainer}>
                <Image
                  source={{ uri: video.thumbnail }}
                  style={styles.thumbnail}
                />
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>{video.duration}</Text>
                </View>
              </View>
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle}>{video.title}</Text>
                <Text style={styles.videoCategory}>{video.category}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Categories Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Browse by Category</Text>
        <View style={styles.categoriesGrid}>
          <TouchableOpacity style={[styles.categoryCard, { backgroundColor: '#FF6B6B' }]}>
            <Ionicons name="school" size={32} color="#FFFFFF" />
            <Text style={styles.categoryName}>Educational</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.categoryCard, { backgroundColor: '#4ECDC4' }]}>
            <Ionicons name="happy" size={32} color="#FFFFFF" />
            <Text style={styles.categoryName}>Entertainment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.categoryCard, { backgroundColor: '#FFD93D' }]}>
            <Ionicons name="rocket" size={32} color="#FFFFFF" />
            <Text style={styles.categoryName}>Adventure</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.categoryCard, { backgroundColor: '#6C63FF' }]}>
            <Ionicons name="musical-notes" size={32} color="#FFFFFF" />
            <Text style={styles.categoryName}>Music</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  featuredSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  featuredCard: {
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -32 }, { translateY: -32 }],
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  featuredCategory: {
    fontSize: 12,
    color: '#FFD93D',
    fontWeight: '600',
    marginBottom: 5,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredDuration: {
    fontSize: 14,
    color: '#CCCCCC',
    marginLeft: 5,
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
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  videoCard: {
    width: '48%',
    marginBottom: 20,
  },
  thumbnailContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  thumbnail: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  videoInfo: {
    paddingHorizontal: 4,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  videoCategory: {
    fontSize: 12,
    color: '#999',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 10,
  },
});