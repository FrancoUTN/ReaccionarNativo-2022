import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import * as Notifications from "expo-notifications";

import Apretable from "../../components/shared/Apretable";

export default function AdminScreen({ navigation }) {
  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (lastNotificationResponse) {
      const action = lastNotificationResponse.notification.request.content.data.action;
      console.log(action);
      if (action === "CLIENTE_NUEVO") {
        navigation.navigate({ name: "ListadoClientes" });
      }
    }
  }, [lastNotificationResponse]);
  
  function onAgregarEmpleadoPressHandler() {
    navigation.navigate({ name: "AltaEmpleado" });
  }
  function onAgregarMesaPressHandler() {
    navigation.navigate({ name: "AltaMesa" });
  }
  function onClientesPressHandler() {
    navigation.navigate({ name: "ListadoClientes" });
  }
  function onVerEncuestasPressHandler() {
    navigation.navigate({ name: "EstadisticaEncuestas" });
  }

  return (
    <View style={styles.container}>
      <Apretable onPress={onAgregarEmpleadoPressHandler}>
        Agregar empleado
      </Apretable>
      <Apretable onPress={onAgregarMesaPressHandler}>
        Agregar mesa
      </Apretable>
      <Apretable onPress={onClientesPressHandler}>
        Clientes
      </Apretable>
      <Apretable onPress={onVerEncuestasPressHandler}>
        Ver encuestas
      </Apretable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
  },
});
