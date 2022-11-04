import { createContext, useState, useRef, useEffect } from 'react';
import { doc, updateDoc, getFirestore } from "firebase/firestore";

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const AuthContext = createContext({
  email: '',
  perfil: '',
  sonidosDesactivados: false,
  authenticate: (email, perfil) => { },
  logout: () => { },
  alternarSonidos: () => { },
});

function AuthContextProvider({ children }) {
  const notificationListener = useRef();
  const responseListener = useRef();
  const [email, setEmail] = useState();
  const [perfil, setPerfil] = useState();
  const [sonidosDesactivados, setSonidosDesactivados] = useState();

  useEffect(() => {
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  function authenticate(email, perfil, uid) {
    setEmail(email);
    setPerfil(perfil);
    updateNotificationToken(uid);
  }

  function logout() {
    setEmail(null);
    setPerfil(null);
  }

  function alternarSonidos() {
    setSonidosDesactivados(estadoPrevio => !estadoPrevio);
  }
  
  const value = {
    email: email,
    perfil: perfil,
    sonidosDesactivados: sonidosDesactivados,
    authenticate: authenticate,
    logout: logout,
    alternarSonidos: alternarSonidos,
  };

  function updateNotificationToken(uid) {
    registerForPushNotificationsAsync().then(token => {
      const docRef = doc(getFirestore(), "usuarios", uid);
      updateDoc(docRef, {
        token
      });
    }).catch(error => {
    });
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: "smileringtone.mp3"
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}