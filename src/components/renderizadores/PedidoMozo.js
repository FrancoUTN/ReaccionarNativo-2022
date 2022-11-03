import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "../../constants/styles";

export default function PedidoMozo({ item }) {
    const [cargandoImagen, setCargandoImagen] = useState(true);

    let textoBoton = '';
    let botonApretable = false;
    let puedoRechazar = false;
    switch(item.estado) {
        case 'a confirmar':
            textoBoton = 'Confirmar pedido';
            botonApretable = true;
            puedoRechazar = true;
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
            textoBoton = 'Listo para servir';
            botonApretable = false;
            break;
        case 'entregado':
            textoBoton = 'Confirmar el pago';
            botonApretable = true;
            break;
        case 'abonado':
            textoBoton = 'Pedido abonado';
            botonApretable = false;
    }
    
    async function onPressHandler() {
        let nuevosDatosPedido = {};
        switch(item.estado) {
            case 'a confirmar':
                nuevosDatosPedido = {
                    estado: 'confirmado'
                };
                break;
            case 'entregado':
                nuevosDatosPedido = {
                    estado: 'abonado'
                };
                nuevosDatosUsuario = {
                    estado: 'libre'
                };
                break;
        }
        const docPedidoRef = doc(getFirestore(), 'pedidos', item.id);
        updateDoc(docPedidoRef, nuevosDatosPedido);
        const docUsuarioRef = doc(getFirestore(), 'usuarios', item.idCliente);
        updateDoc(docUsuarioRef, nuevosDatosUsuario);

        // Libero mesa también
        const docUsuario = await getDoc(docUsuarioRef);
        const mesa = docUsuario.data().mesa;
        if (mesa) {
            const docMesaRef = doc(getFirestore(), 'mesas', mesa);
            updateDoc(docMesaRef, { cliente: '' });
        }
    }

    function onRechazarPressHandler() {
        const nuevosDatosPedido = {
            estado: 'rechazado'
        };
        const docPedidoRef = doc(getFirestore(), 'pedidos', item.id);
        updateDoc(docPedidoRef, nuevosDatosPedido);
    }

    return (
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
            {
                puedoRechazar &&
                <Pressable
                    style={ ({pressed}) => (
                        [styles.pressableRojo, {marginTop: 5}, pressed && {opacity: 0.7}]
                    )}
                    onPress={ onRechazarPressHandler }
                >
                    <Text style={styles.textPressable}>
                        Rechazar pedido
                    </Text>
                </Pressable>
            }
        </View>
    );
}

const styles = StyleSheet.create({
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
