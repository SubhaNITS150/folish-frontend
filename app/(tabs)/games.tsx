
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const GAME_CATEGORIES = ['Learning', 'Adventure', 'Puzzle', 'Creative'];

const GAMES_DATA = [
  {
    id: '1',
    name: 'Goat Runner',
    url: 'https://emilypearsonart.itch.io/goat-runner',
    image: 'https://res.cloudinary.com/dg361q5uv/image/upload/v1765553938/gr_zydfjz.png',
    category: 'Adventure',
    description: 'Run and jump with the goat!',
  },
  {
    id: '2',
    name: 'Chess',
    url: 'https://playpager.com/embed/chess/index.html',
    image: 'https://res.cloudinary.com/dg361q5uv/image/upload/v1765554831/Screenshot_2025-12-12_212318_ja7aih.png',
    category: 'Puzzle',
    description: 'Classic chess game',
  },
  {
    id: '3',
    name: 'Checkers',
    url: 'https://playpager.com/embed/checkers/index.html',
    image: 'https://res.cloudinary.com/dg361q5uv/image/upload/v1765554831/Screenshot_2025-12-12_212326_gfdgfe.png',
    category: 'Puzzle',
    description: 'Strategic board game',
  },
  {
    id: '4',
    name: 'Cubes',
    url: 'https://playpager.com/embed/cubes/index.html',
    image: 'https://res.cloudinary.com/dg361q5uv/image/upload/v1765554831/Screenshot_2025-12-12_212334_qfkzqo.png',
    category: 'Puzzle',
    description: 'Match and solve cubes',
  },
];

export default function GamesScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Learning');

  const filteredGames = GAMES_DATA.filter(
    (game) => game.category === selectedCategory
  );

  const handleGamePress = (game: any) => {
    router.push({
      pathname: './games/play',
      params: {
        gameId: game.id,
        gameName: game.name,
        gameUrl: game.url,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Games</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Featured Game Section */}
      <View style={styles.featuredSection}>
        <View style={styles.featuredCard}>
          <Image
            source={{ uri: GAMES_DATA[0].image }}
            style={styles.featuredImage}
          />
          <View style={styles.featuredOverlay}>
            <Text style={styles.featuredCategory}>Featured</Text>
            <Text style={styles.featuredTitle}>{GAMES_DATA[0].name}</Text>
            <Text style={styles.featuredDescription}>
              {GAMES_DATA[0].description}
            </Text>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => handleGamePress(GAMES_DATA[0])}
            >
              <Ionicons name="play" size={20} color="#FFFFFF" />
              <Text style={styles.playButtonText}>Play Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {GAME_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryTab,
              selectedCategory === category && styles.categoryTabActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Games Grid */}
      <ScrollView style={styles.gamesScrollView}>
        <View style={styles.gamesGrid}>
          {filteredGames.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={styles.gameCard}
              onPress={() => handleGamePress(game)}
            >
              <Image source={{ uri: game.image }} style={styles.gameImage} />
              <View style={styles.gameInfo}>
                <Text style={styles.gameName}>{game.name}</Text>
                <Text style={styles.gameCategory}>{game.category}</Text>
              </View>
            </TouchableOpacity>
          ))}
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  featuredSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  featuredCard: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  featuredCategory: {
    fontSize: 12,
    color: '#FFD93D',
    fontWeight: '600',
    marginBottom: 5,
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  featuredDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 12,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C63FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#16213E',
    marginRight: 10,
  },
  categoryTabActive: {
    backgroundColor: '#6C63FF',
  },
  categoryText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  gamesScrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 100,
  },
  gameCard: {
    width: '48%',
    backgroundColor: '#16213E',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  gameImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  gameInfo: {
    padding: 12,
  },
  gameName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  gameCategory: {
    fontSize: 12,
    color: '#999',
  },
});