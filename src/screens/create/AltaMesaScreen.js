import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import Camara from '../../components/altas/Camara';
import Button from '../../components/ui/Button';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import { Colors } from '../../constants/styles';
import Input from '../../components/Auth/Input';
import QrBase64 from '../../components/shared/QrBase64';


export default function AltaMesaScreen({ navigation }) {
	const [qrEnBase64, setQrEnBase64] = useState(false);
	const [tomarFoto, setTomarFoto] = useState(false);
	const [numero, setNumero] = useState('');
	const [cantidadComensales, setCantidadComensales] = useState('');
	const [tipo, setTipo] = useState('');
	const [foto, setFoto] = useState();
	const [credentialsInvalid, setCredentialsInvalid] = useState({
		tipo: false,
		cantidadComensales: false,
		numero: false,
		foto: false
	});
	const [isAuthenticating, setIsAuthenticating] = useState(false);

	async function agregar() {
		const nombreEnStorage = `mesas/mesa${numero}.jpg`;
		const storageRef = ref(getStorage(), nombreEnStorage);

		const blob = await new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = function () {
				resolve(xhr.response);
			};
			xhr.onerror = function (e) {
				console.log(e);
				reject(new TypeError("Petición de red fallida."));
			};
			xhr.responseType = "blob";
			xhr.open("GET", foto.uri, true);
			xhr.send(null);
		});
		await uploadBytes(storageRef, blob);
		const url = await getDownloadURL(storageRef);

		const mesa = {
			tipo,
			cantidadComensales,
			// numero,
			foto: url,
			qrEnBase64
		}

		const docRef = doc(getFirestore(), 'mesas', 'mesa' + numero);
		await setDoc(docRef, mesa);
		setIsAuthenticating(false);
		navigation.navigate({
			name: 'MesaAgregada',
			params: { qrEnBase64 }
		});
		return;
	}

	async function onSubmitHandler() {
		const tipoIsValid = tipo.trim().length >= 1;
		const cantidadComensalesIsValid = cantidadComensales.trim().length >= 1;
		const numeroIsValid = numero.trim().length >= 1;
		const fotoIsValid = !!foto;

		if (
			!tipoIsValid ||
			!cantidadComensalesIsValid ||
			!numeroIsValid ||
			!fotoIsValid
		) {
			setCredentialsInvalid({
				tipo: !tipoIsValid,
				cantidadComensales: !cantidadComensalesIsValid,
				numero: !numeroIsValid,
				foto: !fotoIsValid
			});
			return;
		}

		setIsAuthenticating(true);
		try {
			await agregar();
		}
		catch (error) {
			console.log(error);
			navigation.navigate({
				name: 'Modal',
				params: { mensajeError: 'Falló el registro. Intenta nuevamente' }
			});
			setIsAuthenticating(false);
		}
	}

	function fotoTomadaHandler(objetoFoto) {
		setTomarFoto(false);
		setFoto(objetoFoto);

		setCredentialsInvalid(
			credenciales => ({ ...credenciales, foto: false })
		);
	}

	function updateInputValueHandler(inputType, enteredValue) {
		switch (inputType) {
			case 'tipo':
				setTipo(enteredValue);
				break;
			case 'cantidadComensales':
				setCantidadComensales(enteredValue);
				break;
			case 'numero':
				setNumero(enteredValue);
				break;
		}
	}

	const formulario = (
		<View style={styles.form}>
			<View>
				<Input
					label="Número"
					onUpdateValue={updateInputValueHandler.bind(this, 'numero')}
					value={numero}
					keyboardType="numeric"
					isInvalid={credentialsInvalid.numero}
				/>
				<Input
					label="Cantidad de Comensales"
					onUpdateValue={updateInputValueHandler.bind(this, 'cantidadComensales')}
					value={cantidadComensales}
					keyboardType="numeric"
					isInvalid={credentialsInvalid.cantidadComensales}
				/>
				<Input
					label="Tipo"
					onUpdateValue={updateInputValueHandler.bind(this, 'tipo')}
					value={tipo}
					isInvalid={credentialsInvalid.tipo}
				/>
				<View style={styles.buttons}>
					<Button onPress={onSubmitHandler}>
						Agregar
					</Button>
				</View>
			</View>
		</View>
	);

	if (tomarFoto) {
		return (
			<Camara
				fotoTomada={fotoTomadaHandler}
			/>
		)
	}
	if (isAuthenticating) {
		return <LoadingOverlay message="Agregando..." />;
	}
	return (
		<ScrollView>
			<View style={styles.fotoContainer}>
				{
					credentialsInvalid.foto ?
						<Text style={styles.fotoErrorText}>
							¡Foto requerida!
						</Text>
						:
						foto &&
						<Image
							style={styles.imagen}
							source={{ uri: foto.uri }}
						/>
				}
			</View>
			<View style={styles.registrateContainer}>
				<Button onPress={() => setTomarFoto(true)}>
					Tomar foto
				</Button>
			</View>
			<View style={styles.qrContainer}>
				<QrBase64
					valor={'mesa' + numero}
					callback={setQrEnBase64}
				/>
			</View>
			<View style={styles.authContent}>
				{
					formulario
				}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	authContent: {
		marginHorizontal: 32,
		padding: 16,
		borderRadius: 4,
		backgroundColor: Colors.primary500,
		elevation: 2,
		shadowColor: 'black',
		shadowOffset: { width: 1, height: 1 },
		shadowOpacity: 0.35,
		shadowRadius: 4,
		marginBottom: 20
	},
	buttons: {
		marginTop: 8,
	},
	registrateContainer: {
		margin: 20,
		padding: 10,
		borderRadius: 10,
		paddingHorizontal: 50,
	},
	imagen: {
		width: 150,
		height: 150
	},
	fotoContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.primary500,
		marginHorizontal: 40,
		marginTop: 20,
		borderRadius: 4,
	},
	fotoErrorText: {
		fontSize: 20,
		margin: 30,
		color: Colors.error100,
	},
	qrContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.primary500,
		marginHorizontal: 100,
		marginVertical: 20,
		padding: 20,
		borderRadius: 10,
	}
});
