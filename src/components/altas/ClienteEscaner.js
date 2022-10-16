import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import LoadingOverlay from '../ui/LoadingOverlay';


export default function ClienteEscaner({ dniEscaneado }) {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    const vectorDatos = data.split('@');
    
    const dni = vectorDatos[4];
    const numerosCuil = vectorDatos[8];
    const principioCuil = numerosCuil.substring(0, 2);
    const finalCuil = numerosCuil.substring(2, 3);
    const cuil = `${principioCuil}-${dni}-${finalCuil}`;

    const datos = {
        nombre: vectorDatos[2],
        apellido: vectorDatos[1],
        dni,
        cuil
    };

    dniEscaneado(datos);
  };

  if (hasPermission === null) {
    return <LoadingOverlay>Verificando permisos...</LoadingOverlay>;
  }
  if (hasPermission === false) {
    return <Text>Sin acceso a la cámara.</Text>;
  }

  return (
    <View style={styles.container}>
        <BarCodeScanner
            // onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            onBarCodeScanned={handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
            // style={styles.escaner}
        />
        {/* <View style={styles.botonEscanerContainer}>
            <Pressable
                onPress={cancelarEscanearPressHandler}
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
        </View>       */}
    </View>
  );
}

const styles = StyleSheet.create({
  escanerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,

    backgroundColor: 'black',
  },
  escaner: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,

    zIndex: 1,
  },
  botonEscanerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  botonEscanerPressable: {
    flex: 1,
    zIndex: 2,
    // backgroundColor: Colors.primary500,
  },
  botonEscaner: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,

    fontFamily: 'Monda_400Regular',
    zIndex: 3,
    color: 'white',
    textAlign: 'center',
    fontSize: 22
  },
  container: {
    flex: 1,
    justifyContent: 'space-around',
    // padding: 30
  },
  scannerContainer: {
    flex: 0.5
  }
}); 