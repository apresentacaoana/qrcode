import { Image, TextInput } from "react-native"
import COLORS from "../constants/colors"
import { LinearGradient } from "expo-linear-gradient"
import { TouchableOpacity, Text, SafeAreaView, StatusBar, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import Checkbox from "expo-checkbox"
import Button from "../components/Button"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserByEmail, loginComEmailESenha, recuperarSenha } from "../db/service"
import { Stack, useRouter } from "expo-router"


const RecoveryPage = () => {
    const [alert, setAlert] = useState("")

    const [email, setEmail] = useState("")
    const router = useRouter()

    const handleSubmit = async () => {
        setAlert("")
        if(!email) return setAlert("Informe suas credenciais")
        let user = await getUserByEmail(email)
        await recuperarSenha(user.id, setAlert)
    }

    return (
        <View 
            className="flex-1  bg-[#0d0d0d]"
        >
            <Stack.Screen options={{headerShown: false}} />
            <StatusBar />
            <View className="flex-1 mx-[22px]">
                <View className="my-[22px]">
                    <Text className="text-[32px] font-bold my-[12px] text-white">Esqueci minha senha</Text>
                    <Text className="text-[16px] text-white">Recupere a sua senha!</Text>
                </View>
                {alert && (
                    <View className="rounded-[8px] bg-orange-400 p-5 mb-[17px]">
                        <Text className="text-black">{alert}</Text>
                    </View>
                )}
                <View className="mb-[12px] text-white">
                    <Text className="text-[16px] text-white font-normal my-[8px]">
                        Email
                    </Text>
                    <View className="w-full h-[48px] border border-white rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            onChangeText={setEmail}
                            value={email}
                            placeholder="Informe o email da sua conta"
                            placeholderTextColor={"#FFFFFF"}
                            keyboardType="email-address"
                            className="w-full text-white"
                        />
                    </View>
                </View>

                <Button 
                    title="Enviar e-mail"
                    filled
                    onPress={handleSubmit}
                    className="mt-[18px] mb-[4px] py-[15px]"
                />

            </View>
        </View>
    )
}

export default RecoveryPage