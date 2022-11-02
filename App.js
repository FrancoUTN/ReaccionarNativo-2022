import { useState, useRef, useEffect } from "react";
import { StatusBar } from "expo-status-bar";

import "./src/util/auth"; // Inicializa App y Auth
import AuthContextProvider from "./src/store/auth-context";
import AnimatedSplashScreen from "./src/startup/AnimatedSplashScreen";
import Navigation from "./src/startup/Navigation";
import "react-native-gesture-handler";

export default function App() {
  const [appLoading, setAppLoading] = useState(true);

  function onFinishHandler() {
    setAppLoading(false);
  }

  return (
    <>
      {appLoading ? (
        <AnimatedSplashScreen onFinish={onFinishHandler} />
      ) : (
        <>
          <StatusBar style="light" />
          <AuthContextProvider>
            <Navigation />
          </AuthContextProvider>
        </>
      )}
    </>
  );
}
