// app/profile/parental-settings.tsx (UPDATED)
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
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

interface VideoAnalytics {
  videoId: string;
  videoTitle: string;
  category: string;
  watchTime: number;
  addictionLevel: string;
  timestamp: string;
}

export default function ParentalSettingsScreen() {
  const router = useRouter();
  const [brightness, setBrightness] = useState(0.7);
  const [soundVolume, setSoundVolume] = useState(0.5);
  const [dailyLimit, setDailyLimit] = useState(120);
  const [activeTab, setActiveTab] = useState<'games' | 'videos'>('games');
  
  // Games data
  const [gameScreenTimeData, setGameScreenTimeData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [45, 60, 30, 90, 75, 120, 105]
    }]
  });

  // Videos data
  const [videoScreenTimeData, setVideoScreenTimeData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [30, 45, 60, 50, 80, 90, 70]
    }]
  });

  const [videoCategoryData, setVideoCategoryData] = useState<any[]>([]);
  const [videoInterventions, setVideoInterventions] = useState(0);
  const [addictionLevel, setAddictionLevel] = useState<'low' | 'medium' | 'high'>('low');

  const gameScreenTime = [
    { name: 'Goat Runner', time: 45, color: '#FF6B6B' },
    { name: 'Chess', time: 30, color: '#4ECDC4' },
    { name: 'Checkers', time: 20, color: '#FFD93D' },
    { name: 'Cubes', time: 25, color: '#6C63FF' },
  ];

  const videoEffectiveness = [
    { video: 'Police Warning', effectiveness: 85, color: '#FF6B6B' },
    { video: 'Star Flight', effectiveness: 70, color: '#4ECDC4' },
    { video: 'Spaceship Blast', effectiveness: 65, color: '#FFD93D' },
  ];

  useEffect(() => {
    loadSettings();
    loadVideoAnalytics();
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

  const loadVideoAnalytics = async () => {
    try {
      // Load video analytics
      const analyticsStr = await AsyncStorage.getItem('video_analytics');
      if (analyticsStr) {
        const analytics: VideoAnalytics[] = JSON.parse(analyticsStr);
        
        // Calculate category breakdown
        const categoryMap: { [key: string]: { time: number; color: string } } = {};
        analytics.forEach((item) => {
          if (!categoryMap[item.category]) {
            categoryMap[item.category] = {
              time: 0,
              color: getCategoryColor(item.category),
            };
          }
          categoryMap[item.category].time += item.watchTime;
        });

        // Convert to pie chart format
        const pieData = Object.entries(categoryMap).map(([name, data]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          population: data.time,
          color: data.color,
          legendFontColor: '#FFFFFF',
          legendFontSize: 12,
        }));
        setVideoCategoryData(pieData);
      }

      // Load interventions
      const interventionsStr = await AsyncStorage.getItem('video_interventions');
      if (interventionsStr) {
        const interventions = JSON.parse(interventionsStr);
        setVideoInterventions(interventions.length);
      }

      // Load addiction level
      const addiction = await AsyncStorage.getItem('addiction_level');
      if (addiction) {
        setAddictionLevel(addiction as any);
      }
    } catch (error) {
      console.error('Error loading video analytics:', error);
    }
  };

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      learning: '#4ECDC4',
      fun: '#FFD93D',
      music: '#FF6B6B',
      stories: '#95E1D3',
      science: '#AA96DA',
      art: '#FCBAD3',
    };
    return colors[category] || '#6C63FF';
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

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'games' && styles.tabActive]}
          onPress={() => setActiveTab('games')}
        >
          <Ionicons
            name="game-controller"
            size={20}
            color={activeTab === 'games' ? '#FFFFFF' : '#999'}
          />
          <Text style={[styles.tabText, activeTab === 'games' && styles.tabTextActive]}>
            Games
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'videos' && styles.tabActive]}
          onPress={() => setActiveTab('videos')}
        >
          <Ionicons
            name="videocam"
            size={20}
            color={activeTab === 'videos' ? '#FFFFFF' : '#999'}
          />
          <Text style={[styles.tabText, activeTab === 'videos' && styles.tabTextActive]}>
            Videos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Games Tab Content */}
      {activeTab === 'games' && (
        <>
          {/* Weekly Screen Time Graph */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly Game Time</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={gameScreenTimeData}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                  backgroundColor: '#16213E',
                  backgroundGradientFrom: '#16213E',
                  backgroundGradientTo: '#16213E',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: { borderRadius: 16 },
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
            <Text style={styles.sectionTitle}>Game Time Breakdown</Text>
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
            <Text style={styles.sectionTitle}>Intervention Effectiveness</Text>
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
        </>
      )}

      {/* Videos Tab Content */}
      {activeTab === 'videos' && (
        <>
          {/* Weekly Video Watch Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly Video Time</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={videoScreenTimeData}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                  backgroundColor: '#16213E',
                  backgroundGradientFrom: '#16213E',
                  backgroundGradientTo: '#16213E',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(76, 205, 196, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: { borderRadius: 16 },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#4ECDC4',
                  },
                }}
                bezier
                style={styles.chart}
              />
            </View>
          </View>

          {/* Addiction Level Indicator */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Engagement Level</Text>
            <View style={[styles.addictionCard, { borderColor: getAddictionColor(addictionLevel) }]}>
              <View style={styles.addictionHeader}>
                <Ionicons name="pulse" size={32} color={getAddictionColor(addictionLevel)} />
                <View style={styles.addictionInfo}>
                  <Text style={styles.addictionLevel}>
                    {addictionLevel.toUpperCase()} LEVEL
                  </Text>
                  <Text style={styles.addictionDesc}>
                    {addictionLevel === 'low' 
                      ? 'Healthy viewing habits'
                      : addictionLevel === 'medium'
                      ? 'Moderate engagement - monitor closely'
                      : 'High engagement - intervention recommended'}
                  </Text>
                </View>
              </View>
              <View style={styles.interventionStats}>
                <View style={styles.interventionStat}>
                  <Text style={styles.interventionValue}>{videoInterventions}</Text>
                  <Text style={styles.interventionLabel}>Break Reminders</Text>
                </View>
                <View style={styles.interventionStat}>
                  <Text style={styles.interventionValue}>
                    {addictionLevel === 'low' ? '5m' : addictionLevel === 'medium' ? '4m' : '3m'}
                  </Text>
                  <Text style={styles.interventionLabel}>Reminder Frequency</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Category Distribution */}
          {videoCategoryData.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category Distribution</Text>
              <View style={styles.chartContainer}>
                <PieChart
                  data={videoCategoryData}
                  width={screenWidth - 40}
                  height={220}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              </View>
            </View>
          )}

          {/* Category Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category Details</Text>
            {videoCategoryData.map((category, index) => (
              <View key={index} style={styles.categoryDetailItem}>
                <View style={[styles.colorDot, { backgroundColor: category.color }]} />
                <Text style={styles.categoryDetailName}>{category.name}</Text>
                <Text style={styles.categoryDetailTime}>
                  {Math.floor(category.population / 60)}m {category.population % 60}s
                </Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Controls Section (Common for both) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Controls</Text>

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

      {/* Content Library */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Content Management</Text>
        <TouchableOpacity style={styles.libraryButton}>
          <Ionicons name="videocam" size={24} color="#6C63FF" />
          <Text style={styles.libraryButtonText}>Manage Video Library</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.libraryButton}>
          <Ionicons name="settings" size={24} color="#6C63FF" />
          <Text style={styles.libraryButtonText}>Intervention Settings</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.libraryButton}
          onPress={() => router.push('./videos/history')}
        >
          <Ionicons name="time" size={24} color="#6C63FF" />
          <Text style={styles.libraryButtonText}>View Full History</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  tabActive: {
    backgroundColor: '#6C63FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  tabTextActive: {
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
  addictionCard: {
    backgroundColor: '#16213E',
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
  },
  addictionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  addictionInfo: {
    marginLeft: 15,
    flex: 1,
  },
  addictionLevel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  addictionDesc: {
    fontSize: 13,
    color: '#999',
    lineHeight: 18,
  },
  interventionStats: {
    flexDirection: 'row',
    gap: 15,
  },
  interventionStat: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  interventionValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  interventionLabel: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },
  categoryDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213E',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  categoryDetailName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  categoryDetailTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C63FF',
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