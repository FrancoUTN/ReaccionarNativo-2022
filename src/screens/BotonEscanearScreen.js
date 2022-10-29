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
	const [mensajeOk, setMensajeOk] = useState('');
    
	async function onEscaneadoHandler({ data }) {
		setEscanear(false);
		const userSnap = await getDoc(userRef);
		const miEstado = userSnap.data().estado;
		if (data == 'ingreso') {
			if (miEstado == 'libre') {
				await actualizarEstado();
				setMensajeOk('¡Ahora estás en la lista de espera!');
			}
			else {
				setMensajeError('Usted ya está ' + miEstado + ".");
			}
		}
		else if (data.includes('mesa')) {
			await escaneoMesa(data, miEstado);
		}
		else {
			setMensajeError('Qr inválido.');
		}
	}

	function onCancelarHandler() {
		setEscanear(false);
	}

	async function actualizarEstado() {
		await updateDoc(
			userRef,
			{ estado: 'en espera' }
		);
		return;
	}
	
	async function escaneoMesa(mesa, miEstado) {
		setCargando(true);
		
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
				navigation.navigate({
					name: 'Cliente'
				});
			}
			else if (miEstado == 'vinculado') {
				setMensajeError('Usted ya está en otra mesa.');
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
				navigation.navigate({
					name: 'Cliente'
				});
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
                onCancelar={onCancelarHandler}
            />
		);
	}
	return (
		<View style={styles.container}>
            <Pressable
                style={({ pressed }) => [styles.boton, pressed && styles.apretado]}
                onPress={() => {
					setEscanear(true);
					setMensajeError('');
					setMensajeOk('');
				}}
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
			{
				!!mensajeOk &&
				<Text style={styles.textoOk}>
					{ mensajeOk }
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
	},	
	textoOk: {
		color: Colors.success,
		fontSize: 20,
		fontFamily: 'Montserrat_400Regular',
		textAlign: 'center'
	}
});
