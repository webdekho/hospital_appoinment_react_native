import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import AppointmentPopup from '../../components/AppointmentPopup';
import EnhancedHtmlRenderer from '../../components/EnhancedHtmlRenderer';
import ApiService from '../../services/api';
// Removed getDoctorImageUrl; constructing robust URL inline to avoid duplicate uploads path

export default function BookAppointmentScreen() {
  const { doctorId } = useLocalSearchParams();
  console.log('BookAppointment - Received doctorId:', doctorId);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState([]);
  const [slotsByShift, setSlotsByShift] = useState(null);
  const [selectedShiftTab, setSelectedShiftTab] = useState(null);
  const [isHoliday, setIsHoliday] = useState(false);
  const [holidayInfo, setHolidayInfo] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [notes, setNotes] = useState('');

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

  const formatDateLocal = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const formatTime12 = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    let hour = parseInt(h, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;
    return `${hour.toString().padStart(2, '0')}:${m} ${period}`;
  };

  useEffect(() => {
    if (doctorId && doctorId !== 'undefined' && doctorId !== undefined) {
      fetchDoctorDetails();
    } else {
      // Use default doctor data if no doctorId provided
      setDoctor({
        id: 1,
        full_name: 'Dr. Eion Morgan',
        specialization: 'MBBS, MD (Neurology)',
        experience_years: 15,
        bio: 'Eion Morgan is a dedicated pediatrician with over 15 years of experience in caring for children\'s health. She is passionate about ensuring the well-being of your little ones and believes in a holistic approach.',
        image_url: null,
      });
      setLoading(false);
    }
  }, [doctorId]);

  // Fetch slots whenever doctor or date changes
  useEffect(() => {
    const loadSlots = async () => {
      try {
        const resolvedDoctorId = doctor?.id || doctor?.user_id || doctor?.doctor_id;
        if (!resolvedDoctorId) return;
        const selected = dates.find(d => d.date === selectedDate)?.fullDate;
        const dateStr = selected ? formatDateLocal(selected) : null;
        if (!dateStr) return;
        // clear previous state while loading
        setSlotsByShift(null);
        setIsHoliday(false);
        setHolidayInfo(null);
        const res = await ApiService.getDoctorSlotsByDate(resolvedDoctorId, dateStr);
        if (res.success && res.data.status) {
          const payload = res.data.data || {};
          const groups = Array.isArray(payload.data) ? payload.data : [];
          setIsHoliday(!!payload.is_holiday);
          setHolidayInfo(payload.holiday_info || null);
          setSlotsByShift(groups);
          // Auto-select first available shift tab
          if (groups.length > 0) {
            setSelectedShiftTab(groups[0].shift_type || 'shift');
          } else {
            setSelectedShiftTab(null);
          }
        } else {
          setIsHoliday(false);
          setHolidayInfo(null);
          setSlotsByShift(null);
          setSelectedShiftTab(null);
        }
      } catch (e) {
        setIsHoliday(false);
        setHolidayInfo(null);
        setSlotsByShift(null);
        setSelectedShiftTab(null);
      }
    };
    loadSlots();
  }, [doctor?.id, doctor?.user_id, doctor?.doctor_id, selectedDate]);

  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      
      // Validate doctorId before making API call
      if (!doctorId || doctorId === 'undefined' || doctorId === undefined) {
        console.log('No valid doctorId provided, using default data');
        setDoctor({
          id: 1,
          full_name: 'Dr. Eion Morgan',
          specialization: 'MBBS, MD (Neurology)',
          experience_years: 15,
          bio: 'Eion Morgan is a dedicated pediatrician with over 15 years of experience in caring for children\'s health. She is passionate about ensuring the well-being of your little ones and believes in a holistic approach.',
          image_url: null,
        });
        setLoading(false);
        return;
      }

      const isAuthenticated = await ApiService.isAuthenticated();
      
      if (!isAuthenticated) {
        // Use default data if not authenticated
        setDoctor({
          id: doctorId || 1,
          full_name: 'Dr. Eion Morgan',
          specialization: 'MBBS, MD (Neurology)',
          experience_years: 15,
          bio: 'Eion Morgan is a dedicated pediatrician with over 15 years of experience in caring for children\'s health. She is passionate about ensuring the well-being of your little ones and believes in a holistic approach.',
          image_url: null,
        });
        setLoading(false);
        return;
      }

      console.log('Fetching doctor details for ID:', doctorId);
      const response = await ApiService.getDoctorById(doctorId);
      
      if (response.success && response.data.status) {
        console.log('Doctor details from API:', response.data.data);
        console.log('Doctor bio/description:', {
          profile_description: response.data.data.profile_description,
          bio: response.data.data.bio,
          description: response.data.data.description
        });
        console.log('Doctor image fields:', {
          image_url: response.data.data.image_url,
          image: response.data.data.image,
          photo: response.data.data.photo,
          profile_image: response.data.data.profile_image
        });
        setDoctor(response.data.data);
      } else {
        // Fallback to default data
        setDoctor({
          id: doctorId || 1,
          full_name: 'Dr. Eion Morgan',
          specialization: 'MBBS, MD (Neurology)',
          experience_years: 15,
          bio: 'Eion Morgan is a dedicated pediatrician with over 15 years of experience in caring for children\'s health. She is passionate about ensuring the well-being of your little ones and believes in a holistic approach.',
          image_url: null,
        });
      }
    } catch (error) {
      console.error('Error fetching doctor details:', error);
      // Fallback to default data
      setDoctor({
        id: doctorId || 1,
        full_name: 'Dr. Eion Morgan',
        specialization: 'MBBS, MD (Neurology)',
        experience_years: 15,
        bio: 'Eion Morgan is a dedicated pediatrician with over 15 years of experience in caring for children\'s health. She is passionate about ensuring the well-being of your little ones and believes in a holistic approach.',
        image_url: null,
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleBookAppointment = async () => {
    if (!doctor) return;
    try {
      setBookingLoading(true);
      const isAuthenticated = await ApiService.isAuthenticated();
      if (!isAuthenticated) {
        setTimeout(() => {
          setPopupType('success');
          setShowPopup(true);
          setBookingLoading(false);
        }, 800);
        return;
      }

      // Build payload for create availability slots from current selections
      const selectedDateInfo = dates.find(d => d.date === selectedDate);
      const weekdayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const dayOfWeek = weekdayNames[selectedDateInfo.fullDate.getDay()];
      const parseSlot = (slotStr) => {
        const match = slotStr.match(/(\d{2})-(\d{2})\s*(AM|PM)/i);
        if (!match) return { start: '09:00:00', end: '10:00:00' };
        let [_, startH, endH, period] = match;
        const to24 = (h, p) => {
          let hour = parseInt(h, 10);
          if (p.toUpperCase() === 'AM') {
            if (hour === 12) hour = 0;
          } else {
            if (hour !== 12) hour += 12;
          }
          return `${hour.toString().padStart(2, '0')}:00:00`;
        };
        const start = to24(startH, period);
        const end = to24(endH, period);
        return { start, end };
      };
      const { start, end } = parseSlot(selectedSlot);
      const payload = {
        doctor_id: doctor.id,
        day_of_week: dayOfWeek,
        shift_type: (selectedTime || 'Afternoon').toLowerCase(),
        start_time: start,
        end_time: end,
        slot_duration: 60,
        slots: [ { start_time: start, end_time: end } ]
      };

      const response = await ApiService.createAvailabilitySlots(payload);
      if (response.success && response.data.status) {
        setPopupType('success');
      } else {
        setPopupType('failure');
      }
    } catch (error) {
      console.error('Error creating availability slots:', error);
      setPopupType('failure');
    } finally {
      setBookingLoading(false);
      setShowPopup(true);
    }
  };

  const handleCreateSlots = async () => {
    if (!doctor) return;
    try {
      setBookingLoading(true);
      const isAuthenticated = await ApiService.isAuthenticated();
      if (!isAuthenticated) {
        console.log('User not authenticated, cannot create availability slots');
        setBookingLoading(false);
        return;
      }

      // Map selected date to weekday name
      const selectedDateInfo = dates.find(d => d.date === selectedDate);
      const weekdayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const dayOfWeek = weekdayNames[selectedDateInfo.fullDate.getDay()];

      // Parse selected slot like '09-10 AM' into HH:MM:SS 24h
      const parseSlot = (slotStr) => {
        // Examples: '09-10 AM', '10-11 AM', '11-12 AM', '12-01 PM'
        const match = slotStr.match(/(\d{2})-(\d{2})\s*(AM|PM)/i);
        if (!match) return { start: '09:00:00', end: '10:00:00' };
        let [_, startH, endH, period] = match;
        const to24 = (h, p) => {
          let hour = parseInt(h, 10);
          if (p.toUpperCase() === 'AM') {
            if (hour === 12) hour = 0;
          } else {
            if (hour !== 12) hour += 12;
          }
          return `${hour.toString().padStart(2, '0')}:00:00`;
        };
        const start = to24(startH, period);
        const end = to24(endH, period);
        return { start, end };
      };

      const { start, end } = parseSlot(selectedSlot);

      const payload = {
        doctor_id: doctor.id,
        day_of_week: dayOfWeek,
        shift_type: (selectedTime || 'Afternoon').toLowerCase(),
        start_time: start,
        end_time: end,
        slot_duration: 60,
        slots: [
          { start_time: start, end_time: end }
        ]
      };

      const response = await ApiService.createAvailabilitySlots(payload);
      if (response.success && response.data.status) {
        console.log('Slots created:', response.data.data);
        setPopupType('success');
      } else {
        console.log('Failed to create slots:', response);
        setPopupType('failure');
      }
    } catch (e) {
      console.log('Create slots error:', e);
      setPopupType('failure');
    } finally {
      setShowPopup(true);
      setBookingLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Compute doctor image URI once for render
  const doctorImageUri = (() => {
    const raw = doctor?.image_url || doctor?.image || doctor?.photo || doctor?.profile_image;
    if (raw && typeof raw === 'string' && raw.trim() !== '') {
      const clean = raw.replace(/^\/+/, '');
      return clean.startsWith('http') ? clean : `${ApiService.getBaseUrl()}/${clean}`;
    }
    return null;
  })();

  // Reset image error when doctor changes
  useEffect(() => {
    setProfileImageError(false);
  }, [doctor?.id]);

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
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#005666" />
            <Text style={styles.loadingText}>Loading doctor details...</Text>
          </View>
        ) : doctor ? (
          <>
            {/* Doctor Profile Section */}
            <View style={styles.profileSection}>
              {doctorImageUri && !profileImageError ? (
                <Image
                  source={{ uri: doctorImageUri }}
                  style={styles.doctorImage}
                  resizeMode="cover"
                  onError={(error) => {
                    console.log('Doctor profile image loading error:', error.nativeEvent);
                    setProfileImageError(true);
                  }}
                  onLoad={() => {
                    console.log('Doctor profile image loaded successfully');
                  }}
                />
              ) : (
                <View style={[styles.doctorImage, styles.doctorImageFallback]}> 
                  <MaterialIcons name="person" size={48} color="#666666" />
                </View>
              )}
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{doctor.full_name}</Text>
                <Text style={styles.doctorCredentials}>
                  {doctor.specialization_name || doctor.specialization || doctor.specialty}
                </Text>
                <Text style={styles.doctorExperience}>
                  {doctor.experience_years}+ years experience
                </Text>
              </View>
            </View>

            {/* Doctor Biography */}
            <View style={styles.biographySection}>
              <Text style={styles.sectionTitle}>Doctor Biography</Text>
              <EnhancedHtmlRenderer
                html={doctor.profile_description || doctor.bio || doctor.description}
                style={styles.biographyText}
                fallbackText={`${doctor.full_name} is a dedicated medical professional with over ${doctor.experience_years} years of experience in ${doctor.specialization_name || doctor.specialization || 'healthcare'}. They are passionate about providing excellent healthcare and ensuring the well-being of their patients.`}
              />
            </View>
          </>
        ) : null}

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

        {/* Available Slots By Date */}
        <View style={styles.timesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Slots</Text>
            <View style={styles.sectionIconContainer}>
              <MaterialIcons name="schedule" size={20} color="#005666" />
            </View>
          </View>
          
          <View style={styles.slotsCard}>
            {isHoliday ? (
              <View style={styles.holidayContainer}>
                <MaterialIcons name="event-busy" size={48} color="#FF6B6B" />
                <Text style={styles.holidayTitle}>Doctor is on holiday</Text>
                <Text style={styles.holidayText}>for this date</Text>
                {holidayInfo && (
                  <View style={styles.holidayInfoContainer}>
                    <Text style={styles.holidayInfoText}>
                      {holidayInfo.start_date} to {holidayInfo.end_date}
                    </Text>
                    {holidayInfo.reason && (
                      <Text style={styles.holidayReasonText}>
                        {holidayInfo.reason}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ) : Array.isArray(slotsByShift) ? (
              slotsByShift.length > 0 ? (
                <>
                  {/* Shift Tabs */}
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    style={styles.shiftTabsScrollView}
                    contentContainerStyle={styles.shiftTabsContent}
                  >
                    {slotsByShift.map((group) => {
                      const shift = group.shift_type || 'shift';
                      const isActive = selectedShiftTab === shift;
                      return (
                        <Pressable
                          key={`tab-${shift}`}
                          style={[styles.shiftTab, isActive && styles.shiftTabActive]}
                          onPress={() => setSelectedShiftTab(shift)}
                        >
                          <MaterialIcons 
                            name={shift === 'morning' ? 'wb-sunny' : shift === 'afternoon' ? 'wb-sunny' : 'nights-stay'} 
                            size={16} 
                            color={isActive ? '#FFFFFF' : '#666666'} 
                            style={{ marginRight: 6 }}
                          />
                          <Text style={[styles.shiftTabText, isActive && styles.shiftTabTextActive]}>
                            {shift.charAt(0).toUpperCase() + shift.slice(1)}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>

                  {/* Selected Shift Slots */}
                  {(() => {
                    const activeGroup = slotsByShift.find(g => (g.shift_type || 'shift') === selectedShiftTab);
                    const normalizedSlots = activeGroup && Array.isArray(activeGroup.slots) ? activeGroup.slots : [];
                    return (
                      <View style={styles.timeSlotsContainer}>
                        {normalizedSlots.length > 0 ? (
                          normalizedSlots.map((slot, idx) => {
                            const label = formatTime12(slot.start_time);
                            const isSelected = selectedSlot === label;
                            return (
                              <Pressable
                                key={`${selectedShiftTab}-${idx}-${slot.start_time}`}
                                style={[
                                  styles.timeSlotButton,
                                  isSelected && styles.selectedTimeSlot
                                ]}
                                onPress={() => setSelectedSlot(label)}
                              >
                                <MaterialIcons 
                                  name="access-time" 
                                  size={16} 
                                  color={isSelected ? '#FFFFFF' : '#005666'} 
                                  style={{ marginRight: 6 }}
                                />
                                <Text style={[
                                  styles.timeSlotText,
                                  isSelected && styles.selectedTimeSlotText
                                ]}>
                                  {label}
                                </Text>
                              </Pressable>
                            );
                          })
                        ) : (
                          <View style={styles.noSlotsContainer}>
                            <MaterialIcons name="schedule" size={32} color="#CCCCCC" />
                            <Text style={styles.noSlotsText}>No slots in this shift</Text>
                          </View>
                        )}
                      </View>
                    );
                  })()}
                </>
              ) : (
                <View style={styles.noSlotsContainer}>
                  <MaterialIcons name="event-available" size={48} color="#CCCCCC" />
                  <Text style={styles.noSlotsText}>No slots available for this date</Text>
                </View>
              )
            ) : (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#005666" />
                <Text style={styles.loadingText}>Loading available slots...</Text>
              </View>
            )}
          </View>
        </View>

        {/* Patient Information */}
        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Patient Information</Text>
            <View style={styles.sectionIconContainer}>
              <MaterialIcons name="person" size={20} color="#005666" />
            </View>
          </View>
          
          <View style={styles.formCard}>
            <View style={styles.formRow}> 
              <View style={styles.inputGroup}>
                <View style={styles.inputLabelContainer}>
                  <MaterialIcons name="person-outline" size={16} color="#005666" />
                  <Text style={styles.inputLabel}>Patient Name <Text style={styles.requiredStar}>*</Text></Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter patient name"
                  placeholderTextColor="#999999"
                  value={patientName}
                  onChangeText={setPatientName}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>
              <View style={styles.inputGroup}>
                <View style={styles.inputLabelContainer}>
                  <MaterialIcons name="phone" size={16} color="#005666" />
                  <Text style={styles.inputLabel}>Mobile Number <Text style={styles.requiredStar}>*</Text></Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter 10-digit mobile number"
                  placeholderTextColor="#999999"
                  value={mobileNumber}
                  onChangeText={(v) => setMobileNumber(v.replace(/[^0-9]/g, ''))}
                  keyboardType="phone-pad"
                  maxLength={10}
                  returnKeyType="done"
                />
              </View>
            </View>
            <View style={styles.inputGroupFull}>
              <View style={styles.inputLabelContainer}>
                <MaterialIcons name="note" size={16} color="#005666" />
                <Text style={styles.inputLabel}>Notes (Optional)</Text>
              </View>
              <TextInput
                style={styles.textArea}
                placeholder="Enter any additional notes for the appointment"
                placeholderTextColor="#999999"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        {/* Book Appointment Button */}
        <Pressable 
          style={[styles.bookButton, bookingLoading && styles.bookButtonDisabled]} 
          onPress={handleBookAppointment}
          disabled={bookingLoading || !doctor}
        >
          {bookingLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.bookButtonText}>Book Appointment</Text>
          )}
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
  doctorImageFallback: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  holidayContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  holidayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginTop: 12,
    marginBottom: 4,
  },
  holidayText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  holidayInfoContainer: {
    backgroundColor: '#FFF5F5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE0E0',
  },
  holidayInfoText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
    textAlign: 'center',
  },
  holidayReasonText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    marginTop: 4,
  },
  shiftTabsScrollView: {
    marginBottom: 16,
  },
  shiftTabsContent: {
    paddingRight: 20,
  },
  noSlotsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noSlotsText: {
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
    textAlign: 'center',
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
  formSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
  },
  inputGroupFull: {
    width: '100%',
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '600',
    marginLeft: 6,
  },
  requiredStar: {
    color: '#E53E3E',
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#1a1a1a',
    fontSize: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#1a1a1a',
    fontSize: 14,
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  shiftTabsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedTimeSlot: {
    backgroundColor: '#005666',
    borderColor: '#005666',
    shadowColor: '#005666',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  timeSlotText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
  },
  selectedTimeSlotText: {
    color: '#FFFFFF',
  },
  shiftTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  shiftTabActive: {
    backgroundColor: '#005666',
    borderColor: '#005666',
    shadowColor: '#005666',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  shiftTabText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
  },
  shiftTabTextActive: {
    color: '#FFFFFF',
  },
  bookButton: {
    backgroundColor: '#005666',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 20,
    shadowColor: '#005666',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#004A5A',
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  bookButtonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0.1,
    elevation: 2,
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
  bottomSpacing: {
    height: 20,
  },
});