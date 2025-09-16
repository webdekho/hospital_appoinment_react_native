import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const AppointmentPopup = ({ visible, type, onClose }) => {
  const isSuccess = type === 'success';

  const Confetti = () => (
    <View style={styles.confettiContainer}>
      {[...Array(30)].map((_, index) => (
        <View
          key={index}
          style={[
            styles.confettiPiece,
            {
              backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][index % 6],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: [{ rotate: `${Math.random() * 360}deg` }],
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
            }
          ]}
        />
      ))}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          {isSuccess && <Confetti />}
          
          <Pressable style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#666" />
          </Pressable>

          <View style={[styles.iconContainer, isSuccess ? styles.successIcon : styles.failureIcon]}>
            {isSuccess ? (
              <View style={styles.checkmarkContainer}>
                <MaterialIcons name="check" size={40} color="#FFFFFF" />
              </View>
            ) : (
              <View style={styles.crossContainer}>
                <MaterialIcons name="close" size={40} color="#FFFFFF" />
              </View>
            )}
          </View>

          <Text style={styles.title}>
            {isSuccess ? 'Transaction successful!!' : 'Transaction Failed'}
          </Text>

          <Text style={styles.message}>
            {isSuccess 
              ? 'Your gift card has been added successfully!' 
              : 'Your gift card transaction has been failed'
            }
          </Text>

          <View style={styles.giftCardContainer}>
            <View style={styles.giftCard}>
              <View style={[styles.giftCardIcon, { backgroundColor: isSuccess ? '#4CAF50' : '#FF5722' }]}>
                <MaterialIcons 
                  name={isSuccess ? "card-giftcard" : "error"} 
                  size={24} 
                  color="#FFFFFF" 
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  confettiPiece: {
    position: 'absolute',
    borderRadius: 2,
  },
  popup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '90%',
    maxWidth: 350,
    position: 'relative',
    zIndex: 2,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  successIcon: {
    backgroundColor: '#4CAF50',
  },
  failureIcon: {
    backgroundColor: '#FF5722',
  },
  checkmarkContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  crossContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  giftCardContainer: {
    alignItems: 'center',
  },
  giftCard: {
    width: 60,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  giftCardIcon: {
    width: 30,
    height: 30,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppointmentPopup;