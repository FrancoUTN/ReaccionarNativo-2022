import { useEffect, useState } from "react";
import { collection, getFirestore, onSnapshot, query, where } from "firebase/firestore";

import { FlatList, StyleSheet, View } from "react-native";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import ItemClienteEnEspera from "../components/renderizadores/ItemClienteEnEspera";

export default function MetreScreen() {
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        const db = getFirestore();
        const q = query(
            collection(db, 'usuarios'),
            where('estado', '==', 'en espera')
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
                renderItem={({ item }) => <ItemClienteEnEspera item={item} />}
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
