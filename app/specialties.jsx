import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ApiService from '../services/api';

const { width } = Dimensions.get('window');

export default function SpecialtiesScreen() {
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const staticSpecialties = [
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

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      const isAuthenticated = await ApiService.isAuthenticated();
      
      if (!isAuthenticated) {
        // If not authenticated, use static data
        console.log('Using static specializations - not authenticated');
        setSpecializations(staticSpecialties);
        return;
      }
      
      const response = await ApiService.getSpecializations(); // Get all specializations
      
      if (response.success && response.data.status) {
        console.log('API specializations data:', response.data.data);
        // Map API data to expected format
        const mappedSpecializations = response.data.data?.map((spec, index) => ({
          id: spec.id,
          name: spec.name || spec.specialization_name || spec.title,
          icon: staticSpecialties[index % staticSpecialties.length]?.icon || '🏥', // Use fallback icons
          color: staticSpecialties[index % staticSpecialties.length]?.color || '#FFB6C1'
        })) || [];
        setSpecializations(mappedSpecializations);
      } else {
        if (response.status === 401) {
          // Token expired or invalid, use static data
          console.log('Using static specializations due to 401 error');
          setSpecializations(staticSpecialties);
        } else {
          setSpecializations(staticSpecialties); // Fallback to static data
        }
      }
    } catch (error) {
      console.error('Error fetching specializations:', error);
      // Fallback to static data
      setSpecializations(staticSpecialties);
    } finally {
      setLoading(false);
    }
  };

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
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#005666" />
            <Text style={styles.loadingText}>Loading specializations...</Text>
          </View>
        ) : (
          <View style={styles.specialtiesGrid}>
            {specializations.map((specialty, index) => (
              <Pressable
                key={specialty.id || index}
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
        )}
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666666',
  },
});