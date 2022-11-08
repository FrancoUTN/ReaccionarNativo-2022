import { useEffect, useState } from "react";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { FlatList, StyleSheet, View, Image, Text } from "react-native";

import LoadingOverlay from "../../components/ui/LoadingOverlay";
import ItemClienteEnEspera from "../../components/renderizadores/ItemClienteEnEspera";
import Sizes_ from "../../util/Sizes";
import { Colors } from "../../constants/styles";

export default function MetreScreen() {
  const [clientes, setClientes] = useState();

  useEffect(() => {
    const db = getFirestore();
    const q = query(
      collection(db, "usuarios"),
      where("estado", "==", "en espera")
    );
    return onSnapshot(q, (qs) => {
      const clientesTraidos = [];
      qs.forEach((documento) => {
        const objeto = {
          id: documento.id,
          ...documento.data(),
        };
        clientesTraidos.push(objeto);
      });
      setClientes(clientesTraidos);
    });
  }, []);

  if (!clientes) {
    return <LoadingOverlay message={"Cargando clientes..."} />;
  }

  return (
    <View style={{ flex: 1, width: "100%", height: "100%" }}>
      {clientes.length <= 0 && (
        <View
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              width: "50%",
              height: "50%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../../assets/emptyList/emptyClient.png")}
              style={{ width: "100%", height: "100%", resizeMode: "contain" }}
            />
          </View>

          <Text
            style={{
              textAlign: "center",
              fontSize: Sizes_.normal,
              color: Colors.primary500,
            }}
          >
            Sin clientes aún...
          </Text>
        </View>
      )}

      {clientes.length > 0 && (
        <FlatList
          data={clientes}
          renderItem={({ item }) => <ItemClienteEnEspera item={item} />}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
