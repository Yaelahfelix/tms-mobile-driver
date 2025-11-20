import { useState } from "react";
import {
  Button,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { primaryColor } from "@/constants/Colors";
import { Box } from "./ui/box";
import { Text } from "./ui/text";
type Props = {
  label: string;
};
export default function ImagePickerComponent({ label }: Props) {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity
      onPress={pickImage}
      className="w-full h-72 justify-center items-center border border-primary-400 bg-white rounded-lg border-dashed"
    >
      {image ? (
        <Image
          source={{ uri: image }}
          className="w-40 h-40 mb-2 rounded-lg shadow"
        />
      ) : (
        <FontAwesome size={60} name="camera" color={primaryColor} />
      )}
      <Text className="text-primary-400 text-lg font-bold">
        {image ? "Ganti Foto" : label}
      </Text>
    </TouchableOpacity>
  );
}
