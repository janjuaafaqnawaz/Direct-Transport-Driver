import { Pressable, Text, View } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const getStatusIcon = (status) => {
  console.log(status);
  switch (status) {
    case "pickedup":
      return <FontAwesome5 name="truck" size={21} color="#ffddd2" />;
    case "delivered":
      return (
        <Ionicons name="checkmark-done-circle" size={24} color="#83c5be" />
      );
    case "returned":
      return <FontAwesome name="undo" size={21} color="#b892ff" />;
    case "cancelled":
      return <Ionicons name="close-circle" size={24} color="#e63946" />;
    default:
      return <Ionicons name="cube" size={24} color="orange" />;
  }
};

const BookingCard = ({ item, setSelectedBooking, router }) => {
  return (
    <Pressable
      onPress={() => {
        setSelectedBooking(item);
        router.push("details");
      }}
      className=" p-4 m-[2%] bg-secondary rounded-lg shadow-xl flex-row items-center"
    >
      <View className="flex-row items-center">
        <View className="mr-4">{getStatusIcon(item.currentStatus)}</View>
        <View className="flex-1">
          <Text className="text-lg text-white font-semibold">
            {item.userName}
          </Text>
          <Text className="text-slate-100 text-sm mb-1">{item.docId}</Text>
          <View className="flex-row items-center">
            <Text
              className={`text-xs font-bold uppercase ${
                item.status === "pickedup"
                  ? "text-blue-400"
                  : item.status === "returned"
                  ? "text-orange-400"
                  : item.status === "cancelled"
                  ? "text-red-400"
                  : item.status === "delivered"
                  ? "text-purple-400"
                  : "text-slate-200"
              }`}
            >
              {item.currentStatus}
            </Text>
            <Text className="text-slate-200 ml-auto mr-2">{`${item.date} - ${item.time}`}</Text>
          </View>
        </View>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="white" />
      </View>
    </Pressable>
  );
};

export default BookingCard;
