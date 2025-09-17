import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import CommonHeader from '../../components/CommonHeader';
import ApiService from '../../services/api';
import { getDoctorImageUrl } from '../../utils/imageUtils';


export default function HomeScreen() {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specializationsLoading, setSpecializationsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const [error, setError] = useState(null);

  const specialties = [
    { name: 'Neurology', icon: '🧠', color: '#FFB6C1' },
    { name: 'Cardiology', icon: '❤️', color: '#FF6B6B' },
    { name: 'Orthopedics', icon: '🦴', color: '#FFD93D' },
    { name: 'Pathology', icon: '🏥', color: '#FFA07A' },
    { name: 'Dermatology', icon: '🔬', color: '#98FB98' },
    { name: 'Pediatrics', icon: '👶', color: '#DDA0DD' },
    { name: 'Gynecology', icon: '💊', color: '#F0E68C' },
    { name: 'Psychiatry', icon: '🧘', color: '#87CEEB' },
  ];

  useEffect(() => {
    fetchDoctors();
    fetchSpecializations();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      const isAuthenticated = await ApiService.isAuthenticated();
      
      if (!isAuthenticated) {
        // If not authenticated, use static data
        setDoctors([
          {
            id: 1,
            full_name: 'Dr. Chloe Kelly',
            specialization: 'M.Ch (Neuro)',
            experience_years: 5,
            consultation_fee: 50.99,
            image_url: null,
          },
          {
            id: 2,
            full_name: 'Dr. Lauren Hemp',
            specialization: 'Spinal Surgery',
            experience_years: 8,
            consultation_fee: 50.99,
            image_url: null,
          },
          {
            id: 3,
            full_name: 'Dr. Eion Morgan',
            specialization: 'MBBS, MD (Neurology)',
            experience_years: 15,
            consultation_fee: 75.99,
            image_url: null,
          },
        ]);
        setError(null);
        return;
      }
      
      const response = await ApiService.getDoctors(3); // Get first 3 doctors
      
      if (response.success && response.data.status) {
        setDoctors(response.data.data || []);
        setError(null);
      } else {
        if (response.status === 401) {
          // Token expired or invalid, use static data
          setDoctors([
            {
              id: 1,
              full_name: 'Dr. Chloe Kelly',
              specialization: 'M.Ch (Neuro)',
              experience_years: 5,
              consultation_fee: 50.99,
              image_url: null,
            },
            {
              id: 2,
              full_name: 'Dr. Lauren Hemp',
              specialization: 'Spinal Surgery',
              experience_years: 8,
              consultation_fee: 50.99,
              image_url: null,
            },
            {
              id: 3,
              full_name: 'Dr. Eion Morgan',
              specialization: 'MBBS, MD (Neurology)',
              experience_years: 15,
              consultation_fee: 75.99,
              image_url: null,
            },
          ]);
          setError(null);
        } else {
          setError(response.data.message || 'Failed to fetch doctors');
        }
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError(null); // Don't show error, just use fallback data
      // Fallback to static data
      setDoctors([
        {
          id: 1,
          full_name: 'Dr. Chloe Kelly',
          specialization: 'M.Ch (Neuro)',
          experience_years: 5,
          consultation_fee: 50.99,
          image_url: null,
        },
        {
          id: 2,
          full_name: 'Dr. Lauren Hemp',
          specialization: 'Spinal Surgery',
          experience_years: 8,
          consultation_fee: 50.99,
          image_url: null,
        },
        {
          id: 3,
          full_name: 'Dr. Eion Morgan',
          specialization: 'MBBS, MD (Neurology)',
          experience_years: 15,
          consultation_fee: 75.99,
          image_url: null,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecializations = async () => {
    try {
      setSpecializationsLoading(true);
      
      // Check if user is authenticated
      const isAuthenticated = await ApiService.isAuthenticated();
      
      if (!isAuthenticated) {
        // If not authenticated, use static data
        setSpecializations(specialties);
        return;
      }
      
      const response = await ApiService.getSpecializations(8); // Get first 8 specializations
      
      if (response.success && response.data.status) {
        // Map API data to expected format
        const mappedSpecializations = response.data.data?.map((spec, index) => {
          // Build photo URL from API response
          let photoUrl = null;
          if (spec.photo) {
            // Replace {base_url} placeholder with actual base URL from ApiService
            // photoUrl = spec.photo.replace('{base_url}', ApiService.getBaseUrl());

            photoUrl = ApiService.getBaseUrl() +"/"+ spec.photo;
          }
          
          return {
            id: spec.specialization_id || spec.id,
            name: spec.name || spec.specialization_name || spec.title,
            photo: photoUrl,
            icon: specialties[index % specialties.length]?.icon || '🏥', // Use fallback icons
            color: specialties[index % specialties.length]?.color || '#FFB6C1'
          };
        }) || [];
        setSpecializations(mappedSpecializations);
      } else {
        if (response.status === 401) {
          // Token expired or invalid, use static data
          // Using static specializations due to 401 error
          setSpecializations(specialties);
        } else {
          // API error, using static specializations
          setSpecializations(specialties); // Fallback to static data
        }
      }
    } catch (error) {
      console.error('Error fetching specializations:', error);
      // Fallback to static data
      setSpecializations(specialties);
    } finally {
      setSpecializationsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Common Header */}
      <CommonHeader title="Home" showSearch={true} showNotification={false} />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['#005666', '#00a0b4']}
            style={styles.heroCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Looking for{'\n'}desired doctor?</Text>
              <Pressable style={styles.searchButton}>
                <Text style={styles.searchButtonText}>Search for</Text>
              </Pressable>
            </View>
            <Image
              source={require('../../assets/images/doctor.png')}
              style={styles.doctorImage}
              resizeMode="contain"
            />
          </LinearGradient>
        </View>

        {/* Find your doctor section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Find your doctor</Text>
            <Pressable onPress={() => router.push('/specialties')}>
              <Text style={styles.seeAllText}>See All {'>'}</Text>
            </Pressable>
          </View>

          <ScrollView 
            horizontal={true} 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.specialtiesScrollContainer}
          >
            {(specializationsLoading ? specialties : specializations).map((specialty, index) => (
              <Pressable 
                key={specialty.id || index} 
                style={styles.specialtyCard}
                onPress={() => {
                  router.push({
                    pathname: '/(tabs)/doctors',
                    params: { 
                      specialtyId: specialty.id,
                      specialtyName: specialty.name 
                    }
                  });
                }}
              >
                <View style={styles.specialtyIcon}>
                  {specialty.photo && !imageErrors[specialty.id] ? (
                    <Image 
                      source={{ uri: specialty.photo }}
                      style={styles.specialtyImage}
                      onError={() => {
                        if (!imageErrors[specialty.id]) {
                          setImageErrors(prev => ({ ...prev, [specialty.id]: true }));
                        }
                      }}
                    />
                  ) : (
                    <Text style={styles.specialtyEmoji}>{specialty.icon}</Text>
                  )}
                </View>
                <Text style={styles.specialtyName}>{specialty.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Popular Doctors section */}
        <View style={[styles.section, { marginTop: -10 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Doctors</Text>
            <Pressable>
              <Text style={styles.seeAllText}>See All {'>'}</Text>
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#005666" />
              <Text style={styles.loadingText}>Loading doctors...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable style={styles.retryButton} onPress={fetchDoctors}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.doctorsContainer}>
              {doctors.map((doctor, index) => {
                const derivedId = doctor.id || doctor.doctor_id;
                const rawPhoto = doctor.photo || doctor.image_url || doctor.image || doctor.profile_image;
                let constructedUrl = null;
                if (rawPhoto && rawPhoto.trim() !== "") {
                  const clean = rawPhoto.replace(/^\/+/, '');
                  constructedUrl = clean.startsWith('http') ? clean : `${ApiService.getBaseUrl()}/${clean}`;
                }
                console.log(`Doctor ${derivedId} photo check:`, {
                  rawPhoto,
                  imageError: imageErrors[derivedId],
                  constructedUrl,
                });
                
                return (
                <View key={derivedId} style={styles.doctorCard}>
                  <View style={styles.doctorInfo}>
                    <View style={styles.doctorAvatarContainer}>
                      {constructedUrl && !imageErrors[derivedId] ? (
                        <Image
                          source={{ uri: constructedUrl }}
                          style={styles.doctorAvatar}
                          onError={() => {
                            if (!imageErrors[derivedId]) {
                              setImageErrors(prev => ({ ...prev, [derivedId]: true }));
                            }
                          }}
                        />
                      ) : (
                        <MaterialIcons name="person" size={32} color="#666666" />
                      )}
                    </View>
                    <View style={styles.doctorDetails}>
                      <Text style={styles.doctorName} numberOfLines={1} ellipsizeMode="tail">
                        {doctor.full_name || 
                         doctor.name || 
                         `${doctor.first_name || ''} ${doctor.last_name || ''}`.trim() ||
                         'Doctor Name'}
                      </Text>
                      <Text style={styles.doctorSpecialty}>
                        {doctor.specialization_name || doctor.specialization || doctor.specialty}
                      </Text>
                      {doctor.qualification && (
                        <Text style={styles.doctorQualification}>{doctor.qualification}</Text>
                      )}
                      {doctor.experience_years && (
                        <Text style={styles.doctorExperience}>
                          {doctor.experience_years} years experience
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.doctorActions}>
                    <Pressable 
                      style={styles.bookButton}
                      onPress={() => {
                        const doctorId = doctor.id || doctor.doctor_id || (index + 1);
                        
                        if (doctorId) {
                          const navUrl = `/main/bookAppointment?doctorId=${doctorId}`;
                          router.push(navUrl);
                        } else {
                          router.push('/main/bookAppointment');
                        }
                      }}
                    >
                      <Text style={styles.bookButtonText}>Appointment</Text>
                    </Pressable>
                  </View>
                </View>
              );
              })}
            </View>
          )}
        </View>

        {/* Who We Are section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Who We Are</Text>
          </View>
          
          <View style={styles.whoWeAreCard}>
            <Text style={styles.whoWeAreText}>
              Facilities at Aayush Hospital in Kalyan Are designed considering the patients comfort. Rooms include sooting colors with adequate use of natural light to keep the patient cozy. The Twin-sharing and special rooms are equipped with flat-screen televisions and a sperate Air Conditioner . The Feel -At Home comfort adds to the doctor effort and promiess a quick recovery.
            </Text>
          </View>
        </View>

        {/* Statistics Section */}
        <View style={styles.statisticsSection}>
          <LinearGradient
            colors={['#005666', '#00a0b4']}
            style={styles.statisticsCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.statisticsGrid}>
              <View style={styles.statisticItem}>
                <MaterialIcons name="person" size={32} color="#FFFFFF" />
                <Text style={styles.statisticNumber}>50+</Text>
                <Text style={styles.statisticLabel}>DEDICATED DOCTORS</Text>
              </View>
              
              <View style={styles.statisticItem}>
                <MaterialIcons name="local-hospital" size={32} color="#FFFFFF" />
                <Text style={styles.statisticNumber}>75+</Text>
                <Text style={styles.statisticLabel}>BEDDED HOSPITAL</Text>
              </View>
              
              <View style={styles.statisticItem}>
                <MaterialIcons name="hotel" size={32} color="#FFFFFF" />
                <Text style={styles.statisticNumber}>15</Text>
                <Text style={styles.statisticLabel}>BEDDED ICU</Text>
              </View>
              
              <View style={styles.statisticItem}>
                <MaterialIcons name="people" size={32} color="#FFFFFF" />
                <Text style={styles.statisticNumber}>10000+</Text>
                <Text style={styles.statisticLabel}>HAPPY PATIENTS</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Our Facilities section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Our Facilities</Text>
          </View>
          
          <View style={styles.facilitiesContainer}>
            <View style={styles.facilityCard}>
              <View style={styles.facilityIcon}>
                <MaterialIcons name="hotel" size={24} color="#005666" />
              </View>
              <View style={styles.facilityContent}>
                <Text style={styles.facilityTitle}>75+ Beds</Text>
                <Text style={styles.facilityDescription}>Including 15-bed ICU</Text>
              </View>
            </View>

            <View style={styles.facilityCard}>
              <View style={styles.facilityIcon}>
                <MaterialIcons name="healing" size={24} color="#005666" />
              </View>
              <View style={styles.facilityContent}>
                <Text style={styles.facilityTitle}>Operation Theaters</Text>
                <Text style={styles.facilityDescription}>Supra Major, Major, and Minor OTs</Text>
              </View>
            </View>

            <View style={styles.facilityCard}>
              <View style={styles.facilityIcon}>
                <MaterialIcons name="bed" size={24} color="#005666" />
              </View>
              <View style={styles.facilityContent}>
                <Text style={styles.facilityTitle}>Patient Rooms</Text>
                <Text style={styles.facilityDescription}>Twin-sharing and special rooms with modern amenities</Text>
              </View>
            </View>
          </View>
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
  heroSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  heroCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 140,
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 28,
  },
  searchButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  searchButtonText: {
    fontSize: 14,
    color: '#005666',
    fontWeight: '600',
  },
  doctorImage: {
    width: 120,
    height: 120,
    marginLeft: 10,
    marginBottom: -20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  seeAllText: {
    fontSize: 14,
    color: '#005666',
    fontWeight: '600',
  },
  specialtiesScrollContainer: {
    paddingHorizontal: 0,
    gap: 20,
  },
  specialtyCard: {
    alignItems: 'center',
    width: 80,
  },
  specialtyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  specialtyEmoji: {
    fontSize: 28,
  },
  specialtyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    resizeMode: 'cover',
  },
  iconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  specialtyName: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '500',
  },
  doctorsContainer: {
    gap: 8,
  },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 4,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  doctorAvatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  doctorAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    resizeMode: 'cover',
  },
  doctorIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  doctorDetails: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
    flexShrink: 1,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  doctorQualification: {
    fontSize: 12,
    color: '#005666',
    fontWeight: '500',
    marginBottom: 2,
  },
  doctorExperience: {
    fontSize: 11,
    color: '#888888',
    fontStyle: 'italic',
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
  },
  bookButton: {
    backgroundColor: '#005666',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  whoWeAreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  whoWeAreText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
    textAlign: 'justify',
  },
  statisticsSection: {
    marginBottom: 30,
  },
  statisticsCard: {
    borderRadius: 16,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statisticsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statisticItem: {
    alignItems: 'center',
    width: '23%',
    marginBottom: 8,
  },
  statisticNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 6,
    marginBottom: 3,
  },
  statisticLabel: {
    fontSize: 8,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 10,
  },
  facilitiesContainer: {
    gap: 16,
  },
  facilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  facilityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  facilityContent: {
    flex: 1,
  },
  facilityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  facilityDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666666',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    marginHorizontal: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#E53E3E',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#005666',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});