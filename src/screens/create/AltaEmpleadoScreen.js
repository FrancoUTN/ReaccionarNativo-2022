import { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import Camara from '../../components/altas/Camara';
import ClienteEscaner from '../../components/altas/ClienteEscaner';
import Button from '../../components/ui/Button';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import { Colors } from '../../constants/styles';
import { signUp, logOut, login } from '../../util/authentication';
import Input from '../../components/Auth/Input';
import { getAuth } from 'firebase/auth';
import getFirebaseErrorMsg from "../../util/firebaseErrorMsg";

export default function AltaEmpleadoScreen({ navigation }) {
	const miEmail = getAuth().currentUser.email;
	const [escanear, setEscanear] = useState(false);
	const [tomarFoto, setTomarFoto] = useState(false);
	const [correo, setCorreo] = useState('');
	const [clave, setClave] = useState('');
	const [nombre, setNombre] = useState('');
	const [apellido, setApellido] = useState('');
	const [dni, setDni] = useState('');
	const [cuil, setCuil] = useState('');
	const [perfil, setPerfil] = useState('');
	const [foto, setFoto] = useState();
	const [credentialsInvalid, setCredentialsInvalid] = useState({
		correo: false,
		clave: false,
		nombre: false,
		apellido: false,
		dni: false,
		cuil: false,
		perfil: false
	});
	const [isAuthenticating, setIsAuthenticating] = useState(false);

	async function agregarUsuario(user) {
		const nombreEnStorage = `usuarios/${user.email}.jpg`;
		const storageRef = ref(getStorage(), nombreEnStorage);

		let url = '';
		if (foto) {
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
			url = await getDownloadURL(storageRef);

		}

		const usuario = {
			correo,
			nombre,
			apellido,
			dni,
			cuil,
			perfil,
			foto: url
		}

		await setDoc(doc(getFirestore(), 'usuarios', user.uid), usuario);
		// setIsAuthenticating(false);
		return;
	}

	async function onSubmitHandler() {
		const correoIsValid = correo.trim().includes('@');
		const claveIsValid = clave.trim().length >= 6;
		const nombreIsValid = nombre.trim().length >= 1;
		const apellidoIsValid = apellido.trim().length >= 1;
		const dniIsValid = dni.trim().length >= 7; // ?
		const cuilIsValid = cuil.trim().length >= 1;
		const perfilIsValid = perfil.trim().length >= 1;

		if (
			!correoIsValid ||
			!claveIsValid ||
			!nombreIsValid ||
			!apellidoIsValid ||
			!dniIsValid ||
			!cuilIsValid ||
			!perfilIsValid
		) {
			setCredentialsInvalid({
				correo: !correoIsValid,
				clave: !claveIsValid,
				nombre: !nombreIsValid,
				apellido: !apellidoIsValid,
				dni: !dniIsValid,
				cuil: !cuilIsValid,
				perfil: !perfilIsValid
			});
			return;
		}

		setIsAuthenticating(true);
		try {
			const usuario = await signUp(correo, clave);
			await agregarUsuario(usuario);
			await logOut();
			await login(miEmail, '123123'); // Truchada necesaria.
			navigation.navigate({
				name: 'Admin'
			});
		}
		catch (error) {
			let message = getFirebaseErrorMsg(error);
			navigation.navigate({
				name: 'Modal',
				params: {
					mensajeError: message
				}
			});
			setIsAuthenticating(false);
		}
	}

	function dniEscaneadoHandler(datos) {
		setNombre(datos.nombre);
		setApellido(datos.apellido);
		setDni(datos.dni);
		setCuil(datos.cuil);
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
			case 'nombre':
				setNombre(enteredValue);
				break;
			case 'apellido':
				setApellido(enteredValue);
				break;
			case 'dni':
				setDni(enteredValue);
				break;
			case 'cuil':
				setCuil(enteredValue);
				break;
			case 'perfil':
				setPerfil(enteredValue);
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
				<Input
					label="CUIL"
					onUpdateValue={updateInputValueHandler.bind(this, 'cuil')}
					value={cuil}
					keyboardType="numeric"
					isInvalid={credentialsInvalid.cuil}
				/>
				<Input
					label="Tipo de empleado"
					onUpdateValue={updateInputValueHandler.bind(this, 'perfil')}
					value={perfil}
					isInvalid={credentialsInvalid.perfil}
				/>
				<View style={styles.buttons}>
					<Button onPress={onSubmitHandler}>
						Agregar usuario
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
		return <LoadingOverlay message="Agregando..." />;
	}
	return (
		<ScrollView>
			<View style={styles.fotoContainer}>
				{
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
	accesosContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: Colors.primary500,
		marginTop: 10,
		marginBottom: 30,
		marginHorizontal: 50,
		padding: 30,
		height: 96,
		borderRadius: 4,
	},
	accesosTexto: {
		fontSize: 20,
		color: 'white'
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
	}
});
