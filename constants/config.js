import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Try to derive the development machine IP when running via Expo
const expoHostUri = Constants.expoConfig?.hostUri
  || Constants.manifest2?.extra?.expoClient?.hostUri
  || Constants.manifest?.debuggerHost
  || '';

const hostFromExpo = expoHostUri.split(':')[0];

// Resolve a host that is reachable from the device/emulator
let RESOLVED_HOST = hostFromExpo && hostFromExpo !== 'localhost' ? hostFromExpo : 'localhost';

// Android emulator cannot access host's localhost; use 10.0.2.2
if (Platform.OS === 'android' && (RESOLVED_HOST === 'localhost' || RESOLVED_HOST === '127.0.0.1')) {
  RESOLVED_HOST = '10.0.2.2';
}

export const CONFIG = {
  API_BASE_URL: `http://${RESOLVED_HOST}/Aayush/backend/api`,
  BASE_URL: `http://${RESOLVED_HOST}/Aayush/backend`,
};
