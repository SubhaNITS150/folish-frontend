// app/profile/parental-settings.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

export default function ParentalSettingsScreen() {
  const router = useRouter();
  const [brightness, setBrightness] = useState(0.7);
  const [soundVolume, setSoundVolume] = useState(0.5);
  const [dailyLimit, setDailyLimit] = useState(120); // minutes
  
  // Mock screen time data
  const [screenTimeData, setScreenTimeData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [45, 60, 30, 90, 75, 120, 105]
    }]
  });

  // Game-specific screen time
  const gameScreenTime = [
    { name: 'Goat Runner', time: 45, color: '#FF6B6B' },
    { name: 'Chess', time: 30, color: '#4ECDC4' },
    { name: 'Checkers', time: 20, color: '#FFD93D' },
    { name: 'Cubes', time: 25, color: '#6C63FF' },
  ];

  // Video effectiveness data
  const videoEffectiveness = [
    { video: 'Police Warning', effectiveness: 85, color: '#FF6B6B' },
    { video: 'Star Flight', effectiveness: 70, color: '#4ECDC4' },
    { video: 'Spaceship Blast', effectiveness: 65, color: '#FFD93D' },
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedBrightness = await AsyncStorage.getItem('brightness');
      const savedSound = await AsyncStorage.getItem('soundVolume');
      const savedLimit = await AsyncStorage.getItem('dailyLimit');
      
      if (savedBrightness) setBrightness(parseFloat(savedBrightness));
      if (savedSound) setSoundVolume(parseFloat(savedSound));
      if (savedLimit) setDailyLimit(parseInt(savedLimit));
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('brightness', brightness.toString());
      await AsyncStorage.setItem('soundVolume', soundVolume.toString());
      await AsyncStorage.setItem('dailyLimit', dailyLimit.toString());
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  useEffect(() => {
    saveSettings();
  }, [brightness, soundVolume, dailyLimit]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Parental Controls</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Weekly Screen Time Graph */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Screen Time</Text>
        <View style={styles.chartContainer}>
          <LineChart
            data={screenTimeData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#16213E',
              backgroundGradientFrom: '#16213E',
              backgroundGradientTo: '#16213E',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#6C63FF',
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>
      </View>

      {/* Game Screen Time Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Screen Time by Game</Text>
        {gameScreenTime.map((game, index) => (
          <View key={index} style={styles.gameTimeItem}>
            <View style={styles.gameTimeLeft}>
              <View style={[styles.colorDot, { backgroundColor: game.color }]} />
              <Text style={styles.gameName}>{game.name}</Text>
            </View>
            <View style={styles.gameTimeRight}>
              <Text style={styles.gameTime}>{game.time} min</Text>
              <View style={styles.gameTimeBar}>
                <View
                  style={[
                    styles.gameTimeBarFill,
                    {
                      backgroundColor: game.color,
                      width: `${(game.time / 120) * 100}%`,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Video Effectiveness */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Most Effective Videos</Text>
        <Text style={styles.sectionSubtitle}>
          Videos ranked by engagement reduction effectiveness
        </Text>
        {videoEffectiveness
          .sort((a, b) => b.effectiveness - a.effectiveness)
          .map((video, index) => (
            <View key={index} style={styles.videoEffectItem}>
              <View style={styles.videoRank}>
                <Text style={styles.videoRankText}>{index + 1}</Text>
              </View>
              <View style={styles.videoEffectContent}>
                <Text style={styles.videoName}>{video.video}</Text>
                <View style={styles.effectivenessBar}>
                  <View
                    style={[
                      styles.effectivenessBarFill,
                      {
                        backgroundColor: video.color,
                        width: `${video.effectiveness}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.effectivenessText}>
                  {video.effectiveness}% effective
                </Text>
              </View>
            </View>
          ))}
      </View>

      {/* Controls Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Controls</Text>

        {/* Brightness Control */}
        <View style={styles.controlItem}>
          <View style={styles.controlHeader}>
            <Ionicons name="sunny" size={24} color="#FFD93D" />
            <Text style={styles.controlLabel}>Brightness</Text>
            <Text style={styles.controlValue}>{Math.round(brightness * 100)}%</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={brightness}
            onValueChange={setBrightness}
            minimumTrackTintColor="#6C63FF"
            maximumTrackTintColor="#1A1A2E"
            thumbTintColor="#FFFFFF"
          />
        </View>

        {/* Sound Control */}
        <View style={styles.controlItem}>
          <View style={styles.controlHeader}>
            <Ionicons name="volume-high" size={24} color="#4ECDC4" />
            <Text style={styles.controlLabel}>Sound</Text>
            <Text style={styles.controlValue}>{Math.round(soundVolume * 100)}%</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={soundVolume}
            onValueChange={setSoundVolume}
            minimumTrackTintColor="#6C63FF"
            maximumTrackTintColor="#1A1A2E"
            thumbTintColor="#FFFFFF"
          />
        </View>

        {/* Daily Limit Control */}
        <View style={styles.controlItem}>
          <View style={styles.controlHeader}>
            <Ionicons name="time" size={24} color="#FF6B6B" />
            <Text style={styles.controlLabel}>Daily Limit</Text>
            <Text style={styles.controlValue}>{dailyLimit} min</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={30}
            maximumValue={240}
            step={15}
            value={dailyLimit}
            onValueChange={setDailyLimit}
            minimumTrackTintColor="#6C63FF"
            maximumTrackTintColor="#1A1A2E"
            thumbTintColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Video Library */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Video Library Settings</Text>
        <TouchableOpacity style={styles.libraryButton}>
          <Ionicons name="videocam" size={24} color="#6C63FF" />
          <Text style={styles.libraryButtonText}>Manage Video Library</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.libraryButton}>
          <Ionicons name="settings" size={24} color="#6C63FF" />
          <Text style={styles.libraryButtonText}>Video Trigger Settings</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#999',
    marginBottom: 15,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  gameTimeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#16213E',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  gameTimeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  gameName: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  gameTimeRight: {
    alignItems: 'flex-end',
    flex: 1,
  },
  gameTime: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 5,
  },
  gameTimeBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#1A1A2E',
    borderRadius: 3,
    overflow: 'hidden',
  },
  gameTimeBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  videoEffectItem: {
    flexDirection: 'row',
    backgroundColor: '#16213E',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  videoRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  videoRankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  videoEffectContent: {
    flex: 1,
  },
  videoName: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  effectivenessBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#1A1A2E',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  effectivenessBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  effectivenessText: {
    fontSize: 12,
    color: '#999',
  },
  controlItem: {
    backgroundColor: '#16213E',
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
  },
  controlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  controlLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
  controlValue: {
    fontSize: 16,
    color: '#6C63FF',
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  libraryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213E',
    padding: 18,
    borderRadius: 12,
    marginBottom: 10,
  },
  libraryButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    flex: 1,
    marginLeft: 15,
  },
});