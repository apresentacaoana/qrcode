import { Image, SafeAreaView, StatusBar, TouchableOpacity, View } from "react-native"
import BottomBar from "../../components/BottomBar"
import { TextInput } from "react-native"
import { Text } from "react-native"
import { useContext, useState } from "react"
import { UserContext } from "../../context/UserContext"
import ChangeProfile from "./ChangeProfile"
import Widget from "../../components/Widget"
import { FontAwesome } from "@expo/vector-icons"
import ChangePassword from "./ChangePassword.js"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"
import { updateUser } from "../../db/service.js"
import Navbar from "../../components/Navbar.js"
import LOGO from '../../../assets/logo-bg.png'


const Config = () => {
    const [pageType, setPageType] = useState("")
    const [user, setUser] = useContext(UserContext)
    const router = useRouter()

    async function logout() {
        await AsyncStorage.removeItem("email")
        setUser({})
        router.replace('/')
    }

    async function changeMode() {
        setUser({
            ...user,
            role: user.role == "frentista" ? "normal" : "frentista"
        })
        updateUser(user.docId, {
            role: user.role == "frentista" ? "normal" : "frentista"
        })
        router.replace('/login')
    }


    return (
        <SafeAreaView className="flex-1 bg-[#fefefe]">
            <View className="mt-8" />
            <StatusBar />
            <View className="w-full flex items-center mt-5 -mb-3  flex-row">
                <Image source={LOGO} className={"w-[30px] h-[30px] ml-7"}/>
                <Text className="font-bold text-[18px] text-[#0f0d3c]">Postos Kotinski</Text>
            </View>
            <View className="flex-1 m-7">
                {!pageType && (
                    <>
                    {/* <Text className="text-[32px] font-bold text-[#0f0d3c] mb-4">Menu de <Text className="text-[#0f0d3c]">Configurações</Text></Text> */}
                    
                    <View className="mb-4 flex flex-row items-center">
                        <Text className="text-[32px] font-bold text-[#0f0d3c] -mt-3">Configuração da <Text className="text-[#0f0d3c]">Conta</Text></Text>
                    </View>
                    {user.canChange && (
                        <TouchableOpacity onPress={changeMode} className="mb-3">
                            <Widget variant={"filled"} className={"flex flex-row justify-center items-center "}>
                                <FontAwesome name="gg-circle" color={"white"} size={20} />

                                {user.role == "normal" && (
                                    <Text className="text-white ml-2">Quero trocar para o modo frentista</Text>
                                )}
                                {user.role == "frentista" && (
                                    <Text className="text-white ml-2">Quero trocar para o modo normal</Text>
                                )}
                            </Widget>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity className="mb-2" onPress={() => setPageType('profile')}>
                        <Widget className={"flex flex-row items-center "}>
                            <FontAwesome name="user" color={"#0f0d3c"} size={20} />
                            <Text className="text-[#0f0d3c] ml-4">Informações Pessoais</Text>
                        </Widget>
                    </TouchableOpacity>
                    <TouchableOpacity className="mb-2" onPress={() => setPageType('password')}>
                        <Widget className={"flex flex-row items-center "}>
                            <FontAwesome name="key" color={"#0f0d3c"} size={20} />
                            <Text className="text-[#0f0d3c] ml-4">Mudar Senha</Text>
                        </Widget>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/terms')} className="mb-2">
                        <Widget className={"flex flex-row items-center "}>
                            <FontAwesome name="book" color={"#0f0d3c"} size={20} />
                            <Text className="text-[#0f0d3c] ml-4">Termos de Segurança e LGPD</Text>
                        </Widget>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/suporte')} className="mb-2">
                        <Widget className={"flex flex-row items-center "}>
                            <FontAwesome name="comments" color={"#0f0d3c"} size={20} />
                            <Text className="text-[#0f0d3c] ml-4">Suporte</Text>
                        </Widget>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={logout} className="mb-2">
                        <Widget className={"flex flex-row items-center "}>
                            <FontAwesome name="sign-out" color={"#0f0d3c"} size={20} />
                            <Text className="text-[#0f0d3c] ml-4">Encerrar Sessão</Text>
                        </Widget>
                    </TouchableOpacity>
                    </>
                )}

                {pageType == "profile" && (<ChangeProfile navigation={router} setPageType={setPageType} />)}
                {pageType == "password" && (<ChangePassword navigation={router} setPageType={setPageType} />)}
            </View>
        </SafeAreaView>
    )
}

export default Config