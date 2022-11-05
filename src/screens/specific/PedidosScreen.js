import { collection, getFirestore, onSnapshot, orderBy, query } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { FlatList, View } from "react-native";

import PedidoMozo from "../../components/renderizadores/PedidoMozo";
import PedidoPreparador from "../../components/renderizadores/PedidoPreparador";
import { AuthContext } from "../../store/auth-context";


export default function PedidosScreen() {
	const miPerfil = useContext(AuthContext).perfil;
    const db = getFirestore();
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'pedidos'), orderBy("fecha", "desc"));
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

    function renderizar({ item }) {
        if (miPerfil == 'mozo') {
            return <PedidoMozo item={item}/>
        }
        else if (
            item.estado == 'confirmado' ||
            item.estado == 'en preparación' ||
            item.estado == 'listo'
        ) {
            return <PedidoPreparador item={item}/>
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
