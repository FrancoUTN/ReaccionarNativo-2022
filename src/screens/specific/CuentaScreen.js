import { getAuth } from "firebase/auth";
import {
    collection,
    doc,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where
} from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import Escaner from "../../components/shared/Escaner";

import LoadingOverlay from "../../components/ui/LoadingOverlay";
import { Colors } from "../../constants/styles";

export default function CuentaScreen() {
    const miUid = getAuth().currentUser.uid;
    const [item, setItem] = useState();
    const [cargando, setCargando] = useState(true);
    const [cargandoImagen, setCargandoImagen] = useState(true);
    const [escanear, setEscanear] = useState(false);
    const [mensajeError, setMensajeError] = useState("");

    useEffect(() => {
        const coleccion = collection(getFirestore(), 'pedidos');
        const constraints = [where('idCliente', "==", miUid), orderBy('fecha', 'desc')];
        const consulta = query(coleccion, ...constraints);

        return onSnapshot(consulta, qs => {
            if (!qs.empty) {                    
                const pedidoTraido = {                  
                    id: qs.docs[0].id,
                    ...qs.docs[0].data()
                };
                setItem(pedidoTraido);
                setCargando(false);
            }
            else {
                console.log("Error: usuario sin pedidos.");
            }
        });
    }, []);


    function onPressHandler() {
        setMensajeError("");
        if (!item.porcentajePropina) {
            setEscanear(true);
        }
        else {
            const docPedidoRef = doc(getFirestore(), 'pedidos', item.id);
            updateDoc(docPedidoRef, { estado: 'cobrado' });
        }
    }

    async function onEscaneadoHandler({ data }) {
        setEscanear(false);
        setCargando(true);
        if (data.includes("propina")) {
            const numeroPropina = Number(data.replace('propina', ''));
            const docPedidoRef = doc(getFirestore(), 'pedidos', item.id);
            updateDoc(docPedidoRef, { porcentajePropina: numeroPropina });
        } else {
          setMensajeError("Qr inválido.");
        }
        setCargando(false);
    }
    
    function onCancelarHandler() {
        setEscanear(false);
    }

    // return 1:
    if (cargando) {
        return <LoadingOverlay message={"Cargando..."} />;
    }

    let textoBoton = '';
    let botonApretable = false;
    if (item) {
        if (item.porcentajePropina || item.porcentajePropina == 0) {
            if (item.estado == 'entregado') {
                textoBoton = 'Pagar';
                botonApretable = true;
            }
            else {
                textoBoton = '¡Gracias!'
            }
        }
        else {
            textoBoton = 'Agregar propina';
            botonApretable = true;
        }
    }

    // return 2:
    if (escanear) {
        return (
            <Escaner
                onEscaneado={onEscaneadoHandler}
                onCancelar={onCancelarHandler}
            />
        );
    }

    // return 3:
    return (
        <View style={styles.viewSuperadora}>
            <View style={styles.viewPrincipal}>
                <View style={styles.viewRow}>
                    <View>
                        <Image
                            style={styles.imageMesa}
                            source={ {uri: item.fotoMesa }}
                            onLoadEnd={ () => setCargandoImagen(false) }
                        />
                        {                        
                            cargandoImagen &&
                            <View style={styles.absoluto}>
                                <ActivityIndicator size="large" color="white" />
                            </View>
                        }
                        <Text style={styles.textMesa}>
                            { item.idMesa }
                        </Text>
                    </View>
                    <View style={styles.viewDerecho}>
                        <Text style={styles.textDetallesTitulo}>
                            Detalles
                        </Text>
                        {
                            item.metaProductos.map(
                                (metaProducto, index) => (
                                    <Text key={index} style={styles.textDetallesContenido}>
                                        { metaProducto.cantidad }x { metaProducto.producto.nombre }
                                    </Text>
                                )
                            )
                        }                  
                        <Text style={styles.textImporte}>
                            Total:  $ { item.importe }
                        </Text>
                    </View>
                </View>
                {
                    botonApretable ?
                    <Pressable
                        style={ ({pressed}) => [styles.pressable, pressed && {opacity: 0.7}] }
                        onPress={onPressHandler}
                    >
                        <Text style={styles.textPressable}>
                            { textoBoton }
                        </Text>
                    </Pressable>
                    :
                    <Pressable
                        style={[
                            styles.pressable,
                            {opacity: 0.6}
                        ]}
                    >
                        <Text style={styles.textPressable}>
                            { textoBoton }
                        </Text>
                    </Pressable>
                }
            </View>
            {!!mensajeError && (
                <Text style={styles.textoError}>Error: {mensajeError}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    textoError: {
      color: Colors.error500,
      fontSize: 20,
      textAlign: "center",
    },
    viewSuperadora: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    viewPrincipal: {
        backgroundColor: Colors.primary800,
        width: 300,
        // marginVertical: 20,
        borderRadius: 2,
        // overflow: 'hidden',
        flex: .8
    },
    viewRow: {
        flexDirection: 'row',
    },
    pressable: {
        backgroundColor: Colors.success,
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
    textDetallesTitulo: {
        color: 'white',
        fontWeight: '500',
        fontSize: 18,
        marginBottom: 5,
    },
    textDetallesContenido: {
        color: 'white',
    },
    textImporte: {
        color: 'white',
        fontWeight: '500',
        fontSize: 16,
        marginTop: 20,
        textAlign: "right",
    },
    textMesa: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 5,
    },
    textPressable: {
        color: 'white',
        fontWeight: '500',
        fontSize: 16,
        textAlign: 'center',
    },
    absoluto: {
        position: 'absolute',
        top: '30%',
        left: '30%'
    },
});
