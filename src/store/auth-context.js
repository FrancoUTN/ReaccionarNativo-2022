import { doc, updateDoc, getFirestore, query, collection, where, getDocs } from "firebase/firestore";
import { createContext, useState, useRef, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export const AuthContext = createContext({
  email: '',
  perfil: '',
  foto: '',
  sonidosDesactivados: false,
  authenticate: (email, perfil, uid, foto) => { },
  logout: () => { },
  alternarSonidos: () => { },
});

function AuthContextProvider({ children }) {
  const notificationListener = useRef();
  const responseListener = useRef();
  const [email, setEmail] = useState();
  const [perfil, setPerfil] = useState();
  const [foto, setFoto] = useState();
  const [sonidosDesactivados, setSonidosDesactivados] = useState();

  useEffect(() => {
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  function authenticate(email, perfil, uid, foto) {
    setEmail(email);
    setPerfil(perfil);
    setFoto(foto);
    updateNotificationToken(uid);
  }

  function logout() {
    setEmail(null);
    setPerfil(null);
    deleteNotificationToken();
  }

  function alternarSonidos() {
    setSonidosDesactivados(estadoPrevio => !estadoPrevio);
  }

  const value = {
    email: email,
    perfil: perfil,
    foto,
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

  async function deleteNotificationToken() {
    const coleccion = collection(getFirestore(), 'usuarios');
    const consulta = query(coleccion, where('correo', "==", email));
    const querySnapshot = await getDocs(consulta);
    if (!querySnapshot.empty) {
      const uid = querySnapshot.docs[0].id;
      const docRef = doc(getFirestore(), "usuarios", uid);
      updateDoc(docRef, {
        token: "N/A"
      });
    }
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    // console.log("Es Android");
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
    console.log("Token: " + token);
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}