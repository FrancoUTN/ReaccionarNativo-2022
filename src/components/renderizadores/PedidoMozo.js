import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  doc,
  getDoc,
  getFirestore,
  updateDoc,
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";

import { Colors } from "../../constants/styles";

export default function PedidoMozo({ item }) {
  const [cargandoImagen, setCargandoImagen] = useState(true);
  const [usersCocina, setUsersCocina] = useState([]);
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
      setUsersCocina(
        usuariosTraidos.filter((user) => {
          return user.perfil === "bartender" || user.perfil === "cocinero";
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

  const enviarPushCocina = async () => {
    usersCocina.forEach(async (metre) => {
      metre.token &&
        (await sendPushNotification(
          metre.token,
          " ❗️❗️ Nuevo pedido confirmado ❗️❗️ ",
          "Tienes un nuevo pedido pendiente de elaboración.",
          { action: "PEDIDO_NUEVO" }
        ));
    });
  };
  let textoBoton = "";
  let botonApretable = false;
  let puedoRechazar = false;
  switch (item.estado) {
    case "a confirmar":
      textoBoton = "Confirmar pedido";
      botonApretable = true;
      puedoRechazar = true;
      break;
    case "rechazado":
      textoBoton = "Rechazado";
      botonApretable = false;
      break;
    case "confirmado":
      textoBoton = "Confirmado";
      botonApretable = false;
      break;
    case "en preparación":
      textoBoton = "En preparación";
      botonApretable = false;
      break;
    case "listo":
      textoBoton = "Listo para servir";
      botonApretable = false;
      break;
    case "entregado":
      textoBoton = "¡Entregado!";
      botonApretable = false;
      break;
    case "cobrado":
      textoBoton = "Confirmar el pago";
      botonApretable = true;
      break;
    case "abonado":
      textoBoton = "Pedido abonado";
      botonApretable = false;
  }

  async function onPressHandler() {
    const docPedidoRef = doc(getFirestore(), "pedidos", item.id);
    let nuevosDatosPedido = {};
    switch (item.estado) {
      case "a confirmar":
        nuevosDatosPedido = {
          estado: "confirmado",
        };
        enviarPushCocina();
        break;
      case "cobrado":
        const docUsuarioRef = doc(getFirestore(), "usuarios", item.idCliente);

        // Libero la mesa ANTES:
        const docUsuario = await getDoc(docUsuarioRef);
        updateDoc(doc(getFirestore(), "mesas", docUsuario.data().mesa), {
          cliente: "",
        });

        // Y luego, dejo al usuario sin mesa:
        const nuevosDatosUsuario = {
          estado: "libre",
          encuestado: false,
          mesa: "",
        };
        updateDoc(docUsuarioRef, nuevosDatosUsuario);

        nuevosDatosPedido = {
          estado: "abonado",
        };
        break;
    }
    updateDoc(docPedidoRef, nuevosDatosPedido);
  }

  function onRechazarPressHandler() {
    const nuevosDatosPedido = {
      estado: "rechazado",
    };
    const docPedidoRef = doc(getFirestore(), "pedidos", item.id);
    updateDoc(docPedidoRef, nuevosDatosPedido);
  }

  return (
    <View style={styles.viewPrincipal}>
      <View style={styles.viewRow}>
        <View>
          <Image
            style={styles.imageMesa}
            source={{ uri: item.fotoMesa }}
            onLoadEnd={() => setCargandoImagen(false)}
          />
          {cargandoImagen && (
            <View style={styles.absoluto}>
              <ActivityIndicator size="large" color="white" />
            </View>
          )}
          <Text style={styles.textMesa}>{item.idMesa}</Text>
        </View>
        <View style={styles.viewDerecho}>
          <Text style={styles.textDetallesTitulo}>Detalles</Text>
          {item.metaProductos.map((metaProducto, index) => (
            <Text key={index} style={styles.textDetallesContenido}>
              {metaProducto.cantidad}x {metaProducto.producto.nombre}
            </Text>
          ))}
          <View style={styles.viewTotales}>
            {
              item.porcentajePropina ? // Ignoro propina del 0% a propósito
              <>
                <Text style={styles.textImporte}>
                    Subtotal: ${item.importe}
                </Text>
                <Text style={styles.textImporte}>                                        
                  {
                    `Propina (${item.porcentajePropina}%): $` +
                    Math.round(item.importe * item.porcentajePropina / 100)
                  }
                </Text>
                <Text style={styles.textTotal}>
                    TOTAL: $
                    {
                      Math.round(
                        item.importe + 
                        (item.importe * item.porcentajePropina / 100)
                      )
                    }
                </Text>
              </>
              :
              <Text style={styles.textTotal}>
                  TOTAL: ${item.importe}
              </Text>
            }
          </View>
        </View>
      </View>
      {botonApretable ? (
        <Pressable
          style={({ pressed }) => [
            styles.pressable,
            pressed && { opacity: 0.7 },
          ]}
          onPress={onPressHandler}
        >
          <Text style={styles.textPressable}>{textoBoton}</Text>
        </Pressable>
      ) : (
        <Pressable
          style={[
            item.estado == "rechazado"
              ? styles.pressableRojo
              : styles.pressable,
            { opacity: 0.6 },
          ]}
        >
          <Text style={styles.textPressable}>{textoBoton}</Text>
        </Pressable>
      )}
      {puedoRechazar && (
        <Pressable
          style={({ pressed }) => [
            styles.pressableRojo,
            { marginTop: 5 },
            pressed && { opacity: 0.7 },
          ]}
          onPress={onRechazarPressHandler}
        >
          <Text style={styles.textPressable}>Rechazar pedido</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  viewPrincipal: {
    backgroundColor: Colors.primary800,
    width: 300,
    marginVertical: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  viewRow: {
    flexDirection: "row",
  },
  pressable: {
    backgroundColor: Colors.success,
    padding: 10,
    margin: 20,
    marginBottom: 15,
    borderRadius: 4,
  },
  pressableRojo: {
    backgroundColor: Colors.error500,
    padding: 10,
    margin: 20,
    marginBottom: 15,
    borderRadius: 4,
  },
  imageMesa: {
    width: 120,
    height: 120,
  },
  viewDerecho: {
    flex: 1,
    padding: 10,
  },
  viewTotales: {
    marginTop: 20,
  },
  textDetallesTitulo: {
    color: "white",
    fontWeight: "500",
    fontSize: 18,
    marginBottom: 5,
  },
  textDetallesContenido: {
    color: "white",
  },
  textImporte: {
    color: "white",
    fontWeight: "300",
    fontSize: 14,
    textAlign: "right",
  },
  textTotal: {
    color: "white",
    fontWeight: "500",
    fontSize: 18,
    textAlign: "right",
  },
  textMesa: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
  },
  textPressable: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
    textAlign: "center",
  },
  absoluto: {
    position: "absolute",
    top: "30%",
    left: "30%",
  },
});
