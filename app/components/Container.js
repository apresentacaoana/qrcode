import { Stack, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"

const Container = ({ title, className, children}) => {
    const router = useRouter()
    return (
        <SafeAreaView className="flex-1 bg-[#fefefe]">
            <StatusBar />
            <View className="mt-8" />
            <Stack.Screen options={{headerShown: false}} />
            <ScrollView overScrollMode="never" className="flex-1 m-7">
                <View className="flex flex-row mb-10">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" color={"#0f0d3c"} size={30} />
                    </TouchableOpacity>
                    <Text className="text-[#0f0d3c] ml-3 text-[28px]">{title}</Text>
                </View>
                <View className={className}>
                    {children}
                </View>
            </ScrollView>
            
        </SafeAreaView>
    )
}

export default Container