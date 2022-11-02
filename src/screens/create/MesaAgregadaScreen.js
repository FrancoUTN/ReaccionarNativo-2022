import { Image, StyleSheet, Text, View} from 'react-native';

import Apretable from '../../components/shared/Apretable';
import { Colors } from '../../constants/styles';


export default function MesaAgregadaScreen({ navigation, route }) {
	const qrEnBase64 = route.params.qrEnBase64;

    function onPressHandler() {
		navigation.navigate({ name: 'Admin' });
	}

	return (
		<View style={styles.container}>
            <View style={styles.mesaContainer}>
                <Text style={styles.textoMesa}>
                    ¡Mesa agregada con éxito!
                </Text>
                <Image
                    style={styles.imagen}
                    source={{
                    uri: 'data:image/png;base64,' + qrEnBase64,
                    }}
                />                
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
