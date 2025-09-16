import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Pressable,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import Clipboard from '@react-native-clipboard/clipboard';
import ApiService from '../../services/api';


export default function OTPScreen() {
  const params = useLocalSearchParams();
  const { mobile, type, fullName, testOtp } = params;
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [autoFillCountdown, setAutoFillCountdown] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const otpInputs = useRef([]);

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

    // Timer countdown
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-fill OTP for testing after 10 seconds
  useEffect(() => {
    if (testOtp && testOtp.length === 6) {
      console.log('Test OTP received:', testOtp);
      setAutoFillCountdown(10);
      
      // Countdown timer
      const countdownInterval = setInterval(() => {
        setAutoFillCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      
      const autoFillTimer = setTimeout(() => {
        console.log('Auto-filling OTP for testing...');
        const otpDigits = testOtp.split('');
        setOtp(otpDigits);
        setAutoFillCountdown(null);
        
        // Focus the last input
        setTimeout(() => {
          otpInputs.current[5]?.focus();
        }, 100);
      }, 10000); // 10 seconds

      return () => {
        clearTimeout(autoFillTimer);
        clearInterval(countdownInterval);
      };
    }
  }, [testOtp]);

  const handleOtpChange = (value, index) => {
    // Check if it's a paste operation (multiple digits)
    if (value.length > 1 && /^\d+$/.test(value)) {
      const digits = value.slice(0, 6).split('');
      const newOtp = [...otp];
      
      // Fill from current index
      for (let i = 0; i < digits.length && (index + i) < 6; i++) {
        newOtp[index + i] = digits[i];
      }
      
      setOtp(newOtp);
      
      // Focus the last filled input or next empty one
      const lastFilledIndex = Math.min(index + digits.length - 1, 5);
      const nextEmptyIndex = newOtp.findIndex((digit, i) => i > lastFilledIndex && !digit);
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : lastFilledIndex;
      
      setTimeout(() => {
        otpInputs.current[focusIndex]?.focus();
      }, 50);
      
      return;
    }
    
    // Single digit input
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        otpInputs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    setErrorMessage('');
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setErrorMessage('Please enter complete OTP');
      return;
    }

    setIsLoading(true);

    try {
      if (type === 'login') {
        const response = await ApiService.verifyOtp(fullName || '', mobile, otpString);
        
        console.log('=== LOGIN OTP VERIFY RESPONSE ===');
        console.log('Full Response:', JSON.stringify(response, null, 2));
        console.log('Response success:', response.success);
        console.log('Response data status:', response.data?.status);
        console.log('Response data code:', response.data?.code);
        console.log('=== END LOGIN OTP DEBUG ===');
        
        if (response.success && response.data.status) {
          await ApiService.saveToken(response.data.data.token);
          await ApiService.saveUserData(response.data.data.user);
          
          console.log('Login successful, navigating to tabs');
          router.replace('/(tabs)');
        } else {
          if (response.data.code === 404) {
            setErrorMessage('No account found with this mobile number. Redirecting to registration...');
            setTimeout(() => {
              router.push({
                pathname: '/auth/register',
                params: { mobile }
              });
            }, 2000);
          } else if (response.data.code === 403) {
            setErrorMessage(response.data.message || 'Account is deactivated. Please contact administrator.');
          } else {
            const apiErrorMessage = response.data.message || 'Invalid OTP. Please try again.';
            setErrorMessage(apiErrorMessage);
          }
        }
      } else if (type === 'register') {
        const response = await ApiService.verifyRegistration(otpString, fullName, mobile, '123456');
        
        console.log('=== REGISTER OTP VERIFY RESPONSE ===');
        console.log('Full Response:', JSON.stringify(response, null, 2));
        console.log('Response success:', response.success);
        console.log('Response data status:', response.data?.status);
        console.log('Response data code:', response.data?.code);
        console.log('=== END REGISTER OTP DEBUG ===');
        
        if (response.success && response.data.status) {
          await ApiService.saveToken(response.data.data.token);
          await ApiService.saveUserData(response.data.data.user);
          
          console.log('Registration successful, navigating to tabs');
          router.replace('/(tabs)');
        } else {
          if (response.data.code === 403) {
            setErrorMessage(response.data.message || 'Account is deactivated. Please contact administrator.');
          } else {
            const apiErrorMessage = response.data.message || 'Invalid or expired OTP. Please try again.';
            setErrorMessage(apiErrorMessage);
          }
        }
      }
    } catch (error) {
      console.log('OTP verification network error:', error);
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (canResend && !isResending) {
      setIsResending(true);
      
      try {
        const response = await ApiService.loginOtp(mobile);
        
        if (response.success && response.data.status) {
          setTimer(60);
          setCanResend(false);
          setOtp(['', '', '', '', '', '']);
          setErrorMessage(''); // Clear any previous errors
        } else {
          setErrorMessage('Failed to resend OTP. Please try again.');
        }
      } catch (error) {
        setErrorMessage('Network error. Please check your connection and try again.');
      } finally {
        setIsResending(false);
      }
    }
  };

  const handlePasteOtp = async () => {
    try {
      const clipboardContent = await Clipboard.getString();
      const digits = clipboardContent.replace(/\D/g, '').slice(0, 6);
      
      if (digits.length > 0) {
        const newOtp = digits.split('');
        // Fill remaining with empty strings if less than 6 digits
        while (newOtp.length < 6) {
          newOtp.push('');
        }
        setOtp(newOtp);
        
        // Focus the last input or first empty one
        const focusIndex = digits.length < 6 ? digits.length : 5;
        setTimeout(() => {
          otpInputs.current[focusIndex]?.focus();
        }, 50);
      } else {
        setErrorMessage('No valid OTP code found in clipboard');
      }
    } catch (error) {
      setErrorMessage('Failed to paste OTP from clipboard');
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

            {/* OTP Form */}
            <View style={styles.formSection}>
              <View style={styles.titleSection}>
                <Text style={styles.welcomeTitle}>Verify OTP</Text>
                <Text style={styles.welcomeSubtitle}>
                  Enter the 6-digit code sent to {mobile}
                </Text>
                
              </View>

              <View style={styles.otpSection}>
                <Text style={styles.inputLabel}>Enter OTP</Text>
                <View style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => otpInputs.current[index] = ref}
                      style={[
                        styles.otpInput,
                        digit && styles.otpInputFilled
                      ]}
                      value={digit}
                      onChangeText={(value) => handleOtpChange(value, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      keyboardType="numeric"
                      maxLength={1}
                      textAlign="center"
                    />
                  ))}
                </View>
                {errorMessage && (
                  <Text style={styles.errorText}>
                    {errorMessage}
                  </Text>
                )}
              </View>

              <View style={styles.timerSection}>
                {canResend ? (
                  <Pressable onPress={handleResendOtp} disabled={isResending}>
                    {isResending ? (
                      <ActivityIndicator color="#005666" size="small" />
                    ) : (
                      <Text style={styles.resendText}>Resend OTP</Text>
                    )}
                  </Pressable>
                ) : (
                  <Text style={styles.timerText}>
                    Resend OTP in {timer}s
                  </Text>
                )}
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.verifyButton,
                  pressed && styles.verifyButtonPressed,
                  isLoading && styles.verifyButtonDisabled
                ]}
                onPress={handleVerifyOtp}
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
                    <Text style={styles.verifyButtonText}>Verify OTP</Text>
                  )}
                </LinearGradient>
              </Pressable>

              <View style={styles.footerSection}>
                <Text style={styles.footerText}>
                  By continuing, you agree to our{' '}
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
  otpSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: '#e8f4f8',
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: '#005666',
    backgroundColor: '#ffffff',
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timerText: {
    fontSize: 14,
    color: '#666666',
  },
  resendText: {
    fontSize: 14,
    color: '#005666',
    fontWeight: '600',
  },
  verifyButton: {
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
  verifyButtonPressed: {
    transform: [{ scale: 0.98 }],
    elevation: 2,
  },
  verifyButtonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButtonText: {
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
  autoFillText: {
    fontSize: 14,
    color: '#ff6b35',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
    backgroundColor: '#fff3f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'center',
  },
  errorText: {
    color: '#ff4757',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '500',
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