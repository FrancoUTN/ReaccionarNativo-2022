import { StyleSheet, View, Text, Pressable } from 'react-native';

import { Colors } from '../../constants/styles';


export default function Apretable({ children, onPress, fontSize, desactivado }) {
	const texto = 
		<Text style={[styles.textoBoton, fontSize && { fontSize: fontSize} ]}>
			{ children }
		</Text>;

    return (
        <View style={styles.botonContainer}>
		{
			desactivado ?
            <View style={styles.viewContainer}>
				{ texto }
			</View>
			:
            <Pressable
                style={({ pressed }) => [styles.boton, pressed && styles.apretado]}
                onPress={onPress}
            >
				{ texto }
            </Pressable>
		}
        </View>
    );
}

const styles = StyleSheet.create({
	botonContainer: {
		flex: 1,
		paddingHorizontal: 20,
		justifyContent: 'center'
	},
	viewContainer: {
		flex: .85,
		justifyContent:'center',
		alignItems: 'center',
		backgroundColor: Colors.primary800,
		borderRadius: 10,
		opacity: 0.6,
	},
	boton: {
		flex: .85,
		justifyContent:'center',
		alignItems: 'center',
		backgroundColor: Colors.primary800,
		borderRadius: 10
	},
	apretado: {
		opacity: 0.7
	},
	textoBoton: {
		color: 'white',
		fontSize: 26,
	}
});
