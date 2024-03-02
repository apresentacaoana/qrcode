import { Stack, useRouter } from "expo-router"
import { ScrollView } from "react-native"
import Widget from "../components/Widget"
import { SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { StatusBar } from "react-native"
import { View } from "react-native"
import { TouchableOpacity } from "react-native"
import { Text } from "react-native"
import { useEffect, useState } from "react"
import { getTermo } from "../db/service"

const TermAndConditions = () => {
    const [texto, setTexto] = useState("")
    const router = useRouter()
    useEffect(() => {
        async function getData() {
            const response = await getTermo()
            setTexto(response[0].texto)
        }
        getData()
    }, [])
    return (
        <SafeAreaView className="flex-1 bg-[#fefefe]">
            <StatusBar />
            <View className="mt-8" />
            <Stack.Screen options={{headerShown: false}} />
            <ScrollView className="flex-1 flex-col m-7">
                <View className="flex flex-row mb-10">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" color={"#0f0d3c"} size={30} />
                    </TouchableOpacity>
                    <Text className="text-[#0f0d3c] ml-3 text-[28px]">Termos</Text>
                </View>
                <Widget className="flex-grow">
                    <Text className="text-[#0f0d3c] text-justify text-[18px]">
                        {texto}
                    </Text>
                </Widget>
            </ScrollView>
        </SafeAreaView>
    )
}

export default TermAndConditions