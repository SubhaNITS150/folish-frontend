// app/(tabs)/games.tsx - FIXED WITH PROPER DESIGN AND GAMES
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { 
    id: 'learning', 
    name: 'Learning', 
    icon: 'school', 
    color: '#FFB6D9',
    image: 'https://res.cloudinary.com/dg361q5uv/image/upload/v1765702119/Gemini_Generated_Image_w2uwnsw2uwnsw2uw_o3oafq.png'
  },
  { 
    id: 'adventure', 
    name: 'Adventure', 
    icon: 'rocket', 
    color: '#A8E6CF',
    image: 'https://res.cloudinary.com/dg361q5uv/image/upload/v1765702096/Gemini_Generated_Image_mclkoimclkoimclk_zjvv0n.png'
  },
  { 
    id: 'puzzle', 
    name: 'Puzzle', 
    icon: 'cube', 
    color: '#FFE985',
    image: 'https://res.cloudinary.com/dg361q5uv/image/upload/v1765702090/Gemini_Generated_Image_tcitg4tcitg4tcit_eh33ox.png'
  },
  { 
    id: 'creative', 
    name: 'Creative', 
    icon: 'color-palette', 
    color: '#B8B5FF',
    image: 'https://res.cloudinary.com/dg361q5uv/image/upload/v1765702077/Gemini_Generated_Image_gh4uz6gh4uz6gh4u_jccztp.png'
  },
];

const GAMES_DATA = [
  {
    id: 'goat-runner',
    title: 'Goat Runner',
    embed: 'https://emilypearsonart.itch.io/goat-runner',
    image: 'https://res.cloudinary.com/dg361q5uv/image/upload/v1765553938/gr_zydfjz.png',
    category: 'adventure',
    description: 'Run and jump with the goat!',
  },
  {
    id: 'love-tester',
    title: 'Love Tester',
    embed: 'https://www.onlinegames.io/games/2021/3/love-tester/index.html',
    image: 'https://www.onlinegames.io/media/posts/152/responsive/love-tester-xs.jpg',
    category: 'creative',
    description: 'Test your love compatibility!',
  },
  {
    id: 'stack-fire-ball',
    title: 'Stack Fire Ball',
    embed: 'https://www.onlinegames.io/games/2021/unity/stack-fire-ball/index.html',
    image: 'https://www.onlinegames.io/media/posts/184/responsive/Stack-Fire-Ball-Game-xs.jpg',
    category: 'puzzle',
    description: 'Break the colorful tiles!',
  },
  {
    id: 'basket-hoop',
    title: 'Basket Hoop',
    embed: 'https://cloud.onlinegames.io/games/2024/construct/311/basket-hoop/index-og.html',
    image: 'https://www.onlinegames.io/media/posts/843/responsive/Basket-Hoop-xs.jpg',
    category: 'puzzle',
    description: 'Make amazing baskets!',
  },
  {
    id: 'stickman-parkour',
    title: 'Stickman Parkour',
    embed: 'https://cloud.onlinegames.io/games/2024/construct/219/stickman-parkour/index-og.html',
    image: 'https://www.onlinegames.io/media/posts/871/responsive/stickman-parkour-OG-xs.jpg',
    category: 'adventure',
    description: 'Epic parkour adventure!',
  },
  {
    id: 'get-on-top',
    title: 'Get On Top',
    embed: 'https://www.onlinegames.io/games/2024/code/6/get-on-top/index.html',
    image: 'https://www.onlinegames.io/media/posts/697/responsive/Get-on-Top-xs.jpg',
    category: 'creative',
    description: 'Wrestling fun game!',
  },
];

export default function GamesScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('learning');
  const scaleAnim = new Animated.Value(1);

  const filteredGames = GAMES_DATA.filter(
    (game) => game.category === selectedCategory
  );

  const handleGamePress = (game: any) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    router.push({
      pathname: '/games/play',
      params: {
        gameId: game.id,
        gameName: game.title,
        gameUrl: game.embed,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#FFE5F1', '#FFF0F8']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>🎮 Games</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#FF69B4" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Featured Game */}
        <View style={styles.featuredSection}>
          <TouchableOpacity
            style={styles.featuredCard}
            onPress={() => handleGamePress(GAMES_DATA[0])}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: GAMES_DATA[0].image }}
              style={styles.featuredImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(255, 105, 180, 0.95)']}
              style={styles.featuredOverlay}
            >
              <View style={styles.featuredBadge}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.featuredBadgeText}>Featured</Text>
              </View>
              <Text style={styles.featuredTitle}>{GAMES_DATA[0].title}</Text>
              <Text style={styles.featuredDescription}>
                {GAMES_DATA[0].description}
              </Text>
              <View style={styles.playButton}>
                <Ionicons name="play" size={24} color="#FFFFFF" />
                <Text style={styles.playButtonText}>Play Now</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Choose a Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.id && styles.categoryCardActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: category.image }}
                  style={styles.categoryImage}
                />
                <LinearGradient
                  colors={
                    selectedCategory === category.id
                      ? [category.color, category.color]
                      : ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.95)']
                  }
                  style={styles.categoryOverlay}
                >
                  <View style={styles.categoryIconBubble}>
                    <Ionicons
                      name={category.icon as any}
                      size={28}
                      color={selectedCategory === category.id ? '#FFFFFF' : '#FF69B4'}
                    />
                  </View>
                  <Text
                    style={[
                      styles.categoryName,
                      selectedCategory === category.id && styles.categoryNameActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Games Grid */}
        <View style={styles.gamesSection}>
          <Text style={styles.sectionTitle}>
            {CATEGORIES.find((c) => c.id === selectedCategory)?.name} Games
          </Text>
          {filteredGames.length > 0 ? (
            <View style={styles.gamesGrid}>
              {filteredGames.map((game) => (
                <TouchableOpacity
                  key={game.id}
                  style={styles.gameCard}
                  onPress={() => handleGamePress(game)}
                  activeOpacity={0.85}
                >
                  <View style={styles.gameImageContainer}>
                    <Image source={{ uri: game.image }} style={styles.gameImage} />
                    <LinearGradient
                      colors={['transparent', 'rgba(0, 0, 0, 0.6)']}
                      style={styles.gameImageOverlay}
                    />
                    <View style={styles.playIconBubble}>
                      <Ionicons name="play" size={20} color="#FFFFFF" />
                    </View>
                  </View>
                  <View style={styles.gameInfo}>
                    <Text style={styles.gameTitle} numberOfLines={1}>
                      {game.title}
                    </Text>
                    <Text style={styles.gameDescription} numberOfLines={2}>
                      {game.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="game-controller-outline" size={64} color="#FFB6C1" />
              <Text style={styles.emptyText}>No games in this category yet!</Text>
              <Text style={styles.emptySubtext}>Check back soon for more fun! 🎮</Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredSection: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  featuredCard: {
    height: 220,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  featuredBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FF69B4',
    marginLeft: 4,
  },
  featuredTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  featuredDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 12,
    fontWeight: '600',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
  },
  categoriesSection: {
    marginTop: 30,
    paddingLeft: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FF1493',
    marginBottom: 15,
  },
  categoriesScroll: {
    paddingRight: 20,
  },
  categoryCard: {
    width: 140,
    height: 140,
    borderRadius: 20,
    marginRight: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  categoryCardActive: {
    transform: [{ scale: 1.05 }],
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    alignItems: 'center',
  },
  categoryIconBubble: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF69B4',
    textAlign: 'center',
  },
  categoryNameActive: {
    color: '#FFFFFF',
  },
  gamesSection: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gameCard: {
    width: (width - 55) / 2,
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  gameImageContainer: {
    width: '100%',
    height: 120,
    position: 'relative',
  },
  gameImage: {
    width: '100%',
    height: '100%',
  },
  gameImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  playIconBubble: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 105, 180, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameInfo: {
    padding: 12,
  },
  gameTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FF1493',
    marginBottom: 4,
  },
  gameDescription: {
    fontSize: 12,
    color: '#FF69B4',
    fontWeight: '600',
    lineHeight: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF69B4',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#FFB6C1',
    fontWeight: '600',
  },
});