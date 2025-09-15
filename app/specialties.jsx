import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function SpecialtiesScreen() {
  const specialties = [
    { name: 'Nephrology', icon: '🫘', color: '#FFE4E6' },
    { name: 'Anesthesiology', icon: '👨‍⚕️', color: '#E0F2FE' },
    { name: 'Orthopedics', icon: '🦴', color: '#FEF3C7' },
    { name: 'Ophthalmology', icon: '👁️', color: '#FEE2E2' },
    { name: 'Pediatrics', icon: '👶', color: '#F3E8FF' },
    { name: 'Oncology', icon: '🩺', color: '#FECACA' },
    { name: 'Dermatology', icon: '🔬', color: '#E0F2FE' },
    { name: 'Pathology', icon: '🏥', color: '#FEF3C7' },
    { name: 'Psychiatry', icon: '🧠', color: '#F0F9FF' },
    { name: 'General surgery', icon: '⚕️', color: '#FEE2E2' },
    { name: 'Endocrinology', icon: '🫀', color: '#FECACA' },
    { name: 'Radiology', icon: '📋', color: '#E0F2FE' },
    { name: 'Surgery', icon: '🔴', color: '#FEF3C7' },
    { name: 'Cardiology', icon: '❤️', color: '#FECACA' },
    { name: 'Geriatrics', icon: '👴', color: '#F3E8FF' },
  ];

  const handleBackPress = () => {
    router.back();
  };

  const handleSpecialtyPress = (specialty) => {
    console.log('Selected specialty:', specialty.name);
    // Navigate to doctors list for this specialty
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBackPress}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#666666" />
        </Pressable>
        <Text style={styles.headerTitle}>Find Your Doctor</Text>
        <Pressable style={styles.searchButton}>
          <MaterialIcons name="search" size={24} color="#666666" />
        </Pressable>
      </View>

      {/* Specialties Grid */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.specialtiesGrid}>
          {specialties.map((specialty, index) => (
            <Pressable
              key={index}
              style={styles.specialtyCard}
              onPress={() => handleSpecialtyPress(specialty)}
            >
              <View style={[styles.specialtyIconContainer, { backgroundColor: specialty.color }]}>
                <Text style={styles.specialtyIcon}>{specialty.icon}</Text>
              </View>
              <Text style={styles.specialtyName}>{specialty.name}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  specialtiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  specialtyCard: {
    width: (width - 60) / 3, // 3 columns with 20px padding on sides and gaps
    alignItems: 'center',
    marginBottom: 24,
  },
  specialtyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  specialtyIcon: {
    fontSize: 32,
  },
  specialtyName: {
    fontSize: 14,
    color: '#1a1a1a',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 18,
  },
});