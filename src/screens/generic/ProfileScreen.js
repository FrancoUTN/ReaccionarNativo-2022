import { useEffect, useContext, useState } from 'react';
import { StyleSheet, View, Image, ActivityIndicator, Text } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { doc, getFirestore, getDoc, updateDoc } from 'firebase/firestore';
import { Colors } from '../../constants/styles';
import { AuthContext } from "../../store/auth-context";
import Button from '../../components/ui/Button';
import Camara from '../../components/altas/Camara';

export default function ProfileScreen() {

  const authCtx = useContext(AuthContext);
  const [cargandoImagen, setCargandoImagen] = useState(true);
  const [tomarFoto, setTomarFoto] = useState(false);
  const [userDB, setUserDB] = useState(null);
  const uid = getAuth().currentUser.uid;
  const email = getAuth().currentUser.email;

  useEffect(() => {
    if (!authCtx.foto) {
      setCargandoImagen(false);
    }
    cargarUser();
  }, []);

  const cargarUser = async () => {
    const docRef = doc(getFirestore(), "usuarios", uid);
    const docSnap = await getDoc(docRef);
    setUserDB(docSnap.data());
  }
  if (tomarFoto) {
    return (
      <Camara
        fotoTomada={fotoTomadaHandler}
      />
    )
  }

  async function fotoTomadaHandler(objetoFoto) {
    const nombreEnStorage = `usuarios/${email}.jpg`;
    const storageRef = ref(getStorage(), nombreEnStorage);
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log("Error al cargar imagen: " + e);
        reject(new TypeError("Petición de red fallida."));
      };
      xhr.responseType = "blob";
      xhr.open("GET", objetoFoto.uri, true);
      xhr.send(null);
    });
    await uploadBytes(storageRef, blob);
    setCargandoImagen(true);
    const url = await getDownloadURL(storageRef);
    setTomarFoto(false);
    const docUsuarioRef = doc(getFirestore(), "usuarios", uid);
    updateDoc(docUsuarioRef, { foto: url });
    authCtx.authenticate(email, authCtx.perfil, uid, url)
  }

  return (
    <>

      <View style={styles.container}>
        {!authCtx.foto && (authCtx.perfil == "bartender" || authCtx.perfil == "metre" || authCtx.perfil == "cocinero" || authCtx.perfil == "mozo") && <View style={styles.registrateContainer}>
          <Button onPress={() => setTomarFoto(true)}>
            Tomar foto
          </Button>
        </View>}
        {authCtx.foto && <Image
          style={styles.avatarStyle}
          source={{ uri: authCtx.foto }}
          onLoadEnd={() => setCargandoImagen(false)}
        />}
        {
          cargandoImagen &&
          <View style={styles.absoluto}>
            <ActivityIndicator size="large" color="white" />
          </View>
        }

      </View>
      {userDB && userDB.nombre && <Text style={styles.textBoxStyle}> Nombre: {userDB.nombre} </Text>}
      {userDB && userDB.apellido && <Text style={styles.textBoxStyle}> Apellido: {userDB.apellido} </Text>}
      {userDB && userDB.dni && <Text style={styles.textBoxStyle}> DNI: {userDB.dni} </Text>}
      {userDB && userDB.perfil && userDB.perfil != "registrado" && userDB.perfil != "pendiente" && <Text style={styles.textBoxStyle}> Perfil: {userDB.perfil} </Text>}
      {email && <Text style={styles.textBoxStyle}> Correo: {email} </Text>}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    alignItems: 'center'
  },
  absoluto: {
    position: 'absolute',
    alignSelf: 'center',
    top: 20
  },
  imagen: {
    height: 150,
    width: 150
  },
  avatarStyle: {
    height: 150,
    width: 150,
    borderRadius: 100,
    borderColor: Colors.primary800,
    borderWidth: 5,
    marginBottom: 15
  },
  registrateContainer: {
    margin: 20,
    padding: 10,
    borderRadius: 10,
    paddingHorizontal: 50,
    marginBottom: 15
  },
  textBoxStyle: {
    borderWidth: 2,
    borderColor: Colors.primary800,
    margin: 10,
    fontSize: 24,
    borderRadius: 10
  }
});