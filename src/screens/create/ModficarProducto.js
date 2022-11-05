import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  addDoc,
  collection,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import Camara from "../../components/altas/Camara";
import Button from "../../components/ui/Button";
import LoadingOverlay from "../../components/ui/LoadingOverlay";
import { Colors } from "../../constants/styles";
import Input from "../../components/Auth/Input";
import QrBase64 from "../../components/shared/QrBase64";
import Apretable from "../../components/shared/Apretable";

const ModficarProducto = () => {
  return (
    <View>
      <Text>ModficarProducto</Text>
    </View>
  );
};

export default ModficarProducto;
