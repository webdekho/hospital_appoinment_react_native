import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import CommonHeader from '../../components/CommonHeader';

export default function ServicesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Common Header */}
      <CommonHeader title="Services" showSearch={true} showNotification={false} />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Services Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Medical Services</Text>
          
          {/* Service Cards */}
          <View style={styles.servicesContainer}>
            <View style={styles.serviceRow}>
              <View style={styles.serviceCard}>
                <View style={styles.imageContainer}>
                  <Image
                    source={require('../../assets/images/kidney.png')}
                    style={styles.serviceImage}
                    resizeMode="cover"
                  />
                  <View style={styles.serviceIconOverlay}>
                    <MaterialIcons name="medical-services" size={28} color="#FFFFFF" />
                  </View>
                </View>
                <View style={styles.serviceContent}>
                  <Text style={styles.serviceTitle}>Knee Arthritis Treatment</Text>
                </View>
              </View>

              <View style={styles.serviceCard}>
                <View style={styles.imageContainer}>
                  <Image
                    source={require('../../assets/images/hosptial.png')}
                    style={styles.serviceImage}
                    resizeMode="cover"
                  />
                  <View style={styles.serviceIconOverlay}>
                    <MaterialIcons name="medical-services" size={28} color="#FFFFFF" />
                  </View>
                </View>
                <View style={styles.serviceContent}>
                  <Text style={styles.serviceTitle}>Kidney Failure Treatment</Text>
                </View>
              </View>
            </View>

            <View style={styles.serviceRow}>
              <View style={styles.serviceCard}>
                <View style={styles.imageContainer}>
                  <Image
                    source={require('../../assets/images/heart.png.png')}
                    style={styles.serviceImage}
                    resizeMode="cover"
                  />
                  <View style={styles.serviceIconOverlay}>
                    <MaterialIcons name="medical-services" size={28} color="#FFFFFF" />
                  </View>
                </View>
                <View style={styles.serviceContent}>
                  <Text style={styles.serviceTitle}>Cardiac Surgery</Text>
                </View>
              </View>

              <View style={styles.serviceCard}>
                <View style={styles.imageContainer}>
                  <Image
                    source={require('../../assets/images/kidney.png')}
                    style={styles.serviceImage}
                    resizeMode="cover"
                  />
                  <View style={styles.serviceIconOverlay}>
                    <MaterialIcons name="medical-services" size={28} color="#FFFFFF" />
                  </View>
                </View>
                <View style={styles.serviceContent}>
                  <Text style={styles.serviceTitle}>Neurosurgery</Text>
                </View>
              </View>
            </View>

            <View style={styles.serviceRow}>
              <View style={styles.serviceCard}>
                <View style={styles.imageContainer}>
                  <Image
                    source={require('../../assets/images/hosptial.png')}
                    style={styles.serviceImage}
                    resizeMode="cover"
                  />
                  <View style={styles.serviceIconOverlay}>
                    <MaterialIcons name="medical-services" size={28} color="#FFFFFF" />
                  </View>
                </View>
                <View style={styles.serviceContent}>
                  <Text style={styles.serviceTitle}>Orthopedic Surgery</Text>
                </View>
              </View>

              <View style={styles.serviceCard}>
                <View style={styles.imageContainer}>
                  <Image
                    source={require('../../assets/images/heart.png.png')}
                    style={styles.serviceImage}
                    resizeMode="cover"
                  />
                  <View style={styles.serviceIconOverlay}>
                    <MaterialIcons name="medical-services" size={28} color="#FFFFFF" />
                  </View>
                </View>
                <View style={styles.serviceContent}>
                  <Text style={styles.serviceTitle}>Emergency Care</Text>
                </View>
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
  section: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'left',
  },
  servicesContainer: {
    gap: 16,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
    height: 140,
  },
  serviceImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
  },
  serviceIconOverlay: {
    position: 'absolute',
    bottom: 10,
    left: '50%',
    marginLeft: -25,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#005666',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#005666',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  serviceContent: {
    padding: 16,
    alignItems: 'center',
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    lineHeight: 20,
  },
});