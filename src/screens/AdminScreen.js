import { StyleSheet, View } from "react-native";
import { useState } from "react";
import LoadingScreen from "./LoadingScreen";
import Apretable from "../components/shared/Apretable";

export default function AdminScreen({ navigation }) {
  const [loading, setLoading] = useState();

  function onClientesPressHandler() {
    navigation.navigate({ name: "ListadoClientes" });
  }

  function onAgregarMesaPressHandler() {
    navigation.navigate({ name: "AltaMesa" });
  }

  function onAgregarEmpleadoPressHandler() {
    navigation.navigate({ name: "AltaEmpleado" });
  }

  function onPressHandler() {
    // Temporal
    console.log("Apretado.");
  }

  return loading ? (
    <LoadingScreen text="Admin ...." />
  ) : (
    <View style={styles.container}>
      <Apretable onPress={onPressHandler}>Agregar administrador</Apretable>
      <Apretable onPress={onAgregarEmpleadoPressHandler}>
        Agregar empleado
      </Apretable>
      <Apretable onPress={onAgregarMesaPressHandler}>Agregar mesa</Apretable>
      <Apretable onPress={onClientesPressHandler}>Clientes</Apretable>
      <Apretable onPress={onPressHandler}>Reservas</Apretable>
      <Apretable onPress={onPressHandler}>Delivery</Apretable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
  },
});
