import { StyleSheet, View} from 'react-native';

import Apretable from '../components/shared/Apretable';


export default function MozoScreen({ navigation }) {
	function onConsultasPressHandler() {
		navigation.navigate({
			name: 'Chat',
			params: { mozo: true }
		});
	}

	function onPedidosPressHandler() {
		navigation.navigate({
			name: 'Pedidos'
		});
	}
	
	return (
		<View style={styles.container}>
			<Apretable
				onPress={onConsultasPressHandler}
			>
				Consultas de clientes
			</Apretable>
			<Apretable
				onPress={onPedidosPressHandler}
			>
				Pedidos
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
