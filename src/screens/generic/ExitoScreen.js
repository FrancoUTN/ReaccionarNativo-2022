import { Button, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/styles';

export default function ExitoScreen({ route, navigation }) {
  const mensaje = route.params?.mensaje;
  const volverA = route.params?.volverA;

  // Mala práctica, pero ya fue
  function onVolverPressHandler() {
    switch(volverA) {
      case 'Login':
        navigation.navigate({
          name: 'Login',
        });
        break;
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.texto}>
        { mensaje }
      </Text>
      <Button onPress={onVolverPressHandler} title="Volver" color={Colors.primary500}/>
    </View>
  );
}

const styles = StyleSheet.create({
  texto: {
    fontSize: 30,
    color: Colors.success,
    margin: 20
  }
});