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
import { Pressable, StyleSheet, Text, View } from "react-native";
import Escaner from "../../components/shared/Escaner";

import LoadingOverlay from "../../components/ui/LoadingOverlay";
import { Colors } from "../../constants/styles";

export default function CuentaScreen() {
    const miUid = getAuth().currentUser.uid;
    const [item, setItem] = useState();
    const [cargando, setCargando] = useState(true);
    const [escanear, setEscanear] = useState(false);
    const [mensajeError, setMensajeError] = useState("");
    const [hayPropina, setHayPropina] = useState(false);

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
                if (pedidoTraido.porcentajePropina || pedidoTraido.porcentajePropina == 0) {
                    setHayPropina(true);
                }
                setCargando(false);
            }
            else {
                console.log("Error: usuario sin pedidos.");
            }
        });
    }, []);


    function onPressHandler() {
        setMensajeError("");
        if (hayPropina) {
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
        if (hayPropina) {
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
        <View style={styles.viewPrincipal}>
            <View style={styles.viewCuentaYBoton}>
                <View style={styles.viewTitulo}>
                    <Text style={styles.textoTitulo}>
                        Reaccionar Nativo
                    </Text>
                </View>
                <View style={styles.viewCuenta}>
                    <View style={styles.viewRow}>
                        <View style={[styles.viewProducto, styles.viewCelda]}>
                            <Text style={[styles.textoEncabezado, styles.textoCelda]}>
                                Producto(s)
                            </Text>
                        </View>
                        <View style={[styles.viewPrecioUnitario, styles.viewCelda]}>
                            <Text style={[styles.textoEncabezado, styles.textoCelda]}>
                                Precio
                            </Text>
                            {/* <Text style={styles.textoEncabezado}>
                                unitario
                            </Text> */}
                        </View>
                        <View style={[styles.viewSuma, styles.viewCelda]}>
                            <Text style={[styles.textoEncabezado, styles.textoCelda]}>
                                Suma
                            </Text>
                        </View>
                    </View>
                    {
                        item.metaProductos.map((metaProducto, index) => (
                            <View key={index} style={styles.viewRow}>
                                <View style={[styles.viewProducto, styles.viewCelda]}>
                                    <Text style={[styles.textoDato, styles.textoCelda]}>
                                        {`${metaProducto.cantidad}x ${metaProducto.producto.nombre}`}
                                    </Text>
                                </View>
                                <View style={[styles.viewPrecioUnitario, styles.viewCelda]}>
                                    <Text style={[styles.textoDato, styles.textoCelda]}>
                                        ${metaProducto.producto.precio}
                                    </Text>
                                </View>
                                <View style={[styles.viewSuma, styles.viewCelda]}>
                                    <Text style={[styles.textoDato, styles.textoCelda]}>
                                        $
                                        {
                                            metaProducto.producto.precio *
                                            metaProducto.cantidad
                                        }
                                    </Text>
                                </View>
                            </View>
                        ))
                    }
                </View>
                {
                    hayPropina ?
                    <>
                        <View style={styles.viewTotales}>
                            <View style={styles.viewTotalesDescripcion}>
                                <Text style={styles.textoSubtotales}>
                                    Subtotal:
                                </Text>
                            </View>
                            <View style={styles.viewSuma}>
                                <Text style={styles.textoSubtotales}>
                                    ${item.importe}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.viewTotales}>
                            <View style={styles.viewTotalesDescripcion}>
                                <Text style={styles.textoSubtotales}>
                                    Propina del
                                    {item.porcentajePropina}%
                                    (¡Muy buenoo!):
                                </Text>
                            </View>
                            <View style={styles.viewSuma}>
                                <Text style={styles.textoSubtotales}>
                                    ${item.importe * item.porcentajePropina / 100}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.viewTotal}>
                            <Text style={styles.textoTotal}>
                                TOTAL: $
                                {
                                    item.importe + 
                                    (item.importe * item.porcentajePropina / 100)
                                }
                            </Text>
                        </View>
                    </>
                    :
                    <View style={styles.viewTotal}>
                        <Text style={styles.textoTotal}>
                            TOTAL: ${item.importe}
                        </Text>
                    </View>
                }
                <View style={styles.viewBoton}>
                    <Pressable>
                        <Text style={styles.textoBoton}>
                            Pagar
                        </Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.viewMensaje}>
                <Text style={styles.textoMensaje}>
                    Error: Qr inválido
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewPrincipal: {
        flex: 1,
        padding: 40,
    },
    viewCuentaYBoton: {
        flex: 9,
        backgroundColor: Colors.primary800,
        borderRadius: 2,
        padding: 10
    },
    viewTitulo: {
        flex: 1,
    },
    viewCuenta: {
        flex: 4,
    },
    viewBoton: {
        flex: 1,
    },
    viewMensaje: {
        flex: 1,
    },
    viewRow: {
        flexDirection: 'row',
    },
    viewProducto: {
        width: '50%'
    },
    viewPrecioUnitario: {
        width: '25%'
    },
    viewSuma: {
        width: '25%'
    },
    viewCelda: {
        padding: 2,
        justifyContent: 'center',
    },
    viewTotales: {
        flexDirection: 'row',
        padding: 2,
    },
    viewTotalesDescripcion: {

    },
    viewTotal: {
        
    },
    textoTitulo: {
        color: 'white',
        fontSize: 30,
        textAlign: 'center',
    },
    textoEncabezado: {
        fontWeight: 'bold',
    },
    textoDato: {
        fontWeight: "300",
    },
    textoCelda: {
        color: 'white',
        textAlign: "right",
    },
    textoSubtotales: {
        color: 'white',
        textAlign: "right",
        // borderColor: 'green',
        // borderWidth: .5
    },
    textoTotal: {
        color: 'white',
        textAlign: "right",
        fontWeight: "500",
        fontSize: 26,
    },
    textoBoton: {
        color: 'white',
    },
    textoMensaje: {
        color: Colors.error500,
    }
});
