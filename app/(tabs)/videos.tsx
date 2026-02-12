// app/(tabs)/videos.tsx
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const YOUTUBE_API_KEY = 'AIzaSyB1QTKNyoZUN8XNSqQY7jPze3b63Ij-aQc';
const CATEGORIES = [
  { id: 'learning', name: 'Learning', icon: 'school', color: '#4ECDC4', query: 'kids education' },
  { id: 'fun', name: 'Fun', icon: 'happy', color: '#FFD93D', query: 'kids fun' },
  { id: 'music', name: 'Music', icon: 'musical-notes', color: '#FF6B6B', query: 'kids songs' },
  { id: 'stories', name: 'Stories', icon: 'book', color: '#95E1D3', query: 'kids stories' },
  { id: 'science', name: 'Science', icon: 'flask', color: '#AA96DA', query: 'kids science' },
  { id: 'art', name: 'Art & Craft', icon: 'color-palette', color: '#FCBAD3', query: 'kids art craft' },
];

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  duration: string;
  viewCount?: string;
}

export default function VideosScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('learning');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentVideos, setRecentVideos] = useState<Video[]>([]);
  const [watchTime, setWatchTime] = useState(0);
  const [addictionLevel, setAddictionLevel] = useState<'low' | 'medium' | 'high'>('low');

  useEffect(() => {
    loadRecentVideos();
    loadWatchData();
    fetchVideos(CATEGORIES[0].query);
  }, []);

  useEffect(() => {
    const category = CATEGORIES.find(c => c.id === selectedCategory);
    if (category) {
      fetchVideos(category.query);
    }
  }, [selectedCategory]);

  const loadWatchData = async () => {
    try {
      const totalTime = await AsyncStorage.getItem('total_video_watch_time');
      const addiction = await AsyncStorage.getItem('addiction_level');
      
      if (totalTime) setWatchTime(parseInt(totalTime));
      if (addiction) setAddictionLevel(addiction as any);
    } catch (error) {
      console.error('Error loading watch data:', error);
    }
  };

  const loadRecentVideos = async () => {
    try {
      const recent = await AsyncStorage.getItem('recent_videos');
      if (recent) {
        setRecentVideos(JSON.parse(recent));
      }
    } catch (error) {
      console.error('Error loading recent videos:', error);
    }
  };

  const fetchVideos = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=20&videoCategoryId=1&safeSearch=strict&key=${YOUTUBE_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.items) {
        const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
        
        const detailsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
        );
        
        const detailsData = await detailsResponse.json();
        
        const formattedVideos: Video[] = data.items.map((item: any, index: number) => {
          const details = detailsData.items[index];
          return {
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
            channelTitle: item.snippet.channelTitle,
            duration: formatDuration(details?.contentDetails?.duration || 'PT0M0S'),
            viewCount: details?.statistics?.viewCount,
          };
        });
        
        setVideos(formattedVideos);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    
      setVideos(getMockVideos());
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (duration: string): string => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (match?.[1] || '').replace('H', '');
    const minutes = (match?.[2] || '').replace('M', '');
    const seconds = (match?.[3] || '').replace('S', '');
    
    if (hours) {
      return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }
    return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
  };

  const getMockVideos = (): Video[] => {
    return [
      {
        id: 'mock1',
        title: 'Learn Colors with Fun Songs',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        channelTitle: 'Kids Learning TV',
        duration: '5:30',
      },
      {
        id: 'mock2',
        title: 'ABC Song for Children',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        channelTitle: 'Educational Kids',
        duration: '3:45',
      },
     
    ];
  };

  const handleVideoPress = (video: Video) => {
    router.push({
      pathname: './videos/watch',
      params: {
        videoId: video.id,
        videoTitle: video.title,
        channelTitle: video.channelTitle,
        thumbnail: video.thumbnail,
        category: selectedCategory,
      },
    });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchVideos(`${searchQuery} kids`);
    }
  };

  return (
    <View style={styles.container}>
   
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Videos</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('./videos/history')}
          >
            <Ionicons name="time-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for videos..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.watchTimeCard}>
        <View style={styles.watchTimeHeader}>
          <Ionicons name="tv" size={24} color="#6C63FF" />
          <Text style={styles.watchTimeTitle}>Today Watch Time</Text>
        </View>
        <View style={styles.watchTimeContent}>
          <Text style={styles.watchTimeValue}>{Math.floor(watchTime / 60)}m {watchTime % 60}s</Text>
          <View style={[styles.addictionBadge, { backgroundColor: getAddictionColor(addictionLevel) }]}>
            <Text style={styles.addictionText}>{addictionLevel.toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${Math.min((watchTime / 7200) * 100, 100)}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.categoryChipActive,
                { borderColor: category.color },
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons
                name={category.icon as any}
                size={20}
                color={selectedCategory === category.id ? '#FFFFFF' : category.color}
              />
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === category.id && styles.categoryChipTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {recentVideos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Continue Watching</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recentVideos.slice(0, 5).map((video) => (
                <TouchableOpacity
                  key={video.id}
                  style={styles.continueCard}
                  onPress={() => handleVideoPress(video)}
                >
                  <Image source={{ uri: video.thumbnail }} style={styles.continueImage} />
                  <View style={styles.playOverlay}>
                    <Ionicons name="play-circle" size={40} color="rgba(255, 255, 255, 0.9)" />
                  </View>
                  <View style={styles.continueInfo}>
                    <Text style={styles.continueTitle} numberOfLines={2}>
                      {video.title}
                    </Text>
                    <Text style={styles.continueChannel}>{video.channelTitle}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {CATEGORIES.find(c => c.id === selectedCategory)?.name} Videos
          </Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6C63FF" />
              <Text style={styles.loadingText}>Loading videos...</Text>
            </View>
          ) : (
            <View style={styles.videoGrid}>
              {videos.map((video) => (
                <TouchableOpacity
                  key={video.id}
                  style={styles.videoCard}
                  onPress={() => handleVideoPress(video)}
                >
                  <View style={styles.thumbnailContainer}>
                    <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
                    <View style={styles.durationBadge}>
                      <Text style={styles.durationText}>{video.duration}</Text>
                    </View>
                    <View style={styles.playIconSmall}>
                      <Ionicons name="play" size={24} color="#FFFFFF" />
                    </View>
                  </View>
                  <View style={styles.videoInfo}>
                    <Text style={styles.videoTitle} numberOfLines={2}>
                      {video.title}
                    </Text>
                    <Text style={styles.videoChannel} numberOfLines={1}>
                      {video.channelTitle}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const getAddictionColor = (level: string) => {
  switch (level) {
    case 'low': return '#4CAF50';
    case 'medium': return '#FFD93D';
    case 'high': return '#FF6B6B';
    default: return '#4CAF50';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#16213E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213E',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#FFFFFF',
  },
  watchTimeCard: {
    backgroundColor: '#16213E',
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 20,
    marginBottom: 20,
  },
  watchTimeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  watchTimeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  watchTimeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  watchTimeValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addictionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  addictionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#1A1A2E',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6C63FF',
    borderRadius: 3,
  },
  content: {
    flex: 1,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213E',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryChipActive: {
    backgroundColor: '#6C63FF',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginLeft: 8,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  continueCard: {
    width: 180,
    marginRight: 15,
  },
  continueImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
  },
  playOverlay: {
    position: 'absolute',
    top: 30,
    left: 70,
  },
  continueInfo: {
    marginTop: 8,
  },
  continueTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  continueChannel: {
    fontSize: 12,
    color: '#999',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#999',
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
    backgroundColor: '#16213E',
  },
  thumbnail: {
    width: '100%',
    height: 100,
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
  playIconSmall: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    marginTop: 8,
  },
  videoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    lineHeight: 18,
  },
  videoChannel: {
    fontSize: 11,
    color: '#999',
  },
});