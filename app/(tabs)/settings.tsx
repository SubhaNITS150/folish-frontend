
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
import * as LocalAuthentication from 'expo-local-authentication';

export default function SettingsScreen() {
  const router = useRouter();
  const [screenTimeEnabled, setScreenTimeEnabled] = useState(true);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [safeModeEnabled, setSafeModeEnabled] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const PARENTAL_PASSWORD = '1234'; 
  const handleParentalSettings = async () => {
   
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (hasHardware && isEnrolled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access Parental Settings',
        fallbackLabel: 'Use Password',
      });

      if (result.success) {
        router.push('./profile/parental-settings');
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
      router.push('./profile/parental-settings');
    } else {
      Alert.alert('Error', 'Incorrect password');
      setPassword('');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Parental Additions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parental Additions</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="time-outline" size={24} color="#6C63FF" />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Screen Time</Text>
              <Text style={styles.settingSubtitle}>Set daily limits for app usage</Text>
            </View>
          </View>
          <Switch
            value={screenTimeEnabled}
            onValueChange={setScreenTimeEnabled}
            trackColor={{ false: '#767577', true: '#6C63FF' }}
            thumbColor={screenTimeEnabled ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="calendar-outline" size={24} color="#6C63FF" />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Schedule</Text>
              <Text style={styles.settingSubtitle}>Set specific times for app access</Text>
            </View>
          </View>
          <Switch
            value={scheduleEnabled}
            onValueChange={setScheduleEnabled}
            trackColor={{ false: '#767577', true: '#6C63FF' }}
            thumbColor={scheduleEnabled ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications-outline" size={24} color="#FFD700" />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Notification Settings</Text>
              <Text style={styles.settingSubtitle}>Receive alerts and important updates</Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#767577', true: '#6C63FF' }}
            thumbColor={notificationsEnabled ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Safe Mode Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safe Mode</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#4CAF50" />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Enable Safe Mode</Text>
              <Text style={styles.settingSubtitle}>Restrict access to certain features or content</Text>
            </View>
          </View>
          <Switch
            value={safeModeEnabled}
            onValueChange={setSafeModeEnabled}
            trackColor={{ false: '#767577', true: '#6C63FF' }}
            thumbColor={safeModeEnabled ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Plus Exclusive Call Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Plus Exclusive Call</Text>

        <TouchableOpacity 
          style={styles.exclusiveCallItem}
          onPress={handleParentalSettings}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="lock-closed" size={24} color="#FF6B6B" />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Activate Exclusive Call</Text>
              <Text style={styles.settingSubtitle}>Avoid 1-1 conversations and call for personal needs</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
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
            <Text style={styles.modalTitle}>Enter Parental Password</Text>
            <TextInput
              style={styles.passwordInput}
              secureTextEntry
              placeholder="Enter password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              keyboardType="numeric"
              maxLength={4}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowPasswordModal(false);
                  setPassword('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={verifyPassword}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#16213E',
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
  },
  exclusiveCallItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#16213E',
    padding: 18,
    borderRadius: 15,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#16213E',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  passwordInput: {
    width: '100%',
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 15,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#1A1A2E',
  },
  confirmButton: {
    backgroundColor: '#6C63FF',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});