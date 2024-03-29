import { useContext, useLayoutEffect, useState } from "react";
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
import ProfileScreen from "../screens/generic/ProfileScreen";
import PreRegistroScreen from "../screens/specific/PreRegistroScreen";
import EncuestaScreen from "../screens/specific/EncuestaScreen";
import EstadisticaEncuestasScreen from "../screens/specific/EstadisticaEncuestasScreen";
import EstadoPedidoScreen from "../screens/specific/EstadoPedidoScreen";
import { View } from "react-native";
import CuentaScreen from "../screens/specific/CuentaScreen";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { logOut } from '../util/authentication';
import { useNavigation } from "@react-navigation/native";
import ExitoScreen from "../screens/generic/ExitoScreen";

const auth = getAuth();
const Stack = createNativeStackNavigator();

export default function Navigation() {
  const authCtx = useContext(AuthContext);
  const [hasLoaded, setHasLoaded] = useState(false);

  useLayoutEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (authenticatedUser) => {
      try {
        if (authenticatedUser) {
          const docRef = doc(getFirestore(), "usuarios", authenticatedUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            authCtx.authenticate(docSnap.data().correo, docSnap.data().perfil, authenticatedUser.uid, docSnap.data().foto);
          }
        }
      } catch (error) {
        console.log(error);
      }
      setHasLoaded(true);
    }
    );
    return unsubscribeAuth;
  }, []);

  return (
    <NavigationContainer>
      {authCtx.email && hasLoaded && <AuthenticatedStack />}
      {!authCtx.email && hasLoaded && <AuthStack />}
      {!hasLoaded && <LoadingOverlay message="Accediendo..." />}
    </NavigationContainer>
  );
}

function AuthStack() {
  const authCtx = useContext(AuthContext);
  const soundOnIcon = (
    <IconButton
      icon="volume-high"
      color="white"
      size={24}
      onPress={authCtx.alternarSonidos}
    />
  );
  const soundOffIcon = (
    <IconButton
      icon="volume-mute"
      color="white"
      size={24}
      onPress={authCtx.alternarSonidos}
    />
  );
  const opcionesTipicas = {
    headerRight: () => (
      <>{authCtx.sonidosDesactivados ? soundOffIcon : soundOnIcon}</>
    ),
  };

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
          ...opcionesTipicas,
          title: "Inicia sesión",
        }}
      />
      <Stack.Screen
        name="Registro"
        component={RegistroScreen}
        options={{
          ...opcionesTipicas,
          title: "Registro",
        }}
      />
      <Stack.Screen
        name="Exito"
        component={ExitoScreen}
        options={{
          ...opcionesTipicas,
          title: "Éxito",
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
          options={{
            ...opcionesTipicas,
            title: "Error",
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const navigation = useNavigation();
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/sounds/logout.mp3")
    );
    await sound.playAsync();
    setTimeout(() => {
      sound.unloadAsync();
    }, 2500);
  }

  const editarPerfil = () => {
    navigation.navigate({
      name: "Profile",
    });
  }

  const authCtx = useContext(AuthContext);
  const logoutIcon = (
    <IconButton
      icon="power"
      color="white"
      size={24}
      onPress={() => {
        if (!authCtx.sonidosDesactivados) {
          playSound();
        }
        authCtx.logout();
        logOut();
      }}
    />
  );
  const soundOnIcon = (
    <IconButton
      icon="volume-high"
      color="white"
      size={24}
      onPress={authCtx.alternarSonidos}
    />
  );
  const soundOffIcon = (
    <IconButton
      icon="volume-mute"
      color="white"
      size={24}
      onPress={authCtx.alternarSonidos}
    />
  );
  const profileIcon = (
    <IconButton
      icon="person-circle-outline"
      color="white"
      size={24}
      onPress={editarPerfil}
    />
  );
  const opcionesTipicas = {
    headerRight: () => (
      <View
        style={{
          flexDirection: "row",
          width: 120,
          justifyContent: "space-between",
        }}
      >
        {profileIcon}
        {authCtx.sonidosDesactivados ? soundOffIcon : soundOnIcon}
        {logoutIcon}
      </View>
    ),
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
              headerBackVisible: false,
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
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
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
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
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
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
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
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
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
              headerRight: () => (
                <View
                  style={{
                    flexDirection: "row",
                    width: 80,
                    justifyContent: "space-between",
                  }}
                >
                  {authCtx.sonidosDesactivados ? soundOffIcon : soundOnIcon}
                  {logoutIcon}
                </View>
              ),
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
              headerBackVisible: false,
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
          <Stack.Screen
            name="Cuenta"
            component={CuentaScreen}
            options={{
              ...opcionesTipicas,
              title: "La cuenta",
            }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
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
              headerBackVisible: false,
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
          <Stack.Screen
            name="Cuenta"
            component={CuentaScreen}
            options={{
              ...opcionesTipicas,
              title: "La cuenta",
            }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
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
      <Stack.Screen
        name="Exito"
        component={ExitoScreen}
        options={{
          ...opcionesTipicas,
          title: "Éxito",
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
          options={{ title: "Error interno" }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
