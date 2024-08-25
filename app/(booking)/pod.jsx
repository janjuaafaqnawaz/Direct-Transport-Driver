import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import ImageViewer from "@/components/common/ImageViewer";
import CustomButton from "@/components/common/CustomButton";
import EmptyState from "@/components/EmptyState";
import { icons } from "@/constants";
import useGlobalContext from "@/context/GlobalProvider";
import { uploadImages, updateBooking } from "@/lib/firebase/functions/post";
import FormField from "@/components/FormField";

const Pod = () => {
  const { selectedBooking } = useGlobalContext();
  const [name, setName] = useState(selectedBooking?.receiverName || "");
  const defaultImages = selectedBooking?.images || [];
  const [selectedImages, setSelectedImages] = useState(defaultImages);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((asset) => asset.uri);
      setSelectedImages((prevImages) => [...newUris, ...prevImages]);
    }
  };

  const pickCameraAsync = async () => {
    let result = await ImagePicker.launchCameraAsync({
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((asset) => asset.uri);
      setSelectedImages((prevImages) => [...newUris, ...prevImages]);
    }
  };

  const removeImage = (uri) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((image) => image !== uri)
    );
  };

  const uploadAllImages = async () => {
    setIsLoading(true);
    setSuccessMessage("");

    try {
      const images = await Promise.all(
        selectedImages.map(async (image) => {
          const url = await uploadImages(image);
          return url;
        })
      );

      await updateBooking("place_bookings", selectedBooking.docId, {
        ...selectedBooking,
        receiverName: name,
        images,
      });

      setSuccessMessage("Images uploaded successfully!");
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-primary">
      <View className="w-[90%]">
        <FormField
          title="Receiver Name"
          value={name}
          placeholder="Write Receiver Name"
          handleChangeText={(e) => setName(e)}
          otherStyles="mb-2"
        />
      </View>
      <FlatList
        data={selectedImages}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View className="relative">
            <ImageViewer
              placeholderImageSource=""
              selectedImage={item}
              styles="w-full h-60 mt-6"
            />
            <TouchableOpacity
              className="absolute top-7 right-2"
              onPress={() => removeImage(item)}
            >
              <Image
                source={icons.remove}
                resizeMode="contain"
                alt="remove"
                className="w-8 h-8"
              />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Images Selected"
            subtitle="Please select an image to add to the bookings list"
            style="mt-16"
          />
        )}
        ListHeaderComponent={() => (
          <View className="my-16 mx-[2%]">
            {selectedImages.length > 0 && (
              <CustomButton
                title="Save Booking"
                handlePress={uploadAllImages}
                isLoading={isLoading}
              />
            )}
            {successMessage !== "" && (
              <Text className="text-green-600 text-center mt-4 font-pmedium">
                {successMessage}
              </Text>
            )}

            <View className="mt-7 space-y-2">
              <Text className="text-base text-slate-700 font-pmedium">
                Thumbnail Image
              </Text>

              <View className="w-full p-4 bg-black-100 rounded-xl border-2 border-transparent flex justify-around items-center flex-row space-x-4">
                <TouchableOpacity
                  onPress={pickImageAsync}
                  className="flex justify-center items-center"
                >
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    alt="upload"
                    className="w-8 h-8 mb-1"
                  />
                  <Text className="text-xs text-slate-700 font-plight">
                    Choose a file
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={pickCameraAsync}
                  className="flex justify-center items-center"
                >
                  <Image
                    source={icons.camera}
                    resizeMode="contain"
                    alt="camera"
                    className="w-8 h-8 mb-1"
                  />
                  <Text className="text-xs text-slate-700 font-plight">
                    Take a photo
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Pod;
