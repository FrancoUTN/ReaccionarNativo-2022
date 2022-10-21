import { useContext, useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Audio } from "expo-av";
import { AuthContext } from "../store/auth-context";
import { Colors } from "../constants/styles";
import LoginScreen from "../screens/LoginScreen";
import ModalScreen from "../screens/ModalScreen";
import IconButton from "../components/ui/IconButton";
import RegistroScreen from "../screens/RegistroScreen";
import AdminScreen from "../screens/AdminScreen";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import ListadoClientesScreen from "../screens/ListadoClientesScreen";
import AnonimoScreen from "../screens/AnonimoScreen";
import BotonEscanearScreen from "../screens/BotonEscanearScreen";
import AltaMesaScreen from "../screens/AltaMesaScreen";
import MesaAgregadaScreen from "../screens/MesaAgregadaScreen";
import MetreScreen from "../screens/MetreScreen";
import ClienteScreen from "../screens/ClienteScreen";
import ChatScreen from "../screens/ChatScreen";
import AltaEmpleadoScreen from "../screens/AltaEmpleadoScreen";
import MozoScreen from "../screens/MozoScreen";
import PreparadorScreen from "../screens/PreparadorScreen";
import AltaProductoScreen from "../screens/AltaProductoScreen";
import MenuScreen from "../screens/MenuScreen";
import PedidoAgregadoScreen from "../screens/PedidoAgregadoScreen";
import PedidosScreen from "../screens/PedidosScreen";
import LoadingScreen from "../screens/LoadingScreen";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.email && <AuthStack />}
      {!!authCtx.email && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: "Inicia sesión",
          headerTitleStyle: {
            fontFamily: "Montserrat_500Medium",
          },
        }}
      />
      <Stack.Screen
        name="Registro"
        component={RegistroScreen}
        options={{
          title: "Registro",
          headerTitleStyle: {
            fontFamily: "Montserrat_500Medium",
          },
        }}
      />
      <Stack.Group
        screenOptions={{
          presentation: "modal",
          headerStyle: { backgroundColor: Colors.error500 },
          headerTintColor: "white",
          contentStyle: { backgroundColor: Colors.error100 },
        }}
      >
        <Stack.Screen
          name="Modal"
          component={ModalScreen}
          options={{ title: "Error" }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  /* HERIK CHANGE  */
  const [sound, setSound] = useState(false);
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/sounds/logout.mp3")
    );
    setSound(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  /******** */
  const authCtx = useContext(AuthContext);
  const logoutIcon = (
    <IconButton
      icon="power"
      color="white"
      size={24}
      onPress={() => {
        playSound();
        authCtx.logout();
      }}
    />
  );
  const opcionesTipicas = {
    headerTitleStyle: {
      fontFamily: "Montserrat_500Medium",
    },
    headerRight: () => logoutIcon,
  };
  let retorno = <></>;

  switch (authCtx.perfil) {
    case "admin":
      retorno = (
        <>
          <Stack.Screen
            name="Admin"
            component={AdminScreen}
            options={opcionesTipicas}
          />
          <Stack.Screen
            name="ListadoClientes"
            component={ListadoClientesScreen}
            options={opcionesTipicas}
          />
          <Stack.Screen
            name="AltaMesa"
            component={AltaMesaScreen}
            options={opcionesTipicas}
          />
          <Stack.Screen
            name="MesaAgregada"
            component={MesaAgregadaScreen}
            options={opcionesTipicas}
          />
          <Stack.Screen
            name="AltaEmpleado"
            component={AltaEmpleadoScreen}
            options={opcionesTipicas}
          />
        </>
      );
      break;
    case "metre":
      retorno = (
        <>
          <Stack.Screen
            name="Metre"
            component={MetreScreen}
            options={opcionesTipicas}
          />
        </>
      );
      break;
    case "mozo":
      retorno = (
        <>
          <Stack.Screen
            name="Mozo"
            component={MozoScreen}
            options={opcionesTipicas}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={opcionesTipicas}
          />
          <Stack.Screen
            name="Pedidos"
            component={PedidosScreen}
            options={opcionesTipicas}
          />
        </>
      );
      break;
    case "cocinero":
    case "bartender":
      retorno = (
        <>
          <Stack.Screen
            name="Preparador"
            component={PreparadorScreen}
            options={opcionesTipicas}
            initialParams={{ perfil: authCtx.perfil }}
          />
          <Stack.Screen
            name="AltaProducto"
            component={AltaProductoScreen}
            options={opcionesTipicas}
          />
          <Stack.Screen
            name="Pedidos"
            component={PedidosScreen}
            options={opcionesTipicas}
          />
        </>
      );
      break;
    case "anon":
      retorno = (
        <>
          <Stack.Screen
            name="Anonimo"
            component={AnonimoScreen}
            options={opcionesTipicas}
          />
          <Stack.Screen
            name="BotonEscanear"
            component={BotonEscanearScreen}
            options={opcionesTipicas}
          />
          <Stack.Screen
            name="Cliente"
            component={ClienteScreen}
            options={opcionesTipicas}
          />
          <Stack.Screen
            name="Menu"
            component={MenuScreen}
            options={opcionesTipicas}
          />
          <Stack.Screen
            name="PedidoAgregado"
            component={PedidoAgregadoScreen}
            options={opcionesTipicas}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={opcionesTipicas}
          />
        </>
      );
      break;
    case "registrado":
      retorno = (
        <>
          <Stack.Screen
            name="BotonEscanear"
            component={BotonEscanearScreen}
            options={opcionesTipicas}
          />
          <Stack.Screen
            name="Cliente"
            component={ClienteScreen}
            options={opcionesTipicas}
          />
          <Stack.Screen
            name="Menu"
            component={MenuScreen}
            options={opcionesTipicas}
          />
          <Stack.Screen
            name="PedidoAgregado"
            component={PedidoAgregadoScreen}
            options={opcionesTipicas}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={opcionesTipicas}
          />
        </>
      );
      break;
    default:
      return <LoadingOverlay message={"Perfil inexistente."} />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      {retorno}
      <Stack.Group
        screenOptions={{
          presentation: "modal",
          headerStyle: { backgroundColor: Colors.error500 },
          headerTintColor: "white",
          contentStyle: { backgroundColor: Colors.error100 },
        }}
      >
        <Stack.Screen
          name="Modal"
          component={ModalScreen}
          options={{ title: "Error interno" }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
