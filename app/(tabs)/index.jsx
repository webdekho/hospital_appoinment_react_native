import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import CommonHeader from '../../components/CommonHeader';


export default function HomeScreen() {
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

  const doctors = [
    {
      id: 1,
      name: 'Chloe Kelly',
      specialty: 'M.Ch (Neuro)',
      rating: 4.5,
      reviews: 2530,
      fees: '$50.99',
      image: require('../../assets/images/heart.png.png'), // Using available image as placeholder
    },
    {
      id: 2,
      name: 'Lauren Hemp',
      specialty: 'Spinal Surgery',
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
            {specialties.map((specialty, index) => (
              <Pressable key={index} style={styles.specialtyCard}>
                <View style={styles.specialtyIcon}>
                  <Text style={styles.specialtyEmoji}>{specialty.icon}</Text>
                </View>
                <Text style={styles.specialtyName}>{specialty.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Popular Doctors section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Doctors</Text>
            <Pressable>
              <Text style={styles.seeAllText}>See All {'>'}</Text>
            </Pressable>
          </View>

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
                  <Pressable 
                    style={styles.bookButton}
                    onPress={() => router.push('/main/bookAppointment')}
                  >
                    <Text style={styles.bookButtonText}>Book Appointment</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
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
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  specialtyEmoji: {
    fontSize: 28,
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
});