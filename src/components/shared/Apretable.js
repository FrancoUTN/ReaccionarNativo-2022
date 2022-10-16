import { StyleSheet, View, Text, Pressable } from 'react-native';

import { Colors } from '../../constants/styles';


export default function Apretable({ children, onPress, fontSize }) {
    return (
        <View style={styles.botonContainer}>
            <Pressable
                style={({ pressed }) => [styles.boton, pressed && styles.apretado]}
                onPress={onPress}
            >
                <Text style={[styles.textoBoton, fontSize && { fontSize: fontSize} ]}>
                { children }
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
	botonContainer: {
		flex: 1,
		padding: 20
	},
	boton: {
		flex: 1,
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
		fontFamily: 'Montserrat_400Regular'
	}
});
