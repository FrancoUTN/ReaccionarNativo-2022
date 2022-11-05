import { StyleSheet, View } from "react-native";
import { useState, useRef, useEffect } from "react";
import Apretable from "../../components/shared/Apretable";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function AdminScreen({ navigation }) {
  const notificationListener = useRef();
  const responseListener = useRef();
  const [notification, setNotification] = useState(false);

  useEffect(() => {
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  notificationListener.current = Notifications.addNotificationReceivedListener(
    (notification) => {
      setNotification(notification);
    }
  );
  responseListener.current =
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
      const action = response.notification.request.content.data.action;
      if (action === "CLIENTE_NUEVO") {
        navigation.navigate({
          name: "ListadoClientes",
        });
      }
    });
  function onClientesPressHandler() {
    navigation.navigate({ name: "ListadoClientes" });
  }
  function onAgregarMesaPressHandler() {
    navigation.navigate({ name: "AltaMesa" });
  }
  function onAgregarEmpleadoPressHandler() {
    navigation.navigate({ name: "AltaEmpleado" });
  }
  function onVerEncuestasPressHandler() {
    navigation.navigate({ name: "EstadisticaEncuestas" });
  }

  // Temporal
  function onPressHandler() {
    console.log("Apretado.");
  }

  return (
    <View style={styles.container}>
      {/* <Apretable
				onPress={onPressHandler}
				desactivado={true}
			>
				Agregar administrador
			</Apretable> */}
      <Apretable onPress={onAgregarEmpleadoPressHandler}>
        Agregar empleado
      </Apretable>
      <Apretable onPress={onAgregarMesaPressHandler}>Agregar mesa</Apretable>
      <Apretable onPress={onClientesPressHandler}>Clientes</Apretable>
      <Apretable onPress={onVerEncuestasPressHandler}>Ver encuestas</Apretable>
      {/* <Apretable
				onPress={onPressHandler}
				desactivado={true}
			>
				Reservas
			</Apretable>
			<Apretable
				onPress={onPressHandler}
				desactivado={true}
			>
				Delivery
			</Apretable> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
  },
});
