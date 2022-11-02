import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "../../constants/styles";
import { AuthContext } from "../../store/auth-context";
import Input from "../Auth/Input";

export default function PedidoPreparador({ item }) {
    const miPerfil = useContext(AuthContext).perfil;
    const miTipo = miPerfil == 'cocinero' ? 'plato' : 'bebida';
    const [cargandoImagen, setCargandoImagen] = useState(true);
    const [demoraEstimadaTextual, setDemoraEstimadaTextual] = useState('');
    const [demoraIsInvalid, setDemoraIsInvalid] = useState(false);
    const [funcionDelBoton, setFuncionDelBoton] = useState('');

    useEffect(
        () => {
            if (item.contenido == 'mixto') {
                if (miPerfil == 'cocinero') {
                    if (item.demoraRealPlatos) {
                        setFuncionDelBoton('finalizado');
                    }
                    else {
                        if (item.demoraEstimadaPlatos) {
                            setFuncionDelBoton('finalizarPlatos');
                        }
                        else {
                            setFuncionDelBoton('tomarPlatos');
                        }
                    }
                }
                else {
                    if (item.demoraRealBebidas) {
                        setFuncionDelBoton('finalizado');
                    }
                    else {
                        if (item.demoraEstimadaBebidas) {
                            setFuncionDelBoton('finalizarBebidas');
                        }
                        else {
                            setFuncionDelBoton('tomarBebidas');
                        }
                    }
                }
            }
            else {
                if (item.demoraRealUnivoco) {
                    setFuncionDelBoton('finalizado');
                }
                else {
                    if (item.demoraEstimadaUnivoco) {
                        setFuncionDelBoton('finalizarUnivoco');
                    }
                    else {
                        setFuncionDelBoton('tomarUnivoco');
                    }
                }
            }
        },
    [item]);

    function onTomarPressHandler() {
        const demoraEstimadaNumerica = Number(demoraEstimadaTextual);
        if (demoraEstimadaNumerica <= 0) {
            setDemoraIsInvalid(true);
        }
        else {
            setDemoraIsInvalid(false);
            let nuevosDatos = {};
            switch(funcionDelBoton) {
                case 'tomarUnivoco':
                    nuevosDatos = {
                        demoraEstimadaUnivoco: demoraEstimadaNumerica,
                        estado: 'en preparación'
                    };
                    break;
                case 'tomarPlatos':
                    if (item.demoraEstimadaBebidas) {
                        nuevosDatos = {
                            demoraEstimadaPlatos: demoraEstimadaNumerica
                        };
                    }
                    else {
                        nuevosDatos = {
                            demoraEstimadaPlatos: demoraEstimadaNumerica,
                            estado: 'en preparación'
                        };
                    }
                    break;
                case 'tomarBebidas':
                    if (item.demoraEstimadaPlatos) {
                        nuevosDatos = {
                            demoraEstimadaBebidas: demoraEstimadaNumerica
                        };
                    }
                    else {
                        nuevosDatos = {
                            demoraEstimadaBebidas: demoraEstimadaNumerica,
                            estado: 'en preparación'
                        };
                    }
                    break;
            }
            actualizarDocumento(nuevosDatos);
        }
    }

    function onFinalizarPressHandler() {      
        let nuevosDatos = {};
        switch(funcionDelBoton) {
            case 'finalizarUnivoco':
                nuevosDatos = {
                    demoraRealUnivoco: 10, // Provisorio
                    estado: 'listo'
                };
                break;
            case 'finalizarPlatos':
                if (item.demoraRealBebidas) {
                    nuevosDatos = {
                        demoraRealPlatos: 20, // Provisorio
                        estado: 'listo'
                    };
                }
                else {
                    nuevosDatos = {
                        demoraRealPlatos: 20, // Provisorio
                    };
                }
                break;
            case 'finalizarBebidas':
                if (item.demoraRealPlatos) {
                    nuevosDatos = {
                        demoraRealBebidas: 5, // Provisorio
                        estado: 'listo'
                    };
                }
                else {
                    nuevosDatos = {
                        demoraRealBebidas: 5, // Provisorio
                    };
                }
                break;
        };
        actualizarDocumento(nuevosDatos);
    }

    function actualizarDocumento(nuevosDatos) {
        const docRef = doc(getFirestore(), 'pedidos', item.id);
        updateDoc(docRef, nuevosDatos);
    }

    let boton = <></>
    switch(funcionDelBoton) {
        case 'tomarUnivoco':
        case 'tomarPlatos':
        case 'tomarBebidas':
            boton = (
                <Pressable
                    style={({ pressed }) => [styles.pressable, pressed && { opacity: 0.7 }]}
                    onPress={ onTomarPressHandler }
                >
                    <Text style={styles.textPressable}>
                        Tomar pedido
                    </Text>
                </Pressable>
            );
            break;
        case 'finalizarUnivoco':
        case 'finalizarPlatos':
        case 'finalizarBebidas':
            boton = (
                <Pressable
                    style={({ pressed }) => [styles.pressable, pressed && { opacity: 0.7 }]}
                    onPress={ onFinalizarPressHandler }
                >
                    <Text style={styles.textPressable}>
                        Finalizar pedido
                    </Text>
                </Pressable>
            );
            break;
        case 'finalizado':
            boton = (
                <Pressable
                    style={[styles.pressable, { opacity: 0.6 }]}
                >
                    <Text style={styles.textPressable}>
                        Finalizado
                    </Text>
                </Pressable>
            );
            break;
    };

    let renderizar = false;
    const arrayDeProductos = item.metaProductos.map(
        (metaProducto, index) => {
            if (metaProducto.producto.tipo === miTipo) {
                renderizar = true;
                return (
                    <Text key={index} style={styles.textDetallesContenido}>
                        {metaProducto.cantidad}x {metaProducto.producto.nombre}
                    </Text>
                );
            }
        }
    );
    if (!renderizar) {
        return <></>;
    }
    return (
        <View style={styles.viewPrincipal}>
            <View style={styles.viewRow}>
                <View>
                    <Image
                        style={styles.imageMesa}
                        source={{ uri: item.fotoMesa }}
                        onLoadEnd={() => setCargandoImagen(false)}
                    />
                    {
                        cargandoImagen &&
                        <View style={styles.absoluto}>
                            <ActivityIndicator size="large" color="white" />
                        </View>
                    }
                    <Text style={styles.textMesa}>
                        {item.idMesa}
                    </Text>
                </View>
                <View style={styles.viewDerecho}>
                    <Text style={styles.textDetallesTitulo}>
                        Detalles
                    </Text>
                    {
                        arrayDeProductos
                    }
                </View>
            </View>
            {
                funcionDelBoton.includes('tomar')
                &&
                <View style={styles.viewInput}>
                    <Input
                        label="Demora estimada de elaboración:"
                        onUpdateValue={setDemoraEstimadaTextual}
                        value={demoraEstimadaTextual}
                        keyboardType="numeric"
                        isInvalid={demoraIsInvalid}
                    />
                </View>
            }
            {
                boton
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
    viewInput: {
        padding: 10
    }
});
