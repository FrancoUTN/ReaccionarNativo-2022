import { useContext, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import Camara from '../../components/altas/Camara';
import Button from '../../components/ui/Button';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import { Colors } from '../../constants/styles';
import Input from '../../components/Auth/Input';
import { getAuth } from 'firebase/auth';
import getFirebaseErrorMsg from "../../util/firebaseErrorMsg";
import { AuthContext } from '../../store/auth-context';

export default function AnonimoScreen({ navigation }) {
	const miUsuario = getAuth().currentUser;
	const authCtx = useContext(AuthContext);
	const [cargando, setCargando] = useState(true);
	const [tomarFoto, setTomarFoto] = useState(false);
	const [nombre, setNombre] = useState('');
	const [foto, setFoto] = useState();
	const [credentialsInvalid, setCredentialsInvalid] = useState({
		nombre: false,
		foto: false
	});
	const [isAuthenticating, setIsAuthenticating] = useState(false);

	useEffect(() => {
		async function obtener() {
			const docRef = doc(getFirestore(), 'usuarios', miUsuario.uid);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				const miEstado = docSnap.data().estado;
				if (miEstado != 'libre') {
					navigation.replace('BotonEscanear');
				}
				else {
					setCargando(false);
				}
			}
		}

		obtener();
	}, []);

	async function modificarUsuario(user) {
		const nombreEnStorage = `usuarios/${user.email}.jpg`;
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

		const usuario = {
			nombre,
			foto: url
		}

		const docRef = doc(getFirestore(), 'usuarios', user.uid);
		await updateDoc(docRef, usuario);
				
		// Actualizo la foto de perfil en context:
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			const miPerfil = docSnap.data().perfil;
			const miFoto = docSnap.data().foto;
			authCtx.authenticate(user.email, miPerfil, user.uid, miFoto);
		}

		setIsAuthenticating(false);
		return;
	}

	async function onSubmitHandler() {
		const nombreIsValid = nombre.length >= 1;
		const fotoIsValid = !!foto;

		if (
			!nombreIsValid ||
			!fotoIsValid
		) {
			setCredentialsInvalid({
				nombre: !nombreIsValid,
				foto: !fotoIsValid
			});
			return;
		}

		setIsAuthenticating(true);
		try {
			await modificarUsuario(miUsuario);
			navigation.replace('BotonEscanear');
		}
		catch (error) {
			let message = getFirebaseErrorMsg(error);
			navigation.navigate({
				name: 'Modal',
				params: { mensajeError: message }
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
		setNombre(enteredValue);
	}

	const ClienteForm = (
		<View style={styles.form}>
			<View>
				<Input
					label="Nombre"
					onUpdateValue={updateInputValueHandler.bind(this, 'nombre')}
					value={nombre}
					isInvalid={credentialsInvalid.nombre}
				/>
				<View style={styles.buttons}>
					<Button onPress={onSubmitHandler}>
						Registrar
					</Button>
				</View>
			</View>
		</View>
	);

	
	if (cargando) {
		return <LoadingOverlay message="Accediendo..." />;
	}
	if (tomarFoto) {
		return <Camara fotoTomada={fotoTomadaHandler}/>;
	}
	if (isAuthenticating) {
		return <LoadingOverlay message="Registrando..." />;
	}
	return (
		<ScrollView>
			<View style={styles.iconContainer}>
				<Image
					style={styles.imagen}
					source={require("../../../assets/otros/intruder.png")}
				/>
			</View>
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
	},
	iconContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 40,
		marginTop: 20,
	},
	fotoErrorText: {
		fontSize: 20,
		margin: 30,
		color: Colors.error100,
	}
});
