import { initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import aplicacion from './fire';

initializeAuth(aplicacion, {
  persistence: getReactNativePersistence(AsyncStorage)
});
