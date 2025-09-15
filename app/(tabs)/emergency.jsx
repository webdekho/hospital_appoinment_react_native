import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import CommonHeader from '../../components/CommonHeader';

export default function EmergencyScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Handle form submission
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Common Header */}
      <CommonHeader title="Emergency" showSearch={false} showNotification={true} />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Emergency Call-to-Action */}
        <View style={styles.emergencySection}>
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyHeader}>
              <MaterialIcons name="emergency" size={40} color="#005666" />
              <View style={styles.emergencyHeaderText}>
                <Text style={styles.emergencyTitle}>24/7 Emergency Care</Text>
                <Text style={styles.emergencySubtitle}>Immediate medical assistance available</Text>
              </View>
            </View>
            <View style={styles.emergencyActions}>
              <View style={styles.emergencyCallButton}>
                <MaterialIcons name="phone" size={24} color="#FFFFFF" />
                <Text style={styles.emergencyCallText}>Call Now: +91 9967008900</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Hospital Information */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="location-on" size={24} color="#005666" />
              <Text style={styles.cardTitle}>Hospital Location</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.hospitalName}>Aayush Hospital</Text>
              <Text style={styles.hospitalAddress}>
                E2, Radha nagar Shopping Centre,{'\n'}
                Khadakpada, Kalyan (West) - 421301
              </Text>
              <View style={styles.actionButton}>
                <MaterialIcons name="directions" size={18} color="#4285F4" />
                <Text style={styles.actionButtonText}>Get Directions</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="phone" size={24} color="#005666" />
              <Text style={styles.cardTitle}>Contact Numbers</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.contactRow}>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Emergency (24/7)</Text>
                  <Text style={styles.contactNumber}>+91 9967008900</Text>
                </View>
                <MaterialIcons name="call" size={20} color="#005666" />
              </View>
              
              <View style={styles.contactRow}>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Appointments</Text>
                  <Text style={styles.contactNumber}>+91 7506363738</Text>
                </View>
                <MaterialIcons name="call" size={20} color="#005666" />
              </View>
              
              <View style={styles.contactRow}>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>General Enquiry</Text>
                  <Text style={styles.contactNumber}>+91 8767040404</Text>
                </View>
                <MaterialIcons name="call" size={20} color="#005666" />
              </View>
            </View>
          </View>
        </View>

        {/* Email Us Section */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="email" size={24} color="#005666" />
              <Text style={styles.cardTitle}>Email Us</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.emailInfo}>
                <MaterialIcons name="email" size={20} color="#005666" />
                <View style={styles.emailContent}>
                  <Text style={styles.emailLabel}>General Enquiry</Text>
                  <Text style={styles.emailAddress}>info@aayush-hospitals.com</Text>
                </View>
              </View>
              
              <Text style={styles.formTitle}>Fill the form if you have any query</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Your Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your name"
                  value={formData.name}
                  onChangeText={(text) => setFormData({...formData, name: text})}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Your Email</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(text) => setFormData({...formData, email: text})}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Your Message</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Type your message here"
                  value={formData.message}
                  onChangeText={(text) => setFormData({...formData, message: text})}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  placeholderTextColor="#999"
                />
              </View>

              <Pressable style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>SUBMIT</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Working Hours */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="schedule" size={24} color="#005666" />
              <Text style={styles.cardTitle}>Working Hours</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>OPD Consultation</Text>
                <Text style={styles.timeValue}>9:00 AM - 9:00 PM</Text>
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>Emergency</Text>
                <Text style={styles.timeValue}>24/7</Text>
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>Visiting Hours</Text>
                <Text style={styles.timeValue}>10:00 AM - 8:00 PM</Text>
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>Lab Services</Text>
                <Text style={styles.timeValue}>7:00 AM - 9:00 PM</Text>
              </View>
              <Text style={styles.noteText}>*Note: OPD timing may vary for different doctors*</Text>
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
  // Emergency Section
  emergencySection: {
    marginTop: 16,
    marginBottom: 24,
  },
  emergencyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 6,
    borderLeftColor: '#005666',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  emergencyHeaderText: {
    marginLeft: 16,
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  emergencySubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  emergencyActions: {
    alignItems: 'stretch',
  },
  emergencyCallButton: {
    backgroundColor: '#005666',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#005666',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emergencyCallText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  // Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  // Cards
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginLeft: 12,
  },
  cardContent: {
    padding: 20,
    paddingTop: 16,
  },
  // Hospital Info
  hospitalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  hospitalAddress: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 22,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#005666',
    fontWeight: '600',
    marginLeft: 8,
  },
  // Contact Rows
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 15,
    color: '#005666',
    fontWeight: '500',
  },
  // Time Rows
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  timeValue: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'right',
    flex: 1,
  },
  // Email Section
  emailInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  emailContent: {
    marginLeft: 12,
    flex: 1,
  },
  emailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  emailAddress: {
    fontSize: 15,
    color: '#005666',
    fontWeight: '500',
  },
  formTitle: {
    fontSize: 15,
    color: '#666666',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  formGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    fontSize: 15,
    color: '#1a1a1a',
    backgroundColor: '#FAFAFA',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#005666',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  noteText: {
    fontSize: 13,
    color: '#888888',
    fontStyle: 'italic',
    marginTop: 12,
    textAlign: 'center',
  },
});