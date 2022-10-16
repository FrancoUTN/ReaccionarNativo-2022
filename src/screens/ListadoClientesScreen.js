import { useEffect, useState } from "react";
import { collection, getFirestore, onSnapshot, query, where } from "firebase/firestore";

import { FlatList, StyleSheet, View } from "react-native";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import ItemCliente from "../components/renderizadores/ItemCliente";

export default function ListadoClientesScreen() {
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        const db = getFirestore();
        const q = query(
            collection(db, 'usuarios'),
            where('perfil', '==', 'pendiente')
        );
        return onSnapshot(q, qs => {
            const clientesTraidos = [];
            qs.forEach( documento => {
                const objeto = {
                    id: documento.id,
                    ...documento.data()
                };
                clientesTraidos.push(objeto);
            });
            setClientes(clientesTraidos);
        });
    }, []);

    if (!clientes) {
        return <LoadingOverlay message={'Cargando clientes...'} />
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={clientes}
                renderItem={({ item }) => <ItemCliente item={item} />}
                keyExtractor={item => item.id}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});
