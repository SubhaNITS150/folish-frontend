// app/profile/achievements.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ACHIEVEMENTS = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Played your first game',
    icon: 'footsteps',
    color: '#6C63FF',
    unlocked: true,
    date: '2 days ago',
  },
  {
    id: '2',
    title: 'Chess Master',
    description: 'Won 10 chess games',
    icon: 'trophy',
    color: '#FFD700',
    unlocked: true,
    date: '1 week ago',
  },
  {
    id: '3',
    title: 'Quick Learner',
    description: 'Complete 5 educational videos',
    icon: 'school',
    color: '#4ECDC4',
    unlocked: true,
    date: '3 days ago',
  },
  {
    id: '4',
    title: 'Time Master',
    description: 'Stay within daily limit for 7 days',
    icon: 'time',
    color: '#FF6B6B',
    unlocked: false,
    progress: 5,
    total: 7,
  },
  {
    id: '5',
    title: 'Game Explorer',
    description: 'Play all available games',
    icon: 'game-controller',
    color: '#95E1D3',
    unlocked: false,
    progress: 3,
    total: 4,
  },
  {
    id: '6',
    title: 'Break Champion',
    description: 'Take 20 recommended breaks',
    icon: 'pause-circle',
    color: '#F38181',
    unlocked: false,
    progress: 12,
    total: 20,
  },
  {
    id: '7',
    title: 'Puzzle Pro',
    description: 'Complete 50 puzzle games',
    icon: 'cube',
    color: '#AA96DA',
    unlocked: false,
    progress: 23,
    total: 50,
  },
  {
    id: '8',
    title: 'Video Buff',
    description: 'Watch 100 educational videos',
    icon: 'videocam',
    color: '#FCBAD3',
    unlocked: false,
    progress: 67,
    total: 100,
  },
];

export default function AchievementsScreen() {
  const router = useRouter();

  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length;
  const totalCount = ACHIEVEMENTS.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Achievements</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{unlockedCount}</Text>
          <Text style={styles.statLabel}>Unlocked</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalCount - unlockedCount}</Text>
          <Text style={styles.statLabel}>Locked</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {Math.round((unlockedCount / totalCount) * 100)}%
          </Text>
          <Text style={styles.statLabel}>Complete</Text>
        </View>
      </View>

      {/* Achievements List */}
      <ScrollView style={styles.achievementsList}>
        {ACHIEVEMENTS.map((achievement) => (
          <View
            key={achievement.id}
            style={[
              styles.achievementCard,
              !achievement.unlocked && styles.lockedCard,
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: achievement.color },
                !achievement.unlocked && styles.lockedIcon,
              ]}
            >
              <Ionicons
                name={achievement.icon as any}
                size={32}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.achievementContent}>
              <Text
                style={[
                  styles.achievementTitle,
                  !achievement.unlocked && styles.lockedText,
                ]}
              >
                {achievement.title}
              </Text>
              <Text style={styles.achievementDescription}>
                {achievement.description}
              </Text>
              {achievement.unlocked ? (
                <View style={styles.unlockedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.unlockedText}>
                    Unlocked {achievement.date}
                  </Text>
                </View>
              ) : (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${
                            (achievement.progress! / achievement.total!) * 100
                          }%`,
                          backgroundColor: achievement.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {achievement.progress}/{achievement.total}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
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
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#16213E',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#1A1A2E',
  },
  achievementsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: '#16213E',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  lockedCard: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  lockedIcon: {
    backgroundColor: '#2A2A3E',
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  lockedText: {
    color: '#999',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  unlockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unlockedText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 5,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#1A1A2E',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
});