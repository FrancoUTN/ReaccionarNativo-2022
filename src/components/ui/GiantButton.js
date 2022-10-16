import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function GiantButton({ children, onPress, color }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.rootContainer, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={[styles.botonGigante, color]}>
          <Text style={styles.buttonText}>
            {children}
          </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: 'Montserrat_700Bold',
    color: 'white',
    fontSize: 28,
  },
  botonGigante: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
