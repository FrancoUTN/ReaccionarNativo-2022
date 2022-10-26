import { Dimensions } from "react-native";

let { width, height } = Dimensions.get("screen");
width = width / 1.2;
height = height / 1.2;

const Sizes_ = {
  xl: height * 0.06, // 55
  big: height * 0.04, // 35
  normal: height * 0.035, // 30
  small: height * 0.0231, // 20
  x_small: height * 0.017, // 11
  spacing: width * 0.004, // 1.5
};
export default Sizes_;
