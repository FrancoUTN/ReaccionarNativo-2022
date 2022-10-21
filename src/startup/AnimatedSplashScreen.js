import { useCallback, useMemo } from "react";
import { View, Text, Image, Animated, Easing } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Montserrat_100Thin,
  Montserrat_100Thin_Italic,
  Montserrat_200ExtraLight,
  Montserrat_200ExtraLight_Italic,
  Montserrat_300Light,
  Montserrat_300Light_Italic,
  Montserrat_400Regular,
  Montserrat_400Regular_Italic,
  Montserrat_500Medium,
  Montserrat_500Medium_Italic,
  Montserrat_600SemiBold,
  Montserrat_600SemiBold_Italic,
  Montserrat_700Bold,
  Montserrat_700Bold_Italic,
  Montserrat_800ExtraBold,
  Montserrat_800ExtraBold_Italic,
  Montserrat_900Black,
  Montserrat_900Black_Italic,
} from '@expo-google-fonts/montserrat';

import { Colors } from "../constants/styles";


SplashScreen.preventAutoHideAsync().catch(() => {});

export default function AnimatedSplashScreen({ onFinish }) {
  let [fontsLoaded] = useFonts({
      Montserrat_100Thin,
      Montserrat_100Thin_Italic,
      Montserrat_200ExtraLight,
      Montserrat_200ExtraLight_Italic,
      Montserrat_300Light,
      Montserrat_300Light_Italic,
      Montserrat_400Regular,
      Montserrat_400Regular_Italic,
      Montserrat_500Medium,
      Montserrat_500Medium_Italic,
      Montserrat_600SemiBold,
      Montserrat_600SemiBold_Italic,
      Montserrat_700Bold,
      Montserrat_700Bold_Italic,
      Montserrat_800ExtraBold,
      Montserrat_800ExtraBold_Italic,
      Montserrat_900Black,
      Montserrat_900Black_Italic,
  });
  
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
    {
      fontsLoaded
      &&
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
          <Text style={{ fontSize: 20 }}>APP RESTAURANT PPS 2022</Text>
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
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                marginVertical: 2,
              }}
            >
              Herik Arismendy{" "}
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                marginVertical: 2,
              }}
            >
              Agustin Cantero{" "}
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                marginVertical: 2,
              }}
            >
              Franco Catania{" "}
            </Text>
          </View>
        </View>
      </Animated.View>
    }
    </View>
  );
}
