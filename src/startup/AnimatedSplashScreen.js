import { useCallback, useMemo } from "react";
import { View, Text, Image, Animated, Easing, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";

import { Colors } from "../constants/styles";


SplashScreen.preventAutoHideAsync().catch(() => {});

export default function AnimatedSplashScreen({ onFinish }) {  
  const onImageLoaded = useCallback(async () => {
    try {
        await SplashScreen.hideAsync();
    } catch (e) {
        console.log(e); // Útil
    } finally {
        animate();
    }
  }, []);

  const scaleValue = useMemo(() => new Animated.Value(0), []);
  const animate = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => onFinish());
  };

  const cardScale = scaleValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
  });

  return (
    <View style={{ flex: 1, backgroundColor: Colors.primary100 }}>
      <Animated.View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          transform: [{ scale: cardScale }],
        }}
      >
        <View
          style={{
            position: "absolute",
            top: "20%",
            width: "100%",
            borderWidth: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20 }}>Reaccionar Nativo</Text>
        </View>
        <View
          style={{
            width: "50%",
            height: "30%",
          }}
        >
          <Image
            source={require("../../assets/icon2.png")}
            style={{ width: "100%", height: "100%", resizeMode: "contain" }}
            onLoadEnd={onImageLoaded}
          />
        </View>
        <View
          style={{
            position: "absolute",
            bottom: "10%",
            width: "100%",
            borderWidth: 0,
            paddingHorizontal: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={styles.viewAlumno}>
            <Text style={styles.textAlumno}>
              Herik Arismendy{" "}
            </Text>
          </View>
          <View style={styles.viewAlumno}>
            <Text style={styles.textAlumno}>
              Agustín Cantero{" "}
            </Text>
          </View>
          <View style={styles.viewAlumno}>
            <Text style={styles.textAlumno}>
              Franco Catania{" "}
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewAlumno: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  textAlumno: {
    marginVertical: 2,
  },
});
