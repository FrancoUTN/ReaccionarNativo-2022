import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  updateDoc,
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";

import { Colors } from "../../constants/styles";
import Apretable from "../../components/shared/Apretable";
import Escaner from "../../components/shared/Escaner";
import LoadingOverlay from "../../components/ui/LoadingOverlay";

export default function BotonEscanearScreen({ navigation }) {
  const usuario = getAuth().currentUser;
  const uid = usuario.uid;
  const db = getFirestore();
  const userRef = doc(db, "usuarios/" + uid);
  const [escanear, setEscanear] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeOk, setMensajeOk] = useState("");
  const [qrIngresoEscaneado, setQrIngresoEscaneado] = useState(false);
  const [usersMetre, setUsersMetres] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const q = query(collection(db, "usuarios"));
    return onSnapshot(q, (qs) => {
      const usuariosTraidos = [];
      qs.forEach((documento) => {
        const objeto = {
          ...documento.data(),
        };
        usuariosTraidos.push(objeto);
      });

      setUsersMetres(
        usuariosTraidos.filter((user) => {
          return user.perfil === "metre";
        })
      );
    });
  }, []);

  const sendPushNotification = async (token, title, body, data) => {
    return fetch("https://exp.host/--/api/v2/push/send", {
      body: JSON.stringify({
        to: token,
        title: title,
        body: body,
        data: data,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  };

  const enviarPushMetres = async () => {
    usersMetre.forEach(async (metre) => {
      metre.token &&
        (await sendPushNotification(
          metre.token,
          " ❗️❗️ Un cliente ha solicitado una mesa ❗️❗️ ",
          `El cliente ${usuario.email} ha solicitado una mesa.`,
          { data: "" }
        ));
    });
  };

  async function onEscaneadoHandler({ data }) {
    setEscanear(false);
    setCargando(true);
    const userSnap = await getDoc(userRef);
    const miEstado = userSnap.data().estado;
    if (data == "ingreso") {
      setQrIngresoEscaneado(true);
    } else if (data.includes("mesa")) {
      await escaneoMesa(data, miEstado);
    } else {
      setMensajeError("Qr inválido.");
    }
    setCargando(false);
  }

  async function onSolicitarMesaPressHandler() {
    setCargando(true);
    const userSnap = await getDoc(userRef);
    const miEstado = userSnap.data().estado;
    if (miEstado == "libre") {
      await actualizarEstado();
      await enviarPushMetres();
      //enviar push a los metres
      setMensajeOk("¡Ahora estás en la lista de espera!");
    } else {
      setMensajeError("Usted ya está " + miEstado + ".");
    }
    setQrIngresoEscaneado(false);
    setCargando(false);
  }

  function onVerEncuestasPressHandler() {
    navigation.navigate({ name: "EstadisticaEncuestas" });
  }

  function onCancelarHandler() {
    setEscanear(false);
  }

  async function actualizarEstado() {
    await updateDoc(userRef, { estado: "en espera" });
    return;
  }

  async function escaneoMesa(mesa, miEstado) {
    if (miEstado == "libre") {
      setMensajeError("Debe anotarse a la lista de espera.");
    } else if (miEstado == "en espera") {
      setMensajeError("Aún no ha sido asignado a una mesa.");
    } else {
      const mesaRef = doc(db, "mesas/" + mesa);
      const mesaSnap = await getDoc(mesaRef);
      const clienteAsociado = mesaSnap.data().cliente;
      if (clienteAsociado == uid) {
        navigation.navigate({
          name: "Cliente",
        });
      } else if (miEstado == "vinculado") {
        setMensajeError("Usted ya está en otra mesa.");
      } else if (!!clienteAsociado) {
        setMensajeError("Mesa ocupada.");
      } else {
        await updateDoc(userRef, {
          mesa,
          estado: "vinculado",
        });
        await updateDoc(mesaRef, { cliente: uid });
        navigation.navigate({
          name: "Cliente",
        });
      }
    }
  }

  if (cargando) {
    return <LoadingOverlay message={"Cargando..."} />;
  }
  if (escanear) {
    return (
      <Escaner
        onEscaneado={onEscaneadoHandler}
        onCancelar={onCancelarHandler}
      />
    );
  }
  if (qrIngresoEscaneado) {
    return (
      <View style={styles.container}>
        <Apretable onPress={onVerEncuestasPressHandler}>
          Ver encuestas
        </Apretable>
        <Apretable onPress={onSolicitarMesaPressHandler}>
          Solicitar una mesa
        </Apretable>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.boton, pressed && styles.apretado]}
        onPress={() => {
          setEscanear(true);
          setMensajeError("");
          setMensajeOk("");
        }}
      >
        <Text style={styles.textoBoton}>Escanear QR</Text>
      </Pressable>
      {!!mensajeError && (
        <Text style={styles.textoError}>Error: {mensajeError}</Text>
      )}
      {!!mensajeOk && <Text style={styles.textoOk}>{mensajeOk}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  boton: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary800,
    margin: 40,
    marginVertical: 80,
    borderRadius: 20,
  },
  apretado: {
    opacity: 0.7,
  },
  textoBoton: {
    color: "white",
    fontSize: 36,
  },
  textoError: {
    color: Colors.error500,
    fontSize: 20,
    textAlign: "center",
  },
  textoOk: {
    color: Colors.success,
    fontSize: 20,
    textAlign: "center",
  },
});
