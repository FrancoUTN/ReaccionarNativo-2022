import { useCallback, useEffect } from "react";
import { View, Text, Image, Animated, Easing } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { Colors } from "../constants/styles";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function AnimatedSplashScreen({ onFinish }) {
  useEffect(() => {
    onImageLoaded();
    animate();
    setTimeout(() => {
      onFinish();
    }, 3000);
  }, []);

  const onImageLoaded = useCallback(async () => {
    try {
      await SplashScreen.hideAsync();
    } catch (e) {
      console.log(e);
    }
  }, []);

  let scaleValue = new Animated.Value(0);
  const animate = () => {
    scaleValue.setValue(0);

    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {});
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
    </View>
  );
}
