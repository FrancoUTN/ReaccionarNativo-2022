import { useContext, useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "../../constants/styles";
import { AuthContext } from "../../store/auth-context";
import Input from "../Auth/Input";

export default function PedidoPreparador({ item, onPress }) {
	const miPerfil = useContext(AuthContext).perfil;
    const miTipo = miPerfil == 'cocinero' ? 'plato' : 'bebida';
    const [cargandoImagen, setCargandoImagen] = useState(true);
    const [demoraEstimada, setDemoraEstimada] = useState('');

    let yaTomeElPedido = false;
    if (miPerfil == 'cocinero') {
        if (item.demoraEstimadaPlatos) {
            yaTomeElPedido = true;
        }
    }
    else {
        if (item.demoraEstimadaBebidas) {
            yaTomeElPedido = true;
        }
    }

    let textoBoton = '';
    let botonApretable = false;
    switch(item.estado) {
        case 'pendiente':
            textoBoton = 'Tomar pedido';
            botonApretable = true;
            break;
        case 'en preparación':
            textoBoton = yaTomeElPedido ? 'Finalizar' : 'Tomar pedido';
            botonApretable = true;
            break;
        case 'platos listos':
            if (miPerfil == 'cocinero') {
                textoBoton = 'Finalizado';
                botonApretable = false;
            }
            else {
                textoBoton = yaTomeElPedido ? 'Finalizar' : 'Tomar pedido';    
                botonApretable = true;            
            }
            break;
        case 'bebidas listas':
            if (miPerfil == 'bartender') {                
                textoBoton = 'Finalizado';
                botonApretable = false;
            }
            else {
                textoBoton = yaTomeElPedido ? 'Finalizar' : 'Tomar pedido';
                botonApretable = true;
            }
            break;
        default:
            textoBoton = 'Finalizado';
            botonApretable = false;
    }

    let renderizar = false;
    const arrayDeProductos = item.metaProductos.map(
        (producto, index) => {
            if (producto.producto.tipo === miTipo) {
                renderizar = true;
                return (
                    <Text key={index} style={styles.textDetallesContenido}>
                        { producto.cantidad }x { producto.producto.nombre }
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
                        arrayDeProductos
                    }
                </View>
            </View>
            {
                yaTomeElPedido
                ||
                <View style={styles.viewInput}>
                    <Input
                        label="Demora estimada de elaboración:"
                        onUpdateValue={setDemoraEstimada}
                        value={demoraEstimada}
                        keyboardType="numeric"
                    />
                </View>
            }
            {
                botonApretable ?
                <Pressable
                    style={ ({pressed}) => [styles.pressable, pressed && {opacity: 0.7}] }
                    onPress={() => onPress(
                        item.id,
                        item.estado,
                        item.contenido,
                        demoraEstimada
                    )}
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
    viewInput: {
        padding: 10
    }
});
