import { getAuth } from "firebase/auth";
import { collection, doc, getFirestore, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { Text } from "react-native";
import { StyleSheet, View} from 'react-native';

import Apretable from '../../components/shared/Apretable';
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import { Colors } from "../../constants/styles";


export default function ClienteScreen({ navigation }) {
	const miUid = getAuth().currentUser.uid;
	const userRef = doc(getFirestore(), 'usuarios', miUid);
    const [cargando1, setCargando1] = useState(true);
    const [cargando2, setCargando2] = useState(true);
	const [cobrado, setCobrado] = useState(true);
	const [libre, setLibre] = useState(true);
	const [encuestado, setEncuestado] = useState(true);
    const [estadoPedido, setEstadoPedido] = useState();

    useEffect(() => {
        return onSnapshot(userRef, qs => {
			if (qs.exists()) {
				if (qs.data().estado) {
					setCobrado(qs.data().estado == 'cobrado');
					setLibre(qs.data().estado == 'libre');
				}
				else {
					console.log("Error: sin estado de usuario.");
				}

				if (qs.data().encuestado) {
					setEncuestado(true);
				}
				else {
					console.log("Usuario no encuestado. (No es un error)");
					setEncuestado(false);
				}
            }
            else {
                console.log("Error: no existe el usuario.");
            }
			setCargando2(false);
        });
    }, []);

    useEffect(() => {
        const coleccion = collection(getFirestore(), 'pedidos');
        const constraints = [where('idCliente', "==", miUid), orderBy('fecha', 'desc')];
        const consulta = query(coleccion, ...constraints);

        return onSnapshot(consulta, qs => {
            if (!qs.empty) {                    
				if (qs.docs[0].data().estado) {
                	setEstadoPedido(qs.docs[0].data().estado);
				}
				else {
					console.log("Error: sin estado de pedido.");
				}
            }
            else {
                console.log("Usuario sin pedidos. (No es un error)");
				setEstadoPedido(null);
            }
			setCargando1(false);
        });
    }, []);

	function onMenuPressHandler() {
		navigation.navigate({ name: 'Menu'});
	}

	function onConsultaAlMozoPressHandler() {
		navigation.navigate({ name: 'Chat'});
	}

	function onEstadoPedidoPressHandler() {
		navigation.navigate({ name: "EstadoPedido" });
	}

	function onResponderEncuestaPressHandler() {
		navigation.navigate({ name: "Encuesta" });
	}

	function onVerEncuestasPressHandler() {
		navigation.navigate({ name: "EstadisticaEncuestas" });
	}

	function onPedirLaCuentaPressHandler() {
		navigation.navigate({ name: "Cuenta" });
	}

	function onPressHandler() { // Temporal
		console.log("Apretado.");
	}

	if (cargando1 || cargando2) {
		return <LoadingOverlay message={"Cargando..."}/>
	}
	if (cobrado || libre) {
		return (
			<View style={styles.viewGracias}>
				<Text style={styles.textoGracias}>
					¡Gracias, vuelva pronto!
				</Text>
			</View>
		);
	}
	return (
		<View style={styles.container}>
			<Apretable
				onPress={onMenuPressHandler}
				desactivado={
					estadoPedido &&
					estadoPedido != 'rechazado' &&
					estadoPedido != 'abonado'
				}
			>
				Menú
			</Apretable>
			<Apretable
				onPress={onConsultaAlMozoPressHandler}
			>
				Consultar al mozo
			</Apretable>
			<Apretable
				onPress={onEstadoPedidoPressHandler}
				desactivado={
					!estadoPedido ||
					estadoPedido == 'abonado'
				}
			>
				Estado de mi pedido
			</Apretable>
			<Apretable
				onPress={onResponderEncuestaPressHandler}
				desactivado={
					encuestado ||
					!estadoPedido ||
					estadoPedido == 'a confirmar' ||
					estadoPedido == 'rechazado' ||
					estadoPedido == 'abonado'
				}
			>
				Responder encuesta
			</Apretable>
			<Apretable
				onPress={onVerEncuestasPressHandler}
				desactivado={!encuestado}
			>
				Ver encuestas
			</Apretable>
			<Apretable
				onPress={onPedirLaCuentaPressHandler}
				desactivado={estadoPedido != 'entregado'}
			>
				Pedir la cuenta
			</Apretable>
			{/* <Apretable
				onPress={onPressHandler}
			>
				Reservar
			</Apretable><Apretable
				onPress={onPressHandler}
			>
				Jugar
			</Apretable>
			<Apretable
				onPress={onPressHandler}
			>
				Pedir por Delivery
			</Apretable> */}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 30
	},
	viewGracias: {
		flex: 1,
		justifyContent: 'center',
	},
	textoGracias: {
		color: Colors.primary800,
		fontSize: 50,
		textAlign: "center",
		padding: 20
	}
});
