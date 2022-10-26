import { useEffect } from "react";
import { View, Text, Animated, Easing } from "react-native";
import { Colors } from "../constants/styles";
import Sizes_ from "../util/Sizes";
const LoadingScreen = (props) => {
  const { text = "Cargando ... " } = props;
  useEffect(() => {
    console.log(text, "texto");
    startImageRotateFunction();
  });

  let rotateValueHolder = new Animated.Value(0);
  const startImageRotateFunction = () => {
    rotateValueHolder.setValue(0);
    Animated.timing(rotateValueHolder, {
      toValue: 1,
      duration: 1500,
      easing: Easing.bounce,
      useNativeDriver: false,
    }).start(() => {
      startImageRotateFunction();
    });
  };

  const rotateData = rotateValueHolder.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["0deg", "180deg", "360deg"],
  });
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: Colors.primary100,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "35%",
            height: "20%",
            marginVertical: 10,
          }}
        >
          <Animated.Image
            source={require("../../assets/icon2.png")}
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "contain",
              transform: [{ rotate: rotateData }],
            }}
          />
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={{ fontSize: Sizes_.normal }}>{text}</Text>
        </View>
      </View>
    </View>
  );
};
export default LoadingScreen;
