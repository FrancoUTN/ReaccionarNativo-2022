import { StyleSheet, View } from "react-native";

import Apretable from "../components/shared/Apretable";


export default function AdminScreen({ navigation }) {
	function onClientesPressHandler() {
		navigation.navigate({ name: "ListadoClientes" });
	}

	function onAgregarMesaPressHandler() {
		navigation.navigate({ name: "AltaMesa" });
	}

	function onAgregarEmpleadoPressHandler() {
		navigation.navigate({ name: "AltaEmpleado" });
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
			<Apretable
				onPress={onAgregarEmpleadoPressHandler}
			>
				Agregar empleado
			</Apretable>
			<Apretable
				onPress={onAgregarMesaPressHandler}
			>
				Agregar mesa
			</Apretable>
			<Apretable
				onPress={onClientesPressHandler}
			>
				Clientes
			</Apretable>
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
