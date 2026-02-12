// app/videos/personalized.tsx - PERSONALIZED VIDEOS STORE
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface VideoItem {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  image: string;
  icon: string;
}

const VIDEO_CATEGORIES = [
  {
    id: 'police',
    name: 'Police Warning',
    icon: 'shield',
    color: '#FF6B6B',
    description: 'Police officer warnings about screen time',
  },
  {
    id: 'doctor',
    name: 'Doctor Advice',
    icon: 'medical',
    color: '#4ECDC4',
    description: 'Doctor explaining health effects',
  },
  {
    id: 'parent',
    name: 'Parent Talk',
    icon: 'people',
    color: '#FFD93D',
    description: 'Parental guidance videos',
  },
  {
    id: 'scary',
    name: 'Scary Stories',
    icon: 'skull',
    color: '#B8B5FF',
    description: 'Age-appropriate scary stories',
  },
  {
    id: 'space',
    name: 'Space Adventures',
    icon: 'rocket',
    color: '#95E1D3',
    description: 'Space-themed intervention videos',
  },
  {
    id: 'superhero',
    name: 'Superhero Messages',
    icon: 'flash',
    color: '#FFB6D9',
    description: 'Superhero teaching good habits',
  },
];

const AVAILABLE_VIDEOS: VideoItem[] = [
  {
    id: 'v1',
    title: 'Police Screen Time Warning',
    category: 'police',
    description: 'Friendly police officer explaining why breaks are important',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
    icon: 'shield',
  },
  {
    id: 'v2',
    title: 'Doctor Eye Health Talk',
    category: 'doctor',
    description: 'Doctor explaining how screens affect your eyes',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400',
    icon: 'medical',
  },
  {
    id: 'v3',
    title: 'Mom & Dad Care',
    category: 'parent',
    description: 'Your parents talking about healthy gaming habits',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400',
    icon: 'people',
  },
  {
    id: 'v4',
    title: 'The Screen Monster Story',
    category: 'scary',
    description: 'A friendly monster teaching about screen time balance',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400',
    icon: 'skull',
  },
  {
    id: 'v5',
    title: 'Astronaut Break Time',
    category: 'space',
    description: 'Astronaut explaining why even space explorers take breaks',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400',
    icon: 'rocket',
  },
  {
    id: 'v6',
    title: 'Super Screen Hero',
    category: 'superhero',
    description: 'Superhero teaching the power of taking breaks',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400',
    icon: 'flash',
  },
];

export default function PersonalizedVideosScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<VideoItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const filteredVideos = selectedCategory === 'all'
    ? AVAILABLE_VIDEOS
    : AVAILABLE_VIDEOS.filter(v => v.category === selectedCategory);

  const addToCart = (video: VideoItem) => {
    if (!cart.find(item => item.id === video.id)) {
      setCart([...cart, video]);
      Alert.alert('✅ Added!', `${video.title} added to cart`);
    } else {
      Alert.alert('ℹ️ Already in cart', 'This video is already in your cart');
    }
  };

  const removeFromCart = (videoId: string) => {
    setCart(cart.filter(item => item.id !== videoId));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('🛒 Cart Empty', 'Please add videos to your cart first!');
      return;
    }
    setShowCart(false);
    setShowCheckout(true);
  };

  const processOrder = () => {
    if (!name || !email || !cardNumber) {
      Alert.alert('❌ Missing Info', 'Please fill in all fields');
      return;
    }

    Alert.alert(
      '🎉 Order Placed!',
      'Your personalized videos will be ready in 24-48 hours. We\'ll send them to your email!',
      [
        {
          text: 'OK',
          onPress: () => {
            setShowCheckout(false);
            setCart([]);
            setName('');
            setEmail('');
            setCardNumber('');
            router.back();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#FFE5F1', '#FFF0F8']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#FF69B4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Custom Videos</Text>
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => setShowCart(true)}
        >
          <Ionicons name="cart" size={24} color="#FF69B4" />
          {cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <LinearGradient
            colors={['#FFB6D9', '#FF8DC7']}
            style={styles.infoGradient}
          >
            <Ionicons name="information-circle" size={32} color="#FFFFFF" />
            <Text style={styles.infoText}>
              Create personalized intervention videos featuring people or characters your child relates to!
            </Text>
          </LinearGradient>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📁 Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === 'all' && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text style={styles.categoryChipText}>All Videos</Text>
            </TouchableOpacity>
            {VIDEO_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === cat.id && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Ionicons name={cat.icon as any} size={18} color="#FFFFFF" />
                <Text style={styles.categoryChipText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Videos Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎬 Available Videos</Text>
          <View style={styles.videosGrid}>
            {filteredVideos.map((video) => (
              <View key={video.id} style={styles.videoCard}>
                <Image source={{ uri: video.image }} style={styles.videoImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
                  style={styles.videoOverlay}
                />
                <View style={styles.videoIconBubble}>
                  <Ionicons name={video.icon as any} size={24} color="#FFFFFF" />
                </View>
                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle}>{video.title}</Text>
                  <Text style={styles.videoDescription}>{video.description}</Text>
                  <View style={styles.videoFooter}>
                    <Text style={styles.videoPrice}>${video.price}</Text>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => addToCart(video)}
                    >
                      <LinearGradient
                        colors={['#A8E6CF', '#7FD1AE']}
                        style={styles.addButtonGradient}
                      >
                        <Ionicons name="add" size={20} color="#FFFFFF" />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Cart Modal */}
      <Modal
        visible={showCart}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCart(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cartModal}>
            <LinearGradient
              colors={['#FFE5F1', '#FFF0F8']}
              style={styles.cartHeader}
            >
              <Text style={styles.cartTitle}>🛒 Your Cart</Text>
              <TouchableOpacity onPress={() => setShowCart(false)}>
                <Ionicons name="close" size={28} color="#FF69B4" />
              </TouchableOpacity>
            </LinearGradient>

            <ScrollView style={styles.cartContent}>
              {cart.length === 0 ? (
                <View style={styles.emptyCart}>
                  <Ionicons name="cart-outline" size={64} color="#FFB6C1" />
                  <Text style={styles.emptyText}>Your cart is empty</Text>
                </View>
              ) : (
                cart.map((item) => (
                  <View key={item.id} style={styles.cartItem}>
                    <Image source={{ uri: item.image }} style={styles.cartItemImage} />
                    <View style={styles.cartItemInfo}>
                      <Text style={styles.cartItemTitle}>{item.title}</Text>
                      <Text style={styles.cartItemPrice}>${item.price}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeFromCart(item.id)}
                    >
                      <Ionicons name="trash" size={20} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </ScrollView>

            {cart.length > 0 && (
              <View style={styles.cartFooter}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalAmount}>${getTotalPrice()}</Text>
                </View>
                <TouchableOpacity
                  style={styles.checkoutButton}
                  onPress={handleCheckout}
                >
                  <LinearGradient
                    colors={['#FFB6D9', '#FF8DC7']}
                    style={styles.checkoutGradient}
                  >
                    <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Checkout Modal */}
      <Modal
        visible={showCheckout}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCheckout(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.checkoutModal}>
            <LinearGradient
              colors={['#FFE5F1', '#FFF0F8']}
              style={styles.checkoutHeader}
            >
              <Text style={styles.checkoutTitle}>💳 Checkout</Text>
              <TouchableOpacity onPress={() => setShowCheckout(false)}>
                <Ionicons name="close" size={28} color="#FF69B4" />
              </TouchableOpacity>
            </LinearGradient>

            <ScrollView style={styles.checkoutContent}>
              <Text style={styles.formLabel}>Full Name</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter your name"
                placeholderTextColor="#FFB6C1"
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.formLabel}>Email</Text>
              <TextInput
                style={styles.formInput}
                placeholder="your@email.com"
                placeholderTextColor="#FFB6C1"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />

              <Text style={styles.formLabel}>Card Number</Text>
              <TextInput
                style={styles.formInput}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#FFB6C1"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="numeric"
                maxLength={19}
              />

              <View style={styles.orderSummary}>
                <Text style={styles.summaryTitle}>Order Summary</Text>
                {cart.map((item) => (
                  <View key={item.id} style={styles.summaryItem}>
                    <Text style={styles.summaryItemName}>{item.title}</Text>
                    <Text style={styles.summaryItemPrice}>${item.price}</Text>
                  </View>
                ))}
                <View style={styles.summaryTotal}>
                  <Text style={styles.summaryTotalLabel}>Total:</Text>
                  <Text style={styles.summaryTotalAmount}>${getTotalPrice()}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.placeOrderButton}
                onPress={processOrder}
              >
                <LinearGradient
                  colors={['#A8E6CF', '#7FD1AE']}
                  style={styles.placeOrderGradient}
                >
                  <Text style={styles.placeOrderText}>Place Order</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FF1493',
  },
  cartButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF6B6B',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  infoGradient: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FF1493',
    marginBottom: 15,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5F1',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: '#FF69B4',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  videosGrid: {
    gap: 15,
  },
  videoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  videoImage: {
    width: '100%',
    height: 180,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  videoIconBubble: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 105, 180, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    padding: 15,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF1493',
    marginBottom: 6,
  },
  videoDescription: {
    fontSize: 13,
    color: '#FF69B4',
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 12,
  },
  videoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoPrice: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FF1493',
  },
  addButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  addButtonGradient: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 105, 180, 0.2)',
    justifyContent: 'flex-end',
  },
  cartModal: {
    height: '80%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  cartTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FF1493',
  },
  cartContent: {
    flex: 1,
    padding: 20,
  },
  emptyCart: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFB6C1',
    marginTop: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF5F8',
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  cartItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cartItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF1493',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FF69B4',
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE5F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartFooter: {
    padding: 20,
    borderTopWidth: 2,
    borderTopColor: '#FFE5F1',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF1493',
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FF1493',
  },
  checkoutButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  checkoutGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    gap: 10,
  },
  checkoutText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  checkoutModal: {
    height: '90%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  checkoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  checkoutTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FF1493',
  },
  checkoutContent: {
    flex: 1,
    padding: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF1493',
    marginBottom: 8,
    marginTop: 12,
  },
  formInput: {
    backgroundColor: '#FFF5F8',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    color: '#FF1493',
    fontWeight: '600',
    borderWidth: 2,
    borderColor: '#FFE5F1',
  },
  orderSummary: {
    backgroundColor: '#FFF5F8',
    borderRadius: 20,
    padding: 20,
    marginTop: 25,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF1493',
    marginBottom: 15,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryItemName: {
    fontSize: 14,
    color: '#FF69B4',
    fontWeight: '600',
  },
  summaryItemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF1493',
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#FFE5F1',
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF1493',
  },
  summaryTotalAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FF1493',
  },
  placeOrderButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 25,
    marginBottom: 30,
  },
  placeOrderGradient: {
    padding: 18,
    alignItems: 'center',
  },
  placeOrderText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});