import { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, Pressable } from 'react-native';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
 } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/styles';
import referencia from '../../util/firestore';
import Mensaje from '../../components/ui/Mensaje';
import LoadingOverlay from '../../components/ui/LoadingOverlay';

export default function ChatScreen({ route }) {
  const soyMozo = route.params?.mozo;
  const auth = getAuth();
  const miEmail = auth.currentUser.email;
  const uid = auth.currentUser.uid;

  const [textoMensaje, setTextoMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [miMesa, setMiMesa] = useState('');
  
  useEffect(() => {
    const q = query(referencia, orderBy("fecha"));

    return onSnapshot(q, qs => {
      setMensajes(
        qs.docs.reduce(
          (result, doc) => {
            result.push({
              id: doc.id,
              texto: doc.data().texto,
              autor: doc.data().autor,
              fecha: doc.data().fecha
            });
            return result;
          }, []
        )
      );
      setCargando(false);
    });
  }, [miMesa]);

  useEffect(() => {
    (async () => {
      if (soyMozo) {
        setMiMesa(null);
      }
      else {
        const docRef = doc(getFirestore(), 'usuarios', uid);
        const docSnap = await getDoc(docRef);
        const mesa = docSnap.data().mesa;
        setMiMesa(mesa);
      }
    })();
  }, []);

  function onChangeTextHandler(texto) {
    setTextoMensaje(texto);
  }

  async function onSendHandler() {
    if (textoMensaje != '') {
      setTextoMensaje('');

      const mensaje = {
        texto: textoMensaje,
        autor: soyMozo ? miEmail : miMesa,
        fecha: new Date()
      };
  
      await addDoc(referencia, mensaje);

      if (!soyMozo) {
        sendPushNotification().catch(
          console.log
        );
      }
    }
  }

  const sendPushNotification = async () => {
    const coleccion = collection(getFirestore(), 'usuarios');
    const consulta = query(coleccion, where('perfil', "==", 'mozo'));
    const querySnapshot = await getDocs(consulta);
    if (!querySnapshot.empty) {
      querySnapshot.docs.forEach(async doc => {
        if (doc.exists()) {
          console.log(`Token del mozo ${doc.data().correo}: ${doc.data().token}`);
          fetch('https://exp.host/--/api/v2/push/send', {
            body: JSON.stringify({
              to: doc.data().token,
              title: "Tienes un mensaje nuevo",
              body: `${miMesa}: ${textoMensaje}`,
              data: { action: "MENSAJE_NUEVO" }
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          });
        }
      });
    }
  }

  function formatDate(timestamp) {
    const fecha = timestamp.toDate();

    return moment(fecha).format('D/M k:mma')
  }

  function renderizarItem({item}) {
    if (soyMozo) {
      if (item.autor === miEmail) {
        return (
          <Mensaje
            texto={item.texto}
            fecha={formatDate(item.fecha)}
          />
        )
      }
  
      return (
        <Mensaje
          autor={item.autor}
          texto={item.texto}
          fecha={formatDate(item.fecha)}
        />
      );
    }
    else {
      if (item.autor === miMesa) {
        return (
          <Mensaje
            texto={item.texto}
            fecha={formatDate(item.fecha)}
          />
        )
      }
  
      return (
        <Mensaje
          autor={item.autor}
          texto={item.texto}
          fecha={formatDate(item.fecha)}
        />
      );
    }
  }

  if (cargando) {
    return <LoadingOverlay message={'Cargando mensajes...'} />
  }

  return (
    <View style={styles.rootContainer}>
      <View style={styles.listaContainer}>
        <FlatList
          data={mensajes}
          renderItem={renderizarItem}
          keyExtractor={item => item.id}
        >
        </FlatList>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={textoMensaje}
          onChangeText={onChangeTextHandler}
        />
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        onPress={onSendHandler}
      >
        <Ionicons name={"send-outline"} color={'white'} size={34} />
      </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: -10,
    padding: 10,
    marginRight: -5,
  },
  pressed: {
    opacity: 0.7,
  },
  rootContainer: {
    flex: 1
  },
  listaContainer: {
    flex: 1,
    paddingHorizontal: 5
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    minHeight: 50,
  },
  input: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 6,
    backgroundColor: 'white',
    borderRadius: 4,
    fontSize: 16,
    height: 40,
    borderColor: Colors.primary800,
    borderWidth: .5,
  },
});
