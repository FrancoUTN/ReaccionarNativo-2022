import { StyleSheet, View} from 'react-native';

import Apretable from '../components/shared/Apretable';


export default function ClienteScreen({ navigation }) {
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
				Consulta al mozo
			</Apretable>
			<Apretable
				onPress={onPressHandler}
			>
				Reservar
			</Apretable>
			<Apretable
				onPress={onPressHandler}
			>
				Pedir por Delivery
			</Apretable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 30
	}
});
