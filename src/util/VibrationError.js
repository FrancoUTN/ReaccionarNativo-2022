import { Text, View, Vibration, Platform } from "react-native";
import React, { Component } from "react";

export function vibrationError() {
  if (Platform.OS != "ios") {
    return Vibration.vibrate(500);
  } else {
    return Vibration.vibrate(1000);
  }
}
