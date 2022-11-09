import { useEffect } from 'react';
import { StyleSheet, View} from 'react-native';
import * as Notifications from "expo-notifications";

import Apretable from '../../components/shared/Apretable';

export default function MozoScreen({ navigation }) {
	const lastNotificationResponse = Notifications.useLastNotificationResponse();
	
	useEffect(() => {
		if (lastNotificationResponse) {
		  const action = lastNotificationResponse.notification.request.content.data.action;
		  console.log(action);
		  if (action == "MENSAJE_NUEVO") {
			navigation.navigate({
				name: 'Chat',
				params: { mozo: true }
			});
		  }
		  else if (action == "PEDIDO_LISTO") {
			navigation.navigate({
				name: 'Pedidos'
			});
		  }
		}
	}, [lastNotificationResponse]);

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
