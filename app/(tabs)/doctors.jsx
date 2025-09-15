import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import CommonHeader from '../../components/CommonHeader';

export default function DoctorsScreen() {
  const [selectedFilter, setSelectedFilter] = useState('Neurologist');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filters = ['Neurologist', 'Neuromedicine', 'Medicine', 'Psychiatry'];
  
  const doctors = [
    {
      id: 1,
      name: 'Dr. Aaliya Y.',
      specialty: 'MDS, FDS RCPS',
      rating: 4.5,
      reviews: 2530,
      fees: '$50.99',
      image: require('../../assets/images/heart.png.png'), // Using available image as placeholder
    },
    {
      id: 2,
      name: 'Dr. Amira',
      specialty: 'BDS, Dentistry',
      rating: 4.5,
      reviews: 2530,
      fees: '$50.99',
      image: require('../../assets/images/kidney.png'), // Using available image as placeholder
    },
    {
      id: 3,
      name: 'Dr. Anna G.',
      specialty: 'Cardiologist',
      rating: 4.5,
      reviews: 2530,
      fees: '$50.99',
      image: require('../../assets/images/hosptial.png'), // Using available image as placeholder
    },
    {
      id: 4,
      name: 'Dr. Anne.',
      specialty: 'Hepatology',
      rating: 4.5,
      reviews: 2530,
      fees: '$50.99',
      image: require('../../assets/images/heart.png.png'), // Using available image as placeholder
    },
    {
      id: 5,
      name: 'Dr. Andrea H.',
      specialty: 'Neurosurgery',
      rating: 4.5,
      reviews: 2530,
      fees: '$50.99',
      image: require('../../assets/images/kidney.png'), // Using available image as placeholder
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Common Header */}
      <CommonHeader title="Doctors" showSearch={true} showNotification={false} />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, isSearchFocused && styles.searchBarFocused]}>
            <MaterialIcons name="search" size={20} color="#666666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search doctors by name or specialty..."
              placeholderTextColor="#999999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
              selectionColor="#005666"
              underlineColorAndroid="transparent"
            />
            {searchQuery.length > 0 && (
              <Pressable 
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons name="close" size={20} color="#666666" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Filter Pills */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScrollContainer}>
            {filters.map((filter, index) => (
              <Pressable
                key={index}
                style={[
                  styles.filterPill,
                  selectedFilter === filter && styles.filterPillSelected
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextSelected
                ]}>
                  {filter}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Doctors List */}
        <View style={styles.doctorsContainer}>
          {doctors.map((doctor) => (
            <View key={doctor.id} style={styles.doctorCard}>
              <View style={styles.doctorInfo}>
                <Image
                  source={doctor.image}
                  style={styles.doctorAvatar}
                  resizeMode="cover"
                />
                <View style={styles.doctorDetails}>
                  <Text style={styles.doctorName}>{doctor.name}</Text>
                  <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.starIcon}>⭐</Text>
                    <Text style={styles.ratingText}>{doctor.rating} ({doctor.reviews})</Text>
                  </View>
                </View>
              </View>
              <View style={styles.doctorActions}>
                <Pressable style={styles.bookButton}>
                  <Text style={styles.bookButtonText}>Book Appointment</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  searchBarFocused: {
    borderColor: '#005666',
    borderWidth: 2,
    elevation: 3,
    shadowOpacity: 0.15,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    paddingVertical: 0,
    minHeight: 24,
    outline: 'none',
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    textDecorationLine: 'none',
    outlineWidth: 0,
    outlineColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  filtersContainer: {
    paddingVertical: 16,
  },
  filtersScrollContainer: {
    paddingHorizontal: 0,
    gap: 12,
  },
  filterPill: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterPillSelected: {
    backgroundColor: '#005666',
    borderColor: '#005666',
  },
  filterText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  filterTextSelected: {
    color: '#FFFFFF',
  },
  doctorsContainer: {
    paddingBottom: 20,
  },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#666666',
  },
  doctorActions: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 80,
  },
  bookButton: {
    backgroundColor: '#005666',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  bookButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});