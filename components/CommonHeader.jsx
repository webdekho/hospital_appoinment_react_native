import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import ApiService from '../services/api';

export default function CommonHeader({ title = 'Home', showSearch = true, showNotification = false, showLogout = true }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await ApiService.getUserData();
        console.log('Loaded user data for header:', user);
        setUserData(user);
      } catch (error) {
        console.error('Error loading user data for header:', error);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await ApiService.clearAuthData();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error during logout:', error);
      router.replace('/auth/login');
    }
  };
  return (
    <LinearGradient
      colors={['#005666', '#00a0b4']}
      style={styles.header}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.userInfo}>
        <View style={styles.userAvatar}>
          <MaterialIcons name="account-circle" size={50} color="#FFFFFF" />
        </View>
        <View>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.userName}>
            {userData?.full_name || 'User'}
          </Text>
        </View>
      </View>
      <View style={styles.headerIcons}>
        {showSearch && (
          <Pressable style={styles.iconButton}>
            <MaterialIcons name="search" size={24} color="#005666" />
          </Pressable>
        )}
        {showNotification && (
          <Pressable style={styles.iconButton}>
            <MaterialIcons name="notifications-none" size={24} color="#005666" />
          </Pressable>
        )}
        {showLogout && (
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={20} color="#FFFFFF" />
          </Pressable>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 2,
    opacity: 0.9,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});