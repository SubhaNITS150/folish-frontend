// app/profile/settings.tsx - FIXED WITH PASSWORD MODAL
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';

export default function SettingsScreen() {
  const router = useRouter();
  const [screenTimeEnabled, setScreenTimeEnabled] = useState(true);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [safeModeEnabled, setSafeModeEnabled] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [modalType, setModalType] = useState<'parental' | 'personalized'>('parental');
  const PARENTAL_PASSWORD = '1234';

  const handleParentalSettings = async () => {
    setModalType('parental');
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (hasHardware && isEnrolled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access Parental Settings',
        fallbackLabel: 'Use Password',
      });

      if (result.success) {
        router.push('/profile/parental-settings');
      } else {
        setShowPasswordModal(true);
      }
    } else {
      setShowPasswordModal(true);
    }
  };

  const handlePersonalizedVideos = async () => {
    setModalType('personalized');
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (hasHardware && isEnrolled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access Personalized Videos',
        fallbackLabel: 'Use Password',
      });

      if (result.success) {
        router.push('/videos/personalized');
      } else {
        setShowPasswordModal(true);
      }
    } else {
      setShowPasswordModal(true);
    }
  };

  const verifyPassword = () => {
    if (password === PARENTAL_PASSWORD) {
      setShowPasswordModal(false);
      setPassword('');
      if (modalType === 'parental') {
        router.push('/profile/parental-settings');
      } else {
        router.push('/videos/personalized');
      }
    } else {
      Alert.alert('❌ Incorrect Password', 'Please try again!');
      setPassword('');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#FFE5F1', '#FFF0F8']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#FF69B4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 28 }} />
      </LinearGradient>

      {/* Parental Additions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👨‍👩‍👧 Parental Additions</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingLeft}>
            <View style={styles.iconBubble}>
              <Ionicons name="time-outline" size={24} color="#FF69B4" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Screen Time</Text>
              <Text style={styles.settingSubtitle}>Set daily limits for app usage</Text>
            </View>
          </View>
          <Switch
            value={screenTimeEnabled}
            onValueChange={setScreenTimeEnabled}
            trackColor={{ false: '#FFE5F1', true: '#FFB6D9' }}
            thumbColor={screenTimeEnabled ? '#FF69B4' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingCard}>
          <View style={styles.settingLeft}>
            <View style={styles.iconBubble}>
              <Ionicons name="calendar-outline" size={24} color="#A8E6CF" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Schedule</Text>
              <Text style={styles.settingSubtitle}>Set specific times for app access</Text>
            </View>
          </View>
          <Switch
            value={scheduleEnabled}
            onValueChange={setScheduleEnabled}
            trackColor={{ false: '#FFE5F1', true: '#A8E6CF' }}
            thumbColor={scheduleEnabled ? '#7FD1AE' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔔 Notifications</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingLeft}>
            <View style={styles.iconBubble}>
              <Ionicons name="notifications-outline" size={24} color="#FFE985" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Notification Settings</Text>
              <Text style={styles.settingSubtitle}>Receive alerts and important updates</Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#FFE5F1', true: '#FFE985' }}
            thumbColor={notificationsEnabled ? '#FFD700' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Safe Mode Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🛡️ Safe Mode</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingLeft}>
            <View style={styles.iconBubble}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#B8B5FF" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Enable Safe Mode</Text>
              <Text style={styles.settingSubtitle}>Restrict access to certain features</Text>
            </View>
          </View>
          <Switch
            value={safeModeEnabled}
            onValueChange={setSafeModeEnabled}
            trackColor={{ false: '#FFE5F1', true: '#B8B5FF' }}
            thumbColor={safeModeEnabled ? '#9D8FFF' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Plus Exclusive Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✨ Plus Exclusive</Text>

        <TouchableOpacity 
          style={styles.exclusiveCard}
          onPress={handleParentalSettings}
        >
          <LinearGradient
            colors={['#FFB6D9', '#FF8DC7']}
            style={styles.exclusiveGradient}
          >
            <View style={styles.iconBubble}>
              <Ionicons name="lock-closed" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.exclusiveTitle}>Parental Controls</Text>
              <Text style={styles.exclusiveSubtitle}>Access detailed analytics & settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.exclusiveCard}
          onPress={handlePersonalizedVideos}
        >
          <LinearGradient
            colors={['#A8E6CF', '#7FD1AE']}
            style={styles.exclusiveGradient}
          >
            <View style={styles.iconBubble}>
              <Ionicons name="videocam" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.exclusiveTitle}>Personalized Videos</Text>
              <Text style={styles.exclusiveSubtitle}>Create custom intervention videos</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Password Modal */}
      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#FFE5F1', '#FFF0F8']}
              style={styles.modalGradient}
            >
              <View style={styles.modalIconBubble}>
                <Ionicons name="lock-closed" size={32} color="#FF69B4" />
              </View>
              <Text style={styles.modalTitle}>
                🔒 {modalType === 'parental' ? 'Parental Access' : 'Premium Access'}
              </Text>
              <Text style={styles.modalSubtitle}>
                Enter your password to continue
              </Text>
              
              <TextInput
                style={styles.passwordInput}
                secureTextEntry
                placeholder="Enter password"
                placeholderTextColor="#FFB6C1"
                value={password}
                onChangeText={setPassword}
                keyboardType="numeric"
                maxLength={4}
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setShowPasswordModal(false);
                    setPassword('');
                  }}
                >
                  <LinearGradient
                    colors={['#FFE5F1', '#FFD6E8']}
                    style={styles.modalButtonGradient}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={verifyPassword}
                >
                  <LinearGradient
                    colors={['#FFB6D9', '#FF8DC7']}
                    style={styles.modalButtonGradient}
                  >
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
      </Modal>

      <View style={{ height: 100 }} />
    </ScrollView>
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
  settingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBubble: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF0F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF1493',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#FF69B4',
    fontWeight: '600',
  },
  exclusiveCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  exclusiveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  exclusiveTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  exclusiveSubtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 105, 180, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalGradient: {
    padding: 30,
    alignItems: 'center',
  },
  modalIconBubble: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FF1493',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#FF69B4',
    fontWeight: '600',
    marginBottom: 25,
    textAlign: 'center',
  },
  passwordInput: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 18,
    color: '#FF1493',
    fontSize: 20,
    marginBottom: 25,
    textAlign: 'center',
    letterSpacing: 15,
    fontWeight: '800',
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },
  modalButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FF69B4',
    fontSize: 16,
    fontWeight: '800',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});