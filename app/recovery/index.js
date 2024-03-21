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
import axios from "axios"


const RecoveryPage = () => {
    const [alert, setAlert] = useState("")

    const [email, setEmail] = useState("")
    const router = useRouter()

    const handleSubmit = async () => {
        setAlert("")
        if(!email) return setAlert("Informe suas credenciais")
        let user = await getUserByEmail(email)

        const url = `https://master--frochap.netlify.app/api/sendemail`;

        axios.post(url, {email: user.id, sendType: "change"})
            .then(response => {
                console.log(response.data)
                setAlert("O link de redefinir senha foi enviado ao email")
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
            });

    }

    return (
        <View 
            className="flex-1  bg-[#fefefe]"
        >
            <Stack.Screen options={{headerShown: false}} />
            <StatusBar />
            <View className="flex-1 mx-[22px] mt-5">
                <View className="my-[22px] ">
                    <Text className="text-[32px] font-bold my-[12px] text-[#0f0d3c]">Esqueci minha senha</Text>
                    <Text className="text-[16px] text-[#0f0d3c]">Recupere a sua senha!</Text>
                </View>
                {alert && (
                    <View className="rounded-[8px] bg-[#0f0d3c] p-5 mb-[17px]">
                        <Text className="text-white">{alert}</Text>
                    </View>
                )}
                <View className="mb-[12px] text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Email
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            onChangeText={setEmail}
                            defaultValue={email}
                            placeholder="Informe o email da sua conta"
                            placeholderTextColor={"#A0A0A0"}
                            keyboardType="email-address"
                            className="w-full text-[#0f0d3c]"
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