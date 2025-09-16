import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import ApiService from '../../services/api';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
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
    // Check if user is already authenticated
    const checkAuth = async () => {
      const token = await ApiService.getToken();
      const userData = await ApiService.getUserData();
      
      if (token && userData) {
        console.log('User already authenticated, redirecting to home');
        router.replace('/(tabs)');
        return;
      }
    };
    
    checkAuth();

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

  const handleGetStarted = () => {
    router.push('/auth/login');
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

          <View style={styles.imageSection}>
            <View style={styles.mainImageContainer}>
              
              {/* Top left circle */}
              <View style={styles.topLeftCircleContainer}>
                <View style={styles.topLeftCircle}>
                  <Image
                    source={require('../../assets/images/heart.png.png')}
                    style={styles.circleImage}
                    resizeMode="cover"
                  />
                </View>
              </View>

              {/* Bottom large circle */}
              <View style={styles.bottomCircleContainer}>
                <View style={styles.bottomCircle}>
                  <Image
                    source={require('../../assets/images/hosptial.png')}
                    style={styles.circleImage}
                    resizeMode="cover"
                  />
                </View>
              </View>

              {/* Top right circle */}
              <View style={styles.topRightCircleContainer}>
                <View style={styles.topRightCircle}>
                  <Image
                    source={require('../../assets/images/kidney.png')}
                    style={styles.circleImage}
                    resizeMode="cover"
                  />
                </View>
              </View>

            </View>
          </View>

          <View style={styles.textSection}>
            <Text style={styles.title}>Perfect Health Center</Text>
            <Text style={styles.subtitle}>
              Find a health center that meets your needs and supports your well-being.
            </Text>
          </View>

          <View style={styles.buttonSection}>
            <Pressable
              style={({ pressed }) => [
                styles.getStartedButton,
                pressed && styles.getStartedButtonPressed
              ]}
              onPress={handleGetStarted}
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
                <Text style={styles.buttonText}>Get Started</Text>
              </LinearGradient>
            </Pressable>
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
    paddingHorizontal: 24,
  },
  logoContainer: {
    paddingTop: 40,
    paddingBottom: 40,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#005666',
    letterSpacing: 1,
  },
  imageSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  mainImageContainer: {
    width: 280,
    height: 280,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Top left circle (heart) - above hospital, left touch
  topLeftCircleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 3,
  },
  topLeftCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffffff',
    elevation: 8,
    shadowColor: '#005666',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#005666',
  },
  // Center large circle (biggest, overlapped by others)
  bottomCircleContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -100,
    marginLeft: -100,
    zIndex: 1,
  },
  bottomCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#ffffff',
    elevation: 6,
    shadowColor: '#00a0b4',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#00a0b4',
  },
  // Bottom right circle (kidney)
  topRightCircleContainer: {
    position: 'absolute',
    bottom: 20,
    right: 0,
    zIndex: 2,
  },
  topRightCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    elevation: 5,
    shadowColor: '#005666',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#005666',
  },
  circleImage: {
    width: '100%',
    height: '100%',
  },
  textSection: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonSection: {
    paddingBottom: 40,
  },
  getStartedButton: {
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
  },
  getStartedButtonPressed: {
    transform: [{ scale: 0.98 }],
    elevation: 2,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.8,
  },
  // Decorative Shapes (same as other auth screens)
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