import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, onSnapshot } from 'firebase/firestore';
import { useState } from 'react';
import { useEffect } from 'react';
import { StyleSheet, View} from 'react-native';

import Apretable from '../../components/shared/Apretable';


export default function ClienteScreen({ navigation }) {
	const miUid = getAuth().currentUser.uid;
	const userRef = doc(getFirestore(), 'usuarios', miUid);
	const [miEstado, setMiEstado] = useState('');

    useEffect(() => {
        return onSnapshot(userRef, qs => {
			if (qs.exists()) {
				if (qs.data().estado) {
					setMiEstado(qs.data().estado);
				}
			}
        });
    }, []);

	function onMenuPressHandler() {
		navigation.navigate({ name: 'Menu'});
	}

	function onConsultaAlMozoPressHandler() {
		navigation.navigate({ name: 'Chat'});
	}

	function onPressHandler() { // Temporal
		console.log("Apretado.");
	}
	
	return (
		<View style={styles.container}>
			<Apretable
				onPress={onMenuPressHandler}
			>
				Menú
			</Apretable>
			<Apretable
				onPress={onConsultaAlMozoPressHandler}
			>
				Consultar al mozo
			</Apretable>
			<Apretable
				onPress={onPressHandler}
				desactivado={true}
			>
				Estado de mi pedido
			</Apretable>
			<Apretable
				onPress={onPressHandler}
				desactivado={miEstado != 'con pedido confirmado'}
			>
				Responder encuesta
			</Apretable>
			<Apretable
				onPress={onPressHandler}
				desactivado={miEstado != 'encuestado'}
			>
				Ver encuestas
			</Apretable>
			<Apretable
				onPress={onPressHandler}
				desactivado={true}
			>
				Pedir la cuenta
			</Apretable>
			{/* <Apretable
				onPress={onPressHandler}
			>
				Reservar
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
	}
});
