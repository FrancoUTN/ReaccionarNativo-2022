import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "../../constants/styles";

export default function PedidoMozo({ item }) {
    const [cargandoImagen, setCargandoImagen] = useState(true);

    let textoBoton = '';
    let botonApretable = false;
    switch(item.estado) {
        case 'a confirmar':
            textoBoton = 'Confirmar pedido';
            botonApretable = true;
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

    function onPressHandler() {
        let nuevosDatos = {};
        switch(item.estado) {
            case 'a confirmar':
                nuevosDatos = {
                    estado: 'confirmado'
                };
                break;
            case 'entregado':
                nuevosDatos = {
                    estado: 'abonado'
                };
                break;
        }
        const docRef = doc(getFirestore(), 'pedidos', item.id);
        updateDoc(docRef, nuevosDatos);
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
                    style={ [styles.pressable, {opacity: 0.6}] }
                >
                    <Text style={styles.textPressable}>
                        { textoBoton }
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
        fontFamily: 'Montserrat_500Medium',
        fontSize: 18,
        marginBottom: 5,
    },
    textDetallesContenido: {
        color: 'white',
        fontFamily: 'Montserrat_400Regular',
    },
    textImporte: {
        color: 'white',
        fontFamily: 'Montserrat_500Medium',
        fontSize: 16,
        marginTop: 20,
        textAlign: "right",
    },
    textMesa: {
        color: 'white',
        fontFamily: 'Montserrat_400Regular',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 5,
    },
    textPressable: {
        color: 'white',
        fontFamily: 'Montserrat_500Medium',
        fontSize: 16,
        textAlign: 'center',
    },
    absoluto: {
        position: 'absolute',
        top: '30%',
        left: '30%'
    },
});
