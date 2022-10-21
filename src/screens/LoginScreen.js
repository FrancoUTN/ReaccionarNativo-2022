import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useContext, useState, useEffect } from "react";
import { Audio } from "expo-av";
import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { AuthContext } from "../store/auth-context";
import { login } from "../util/authentication";
import LoadingScreen from "./LoadingScreen";

function LoginScreen({ navigation }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [loading, setLoading] = useState(false);

  const authCtx = useContext(AuthContext);
  /* HERIK CHANGE  */
  const [sound, setSound] = useState(false);
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/sounds/sounLogin.wav")
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

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const usuario = await login(email, password);

      const docRef = doc(getFirestore(), "usuarios", usuario.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("loggeado");
        playSound();
        authCtx.authenticate(usuario.email, docSnap.data().perfil);
      } else {
        console.log("Error en Login: No existe el documento.");
      }
    } catch (error) {
      console.log(error);
      navigation.navigate({
        name: "Modal",
        params: { mensajeError: "Falló la autenticación. Intenta nuevamente" },
      });

      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Accediendo..." />;
  }

  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
