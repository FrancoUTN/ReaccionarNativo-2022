import {
  Text,
  View,
  ScrollView,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { Component, useEffect, useState } from "react";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";

import Sizes_ from "../../util/Sizes";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

const ListadoProductos = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const db = getFirestore();
    const q = query(collection(db, "productos"));
    return onSnapshot(q, (qs) => {
      const productosTraidos = [];
      qs.forEach((documento) => {
        console.log("datacompleta", documento);
        const objeto = {
          ...documento.data(),
        };
        productosTraidos.push(objeto);
      });
      setData(productosTraidos);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingOverlay message={"Cargando información"}></LoadingOverlay>;
  }
  const modificarProducto = () => {};
  const borrarProducto = async () => {
    await deleteDoc(doc(db, "productos", "DC"));
  };

  const ItemProducto = (item) => {
    console.log("item", item.item);

    return (
      <View
        style={{
          width: "100%",
          borderWidth: 1,
          height: Dimensions.get("window").height * 0.2,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flex: 0.4,
            width: "100%",
            height: "100%",
            borderWidth: 0,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <Image
              source={{ uri: item.item.fotos[0] }}
              style={{ width: "100%", height: "60%", resizeMode: "contain" }}
            />
          </View>
          <View
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <Image
              source={{ uri: item.item.fotos[1] }}
              style={{ width: "100%", height: "60%", resizeMode: "contain" }}
            />
          </View>
          <View
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <Image
              source={{ uri: item.item.fotos[2] }}
              style={{ width: "100%", height: "60%", resizeMode: "contain" }}
            />
          </View>
        </View>
        <View
          style={{
            flex: 0.4,
            justifyContent: "center",
            width: "100%",
            height: "100%",
            paddingLeft: 5,
          }}
        >
          <Text
            style={{ textAlign: "center", width: "100%", marginBottom: 10 }}
          >
            {" "}
            {item.item.nombre}{" "}
          </Text>
          <Text> {item.item.descripcion} </Text>
        </View>
        <View
          style={{ flex: 0.2, width: "100%", height: "100%", borderWidth: 1 }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesome name="edit" size={Sizes_.xl} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AntDesign name="delete" size={Sizes_.xl} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AntDesign name="qrcode" size={Sizes_.xl} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        renderItem={({ item }) => <ItemProducto item={item} />}
        keyExtractor={(item) => item.qrEnBase64}
      />
    </View>
  );
};

export default ListadoProductos;
