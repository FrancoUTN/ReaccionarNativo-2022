import { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Audio } from "expo-av";
import { AuthContext } from "../store/auth-context";
import { Colors } from "../constants/styles";
import LoginScreen from "../screens/generic/LoginScreen";
import ModalScreen from "../screens/generic/ModalScreen";
import IconButton from "../components/ui/IconButton";
import RegistroScreen from "../screens/create/RegistroScreen";
import AdminScreen from "../screens/main/AdminScreen";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import ListadoClientesScreen from "../screens/specific/ListadoClientesScreen";
import AnonimoScreen from "../screens/main/AnonimoScreen";
import BotonEscanearScreen from "../screens/specific/BotonEscanearScreen";
import AltaMesaScreen from "../screens/create/AltaMesaScreen";
import MesaAgregadaScreen from "../screens/create/MesaAgregadaScreen";
import MetreScreen from "../screens/main/MetreScreen";
import ClienteScreen from "../screens/main/ClienteScreen";
import ChatScreen from "../screens/specific/ChatScreen";
import AltaEmpleadoScreen from "../screens/create/AltaEmpleadoScreen";
import MozoScreen from "../screens/main/MozoScreen";
import PreparadorScreen from "../screens/main/PreparadorScreen";
import AltaProductoScreen from "../screens/create/AltaProductoScreen";
import MenuScreen from "../screens/specific/MenuScreen";
import PedidoAgregadoScreen from "../screens/specific/PedidoAgregadoScreen";
import PedidosScreen from "../screens/specific/PedidosScreen";
import PreRegistroScreen from "../screens/specific/PreRegistroScreen";
import EncuestaScreen from "../screens/specific/EncuestaScreen";
import EstadisticaEncuestasScreen from "../screens/specific/EstadisticaEncuestasScreen";
import EstadoPedidoScreen from "../screens/specific/EstadoPedidoScreen";

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
        }}
      />
      <Stack.Screen
        name="Registro"
        component={RegistroScreen}
        options={{
          title: "Registro",
        }}
      />
      <Stack.Group
        screenOptions={{
          presentation: "modal",
          headerStyle: { backgroundColor: Colors.error500 },
          headerTintColor: "white",
          contentStyle: { backgroundColor: Colors.error300 },
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
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/sounds/logout.mp3")
    );
    await sound.playAsync();
    setTimeout(() => {
      sound.unloadAsync();
    }, 2500);
  }

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
            options={{
              ...opcionesTipicas,
              title: "Adminstrador",
            }}
          />
          <Stack.Screen
            name="ListadoClientes"
            component={ListadoClientesScreen}
            options={{
              ...opcionesTipicas,
              title: "Clientes",
            }}
          />
          <Stack.Screen
            name="AltaMesa"
            component={AltaMesaScreen}
            options={{
              ...opcionesTipicas,
              title: "Alta de mesa",
            }}
          />
          <Stack.Screen
            name="MesaAgregada"
            component={MesaAgregadaScreen}
            options={{
              ...opcionesTipicas,
              title: "Mesa agregada",
            }}
          />
          <Stack.Screen
            name="AltaEmpleado"
            component={AltaEmpleadoScreen}
            options={{
              ...opcionesTipicas,
              title: "Alta de empleado",
            }}
          />
          <Stack.Screen
            name="EstadisticaEncuestas"
            component={EstadisticaEncuestasScreen}
            options={{
              ...opcionesTipicas,
              title: "Estadísticas",
            }}
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
            options={{
              ...opcionesTipicas,
              title: "Alta de producto",
            }}
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
            options={{
              ...opcionesTipicas,
              title: "Ingreso anónimo",
            }}
          />
          <Stack.Screen
            name="BotonEscanear"
            component={BotonEscanearScreen}
            options={{
              ...opcionesTipicas,
              title: "Escáner",
            }}
          />
          <Stack.Screen
            name="Cliente"
            component={ClienteScreen}
            options={opcionesTipicas}
          />
          <Stack.Screen
            name="Menu"
            component={MenuScreen}
            options={{
              ...opcionesTipicas,
              title: "Menú",
            }}
          />
          <Stack.Screen
            name="PedidoAgregado"
            component={PedidoAgregadoScreen}
            options={{
              ...opcionesTipicas,
              title: "Pedido realizado",
            }}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={opcionesTipicas}
          />
          <Stack.Screen
            name="EstadoPedido"
            component={EstadoPedidoScreen}
            options={{
              ...opcionesTipicas,
              title: "Pedido",
            }}
          />
          <Stack.Screen
            name="EstadisticaEncuestas"
            component={EstadisticaEncuestasScreen}
            options={{
              ...opcionesTipicas,
              title: "Estadísticas",
            }}
          />
          <Stack.Screen
            name="Encuesta"
            component={EncuestaScreen}
            options={{
              ...opcionesTipicas,
              title: "Encuesta",
            }}
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
            options={{
              ...opcionesTipicas,
              title: "Escáner",
            }}
          />
          <Stack.Screen
            name="Cliente"
            component={ClienteScreen}
            options={opcionesTipicas}
          />
          <Stack.Screen
            name="Menu"
            component={MenuScreen}
            options={{
              ...opcionesTipicas,
              title: "Menú",
            }}
          />
          <Stack.Screen
            name="PedidoAgregado"
            component={PedidoAgregadoScreen}
            options={{
              ...opcionesTipicas,
              title: "Pedido realizado",
            }}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={opcionesTipicas}
          />
          <Stack.Screen
            name="EstadoPedido"
            component={EstadoPedidoScreen}
            options={{
              ...opcionesTipicas,
              title: "Pedido",
            }}
          />
          <Stack.Screen
            name="EstadisticaEncuestas"
            component={EstadisticaEncuestasScreen}
            options={{
              ...opcionesTipicas,
              title: "Estadísticas",
            }}
          />
          <Stack.Screen
            name="Encuesta"
            component={EncuestaScreen}
            options={{
              ...opcionesTipicas,
              title: "Encuesta",
            }}
          />
        </>
      );
      break;
    case "pendiente":
    case "rechazado":
      retorno = (
        <>
          <Stack.Screen
            name="PreRegistro"
            component={PreRegistroScreen}
            options={{ title: "Error" }}
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
          contentStyle: { backgroundColor: Colors.error300 },
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
