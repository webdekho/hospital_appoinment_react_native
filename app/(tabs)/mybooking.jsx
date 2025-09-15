import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import CommonHeader from '../../components/CommonHeader';

export default function MyBookingScreen() {
  
  const todayAppointments = [
    {
      id: 1,
      name: 'Dr. Andrea H.',
      qualification: 'MD, DNB (Endo)',
      time: '09:00 - 10:00 AM',
      status: 'Scheduled',
      image: require('../../assets/images/heart.png.png'),
    },
    {
      id: 2,
      name: 'Dr. Amira Yuasha',
      qualification: 'Diploma (Cardiac EP)',
      time: '09:00 - 10:00 AM',
      status: 'Scheduled',
      image: require('../../assets/images/kidney.png'),
    },
    {
      id: 3,
      name: 'Dr. Eion Morgan',
      qualification: 'MDS, FDS RCPS',
      time: '09:00 - 10:00 AM',
      status: 'Scheduled',
      image: require('../../assets/images/hosptial.png'),
    },
  ];

  const tomorrowAppointments = [
    {
      id: 4,
      name: 'Dr. Jerry Jones',
      qualification: 'MBBS, MD (Neurology)',
      time: '09:00 - 10:00 AM',
      status: 'Scheduled',
      image: require('../../assets/images/kidney.png'),
    },
    {
      id: 5,
      name: 'Dr. Eion Morgan',
      qualification: 'MD, MNA',
      time: '09:00 - 10:00 AM',
      status: 'Scheduled',
      image: require('../../assets/images/heart.png.png'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Common Header */}
      <CommonHeader title="My Booking" showSearch={true} showNotification={false} />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* Today Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today</Text>
            <Text style={styles.sectionDate}>02 Oct, 2023</Text>
          </View>
          
          <View style={styles.appointmentsContainer}>
            {todayAppointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentInfo}>
                  <Image
                    source={appointment.image}
                    style={styles.doctorAvatar}
                    resizeMode="cover"
                  />
                  <View style={styles.appointmentDetails}>
                    <Text style={styles.doctorName}>{appointment.name}</Text>
                    <Text style={styles.doctorQualification}>{appointment.qualification}</Text>
                    <View style={styles.scheduleContainer}>
                      <Text style={styles.statusText}>{appointment.status}</Text>
                      <Text style={styles.statusDot}> • </Text>
                      <Text style={styles.timeText}>{appointment.time}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Tomorrow Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tomorrow</Text>
            <Text style={styles.sectionDate}>01 Oct, 2023</Text>
          </View>
          
          <View style={styles.appointmentsContainer}>
            {tomorrowAppointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentInfo}>
                  <Image
                    source={appointment.image}
                    style={styles.doctorAvatar}
                    resizeMode="cover"
                  />
                  <View style={styles.appointmentDetails}>
                    <Text style={styles.doctorName}>{appointment.name}</Text>
                    <Text style={styles.doctorQualification}>{appointment.qualification}</Text>
                    <View style={styles.scheduleContainer}>
                      <Text style={styles.statusText}>{appointment.status}</Text>
                      <Text style={styles.statusDot}> • </Text>
                      <Text style={styles.timeText}>{appointment.time}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
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
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
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
  sectionDate: {
    fontSize: 14,
    color: '#005666',
    fontWeight: '500',
  },
  appointmentsContainer: {
    gap: 12,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  appointmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  appointmentDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  doctorQualification: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  scheduleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    color: '#005666',
    fontWeight: '500',
  },
  statusDot: {
    fontSize: 12,
    color: '#666666',
  },
  timeText: {
    fontSize: 12,
    color: '#666666',
  },
});