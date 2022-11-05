import { StyleSheet, Text, View } from 'react-native';

export default function Mensaje({ autor, texto, fecha }) {
  return (
    <View style={[styles.mensajeContainer, autor || {alignSelf: 'flex-end'}]}>
    {
        !!autor &&
        <Text style={styles.autor}>
            {autor}:
        </Text>
    }
        <Text style={styles.texto}>
            {texto}
        </Text>
        <Text style={styles.fecha}>
            {fecha}
        </Text>
    </View>
  );
}

const styles = StyleSheet.create({
    mensajeContainer: {    
        backgroundColor: 'white',
        borderRadius: 4,
        margin: 5,
        padding: 6,
        width: '60%'
    },
    texto: {
        color: '#111111'
    },
    autor: {
        color: '#111111',
        fontWeight: '700'
    },    
    fecha: {
        color: '#555555',
        alignSelf: 'flex-end'
    }
});
