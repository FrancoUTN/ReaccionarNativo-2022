import { collection, doc, getFirestore, onSnapshot, query, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { FlatList, View } from "react-native";

import PedidoMozo from "../components/renderizadores/PedidoMozo";
import PedidoPreparador from "../components/renderizadores/PedidoPreparador";
import { AuthContext } from "../store/auth-context";


export default function PedidosScreen() {
	const miPerfil = useContext(AuthContext).perfil;
    const db = getFirestore();
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'pedidos'));
        return onSnapshot(q, qs => {
            const pedidosTraidos = [];
            qs.forEach(qds => {
                const pedidoTraido = {
                    id: qds.id,
                    ...qds.data()
                };
                pedidosTraidos.push(pedidoTraido);
            });
            setPedidos(pedidosTraidos);
        });
    }, []);

    async function onPedidoPressHandler(
        id,
        estado,
        contenido,
        demoraEstimada
    ) {
        const docRef = doc(db, 'pedidos', id);
        let nuevoEstado = '';
        switch(estado) {
            case 'a confirmar':
                nuevoEstado = 'pendiente';
                break;
            case 'pendiente':
                nuevoEstado = 'en preparación';
                break;
            case 'en preparación':
                if (contenido == 'mixto')
                    if (miPerfil == 'cocinero')
                        nuevoEstado = 'platos listos';
                    else
                        nuevoEstado = 'bebidas listas';
                else
                    nuevoEstado = 'listo';
                break;
            case 'platos listos':
                if (!demoraEstimada)
                    nuevoEstado = 'listo';
                break;
            case 'bebidas listas':
                if (!demoraEstimada)
                    nuevoEstado = 'listo';
                break;
            // case 'listo':
            //     break;
            // case 'llevado':
            //     break;
        }

        let nuevosDatos = {};
        if (demoraEstimada && miPerfil == 'cocinero') { 
            nuevosDatos = {
                estado: nuevoEstado,
                demoraEstimadaPlatos: Number(demoraEstimada)
            };
        }
        else if (demoraEstimada) {
            nuevosDatos = {
                estado: nuevoEstado,
                demoraEstimadaBebidas: Number(demoraEstimada)
            };
        }
        else {
            nuevosDatos = {
                estado: nuevoEstado
            };
        }
        await updateDoc(docRef, nuevosDatos);
    }

    function renderizar({ item }) {
        if (miPerfil == 'mozo') {
            return <PedidoMozo item={item} onPress={onPedidoPressHandler} />
        }
        else if (item.estado != 'a confirmar') {
            return <PedidoPreparador item={item} onPress={onPedidoPressHandler} />
        }
    }

    return(
        <View>
            <FlatList
                contentContainerStyle={ {alignItems: 'center'} }
                data={pedidos}
                renderItem={renderizar}
                keyExtractor={item => item.id}
            />
        </View>
    );
}
