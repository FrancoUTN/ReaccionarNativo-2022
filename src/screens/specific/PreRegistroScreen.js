import { Button, StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../../store/auth-context";
import { Colors } from "../../constants/styles";
import { useContext } from "react";

export default function PreRegistroScreen() {
  const authCtx = useContext(AuthContext);
  const perfil = authCtx.perfil;

  let mensajeError = "";
  if (perfil == "pendiente") {
    mensajeError =
      "Lo sentimos, aún no has sido aceptado por un administrador.";
  } else if (perfil == "rechazado") {
    mensajeError =
      "Lo sentimos: Su solicitud de acceso al restaurante ha sido rechazada.";
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={styles.texto}>{mensajeError}</Text>
      <Button
        onPress={() => authCtx.logout()}
        title="De acuerdo"
        color={Colors.primary500}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  texto: {
    fontSize: 30,
    color: Colors.primary800,
    margin: 35,
    textAlign: "center",
  },
});
