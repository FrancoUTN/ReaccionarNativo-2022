import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { doc, getFirestore, setDoc, getDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import Camara from '../../components/altas/Camara';
import ClienteEscaner from '../../components/altas/ClienteEscaner';
import Button from '../../components/ui/Button';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import { Colors } from '../../constants/styles';
import { signUp, logOut } from '../../util/authentication';
import Input from '../../components/Auth/Input';


export default function RegistroScreen({ navigation }) {
	const [escanear, setEscanear] = useState(false);
	const [tomarFoto, setTomarFoto] = useState(false);
	const [correo, setCorreo] = useState('');
	const [clave, setClave] = useState('');
	const [repetirClave, setRepetirClave] = useState('');
	const [nombre, setNombre] = useState('');
	const [apellido, setApellido] = useState('');
	const [dni, setDni] = useState('');
	const [foto, setFoto] = useState();
	const [credentialsInvalid, setCredentialsInvalid] = useState({
		correo: false,
		clave: false,
		repetirClave: false,
		nombre: false,
		apellido: false,
		dni: false,
		foto: false
	});
	const [isAuthenticating, setIsAuthenticating] = useState(false);

	async function agregarUsuario(user) {
		const nombreEnStorage = `usuarios/${user.email}.jpg`;
		const storageRef = ref(getStorage(), nombreEnStorage);

		const blob = await new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = function () {
				resolve(xhr.response);
			};
			xhr.onerror = function (e) {
				console.log("Error al cargar imagen: " + e);
				reject(new TypeError("Petición de red fallida."));
			};
			xhr.responseType = "blob";
			xhr.open("GET", foto.uri, true);
			xhr.send(null);
		});
		await uploadBytes(storageRef, blob);
		const url = await getDownloadURL(storageRef);

		const usuario = {
			correo,
			nombre,
			apellido,
			dni,
			foto: url,
			perfil: 'pendiente',
			estado: 'libre'
		}

		await setDoc(doc(getFirestore(), 'usuarios', user.uid), usuario);
		setIsAuthenticating(false);
		sendPushNotification().then(data => {
			console.log(JSON.stringify(data));
		}).catch(error => {
			console.log("Error al enviar notificación: ", JSON.stringify(error));
		});

		return;
	}

	async function onSubmitHandler() {
		const correoIsValid = correo.trim().includes('@');
		const claveIsValid = clave.trim().length >= 6;
		const repetirClaveIsValid = clave === repetirClave;
		const nombreIsValid = nombre.length >= 1;
		const apellidoIsValid = apellido.length >= 1;
		const dniIsValid = dni.trim().length >= 7; // ?
		const fotoIsValid = !!foto;

		if (
			!correoIsValid ||
			!claveIsValid ||
			!repetirClaveIsValid ||
			!nombreIsValid ||
			!apellidoIsValid ||
			!dniIsValid ||
			!fotoIsValid
		) {
			setCredentialsInvalid({
				correo: !correoIsValid,
				clave: !claveIsValid,
				repetirClave: !repetirClaveIsValid,
				nombre: !nombreIsValid,
				apellido: !apellidoIsValid,
				dni: !dniIsValid,
				foto: !fotoIsValid
			});
			return;
		}

		setIsAuthenticating(true);
		try {
			const usuario = await signUp(correo, clave);
			logOut();
			await agregarUsuario(usuario);
			navigation.navigate({
				name: 'Login'
			});
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

	function dniEscaneadoHandler(datos) {
		setNombre(datos.nombre);
		setApellido(datos.apellido);
		setDni(datos.dni);
		setEscanear(false);
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
			case 'correo':
				setCorreo(enteredValue);
				break;
			case 'clave':
				setClave(enteredValue);
				break;
			case 'repetirClave':
				setRepetirClave(enteredValue);
				break;
			case 'nombre':
				setNombre(enteredValue);
				break;
			case 'apellido':
				setApellido(enteredValue);
				break;
			case 'dni':
				setDni(enteredValue);
				break;
		}
	}

	const ClienteForm = (
		<View style={styles.form}>
			<View>
				<Input
					label="Correo electrónico"
					onUpdateValue={updateInputValueHandler.bind(this, 'correo')}
					value={correo}
					keyboardType="email-address"
					isInvalid={credentialsInvalid.correo}
				/>
				<Input
					label="Contraseña"
					onUpdateValue={updateInputValueHandler.bind(this, 'clave')}
					secure
					value={clave}
					isInvalid={credentialsInvalid.clave}
				/>
				<Input
					label="Repetir contraseña"
					onUpdateValue={updateInputValueHandler.bind(this, 'repetirClave')}
					secure
					value={repetirClave}
					isInvalid={credentialsInvalid.repetirClave}
				/>
				<Input
					label="Nombre"
					onUpdateValue={updateInputValueHandler.bind(this, 'nombre')}
					value={nombre}
					isInvalid={credentialsInvalid.nombre}
				/>
				<Input
					label="Apellido"
					onUpdateValue={updateInputValueHandler.bind(this, 'apellido')}
					value={apellido}
					isInvalid={credentialsInvalid.apellido}
				/>
				<Input
					label="DNI"
					onUpdateValue={updateInputValueHandler.bind(this, 'dni')}
					value={dni}
					keyboardType="numeric"
					isInvalid={credentialsInvalid.dni}
				/>
				<View style={styles.buttons}>
					<Button onPress={onSubmitHandler}>
						Registrar
					</Button>
				</View>
			</View>
		</View>
	);

	if (escanear) {
		return (
			<ClienteEscaner
				dniEscaneado={dniEscaneadoHandler}
			/>
		)
	}
	if (tomarFoto) {
		return (
			<Camara
				fotoTomada={fotoTomadaHandler}
			/>
		)
	}
	if (isAuthenticating) {
		return <LoadingOverlay message="Registrando..." />;
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
			<View style={styles.authContent}>
				{
					ClienteForm
				}
			</View>
			<View style={styles.registrateContainer}>
				<Button onPress={() => setEscanear(true)}>
					Escanear QR del DNI
				</Button>
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
		// backgroundColor: Colors.primary500,
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
	}
});

export const sendPushNotification = async () => {
	const docRef = doc(getFirestore(), "usuarios", "Uo9hvdF3KaaAZzYzzxqqVrnUDID3");
	const docSnap = await getDoc(docRef);
	console.log("uid admin: ", docSnap.data().token)
	return fetch('https://exp.host/--/api/v2/push/send', {
		body: JSON.stringify({
			to: docSnap.data().token,
			title: "Nuevo cliente",
			body: "Se registró un nuevo cliente.",
			data: { action: "CLIENTE_NUEVO" }
		}),
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
	});
}