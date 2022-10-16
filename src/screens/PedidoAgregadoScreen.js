import { Image, StyleSheet, Text, View} from 'react-native';

import Apretable from '../components/shared/Apretable';
import { Colors } from '../constants/styles';


export default function PedidoAgregadoScreen({ navigation, route }) {
    function onPressHandler() {
		navigation.navigate({ name: 'Cliente' });
	}

	return (
		<View style={styles.container}>
            <View style={styles.mesaContainer}>
                <Text style={styles.textoMesa}>
                    Pedido solicitado con éxito.
                </Text>           
            </View>
			<Apretable
				onPress={onPressHandler}
                fontSize={22}
			>
				Volver
			</Apretable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 50,
	},
    mesaContainer: {
        flex: 4,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: Colors.primary500,
        borderRadius: 10,
        marginVertical: 50
    },
    imagen: {
        width: 150,
        height: 150
    },
    textoMesa: {
        fontSize: 24,
        color: 'white',
        textAlign: 'center'
    }
});
