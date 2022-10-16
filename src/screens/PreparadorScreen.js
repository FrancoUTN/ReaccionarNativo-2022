import { useEffect } from 'react';
import { StyleSheet, View} from 'react-native';

import Apretable from '../components/shared/Apretable';


export default function PreparadorScreen({ navigation, route }) {
	const miPerfil = route.params?.perfil;
	
    useEffect(
        () => navigation.setOptions({
            title: miPerfil
        }),
    []);

	function onAgregarPressHandler() {
		navigation.navigate({
			name: 'AltaProducto',
			params: { miPerfil }
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
				onPress={onAgregarPressHandler}
			>
				Agregar { miPerfil == 'cocinero' ? 'plato' : 'bebida' }
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
