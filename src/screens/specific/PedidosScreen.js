import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { FlatList, View, Image, Text } from "react-native";

import { Colors } from "../../constants/styles";
import PedidoMozo from "../../components/renderizadores/PedidoMozo";
import PedidoPreparador from "../../components/renderizadores/PedidoPreparador";
import { AuthContext } from "../../store/auth-context";
import Sizes_ from "../../util/Sizes";
import LoadingOverlay from "../../components/ui/LoadingOverlay";

export default function PedidosScreen() {
  const miPerfil = useContext(AuthContext).perfil;
  const db = getFirestore();
  const [pedidos, setPedidos] = useState();

  useEffect(() => {
    console.log("entre?", miPerfil);
    const q = query(collection(db, "pedidos"), orderBy("fecha", "desc"));
    return onSnapshot(q, (qs) => {
      const pedidosTraidos = [];
      qs.forEach((qds) => {
        const pedidoTraido = {
          id: qds.id,
          ...qds.data(),
        };
        pedidosTraidos.push(pedidoTraido);
      });
      setPedidos(pedidosTraidos);
    });
  }, []);

  function renderizar({ item }) {
    if (miPerfil == "mozo") {
      return <PedidoMozo item={item} />;
    } else if (
      item.estado == "confirmado" ||
      item.estado == "en preparación" ||
      item.estado == "listo"
    ) {
      return <PedidoPreparador item={item} />;
    } else {
      return <PedidoPreparador item={item} />;
    }
  }

  if (!pedidos) {
    return <LoadingOverlay message={"Cargando pedidos..."} />;
  }

  return (
    <View style={{ flex: 1, width: "100%", height: "100%" }}>
      {pedidos.length <= 0 && (
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
              source={require("../../../assets/emptyList/noData.png")}
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
            Sin pedidos aún...
          </Text>
        </View>
      )}
      {pedidos.length > 0 && ( // No funciona si es cocinero o bartender
        <FlatList
          contentContainerStyle={{ alignItems: "center" }}
          data={pedidos}
          renderItem={renderizar}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<View> vacio?? </View>}
        />
      )}
    </View>
  );
}
