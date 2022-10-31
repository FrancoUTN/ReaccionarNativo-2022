import { useEffect, useState } from "react";
import { addDoc, collection, doc, getDoc, getFirestore, onSnapshot, query } from "firebase/firestore";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';

import LoadingOverlay from "../../components/ui/LoadingOverlay";
import ItemProducto from "../../components/renderizadores/ItemProducto";
import { Colors } from "../../constants/styles";
import { getAuth } from "firebase/auth";


export default function MenuScreen({ navigation }) {
    const db = getFirestore();
    const [productos, setProductos] = useState([]);
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [importe, setImporte] = useState(0);
    const [demora, setDemora] = useState(0);
    const [pidiendo, setPidiendo] = useState(false);

    useEffect(() => {
        const q = query(
            collection(db, 'productos')
        );
        return onSnapshot(q, qs => {
            const productosTraidos = [];
            qs.forEach( documento => {
                const objeto = {
                    id: documento.id,
                    ...documento.data()
                };
                productosTraidos.push(objeto);
            });
            setProductos(productosTraidos);
        });
    }, []);

    useEffect(
        () => {
            let importeAcumulado = 0;
            let demoraMaxima = 0;
            productosSeleccionados.forEach(
                producto => {
                    const cant = producto.cantidad;
                    importeAcumulado += producto.producto.precio * cant;

                    if (producto.producto.tiempoPromedio > demoraMaxima) {
                        demoraMaxima = producto.producto.tiempoPromedio;
                    }
                }
            );
            setImporte(importeAcumulado);
            setDemora(demoraMaxima);
        }
    , [productosSeleccionados]);

    function onCantidadModificadaHandler(id, cantidad) {
        const productoExistente = productosSeleccionados.find(
            indice => indice.producto.id == id
        );

        if (productoExistente) {
            if (cantidad === 0) {
                setProductosSeleccionados(
                    productosPrevios => {
                        return productosPrevios.filter(
                            indice => (
                                indice.producto.id !== productoExistente.producto.id
                            )
                        );
                    }
                );
            }
            else {
                setProductosSeleccionados(
                    productosPrevios => {
                        const elIndice = productosPrevios.findIndex(
                            productoPrevio => (
                                productoPrevio.producto.id == productoExistente.producto.id
                            )
                        );

                        const nuevoProducto = {...productosPrevios[elIndice]};
                        nuevoProducto.cantidad = cantidad;
                        productosPrevios[elIndice] = nuevoProducto;

                        return [...productosPrevios]; // Fundamental (para el useEffect).
                    }
                );
                productoExistente.cantidad = cantidad;
            }
        }
        else {
            if (cantidad === 0) {
                // Nada
            }
            else {
                const productoNuevo = productos.find(
                    prod => prod.id == id
                );

                const auxProductoNuevo = {
                    ...productoNuevo
                }

                const objeto = {
                    producto: auxProductoNuevo,
                    cantidad: cantidad
                };

                setProductosSeleccionados(
                    productosPrevios => {
                        return [...productosPrevios, objeto];
                    }
                );
            }
        }
    }

    async function pedirHandler() {
        if (productosSeleccionados.length <= 0) {
            return;
        }

        let contieneBebidas = false;
        let contienePlatos = false;
        productosSeleccionados.forEach(productoSeleccionado => {
            if (productoSeleccionado.producto.tipo == 'plato') {
                contienePlatos = true;
            }
            else {
                contieneBebidas = true;
            }
        });
        let contenido = 'bebidas';
        if (contienePlatos && contieneBebidas) {
            contenido = 'mixto';
        }
        else if (contienePlatos) {
            contenido = 'platos';
        }
        
        setPidiendo(true);
        try{
            const miUid = getAuth().currentUser.uid;
            const userRef = doc(db, 'usuarios', miUid);
            const userSnapshot = await getDoc(userRef);
            const mesaId = userSnapshot.data().mesa;
            const mesaRef = doc(db, 'mesas', mesaId);
            const mesaSnapshot = await getDoc(mesaRef);
    
            const pedido = {
                idMesa: mesaId,
                fotoMesa: mesaSnapshot.data().foto,
                fecha: new Date(),
                idCliente: miUid,
                metaProductos: productosSeleccionados,
                importe,
                estado: 'a confirmar',
                contenido
            };
            await addDoc(collection(db, 'pedidos'), pedido);
            navigation.navigate({
                name: 'PedidoAgregado'
            });
        }
		catch (error) {
            navigation.navigate({
              name: 'Modal',
              params: { mensajeError: error.message }
            });
        }
    }

    if (!productos) {
        return <LoadingOverlay message={'Cargando productos...'} />
    }    
    if (pidiendo) {
        return <LoadingOverlay message={'Generando pedido...'} />
    }
    return (
        <>
            <View style={styles.container}>
                <FlatList
                    data={productos}
                    renderItem={({ item }) => (
                        <ItemProducto
                            item={item}
                            onCantidadModificada={onCantidadModificadaHandler}
                        />
                    )}
                    keyExtractor={item => item.id}
                />
            </View>            
            <View style={styles.viewImporte}>
                <Text style={styles.textImporte}>
                    Total:  $ { importe }
                </Text>
                <View style={styles.viewDemora}>
                    <Ionicons
                        name="time-outline"
                        color='white'
                        size={26}
                    />
                    <Text style={styles.textDemora}>
                        { demora }'
                    </Text>
                </View>
                <Pressable
                    style={({ pressed }) => ([styles.pressablePedir, pressed && { opacity: 0.7 }])}
                    onPress={pedirHandler}
                >
                    <Text style={styles.textPedir}>
                        ¡Pedir!
                    </Text>
                </Pressable>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 9,
        alignItems: 'center'
    },
    viewImporte: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.primary500,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textImporte: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'Montserrat_500Medium',
        marginLeft: 10
    },
    pressablePedir: {
        backgroundColor: 'green',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginRight: 10
    },
    textPedir: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'Montserrat_400Regular',
    },
    viewDemora: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textDemora: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'Montserrat_400Regular',
        marginLeft: 4
    }
});
