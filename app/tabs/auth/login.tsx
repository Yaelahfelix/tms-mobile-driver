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
import { useAuth } from "@/lib/auth";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const { login, token, loading } = useAuth();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password2025#");
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && token) {
      router.replace("/tabs");
    }
  }, [loading, token]);

  const handleLogin = async () => {
    setError(undefined);
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/tabs");
    } catch (err) {
      setError("Email atau kata sandi tidak valid");
    } finally {
      setSubmitting(false);
    }
  };

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
            <FormControl isInvalid={!!error} size="md">
              <FormControlLabel>
                <FormControlLabelText>Email</FormControlLabelText>
              </FormControlLabel>
              <Input className="my-1" size="md">
                <InputField
                  type="text"
                  placeholder="Masukkan email"
                  value={email}
                  autoCapitalize="none"
                  onChangeText={setEmail}
                />
              </Input>
            </FormControl>
            <FormControl isInvalid={!!error} size="md">
              <FormControlLabel>
                <FormControlLabelText>Password</FormControlLabelText>
              </FormControlLabel>
              <Input className="my-1" size="md">
                <InputField
                  type="password"
                  placeholder="password"
                  value={password}
                  onChangeText={setPassword}
                />
              </Input>
              {error && (
                <FormControlError>
                  <FormControlErrorIcon
                    as={AlertCircleIcon}
                    className="text-red-500"
                  />
                  <FormControlErrorText className="text-red-500">
                    {error}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          </VStack>
        </VStack>
      </Center>
      <Button action="primary" onPress={handleLogin} isDisabled={submitting}>
        <ButtonText>{submitting ? "Memproses..." : "Masuk"}</ButtonText>
      </Button>
    </SafeAreaView>
  );
}
