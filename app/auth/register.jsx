import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import ApiService from '../../services/api';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const params = useLocalSearchParams();
  const { mobile } = params;
  
  const [fullName, setFullName] = useState('');
  const [isValidName, setIsValidName] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Animation values
  const floatAnim1 = useState(new Animated.Value(0))[0];
  const floatAnim2 = useState(new Animated.Value(0))[0];
  const floatAnim3 = useState(new Animated.Value(0))[0];
  const floatAnim4 = useState(new Animated.Value(0))[0];
  const floatAnim5 = useState(new Animated.Value(0))[0];
  const floatAnim6 = useState(new Animated.Value(0))[0];
  const rotateAnim1 = useState(new Animated.Value(0))[0];
  const rotateAnim2 = useState(new Animated.Value(0))[0];
  const rotateAnim3 = useState(new Animated.Value(0))[0];
  const scaleAnim1 = useState(new Animated.Value(0))[0];
  const scaleAnim2 = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Animation setup
    const createFloatingAnimation = (animValue, duration, delay = 0) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: duration,
            delay: delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const createRotationAnimation = (animValue, duration, delay = 0) => {
      return Animated.loop(
        Animated.timing(animValue, {
          toValue: 1,
          duration: duration,
          delay: delay,
          useNativeDriver: true,
        })
      );
    };

    const createScalingAnimation = (animValue, duration, delay = 0) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: duration,
            delay: delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Start animations
    createFloatingAnimation(floatAnim1, 3000, 0).start();
    createFloatingAnimation(floatAnim2, 4000, 1000).start();
    createFloatingAnimation(floatAnim3, 3500, 500).start();
    createFloatingAnimation(floatAnim4, 4500, 800).start();
    createFloatingAnimation(floatAnim5, 2800, 1500).start();
    createFloatingAnimation(floatAnim6, 3800, 300).start();
    createRotationAnimation(rotateAnim1, 8000, 0).start();
    createRotationAnimation(rotateAnim2, 6000, 2000).start();
    createRotationAnimation(rotateAnim3, 7000, 1000).start();
    createScalingAnimation(scaleAnim1, 3000, 0).start();
    createScalingAnimation(scaleAnim2, 2500, 1200).start();
  }, []);

  const validateName = (name) => {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
  };

  const handleNameChange = (text) => {
    setFullName(text);
    setIsValidName(true);
  };

  const handleRegister = async () => {
    setErrorMessage('');
    
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    if (!validateName(fullName)) {
      setIsValidName(false);
      setErrorMessage('Please enter a valid full name (letters only, minimum 2 characters)');
      return;
    }

    setIsLoading(true);

    try {
      const response = await ApiService.register(fullName.trim(), mobile, '123456');
      
      console.log('=== REGISTER API RESPONSE ===');
      console.log('Full Response:', JSON.stringify(response, null, 2));
      console.log('Response success:', response.success);
      console.log('Response data status:', response.data?.status);
      console.log('=== END REGISTER DEBUG ===');
      
      if (response.success && response.data.status) {
        console.log('Registration successful, navigating to OTP screen');
        setIsLoading(false);
        
        // Direct navigation to OTP screen with test OTP
        setTimeout(() => {
          router.replace({
            pathname: '/auth/otp',
            params: { 
              mobile,
              type: 'register',
              fullName: fullName.trim(),
              testOtp: response.data.data.otp // Pass OTP for testing
            }
          });
        }, 100);
        return;
      } else {
        const apiErrorMessage = response.data.message || 'Registration failed. Please try again.';
        if (response.data.errors?.mobile_number) {
          setErrorMessage('This mobile number is already registered. Please try logging in instead.');
        } else {
          setErrorMessage(apiErrorMessage);
        }
      }
    } catch (error) {
      console.log('Registration network error:', error);
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.backgroundContainer}>
        {/* Animated Decorative Shapes */}
        <Animated.View style={[styles.decorativeShape1, { transform: [{ translateY: floatAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }) }, { rotate: rotateAnim1.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }]} />
        <Animated.View style={[styles.decorativeShape2, { transform: [{ translateY: floatAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, 15] }) }, { translateX: floatAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, 5] }) }] }]} />
        <Animated.View style={[styles.decorativeShape3, { transform: [{ translateY: floatAnim3.interpolate({ inputRange: [0, 1], outputRange: [0, -25] }) }, { rotate: rotateAnim2.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-360deg'] }) }] }]} />
        <Animated.View style={[styles.decorativeShape4, { transform: [{ translateX: floatAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) }, { scale: floatAnim1.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) }] }]} />
        <Animated.View style={[styles.decorativeShape5, { transform: [{ translateY: floatAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, 20] }) }, { rotate: rotateAnim1.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }] }]} />
        <Animated.View style={[styles.decorativeShape6, { transform: [{ translateX: floatAnim4.interpolate({ inputRange: [0, 1], outputRange: [0, 6] }) }, { scale: scaleAnim1.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.2] }) }] }]} />
        <Animated.View style={[styles.decorativeShape7, { transform: [{ translateY: floatAnim5.interpolate({ inputRange: [0, 1], outputRange: [0, -18] }) }, { rotate: rotateAnim3.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '270deg'] }) }] }]} />
        <Animated.View style={[styles.decorativeShape8, { transform: [{ translateY: floatAnim6.interpolate({ inputRange: [0, 1], outputRange: [0, 22] }) }, { translateX: floatAnim6.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }] }]} />
        <Animated.View style={[styles.decorativeShape9, { transform: [{ scale: scaleAnim2.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] }) }, { rotate: rotateAnim2.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '90deg'] }) }] }]} />
        <Animated.View style={[styles.decorativeShape10, { transform: [{ translateY: floatAnim4.interpolate({ inputRange: [0, 1], outputRange: [0, -15] }) }, { translateX: floatAnim5.interpolate({ inputRange: [0, 1], outputRange: [0, 5] }) }] }]} />

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logoWrapper}>
                <Image
                  source={require('../../assets/images/aayush_favicon.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
                <Text style={styles.hospitalName}>Aayush Hospital</Text>
              </View>
            </View>
          </View>

          {/* Main Content Card */}
          <View style={styles.contentCard}>
            {/* Hospital Image */}
            <View style={styles.imageSection}>
              <View style={styles.imageContainer}>
                <Image
                  source={require('../../assets/images/hospital_front.jpg')}
                  style={styles.hospitalImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,86,102,0.3)']}
                  style={styles.imageOverlay}
                />
              </View>
            </View>

            {/* Registration Form */}
            <View style={styles.formSection}>
              <View style={styles.titleSection}>
                <Text style={styles.welcomeTitle}>Sign Up</Text>
                <Text style={styles.welcomeSubtitle}>
                  Enter your full name for {mobile}
                </Text>
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.nameInputContainer}>
                  <View style={styles.patientIconContainer}>
                    <Text style={styles.patientIcon}>👤</Text>
                  </View>
                  <TextInput
                    style={[
                      styles.nameInput,
                      !isValidName && styles.nameInputError
                    ]}
                    placeholder="Enter your full name"
                    placeholderTextColor="#a0a0a0"
                    value={fullName}
                    onChangeText={handleNameChange}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
                {!isValidName && (
                  <Text style={styles.errorText}>
                    Please enter a valid full name (letters only, minimum 2 characters)
                  </Text>
                )}
                {errorMessage && (
                  <Text style={styles.errorText}>
                    {errorMessage}
                  </Text>
                )}
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.registerButton,
                  pressed && styles.registerButtonPressed,
                  isLoading && styles.registerButtonDisabled
                ]}
                onPress={handleRegister}
                disabled={isLoading}
                android_ripple={{ 
                  color: '#ffffff40',
                  borderless: false
                }}
              >
                <LinearGradient
                  colors={['#005666', '#00a0b4']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <Text style={styles.registerButtonText}>Submit</Text>
                  )}
                </LinearGradient>
              </Pressable>

              <View style={styles.footerSection}>
                <Text style={styles.footerText}>
                  By completing registration, you agree to our{' '}
                  <Text style={styles.linkText}>Terms & Conditions</Text>
                  {' '}and{' '}
                  <Text style={styles.linkText}>Privacy Policy</Text>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  headerSection: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  hospitalName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#005666',
    letterSpacing: 1,
  },
  contentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginBottom: 40,
  },
  imageSection: {
    height: 220,
    position: 'relative',
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  hospitalImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  formSection: {
    padding: 30,
  },
  titleSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  inputSection: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  nameInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e8f4f8',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#005666',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  patientIconContainer: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    minWidth: 60,
  },
  patientIcon: {
    fontSize: 20,
    color: '#666666',
  },
  nameInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#f5f5f5',
  },
  nameInputError: {
    borderColor: '#ff4757',
    borderWidth: 2,
  },
  errorText: {
    color: '#ff4757',
    fontSize: 14,
    marginTop: 8,
    paddingLeft: 4,
    fontWeight: '500',
  },
  registerButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#005666',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 24,
  },
  registerButtonPressed: {
    transform: [{ scale: 0.98 }],
    elevation: 2,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.8,
  },
  footerSection: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#005666',
    fontWeight: '600',
  },
  // Decorative Shapes (same as login screen)
  decorativeShape1: { position: 'absolute', top: 80, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(0, 86, 102, 0.25)', zIndex: 0 },
  decorativeShape2: { position: 'absolute', top: 200, left: 10, width: 80, height: 80, borderRadius: 20, backgroundColor: 'rgba(0, 160, 180, 0.22)', transform: [{ rotate: '45deg' }], zIndex: 0 },
  decorativeShape3: { position: 'absolute', top: 350, right: 10, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(0, 86, 102, 0.2)', zIndex: 0 },
  decorativeShape4: { position: 'absolute', bottom: 200, left: 20, width: 40, height: 40, borderRadius: 8, backgroundColor: 'rgba(0, 160, 180, 0.28)', zIndex: 0 },
  decorativeShape5: { position: 'absolute', bottom: 100, right: 40, width: 70, height: 70, borderRadius: 15, backgroundColor: 'rgba(0, 86, 102, 0.23)', transform: [{ rotate: '30deg' }], zIndex: 0 },
  decorativeShape6: { position: 'absolute', top: 150, right: 80, width: 35, height: 35, borderRadius: 18, backgroundColor: 'rgba(0, 160, 180, 0.24)', zIndex: 0 },
  decorativeShape7: { position: 'absolute', top: 450, left: 50, width: 55, height: 55, borderRadius: 12, backgroundColor: 'rgba(0, 86, 102, 0.21)', zIndex: 0 },
  decorativeShape8: { position: 'absolute', top: 300, left: 5, width: 65, height: 65, borderRadius: 32, backgroundColor: 'rgba(0, 160, 180, 0.19)', zIndex: 0 },
  decorativeShape9: { position: 'absolute', bottom: 300, right: 15, width: 45, height: 45, borderRadius: 8, backgroundColor: 'rgba(0, 86, 102, 0.26)', transform: [{ rotate: '15deg' }], zIndex: 0 },
  decorativeShape10: { position: 'absolute', bottom: 50, left: 5, width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0, 160, 180, 0.22)', zIndex: 0 },
});