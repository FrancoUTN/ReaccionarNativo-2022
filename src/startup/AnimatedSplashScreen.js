import { useCallback, useMemo } from "react";
import { Animated, StyleSheet, View} from "react-native";
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

    const animation = useMemo(() => new Animated.Value(1), []);
    
    const efecto = () => {
        Animated.timing(animation,
        {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
        }).start(() => onFinish());
    };

    const onImageLoaded = useCallback(async () => {
        try {
            await SplashScreen.hideAsync();
            // SplashScreen.hideAsync();
        } catch (e) {
            console.log(e); // Útil
        } finally {
            efecto();
        }
    }, []);

    return (
        <View style={{ flex: 1 }}>
        {
            fontsLoaded &&
            <Animated.View
                pointerEvents="none"
                style={[
                    StyleSheet.absoluteFill,
                    {
                        backgroundColor: '#000000', // Manual
                    },
                ]}
            >
            <Animated.Image
                style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "contain", // Manual
                    opacity: animation,
                }}
                source={require('../../assets/splash.png')}
                onLoadEnd={onImageLoaded}
                fadeDuration={0}
            />
            </Animated.View>
        }
        </View>
    );
}