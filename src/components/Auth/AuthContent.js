import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FloatingAction } from "react-native-floating-action";

import AuthForm from "./AuthForm";
import { Colors } from "../../constants/styles";
import { useNavigation } from "@react-navigation/native";
import Button from "../ui/Button";

function AuthContent({ isLogin, onAuthenticate }) {
  const navigation = useNavigation();

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
  });

  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");

  const valoresAccion = {
    icon: require("../../../assets/arrow.png"),
    color: Colors.terciary,
    textColor: Colors.terciary,
  };

  const acciones = [
    {
      text: "Administrador",
      name: "admin",
      ...valoresAccion,
    },
    {
      text: "Registrado",
      name: "registrado",
      ...valoresAccion,
    },
    {
      text: "Anónimo",
      name: "anonimo",
      ...valoresAccion,
    },
    {
      text: "Metre",
      name: "metre",
      ...valoresAccion,
    },
    {
      text: "Mozo",
      name: "mozo",
      ...valoresAccion,
    },
    {
      text: "Cocinero",
      name: "cocinero",
      ...valoresAccion,
    },
    {
      text: "Bartender",
      name: "bartender",
      ...valoresAccion,
    },
  ];

  function submitHandler(credentials) {
    let { email, password } = credentials;

    email = email.trim();
    password = password.trim();

    const emailIsValid = email.includes("@");
    const passwordIsValid = password.length >= 6;

    if (!emailIsValid || !passwordIsValid) {
      navigation.navigate({
        name: "Modal",
        params: { mensajeError: "Datos inválidos." },
      });

      setCredentialsInvalid({
        email: !emailIsValid,
        password: !passwordIsValid,
      });

      return;
    }

    onAuthenticate({ email, password });
  }

  function onPressItemHandler(name) {
    setClave("123123");    
    switch (name) {
      case "admin":
        setCorreo("admin@rnativo.com");
        break;
      case "registrado":
        setCorreo("registrado@rnativo.com");
        break;
      case "anonimo":
        setCorreo("anonimo@rnativo.com");
        break;
      case "metre":
        setCorreo("metre@rnativo.com");
        break;
      case "mozo":
        setCorreo("mozo@rnativo.com");
        break;
      case "cocinero":
        setCorreo("cocinero@rnativo.com");
        break;
      case "bartender":
        setCorreo("bartender@rnativo.com");
        break;
    }
  }

  function registrateHandler() {
    navigation.navigate({
      name: "Registro",
    });
  }

  return (
    <>
      <View style={styles.authContent}>
        <AuthForm
          isLogin={isLogin}
          onSubmit={submitHandler}
          credentialsInvalid={credentialsInvalid}
          correo={correo}
          clave={clave}
        />
      </View>
      <View style={styles.registrateContainer}>
        <Button onPress={registrateHandler}>...o regístrate</Button>
      </View>
      <View style={styles.accesosContainer}>
        <Text style={styles.accesosTexto}>Acceso rápido:</Text>
        <FloatingAction
          actions={acciones}
          color={Colors.primary800}
          buttonSize={48}
          distanceToEdge={{ vertical: 22, horizontal: 28 }}
          onPressItem={(name) => onPressItemHandler(name)}
        />
      </View>
    </>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  authContent: {
    marginTop: 64,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 4,
    backgroundColor: Colors.primary500,
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  accesosContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.primary500,
    marginTop: 10,
    marginBottom: 30,
    marginHorizontal: 50,
    padding: 30,
    height: 96,
    borderRadius: 10,
  },
  accesosTexto: {
    fontSize: 20,
    color: "white",
  },
  registrateContainer: {
    margin: 30,
    padding: 10,
    // backgroundColor: Colors.primary500,
    borderRadius: 10,
    paddingHorizontal: 50,
  },
});
