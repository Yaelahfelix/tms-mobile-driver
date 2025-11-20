import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { AlertCircleIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

import { VStack } from "@/components/ui/vstack";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [isInvalid, setIsInvalid] = useState(false);
  const [inputValue, setInputValue] = useState("12345");
  return (
    <SafeAreaView className="flex-1 mx-5">
      <Center className="flex-1 w-full">
        <VStack className=" w-full">
          <VStack>
            <Text className="text-center" size="2xl" bold>
              Selamat Datang,
            </Text>
            <Text className="text-center">Masukkan Akun Anda</Text>
          </VStack>

          <VStack className="mt-10 gap-5">
            <FormControl
              // isInvalid={isInvalid}
              size="md"
              isDisabled={false}
              isReadOnly={false}
              isRequired={false}
            >
              <FormControlLabel>
                <FormControlLabelText>Username</FormControlLabelText>
              </FormControlLabel>
              <Input className="my-1" size="md">
                <InputField
                  type="text"
                  placeholder="Masukkan username"
                  value={inputValue}
                  onChangeText={(text) => setInputValue(text)}
                />
              </Input>
            </FormControl>
            <FormControl
              // isInvalid={isInvalid}
              size="md"
              isDisabled={false}
              isReadOnly={false}
              isRequired={false}
            >
              <FormControlLabel>
                <FormControlLabelText>Password</FormControlLabelText>
              </FormControlLabel>
              <Input className="my-1" size="md">
                <InputField
                  type="password"
                  placeholder="password"
                  value={inputValue}
                  onChangeText={(text) => setInputValue(text)}
                />
              </Input>
              <FormControlError>
                <FormControlErrorIcon
                  as={AlertCircleIcon}
                  className="text-red-500"
                />
                <FormControlErrorText className="text-red-500">
                  Password Salah
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          </VStack>
        </VStack>
      </Center>
      <Button action="primary">
        <ButtonText>Masuk</ButtonText>
      </Button>
    </SafeAreaView>
  );
}
