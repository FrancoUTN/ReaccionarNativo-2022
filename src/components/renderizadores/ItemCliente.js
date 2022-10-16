import { useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { doc, getFirestore, updateDoc } from "firebase/firestore";

import { Colors } from "../../constants/styles";

export default function ItemCliente({ item }) {
    const [cargandoImagen, setCargandoImagen] = useState(true);

    function aceptar() {
        const db = getFirestore();
        const docRef = doc(db, 'usuarios', item.id);
        updateDoc(docRef, { perfil: 'registrado' });
    }
    
    function rechazar() {
        const db = getFirestore();
        const docRef = doc(db, 'usuarios', item.id);
        updateDoc(docRef, { perfil: 'rechazado' });        
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
                        onPress={aceptar}
                    >
                        <Ionicons
                            name='checkmark-circle'
                            size={42}
                            color='green'
                        />
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => ([styles.itemIcono, pressed && { opacity: 0.7 }])}
                        onPress={rechazar}
                    >
                        <Ionicons
                            name='close-circle'
                            size={42}
                            color='red'
                        />
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
        fontFamily: 'Montserrat_400Regular'
    },
    iconosContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    itemIcono: {
        marginHorizontal: 10
    },
});
