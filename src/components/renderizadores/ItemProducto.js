import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';

import { Colors } from "../../constants/styles";

export default function ItemProducto({ item, onCantidadModificada }) {
    const [cargandoImagen, setCargandoImagen] = useState(true);
    const [cantidad, setCantidad] = useState(0);

    useEffect(
        () => onCantidadModificada(item.id, cantidad)
    , [cantidad]);

    function aumentar() {
        setCantidad(
            cantidadPrevia => cantidadPrevia + 1
        );
    }
    
    function disminuir() {
        if (cantidad === 0) {
            // Nada
        } else {
            setCantidad(
                cantidadPrevia => cantidadPrevia - 1
            );
        }
    }

    return (
        <View style={styles.viewRaiz}>
            <View style={styles.viewFotos}>
                <Image
                    style={styles.image}
                    source={{ uri: item.fotos[0] }}
                    onLoadEnd={() => setCargandoImagen(false)}
                />
                <Image
                    style={styles.image}
                    source={{ uri: item.fotos[1] }}
                    onLoadEnd={() => setCargandoImagen(false)}
                />
                <Image
                    style={styles.image}
                    source={{ uri: item.fotos[2] }}
                    onLoadEnd={() => setCargandoImagen(false)}
                />
            </View>
            {
            cargandoImagen &&
            <View style={styles.absoluto}>
                <ActivityIndicator size="large" color="white" />
            </View>
            }
            <View style={styles.viewDatos}>
                <View style={styles.viewIzquierda}>
                    <Text style={styles.textNombre}>
                        { item.nombre }
                    </Text>
                    <Text style={styles.textDescripcion}>
                        {
                            item.descripcion
                        }
                    </Text>
                </View>
                <View style={styles.viewDerecha}>
                    <View style={styles.viewRow}>
                        <Text style={styles.textPrecioYTiempo}>
                            {
                                '$ ' +
                                item.precio
                                // + ',00'
                                + '  |  '
                            }
                        </Text>
                        <Ionicons
                            name="time-outline"
                            color='white'
                        />
                        <Text style={styles.textPrecioYTiempo}>
                            { ' ' + item.tiempoPromedio }'
                        </Text>
                    </View>
                    <View style={styles.viewOpciones}>
                        <Pressable
                            style={({ pressed }) => ([styles.itemIcono, pressed && { opacity: 0.7 }])}
                            onPress={disminuir}
                        >
                            <Ionicons
                                name='remove-circle'
                                size={42}
                                color='red'
                            />
                        </Pressable>
                        <View style={styles.viewCantidad}>
                            <Text style={styles.textCantidad}>
                                {
                                    cantidad
                                }
                            </Text>
                        </View>
                        <Pressable
                            style={({ pressed }) => ([styles.itemIcono, pressed && { opacity: 0.7 }])}
                            onPress={aumentar}
                        >
                            <Ionicons
                                name='add-circle'
                                size={42}
                                color='green'
                            />
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewRaiz: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.primary800,
        width: 300,
        marginVertical: 10,
        borderRadius: 10
    },
    viewFotos: {
        flex: 1,
        flexDirection: 'row'
    },
    image: {
        width: 100,
        height: 100
    },
    viewDatos: {
        flex: 1,
        flexDirection: 'row',
        padding: 10
    },
    textNombre: {
        color: 'white',
        fontFamily: 'Montserrat_500Medium',
        fontSize: 18,
        marginBottom: 5
    },
    textDescripcion: {
        color: 'white',
        fontFamily: 'Montserrat_300Light_Italic',
        fontSize: 12
    },
    textPrecioYTiempo: {
        color: 'white',
        fontFamily: 'Montserrat_400Regular',
        fontSize: 16
    },
    viewIzquierda: {
        flex: 1,
        padding: 10
    },
    viewDerecha: {
        flex: 1,
        padding: 10
    },
    viewRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    viewCantidad: {
        width: 30,
        backgroundColor: 'white',
        borderRadius: 5
    },
    textCantidad: {
        color: 'white',
        fontFamily: 'Montserrat_500Medium',
        textAlign: 'center',
        fontSize: 20,
        color: Colors.primary800,
    },
    viewOpciones: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
        padding: 5
    },
    absoluto: {
        position: 'absolute',
        top: '20%',
        left: '50%'
    },
});
