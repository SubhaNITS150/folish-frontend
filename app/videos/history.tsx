// app/videos/history.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface VideoAnalytics {
  videoId: string;
  videoTitle: string;
  category: string;
  watchTime: number;
  addictionLevel: string;
  timestamp: string;
}

interface CategoryStats {
  [key: string]: {
    time: number;
    count: number;
    color: string;
  };
}

export default function VideoHistoryScreen() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<VideoAnalytics[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats>({});
  const [totalWatchTime, setTotalWatchTime] = useState(0);
  const [interventionCount, setInterventionCount] = useState(0);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Load video analytics
      const analyticsStr = await AsyncStorage.getItem('video_analytics');
      if (analyticsStr) {
        const data: VideoAnalytics[] = JSON.parse(analyticsStr);
        setAnalytics(data);

        // Calculate total watch time
        const total = data.reduce((sum, item) => sum + item.watchTime, 0);
        setTotalWatchTime(total);

        // Calculate category stats
        const stats: CategoryStats = {};
        data.forEach((item) => {
          if (!stats[item.category]) {
            stats[item.category] = {
              time: 0,
              count: 0,
              color: getCategoryColor(item.category),
            };
          }
          stats[item.category].time += item.watchTime;
          stats[item.category].count += 1;
        });
        setCategoryStats(stats);
      }

      // Load intervention count
      const interventionsStr = await AsyncStorage.getItem('video_interventions');
      if (interventionsStr) {
        const interventions = JSON.parse(interventionsStr);
        setInterventionCount(interventions.length);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
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

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${seconds % 60}s`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
    return date.toLocaleDateString();
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all watch history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('video_analytics');
              await AsyncStorage.removeItem('video_interventions');
              await AsyncStorage.removeItem('recent_videos');
              setAnalytics([]);
              setCategoryStats({});
              setTotalWatchTime(0);
              setInterventionCount(0);
            } catch (error) {
              console.error('Error clearing history:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Watch History</Text>
        <TouchableOpacity onPress={handleClearHistory}>
          <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons name="time" size={28} color="#6C63FF" />
            </View>
            <Text style={styles.summaryValue}>{formatTime(totalWatchTime)}</Text>
            <Text style={styles.summaryLabel}>Total Watch Time</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons name="videocam" size={28} color="#4ECDC4" />
            </View>
            <Text style={styles.summaryValue}>{analytics.length}</Text>
            <Text style={styles.summaryLabel}>Videos Watched</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons name="alert-circle" size={28} color="#FFD93D" />
            </View>
            <Text style={styles.summaryValue}>{interventionCount}</Text>
            <Text style={styles.summaryLabel}>Break Reminders</Text>
          </View>
        </View>

        {/* Category Breakdown */}
        {Object.keys(categoryStats).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category Breakdown</Text>
            {Object.entries(categoryStats).map(([category, stats]) => (
              <View key={category} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryLeft}>
                    <View
                      style={[
                        styles.categoryDot,
                        { backgroundColor: stats.color },
                      ]}
                    />
                    <Text style={styles.categoryName}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </View>
                  <View style={styles.categoryRight}>
                    <Text style={styles.categoryTime}>{formatTime(stats.time)}</Text>
                    <Text style={styles.categoryCount}>{stats.count} videos</Text>
                  </View>
                </View>
                <View style={styles.categoryBar}>
                  <View
                    style={[
                      styles.categoryBarFill,
                      {
                        backgroundColor: stats.color,
                        width: `${(stats.time / totalWatchTime) * 100}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Watch History List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {analytics.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="time-outline" size={64} color="#999" />
              <Text style={styles.emptyText}>No watch history yet</Text>
              <Text style={styles.emptySubtext}>
                Start watching videos to see your history
              </Text>
            </View>
          ) : (
            analytics
              .slice()
              .reverse()
              .map((item, index) => (
                <View key={index} style={styles.historyItem}>
                  <View style={styles.historyIcon}>
                    <Ionicons name="play-circle" size={24} color="#6C63FF" />
                  </View>
                  <View style={styles.historyContent}>
                    <Text style={styles.historyTitle} numberOfLines={2}>
                      {item.videoTitle}
                    </Text>
                    <View style={styles.historyMeta}>
                      <View
                        style={[
                          styles.categoryBadge,
                          {
                            backgroundColor: getCategoryColor(item.category),
                          },
                        ]}
                      >
                        <Text style={styles.categoryBadgeText}>
                          {item.category}
                        </Text>
                      </View>
                      <Text style={styles.historyTime}>
                        {formatTime(item.watchTime)}
                      </Text>
                      <Text style={styles.historyDate}>
                        {formatDate(item.timestamp)}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.addictionIndicator,
                      {
                        backgroundColor:
                          item.addictionLevel === 'high'
                            ? '#FF6B6B'
                            : item.addictionLevel === 'medium'
                            ? '#FFD93D'
                            : '#4CAF50',
                      },
                    ]}
                  />
                </View>
              ))
          )}
        </View>
      </ScrollView>
    </View>
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
  content: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 30,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#16213E',
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
  },
  summaryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1A1A2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
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
  categoryItem: {
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 12,
    color: '#999',
  },
  categoryBar: {
    height: 6,
    backgroundColor: '#1A1A2E',
    borderRadius: 3,
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
  },
  historyIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#1A1A2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
    lineHeight: 18,
  },
  historyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  historyTime: {
    fontSize: 12,
    color: '#999',
  },
  historyDate: {
    fontSize: 12,
    color: '#666',
  },
  addictionIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});