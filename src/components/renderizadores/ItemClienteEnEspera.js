import { useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { doc, getFirestore, updateDoc } from "firebase/firestore";

import { Colors } from "../../constants/styles";


export default function ItemClienteEnEspera({ item }) {
    const [cargandoImagen, setCargandoImagen] = useState(true);

    function asignarMesaHandler() {
        const db = getFirestore();
        const docRef = doc(db, 'usuarios', item.id);
        updateDoc(docRef, { estado: 'asignado' });
    }

    return (
        <View style={styles.itemContainer}>
            <Image
                style={styles.itemImagen}
                source={{ uri: item.foto }}
                onLoadEnd={() => setCargandoImagen(false)}
            />
            {
                cargandoImagen &&
                <View style={styles.absoluto}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            }
            <View style={styles.textoEIconosContainer}>
                <Text style={styles.itemTexto}>
                    { item.nombre }
                </Text>
                <View style={styles.iconosContainer}>
                    <Pressable
                        style={({ pressed }) => ([styles.itemIcono, pressed && { opacity: 0.7 }])}
                        onPress={asignarMesaHandler}
                    >
                        <Text style={styles.asignarTexto}>
                            Asignar mesa
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    absoluto: {
        position: 'absolute',
        left: '20%'
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 150,
        margin: 20,
        backgroundColor: Colors.primary800,
        borderRadius: 10
    },
    itemImagen: {
        width: 150,
        height: 150,
        borderRadius: 10
    },
    textoEIconosContainer: {
        height: '100%',
        flex: 1,
        justifyContent: 'space-evenly'
    },
    itemTexto: {
        color: 'white',
        fontSize: 18,
        marginHorizontal: 10,
        textAlign: 'center',
    },
    iconosContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    itemIcono: {
        marginHorizontal: 10,        
        backgroundColor: Colors.success,
        borderRadius: 10,
        padding: 10
    },
    asignarTexto: {
        color: 'white',
        fontWeight: '500',
    }
});
