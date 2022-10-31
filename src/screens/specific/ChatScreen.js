import { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, Text } from 'react-native';
import { addDoc, doc, getDoc, getFirestore, onSnapshot, orderBy, query } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import { Colors } from '../../constants/styles';
import IconButton from '../../components/ui/IconButton';

import referencia from '../../util/firestore';
import moment from 'moment';
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
  const [error, setError] = useState(false);
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
    if (textoMensaje.length > 21) {
      error || setError(true);
    }
    else if (textoMensaje != '') {
      setTextoMensaje('');
      error && setError(false);

      const mensaje = {
        texto: textoMensaje,
        autor: soyMozo ? miEmail : miMesa,
        fecha: new Date()
      };
  
      await addDoc(referencia, mensaje);
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
      <View style={styles.errorContainer}>
      {
        error &&
        <Text style={styles.error}>
          Error: 21 caracteres máximo.
        </Text>
      }
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={textoMensaje}
          onChangeText={onChangeTextHandler}
        />
        <IconButton
          icon="send"
          color={'white'}
          size={30}
          onPress={onSendHandler}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1
  },
  listaContainer: {
    flex: 7,
    padding: 5
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
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
  },
  errorContainer: {
    // minHeight: 15,
  },
  error: {
    color: Colors.error500,
    marginBottom: 4,
    fontFamily: 'Montserrat_400Regular',
    textAlign: 'center'
  }
});
