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

const ModificarProducto = ({ navigation, route }) => {
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

  return (
    <View style={{ flex: 1 }}>
      <Text>ModificarProducto</Text>
    </View>
  );
};
