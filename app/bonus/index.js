import { Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView, StatusBar } from "react-native"
import Widget from "../components/Widget"
import { Ionicons } from "@expo/vector-icons"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"

const Bonus = () => {
    const router = useRouter()
    const bonus = useLocalSearchParams();
    return (
        <SafeAreaView className="flex-1 bg-[#fefefe]">
            <StatusBar />
            <View className="mt-8" />
            <Stack.Screen options={{headerShown: false}} />
            <View className="flex-1 m-7">
                <View className="flex flex-row mb-10">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" color={"#0f0d3c"} size={30} />
                    </TouchableOpacity>
                    <Text className="text-[#0f0d3c] ml-3 text-[28px]">Detalhes</Text>
                </View>
                <View className="flex-1 justify-center items-center">
                    <Widget className={`mb-10 self-center justify-self-center w-[300px]`}>
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-[#0f0d3c] font-bold text-[25px]">Bônus</Text>
                            <Text className="text-[#0f0d3c] text-[18px]">{bonus.litros} L</Text>
                        </View>
                        <Text  className="text-[16px] my-4 mt-7 text-justify opacity-80 text-[#0f0d3c]">{bonus.motivo}</Text>
                        <Text className="font-bold -mt-3 text-[#0f0d3c] text-center text-[60px]">{bonus.dias} dias</Text>
                        <TouchableOpacity onPress={() => router.push({pathname: "/edit/bonus", params: {...bonus}})} className="mt-4">
                            <Widget className={"bg-white py-3"}>
                                <Text className="text-center font-bold">Editar</Text>
                            </Widget>
                        </TouchableOpacity>
                    </Widget>

                </View>
            </View>
        </SafeAreaView>
    )
}

export default Bonus