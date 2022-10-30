import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useContext, useState } from "react";
import { Audio } from "expo-av";
import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { AuthContext } from "../store/auth-context";
import { login } from "../util/authentication";

function LoginScreen({ navigation }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);
  /* HERIK CHANGE  */
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/sounds/sounLogin.wav")
    );
    await sound.playAsync();
    setTimeout(() => {
      sound.unloadAsync();
    }, 2500);
  }
  /******** */

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const usuario = await login(email, password);

      const docRef = doc(getFirestore(), "usuarios", usuario.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        playSound();
        authCtx.authenticate(usuario.email, docSnap.data().perfil, usuario.uid);
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
