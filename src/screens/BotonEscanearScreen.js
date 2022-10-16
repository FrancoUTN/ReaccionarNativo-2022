import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Escaner from '../components/shared/Escaner';
import LoadingOverlay from '../components/ui/LoadingOverlay';

import { Colors } from '../constants/styles';


export default function BotonEscanearScreen({ navigation }) {
	const usuario = getAuth().currentUser;
	const uid = usuario.uid;
	const db = getFirestore();
	const userRef = doc(db, 'usuarios/' + uid);
	const [escanear, setEscanear] = useState(false);
	const [cargando, setCargando] = useState(false);
	const [mensajeError, setMensajeError] = useState('');
    
	function onEscaneadoHandler({ data }) {
		setEscanear(false);

		if (data == 'ingreso') {
			actualizarEstado();
		}
		else if (data.includes('mesa')) {
			escaneoMesa(data);
		}
	}

	async function actualizarEstado() {
		await updateDoc(
			userRef,
			{ estado: 'en espera' }
		);
		return;
	}
	
	async function escaneoMesa(mesa) {
		setCargando(true);
		const userSnap = await getDoc(userRef);
		if (!userSnap.exists()) {
			setMensajeError('Usuario inexistente.');
		}
		else {
			const miEstado = userSnap.data().estado;
			if (miEstado == 'libre') {
				setMensajeError('Debe anotarse a la lista de espera.');
			}
			else if (miEstado == 'en espera') {
				setMensajeError('Aún no ha sido asignado a una mesa.');
			}
			else {
				const mesaRef = doc(db, 'mesas/' + mesa);
				const mesaSnap = await getDoc(mesaRef);
				const clienteAsociado = mesaSnap.data().cliente;
				if (clienteAsociado == uid) {
					setMensajeError('');
					navigation.navigate({
						name: 'Cliente'
					});
				}	
				else if (!!clienteAsociado) {
					setMensajeError('Mesa ocupada.');
				}
				else {
					await updateDoc(
						userRef,
						{
							mesa,
							estado: 'vinculado'
						}
					);
					await updateDoc(
						mesaRef,
						{ cliente: uid }
					);
					setMensajeError('');
					navigation.navigate({
						name: 'Cliente'
					});
				}
			}
		}
		setCargando(false);
	}

	if (cargando) {
		return <LoadingOverlay message={'Cargando...'} />;
	}
	if (escanear) {
		return (
            <Escaner
                onEscaneado={onEscaneadoHandler}
            />
		);
	}
	return (
		<View style={styles.container}>
            <Pressable
                style={({ pressed }) => [styles.boton, pressed && styles.apretado]}
                onPress={() => setEscanear(true)}
            >
                <Text style={styles.textoBoton}>
                	Escanear QR
                </Text>
            </Pressable>
			{
				!!mensajeError &&
				<Text style={styles.textoError}>
					Error: { mensajeError }
				</Text>
			}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent:'center',
	},
	boton: {
		flex: 0.3,
		justifyContent:'center',
		alignItems: 'center',
		backgroundColor: Colors.primary800,
		margin: 40,
		marginVertical: 80,
		borderRadius: 20,
	},
	apretado: {
		opacity: 0.7
	},
	textoBoton: {
		color: 'white',
		fontSize: 36,
		fontFamily: 'Montserrat_400Regular'
	},
	textoError: {
		color: Colors.error500,
		fontSize: 20,
		fontFamily: 'Montserrat_400Regular',
		textAlign: 'center'
	}
});
