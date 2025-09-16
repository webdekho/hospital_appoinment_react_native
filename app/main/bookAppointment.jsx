import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AppointmentPopup from '../../components/AppointmentPopup';

export default function BookAppointmentScreen() {
  // Generate dates for the next 30 days starting from today
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      
      dates.push({
        date: currentDate.getDate(),
        day: dayNames[currentDate.getDay()],
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        fullDate: currentDate,
      });
    }
    
    return dates;
  };

  const dates = generateDates();
  const [selectedDate, setSelectedDate] = useState(dates[0].date);
  const [selectedTime, setSelectedTime] = useState('Afternoon');
  const [selectedSlot, setSelectedSlot] = useState('09-10 AM');
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState('success');

  const timeSlots = ['Morning', 'Afternoon', 'Evening'];

  const afternoonSlots = ['09-10 AM', '10-11 AM', '11-12 AM', '12-01 PM'];

  // Get current month and year for display
  const getCurrentMonthYear = () => {
    const today = new Date();
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return `${monthNames[today.getMonth()]} ${today.getFullYear()}`;
  };

  const handleBookAppointment = () => {
    const selectedDateInfo = dates.find(d => d.date === selectedDate);
    console.log('Booking appointment for:', {
      date: selectedDateInfo,
      time: selectedTime,
      slot: selectedSlot
    });
    
    // Simulate booking process - randomly show success or failure
    const isSuccess = Math.random() > 0.3; // 70% success rate
    setPopupType(isSuccess ? 'success' : 'failure');
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#666" />
        </Pressable>
        <Text style={styles.headerTitle}>Doctor Profile</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Doctor Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={require('../../assets/images/doctor.png')}
            style={styles.doctorImage}
            resizeMode="cover"
          />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>Dr. Eion Morgan</Text>
            <Text style={styles.doctorCredentials}>MBBS, MD (Neurology)</Text>
            <Text style={styles.doctorExperience}>15+ years experience</Text>
          </View>
        </View>


        {/* Doctor Biography */}
        <View style={styles.biographySection}>
          <Text style={styles.sectionTitle}>Doctor Biography</Text>
          <Text style={styles.biographyText}>
            Eion Morgan is a dedicated pediatrician with over 15 years of experience in caring for children's health. She is passionate about ensuring the well-being of your little ones and believes in a holistic approach.
          </Text>
        </View>

        {/* Schedules Section */}
        <View style={styles.schedulesSection}>
          <View style={styles.schedulesHeader}>
            <Text style={styles.sectionTitle}>Schedules</Text>
            <View style={styles.monthSelector}>
              <Text style={styles.monthText}>{getCurrentMonthYear()}</Text>
              <MaterialIcons name="keyboard-arrow-down" size={20} color="#666" />
            </View>
          </View>

          {/* Date Selection */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.datesContainer}
            contentContainerStyle={styles.datesContent}
          >
            {dates.map((item) => (
              <Pressable
                key={item.date}
                style={[
                  styles.dateItem,
                  selectedDate === item.date && styles.selectedDateItem
                ]}
                onPress={() => setSelectedDate(item.date)}
              >
                <Text style={[
                  styles.dateNumber,
                  selectedDate === item.date && styles.selectedDateText
                ]}>
                  {item.date}
                </Text>
                <Text style={[
                  styles.dayText,
                  selectedDate === item.date && styles.selectedDateText
                ]}>
                  {item.day}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Choose Times */}
        <View style={styles.timesSection}>
          <Text style={styles.sectionTitle}>Choose Times</Text>
          
          {/* Time Period Selection */}
          <View style={styles.timePeriodsContainer}>
            {timeSlots.map((time) => (
              <Pressable
                key={time}
                style={[
                  styles.timePeriodButton,
                  selectedTime === time && styles.selectedTimePeriod
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[
                  styles.timePeriodText,
                  selectedTime === time && styles.selectedTimePeriodText
                ]}>
                  {time}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Time Slots */}
          <Text style={styles.scheduleTitle}>Afternoon Schedule</Text>
          <View style={styles.timeSlotsContainer}>
            {afternoonSlots.map((slot) => (
              <Pressable
                key={slot}
                style={[
                  styles.timeSlotButton,
                  selectedSlot === slot && styles.selectedTimeSlot
                ]}
                onPress={() => setSelectedSlot(slot)}
              >
                <Text style={[
                  styles.timeSlotText,
                  selectedSlot === slot && styles.selectedTimeSlotText
                ]}>
                  {slot}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Book Appointment Button */}
        <Pressable style={styles.bookButton} onPress={handleBookAppointment}>
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </Pressable>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Appointment Popup */}
      <AppointmentPopup
        visible={showPopup}
        type={popupType}
        onClose={handleClosePopup}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  doctorImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#005666',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  doctorCredentials: {
    fontSize: 15,
    color: '#666666',
    marginBottom: 4,
  },
  doctorExperience: {
    fontSize: 15,
    color: '#005666',
    fontWeight: '500',
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    color: '#999',
    marginLeft: 6,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  specialtyTag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  activeSpecialty: {
    backgroundColor: '#E8F5E8',
  },
  specialtyText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  activeSpecialtyText: {
    color: '#4CAF50',
  },
  biographySection: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  biographyText: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 24,
  },
  schedulesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  schedulesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  datesContainer: {
    marginBottom: 20,
    paddingLeft: 0,
  },
  datesContent: {
    gap: 12,
    paddingLeft: 0,
    paddingRight: 20,
  },
  dateItem: {
    width: 50,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDateItem: {
    backgroundColor: '#005666',
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  dayText: {
    fontSize: 12,
    color: '#666',
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
  timesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  timePeriodsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
  },
  timePeriodButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  selectedTimePeriod: {
    backgroundColor: '#005666',
  },
  timePeriodText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedTimePeriodText: {
    color: '#FFFFFF',
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlotButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  selectedTimeSlot: {
    backgroundColor: '#005666',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedTimeSlotText: {
    color: '#FFFFFF',
  },
  bookButton: {
    backgroundColor: '#005666',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bottomSpacing: {
    height: 20,
  },
});