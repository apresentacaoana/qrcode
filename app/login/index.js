import { Image, TextInput } from "react-native"
import COLORS from "../constants/colors"
import { LinearGradient } from "expo-linear-gradient"
import { TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useContext, useEffect, useState } from "react"
import Checkbox from "expo-checkbox"
import Button from "../components/Button"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserByEmail, loginComEmailESenha } from "../db/service"
import { UserContext } from "../context/UserContext"

import { Text, View, StatusBar} from "react-native"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"

const Login = () => {
    const [isPasswordShown, setIsPasswordShown] = useState(false)
    const params = useLocalSearchParams()
    const {aviso} = params
    const [user, setUser] = useContext(UserContext)
    const [isCheck, setIsChecked] = useState(false)
    const [alert, setAlert] = useState("")
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")


    const handleSubmit = async () => {
        setAlert("")
        if(!email || !senha) return setAlert("Informe suas credenciais")
        if(email.toLowerCase() == "frentista@cadastro.com" && senha.toLowerCase() == "frentista@cadastro") {
            return router.push("/register/frentista")
        }
        await loginComEmailESenha(email.toLowerCase(), senha, setAlert, router, setUser)
    }

    useEffect(() => {
        if(aviso) {
            setAlert("Foi enviado um link de confirmação ao seu email, clique neste link para ativar sua conta")
        }
    }, [])

    return (
        <View 
            className={"flex-1  bg-[#0d0d0d]"}
        >
        <Stack.Screen options={{ headerShown: false }} />
            <StatusBar />
            <View className="flex-1 mx-[22px]">
                <View className="my-[42px]">
                    <Text className="text-[32px] font-bold my-[12px] text-white">Entrar</Text>
                    <Text className="text-[16px] text-white">Tenha os melhores preços para abastecer!</Text>
                </View>
                {alert && (
                    <View className="rounded-[8px] bg-red-500 p-5 mb-[17px]">
                        <Text className="text-white">{alert}</Text>
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
                            placeholder="Informe seu email"
                            placeholderTextColor={"#FFFFFF"}
                            keyboardType="email-address"
                            className="w-full text-white"
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-white">
                    <Text className="text-[16px] text-white font-normal my-[8px]">
                        Senha
                    </Text>
                    <View className="w-full h-[48px] border border-white rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            onChangeText={setSenha}
                            value={senha}
                            placeholder="Informe sua senha"
                            placeholderTextColor={"#FFFFFF"}
                            className="w-full text-white"
                            secureTextEntry={!isPasswordShown}
                        />
                        <TouchableOpacity
                            onPress={() => setIsPasswordShown(!isPasswordShown)}
                            className="absolute right-[12px]"
                        >
                            <Ionicons name={`${isPasswordShown ? "eye" : "eye-off"}`} size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity onPress={() => router.push('/recovery')} className="-mt-2 mb-3">
                    <Text className="text-orange-400">Esqueci minha senha</Text>
                </TouchableOpacity>

                <Button 
                    title="Entrar"
                    filled
                    onPress={handleSubmit}
                    className="mt-[18px] mb-[4px] py-[15px]"
                />

            </View>
        </View>
    )
}

export default Login