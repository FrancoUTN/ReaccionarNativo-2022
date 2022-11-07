import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  addDoc,
  collection,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import Camara from "../../components/altas/Camara";
import Button from "../../components/ui/Button";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import { Colors } from "../../constants/styles";
import Input from "../../components/Auth/Input";
import QrBase64 from "../../components/shared/QrBase64";
import Apretable from "../../components/shared/Apretable";

export default function AltaProductoScreen({ navigation, route }) {
  const esBebida = route.params.miPerfil == "bartender" ? true : false;
  const [qrEnBase64, setQrEnBase64] = useState();
  const [tomarFoto, setTomarFoto] = useState(false);
  const [tiempoPromedio, setTiempoPromedio] = useState("");
  const [precio, setPrecio] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fotos, setFotos] = useState([]);
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    nombre: false,
    descripcion: false,
    precio: false,
    tiempoPromedio: false,
    fotos: false,
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [idProducto, setIdProducto] = useState(null);
  const [docReference, setDocReference] = useState(false);

  useEffect(() => {
    (async () => {
      if (qrEnBase64) {
        await updateDoc(docReference, {
          qrEnBase64,
        });
      }
    })();
  }, [qrEnBase64]);

  async function agregar() {
    const arrayDeFotos = [];

    for (const [indice, foto] of fotos.entries()) {
      const nombreEnStorage = `productos/${nombre}_${indice + 1}.jpg`;
      const storageRef = ref(getStorage(), nombreEnStorage);
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Petición de red fallida."));
        };
        xhr.responseType = "blob";
        xhr.open("GET", foto.uri, true);
        xhr.send(null);
      });
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      arrayDeFotos.push(url);
    }

    const producto = {
      nombre,
      descripcion,
      tipo: esBebida ? "bebida" : "plato",
      precio: Number(precio),
      tiempoPromedio: Number(tiempoPromedio),
      fotos: arrayDeFotos,
    };

    const colRef = collection(getFirestore(), "productos");
    const docRef = await addDoc(colRef, producto);
    setDocReference(docRef);
    setIdProducto(docRef.id);
    return;
  }
  async function onSubmitHandler() {
    const nombreIsValid = nombre.trim().length >= 1;
    const descripcionIsValid = nombre.trim().length >= 1;
    const precioIsValid = Number(precio) > 0;
    const tiempoPromedioIsValid = Number(tiempoPromedio) > 0;
    const fotosIsValid = fotos[2];
    if (
      !nombreIsValid ||
      !descripcionIsValid ||
      !precioIsValid ||
      !tiempoPromedioIsValid ||
      !fotosIsValid
    ) {
      setCredentialsInvalid({
        nombre: !nombreIsValid,
        descripcion: !descripcionIsValid,
        precio: !precioIsValid,
        tiempoPromedio: !tiempoPromedioIsValid,
        fotos: !fotosIsValid,
      });
      return;
    }
    setIsAuthenticating(true);
    try {
      await agregar();
    } catch (error) {
      console.log(error);
      navigation.navigate({
        name: "Modal",
        params: { mensajeError: "Falló el registro. Intenta nuevamente" },
      });
      setIsAuthenticating(false);
    }
  }
  function fotoTomadaHandler(objetoFoto) {
    setTomarFoto(false);
    setFotos((fotosPrevias) => [...fotosPrevias, objetoFoto]);
  }
  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "nombre":
        setNombre(enteredValue);
        break;
      case "descripcion":
        setDescripcion(enteredValue);
        break;
      case "precio":
        setPrecio(enteredValue);
        break;
      case "tiempoPromedio":
        setTiempoPromedio(enteredValue);
        break;
    }
  }
  function volverHandler() {
    navigation.goBack();
  }
  const formulario = (
    <View style={styles.form}>
      <View>
        <Input
          label="Nombre"
          onUpdateValue={updateInputValueHandler.bind(this, "nombre")}
          value={nombre}
          isInvalid={credentialsInvalid.nombre}
        />
        <Input
          label="Descripción"
          onUpdateValue={updateInputValueHandler.bind(this, "descripcion")}
          value={descripcion}
          isInvalid={credentialsInvalid.descripcion}
        />
        <Input
          label="Tiempo (promedio) de elaboración"
          onUpdateValue={updateInputValueHandler.bind(this, "tiempoPromedio")}
          value={tiempoPromedio}
          keyboardType="numeric"
          isInvalid={credentialsInvalid.tiempoPromedio}
        />
        <Input
          label="Precio"
          onUpdateValue={updateInputValueHandler.bind(this, "precio")}
          value={precio}
          keyboardType="numeric"
          isInvalid={credentialsInvalid.precio}
        />
        <View style={styles.buttons}>
          <Button onPress={onSubmitHandler}>Agregar</Button>
        </View>
      </View>
    </View>
  );
  if (tomarFoto) {
    return <Camara fotoTomada={fotoTomadaHandler} />;
  }
  if (idProducto) {
    return (
      <View style={styles.container}>
        <View style={styles.mesaContainer}>
          <Text style={styles.textoMesa}>¡Producto añadido con éxito!</Text>
          <QrBase64 valor={idProducto} callback={setQrEnBase64} />
        </View>
        <Apretable onPress={volverHandler} fontSize={22}>
          Volver
        </Apretable>
      </View>
    );
  }
  if (isAuthenticating) {
    const cosa = esBebida ? "Agregando bebida..." : "Agregando plato...";
    return <LoadingOverlay message={cosa} />;
  }
  return (
    <ScrollView contentContainerStyle={styles.viewRaiz}>
      <View style={styles.fotoContainer}>
        <View style={styles.fotosContainer}>
          {fotos[0] && (
            <Image style={styles.imagen} source={{ uri: fotos[0].uri }} />
          )}
          {fotos[1] && (
            <Image style={styles.imagen} source={{ uri: fotos[1].uri }} />
          )}
          {fotos[2] && (
            <Image style={styles.imagen} source={{ uri: fotos[2].uri }} />
          )}
        </View>
        {credentialsInvalid.fotos && (
          <Text style={styles.fotoErrorText}>¡3 fotos requeridas!</Text>
        )}
      </View>
      <View style={styles.registrateContainer}>
        <Button onPress={() => setTomarFoto(true)}>
          {fotos[0] ? "Tomar otra foto" : "Tomar foto"}
        </Button>
      </View>
      <View style={styles.authContent}>{formulario}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  viewRaiz: {
    alignItems: "center",
  },
  authContent: {
    marginHorizontal: 32,
    padding: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary500,
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    marginBottom: 20,
  },
  buttons: {
    marginTop: 8,
  },
  registrateContainer: {
    margin: 20,
    padding: 10,
    borderRadius: 10,
    paddingHorizontal: 50,
  },
  imagen: {
    width: 100,
    height: 100,
  },
  fotoContainer: {
    backgroundColor: Colors.primary500,
    marginTop: 20,
    borderRadius: 4,
    heigth: 200,
  },
  fotosContainer: {
    flexDirection: "row",
    width: 300,
  },
  fotoErrorText: {
    fontSize: 20,
    margin: 30,
    color: Colors.error100,
    textAlign: "center",
  },
  qrContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary500,
    marginHorizontal: 100,
    marginVertical: 20,
    padding: 20,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    padding: 50,
  },
  mesaContainer: {
    flex: 4,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: Colors.primary500,
    borderRadius: 10,
    marginVertical: 50,
  },
  textoMesa: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
  },
});
