import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import LoadingOverlay from '../ui/LoadingOverlay';
import { Colors } from '../../constants/styles';


export default function Escaner({ onEscaneado, onCancelar }) {
    const [hasPermission, setHasPermission] = useState(null);

    useEffect(() => {
        (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <LoadingOverlay>Verificando permisos...</LoadingOverlay>;
    }
    if (hasPermission === false) {
        return <View> <Text>Sin acceso a la cámara.</Text> </View> ;
    }
    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={onEscaneado}
                style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.botonEscanerContainer}>
                <Pressable
                    onPress={onCancelar}
                    style={
                        ({pressed}) => {
                            return [styles.botonEscanerPressable , pressed && { opacity: 0.7 }]
                        }
                    }
                >
                    <Text style={styles.botonEscaner}>
                        Cancelar
                    </Text>
                </Pressable>
            </View>      
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    botonEscanerContainer: {
        flex: 0.25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botonEscanerPressable: {
        backgroundColor: Colors.error500,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 4,
    },
    botonEscaner: {
        color: 'white',
        fontFamily: 'Montserrat_400Regular',
        fontSize: 18,
    },
}); 