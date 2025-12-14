// app/games/play.tsx
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ResizeMode, Video } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { WebView } from 'react-native-webview';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const INTERVENTION_VIDEOS = [
  'https://res.cloudinary.com/dg361q5uv/video/upload/v1759605675/Spaceship_s_Final_Blast_Through_Infinity_xrfcyx.mp4',
  'https://res.cloudinary.com/dg361q5uv/video/upload/v1759605664/Spaceship_s_Final_Flight_Into_Star_1_kqlm1q.mp4',
  'https://res.cloudinary.com/dg361q5uv/video/upload/v1759494142/Starship_Launch_to_Blinding_Star_1_mesgob.mp4',
];
const INTERVENTION_INTERVALS = [120, 300, 480]; 

export default function GamePlayScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { gameId, gameName, gameUrl } = params;

  const [showVideo, setShowVideo] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [playTime, setPlayTime] = useState(0);
  const [nextInterventionIndex, setNextInterventionIndex] = useState(0);
  const videoRef = useRef<Video>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setPlayTime((prev) => {
        const newTime = prev + 1;
        checkForIntervention(newTime);
        return newTime;
      });
    }, 1000);

    trackGameSession('start');

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      trackGameSession('end');
    };
  }, []);

  const checkForIntervention = (currentTime: number) => {
    if (nextInterventionIndex < INTERVENTION_INTERVALS.length) {
      if (currentTime >= INTERVENTION_INTERVALS[nextInterventionIndex]) {
        triggerIntervention();
      }
    }
  };

  const triggerIntervention = () => {
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const videoIndex = Math.floor(Math.random() * INTERVENTION_VIDEOS.length);
    setCurrentVideoUrl(INTERVENTION_VIDEOS[videoIndex]);
    setShowVideo(true);

    trackIntervention(videoIndex);
    setNextInterventionIndex((prev) => prev + 1);
  };

  const trackGameSession = async (action: 'start' | 'end') => {
    try {
      const key = `game_${gameId}_sessions`;
      const existing = await AsyncStorage.getItem(key);
      const sessions = existing ? JSON.parse(existing) : [];

      if (action === 'start') {
        sessions.push({
          startTime: new Date().toISOString(),
          duration: 0,
        });
      } else {
        if (sessions.length > 0) {
          sessions[sessions.length - 1].duration = playTime;
        }
      }

      await AsyncStorage.setItem(key, JSON.stringify(sessions));

   
      const totalKey = `total_screen_time`;
      const totalTime = await AsyncStorage.getItem(totalKey);
      const currentTotal = totalTime ? parseInt(totalTime) : 0;
      await AsyncStorage.setItem(totalKey, (currentTotal + playTime).toString());
    } catch (error) {
      console.error('Error tracking session:', error);
    }
  };

  const trackIntervention = async (videoIndex: number) => {
    try {
      const key = `interventions`;
      const existing = await AsyncStorage.getItem(key);
      const interventions = existing ? JSON.parse(existing) : [];

      interventions.push({
        gameId,
        gameName,
        videoIndex,
        timestamp: new Date().toISOString(),
        playTimeWhenShown: playTime,
      });

      await AsyncStorage.setItem(key, JSON.stringify(interventions));
    } catch (error) {
      console.error('Error tracking intervention:', error);
    }
  };

  const handleVideoEnd = () => {
    setShowVideo(false);

    Alert.alert(
      'Take a Break?',
      'You\'ve been playing for a while. Would you like to continue or take a break?',
      [
        {
          text: 'Take a Break',
          onPress: () => router.back(),
          style: 'default',
        },
        {
          text: 'Continue Playing',
          onPress: () => {
            
            timerRef.current = setInterval(() => {
              setPlayTime((prev) => {
                const newTime = prev + 1;
                checkForIntervention(newTime);
                return newTime;
              });
            }, 1000);
          },
          style: 'cancel',
        },
      ]
    );
  };

  const handleBackPress = () => {
    Alert.alert(
      'Exit Game?',
      'Are you sure you want to exit?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Exit',
          onPress: () => router.back(),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
  
      <WebView
        source={{ uri: gameUrl as string }}
        style={styles.webview}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />

      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      
      <View style={styles.timerContainer}>
        <Ionicons name="time" size={20} color="#FFFFFF" />
        <Text style={styles.timerText}>
          {Math.floor(playTime / 60)}:{(playTime % 60).toString().padStart(2, '0')}
        </Text>
      </View>

      <Modal
        visible={showVideo}
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: currentVideoUrl }}
            style={styles.video}
            useNativeControls={false}
            resizeMode={ResizeMode.CONTAIN}
            isLooping={false}
            shouldPlay={showVideo}
            onPlaybackStatusUpdate={(status) => {
              if (status.isLoaded && status.didJustFinish) {
                handleVideoEnd();
              }
            }}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  webview: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  timerContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: screenWidth,
    height: screenHeight,
  },
});