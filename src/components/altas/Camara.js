import React, { useState, useEffect, useRef } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import IconButton from '../ui/IconButton';
import { Colors } from '../../constants/styles';

export default function Camara({ fotoTomada }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [vistaPrevia, setVistaPrevia] = useState(false);
    const [foto, setFoto] = useState();
    const camaraRef = useRef();

    useEffect(() => {
        (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
        })();
    }, []);

    function sacarFoto() {
        if (camaraRef) {
            camaraRef.current.takePictureAsync().then( foto => {
                setFoto(foto);
                setVistaPrevia(!vistaPrevia);
            });
        }
    }

    function cancelar() {
        setFoto(null);
        setVistaPrevia(!vistaPrevia);
    }
    
    function confirmar() {
        fotoTomada(foto);
    }

    if (hasPermission === null) {
        return <View/>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    if (!vistaPrevia) {
        return (
            <Camera
                style={styles.camera}
                ref={camara => camaraRef.current = camara}
            >
                <View style={styles.buttonContainer}>
                    <IconButton
                        icon='camera-outline'
                        color='white'
                        size={50}
                        onPress={sacarFoto}
                    />
                </View>
            </Camera>
        );
    }
    if (vistaPrevia) {
        return (
            <View
                style={styles.camera}
            >
                <ImageBackground
                    style={{
                        width: '100%',
                        height: '100%',
                        justifyContent: 'flex-end'
                    }}
                    source={{ uri: foto.uri }}
                >
                    <View
                        style={{
                            height: '20%',
                            flexDirection: 'row',
                            justifyContent: 'space-around'
                        }}
                    >
                        <IconButton
                            icon='close-circle-outline'
                            // color={Colores.errorOscuro}
                            color={Colors.cancelar}
                            size={60}
                            onPress={cancelar}
                        />
                        <IconButton
                            icon='checkmark-circle-outline'
                            color='#3EC300'
                            size={60}
                            onPress={confirmar}
                        />
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    camera: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    buttonContainer: {
        marginBottom: '8%',
        alignSelf: 'center'
    }
});
