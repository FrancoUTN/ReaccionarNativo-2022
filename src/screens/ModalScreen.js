import { Button, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/styles';

export default function ModalScreen({ route, navigation }) {
  const mensajeError = route.params?.mensajeError;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.texto}>
        { mensajeError }
      </Text>
      <Button onPress={() => navigation.goBack()} title="Regresar" color={Colors.primary500}/>
    </View>
  );
}

const styles = StyleSheet.create({
  texto: {
    fontSize: 20,
    color: Colors.primary800,
    margin: 20
  }
});