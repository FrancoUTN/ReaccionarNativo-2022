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

import LoadingOverlay from "../../components/ui/LoadingOverlay";
import { Colors } from "../../constants/styles";

export default function EstadoPedidoScreen() {
    const miUid = getAuth().currentUser.uid;
    const [item, setItem] = useState();
    const [cargandoPedido, setCargandoPedido] = useState(true);
    const [cargandoImagen, setCargandoImagen] = useState(true);

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
                setCargandoPedido(false);
            }
            else {
                console.log("Error: usuario sin pedidos.");
            }
        });
    }, []);

    if (cargandoPedido) {
        return <LoadingOverlay message={'Cargando pedido...'} />;
    }

    function onPressHandler() {
        const docPedidoRef = doc(getFirestore(), 'pedidos', item.id);
        updateDoc(docPedidoRef, { estado: 'entregado' });
    }

    let textoBoton = '';
    let botonApretable = false;
    switch(item.estado) {
        case 'a confirmar':
            textoBoton = 'A confirmar';
            botonApretable = false;
            break;
        case 'rechazado':
            textoBoton = 'Rechazado';
            botonApretable = false;
            break;
        case 'confirmado':
            textoBoton = 'Confirmado';
            botonApretable = false;
            break;
        case 'en preparación':
            textoBoton = 'En preparación';
            botonApretable = false;
            break;
        case 'listo':
            textoBoton = 'Confirmar recepción';
            botonApretable = true;
            break;
        case 'entregado':
            textoBoton = 'Entregado';
            botonApretable = false;
            break;
        case "cobrado":
            textoBoton = "Cobrado";
            botonApretable = false;
            break;
        case 'abonado': // Igual, no debería llegar hasta acá. Se libera antes
            textoBoton = 'Pedido abonado';
            botonApretable = false;
    }

    return (
        <View style={styles.viewSuperadora}>
            <Text style={styles.tituloSuperior}>
                ¡Hola!
            </Text>
            <Text style={styles.textoSuperior}>
                Aquí podrás seguir el estado de tu pedido y confirmar su recepción cuando llegue a tu mesa.
            </Text>
            <Text style={styles.tituloSuperior}>
                Tu orden:
            </Text>
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
                        onPress={ onPressHandler }
                    >
                        <Text style={styles.textPressable}>
                            { textoBoton }
                        </Text>
                    </Pressable>
                    :
                    <Pressable
                        style={[
                            item.estado == 'rechazado' ? styles.pressableRojo : styles.pressable,
                            {opacity: 0.6}
                        ]}
                    >
                        <Text style={styles.textPressable}>
                            { textoBoton }
                        </Text>
                    </Pressable>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewSuperadora: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tituloSuperior: {
        color: Colors.primary800,
        fontSize: 48,
        textAlign: 'center',
    }, 
    textoSuperior: {
        color: Colors.primary800,
        fontSize: 22,
        textAlign: 'center',
        marginHorizontal: 30,
        marginVertical: 15
    },
    viewPrincipal: {
        backgroundColor: Colors.primary800,
        width: 300,
        marginVertical: 20,
        borderRadius: 10,
        overflow: 'hidden',
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
