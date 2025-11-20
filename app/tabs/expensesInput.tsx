import EditScreenInfo from "@/components/EditScreenInfo";
import ImagePickerComponent from "@/components/ImagePicker";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Tab2() {
  return (
    <SafeAreaView className="mx-5 flex-1">
      <VStack space={"lg"} className="flex-1">
        <FormControl
          // isInvalid={isInvalid}
          size="md"
          isDisabled={false}
          isReadOnly={false}
          isRequired={false}
        >
          <FormControlLabel>
            <FormControlLabelText>Kategori</FormControlLabelText>
          </FormControlLabel>
          <Input className="bg-white" size="md">
            <InputField type="text" placeholder="Masukkan nama pembelian..." />
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
            <FormControlLabelText>Total Harga</FormControlLabelText>
          </FormControlLabel>
          <Input className=" bg-white" size="md">
            <InputField type="text" placeholder="Rp 50.000" />
          </Input>
        </FormControl>

        <VStack>
          <Text>Catatan Detail</Text>

          <Textarea
            size="md"
            isReadOnly={false}
            isInvalid={false}
            isDisabled={false}
            className="w-full bg-white"
          >
            <TextareaInput placeholder="Your text goes here..." />
          </Textarea>
        </VStack>

        <VStack>
          <Text>Foto Struk</Text>
          <ImagePickerComponent label="Unggah Bukti Pembayaran" />
        </VStack>
      </VStack>
      <VStack space="sm">
        <Button>
          <ButtonText>Simpan Pengeluaran</ButtonText>
        </Button>
        <Button variant="outline" onPress={() => router.back()}>
          <ButtonText>Batalkan</ButtonText>
        </Button>
      </VStack>
    </SafeAreaView>
  );
}
