// app/videos/watch.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Intervention videos
const INTERVENTION_VIDEOS = [
  'https://res.cloudinary.com/dg361q5uv/video/upload/v1759605675/Spaceship_s_Final_Blast_Through_Infinity_xrfcyx.mp4',
  'https://res.cloudinary.com/dg361q5uv/video/upload/v1759605664/Spaceship_s_Final_Flight_Into_Star_1_kqlm1q.mp4',
  'https://res.cloudinary.com/dg361q5uv/video/upload/v1759494142/Starship_Launch_to_Blinding_Star_1_mesgob.mp4',
];

// Addiction level thresholds (in seconds)
const ADDICTION_THRESHOLDS = {
  low: { duration: 180, interval: 300 },      // 3min videos, interrupt every 5min
  medium: { duration: 120, interval: 240 },   // 2min videos, interrupt every 4min
  high: { duration: 60, interval: 180 },      // 1min videos, interrupt every 3min
};

export default function VideoWatchScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { videoId, videoTitle, channelTitle, thumbnail, category } = params;

  const [showIntervention, setShowIntervention] = useState(false);
  const [currentInterventionUrl, setCurrentInterventionUrl] = useState('');
  const [watchTime, setWatchTime] = useState(0);
  const [totalWatchTime, setTotalWatchTime] = useState(0);
  const [addictionLevel, setAddictionLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [nextInterventionTime, setNextInterventionTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    loadUserData();
    startWatchTimer();
    trackVideoStart();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      trackVideoEnd();
    };
  }, []);

  useEffect(() => {
    // Calculate addiction level based on total watch time
    calculateAddictionLevel(totalWatchTime);
  }, [totalWatchTime]);

  const loadUserData = async () => {
    try {
      const totalTime = await AsyncStorage.getItem('total_video_watch_time');
      const addiction = await AsyncStorage.getItem('addiction_level');
      
      if (totalTime) {
        const time = parseInt(totalTime);
        setTotalWatchTime(time);
        calculateAddictionLevel(time);
      }
      
      if (addiction) {
        setAddictionLevel(addiction as any);
      }

      // Set first intervention time
      const threshold = ADDICTION_THRESHOLDS[addictionLevel];
      setNextInterventionTime(threshold.interval);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const calculateAddictionLevel = async (totalTime: number) => {
    let level: 'low' | 'medium' | 'high' = 'low';
    
    // Determine addiction level based on total watch time
    if (totalTime > 7200) { // > 2 hours
      level = 'high';
    } else if (totalTime > 3600) { // > 1 hour
      level = 'medium';
    } else {
      level = 'low';
    }
    
    setAddictionLevel(level);
    await AsyncStorage.setItem('addiction_level', level);
  };

  const startWatchTimer = () => {
    timerRef.current = setInterval(() => {
      setWatchTime((prev) => {
        const newTime = prev + 1;
        checkForIntervention(newTime);
        return newTime;
      });
    }, 1000);
  };

  const checkForIntervention = (currentTime: number) => {
    if (currentTime >= nextInterventionTime) {
      triggerIntervention();
    }
  };

  const triggerIntervention = () => {
    // Pause timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Select random intervention video
    const videoIndex = Math.floor(Math.random() * INTERVENTION_VIDEOS.length);
    setCurrentInterventionUrl(INTERVENTION_VIDEOS[videoIndex]);
    setShowIntervention(true);

    // Track intervention
    trackIntervention(videoIndex);

    // Set next intervention time based on addiction level
    const threshold = ADDICTION_THRESHOLDS[addictionLevel];
    setNextInterventionTime(watchTime + threshold.interval);
  };

  const trackVideoStart = async () => {
    try {
      // Add to recent videos
      const recentStr = await AsyncStorage.getItem('recent_videos');
      const recent = recentStr ? JSON.parse(recentStr) : [];
      
      const videoData = {
        id: videoId,
        title: videoTitle,
        thumbnail,
        channelTitle,
      };

      // Remove if already exists and add to front
      const filtered = recent.filter((v: any) => v.id !== videoId);
      filtered.unshift(videoData);
      
      await AsyncStorage.setItem('recent_videos', JSON.stringify(filtered.slice(0, 10)));

      // Track session start
      const sessionKey = `video_session_${Date.now()}`;
      await AsyncStorage.setItem(sessionKey, JSON.stringify({
        videoId,
        category,
        startTime: new Date().toISOString(),
        duration: 0,
      }));
    } catch (error) {
      console.error('Error tracking video start:', error);
    }
  };

  const trackVideoEnd = async () => {
    try {
      // Update total watch time
      const currentTotal = await AsyncStorage.getItem('total_video_watch_time');
      const total = currentTotal ? parseInt(currentTotal) : 0;
      await AsyncStorage.setItem('total_video_watch_time', (total + watchTime).toString());

      // Track by category
      const categoryKey = `category_${category}_time`;
      const categoryTime = await AsyncStorage.getItem(categoryKey);
      const catTotal = categoryTime ? parseInt(categoryTime) : 0;
      await AsyncStorage.setItem(categoryKey, (catTotal + watchTime).toString());

      // Log detailed analytics
      const analyticsKey = `video_analytics`;
      const analyticsStr = await AsyncStorage.getItem(analyticsKey);
      const analytics = analyticsStr ? JSON.parse(analyticsStr) : [];
      
      analytics.push({
        videoId,
        videoTitle,
        category,
        watchTime,
        addictionLevel,
        timestamp: new Date().toISOString(),
      });

      await AsyncStorage.setItem(analyticsKey, JSON.stringify(analytics));
    } catch (error) {
      console.error('Error tracking video end:', error);
    }
  };

  const trackIntervention = async (videoIndex: number) => {
    try {
      const key = `video_interventions`;
      const existing = await AsyncStorage.getItem(key);
      const interventions = existing ? JSON.parse(existing) : [];

      interventions.push({
        videoId,
        videoTitle,
        category,
        interventionVideoIndex: videoIndex,
        watchTimeWhenShown: watchTime,
        addictionLevel,
        timestamp: new Date().toISOString(),
      });

      await AsyncStorage.setItem(key, JSON.stringify(interventions));
    } catch (error) {
      console.error('Error tracking intervention:', error);
    }
  };

  const handleInterventionEnd = () => {
    setShowIntervention(false);

    // Show alert asking if they want to continue
    Alert.alert(
      'Time for a Break? 🌟',
      `You've been watching for ${Math.floor(watchTime / 60)} minutes. Taking breaks helps your eyes and brain!`,
      [
        {
          text: 'Take a Break',
          onPress: () => router.back(),
          style: 'default',
        },
        {
          text: 'Watch More',
          onPress: () => {
            // Resume timer
            startWatchTimer();
          },
          style: 'cancel',
        },
      ]
    );
  };

  const handleBackPress = () => {
    Alert.alert(
      'Stop Watching?',
      'Are you sure you want to exit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Exit',
          onPress: () => router.back(),
          style: 'destructive',
        },
      ]
    );
  };

  const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0`;

  return (
    <View style={styles.container}>
      {/* YouTube Player */}
      <View style={styles.videoContainer}>
        <WebView
          source={{ uri: youtubeEmbedUrl }}
          style={styles.webview}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
        />
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#6C63FF" />
          </View>
        )}
      </View>

      {/* Video Info */}
      <View style={styles.infoContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {videoTitle}
          </Text>
          <Text style={styles.channelTitle}>{channelTitle}</Text>
        </View>

        {/* Watch Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Ionicons name="time" size={20} color="#6C63FF" />
            <Text style={styles.statText}>
              {Math.floor(watchTime / 60)}:{(watchTime % 60).toString().padStart(2, '0')}
            </Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: getAddictionColor(addictionLevel) }]}>
            <Ionicons name="pulse" size={20} color="#FFFFFF" />
            <Text style={styles.statText}>{addictionLevel.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      {/* Intervention Modal */}
      <Modal
        visible={showIntervention}
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.interventionContainer}>
          <Video
            ref={videoRef}
            source={{ uri: currentInterventionUrl }}
            style={styles.interventionVideo}
            useNativeControls={false}
            resizeMode={ResizeMode.CONTAIN}
            isLooping={false}
            shouldPlay={showIntervention}
            onPlaybackStatusUpdate={(status) => {
              if (status.isLoaded && status.didJustFinish) {
                handleInterventionEnd();
              }
            }}
          />
          <View style={styles.interventionOverlay}>
            <View style={styles.interventionBadge}>
              <Ionicons name="eye-outline" size={24} color="#FFFFFF" />
              <Text style={styles.interventionText}>Screen Time Break</Text>
            </View>
          </View>
        </View>
      </Modal>
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
  videoContainer: {
    width: '100%',
    height: screenWidth * (9 / 16), // 16:9 aspect ratio
    backgroundColor: '#000000',
    position: 'relative',
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  infoContainer: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#16213E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  videoInfo: {
    marginBottom: 20,
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 28,
  },
  channelTitle: {
    fontSize: 14,
    color: '#999',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213E',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  interventionContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  interventionVideo: {
    width: screenWidth,
    height: screenHeight,
  },
  interventionOverlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  interventionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(108, 99, 255, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 10,
  },
  interventionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});