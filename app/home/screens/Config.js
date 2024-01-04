import { SafeAreaView, StatusBar, TouchableOpacity, View } from "react-native"
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
        updateUser(user.docId, {
            role: user.role == "frentista" ? "normal" : "frentista"
        })
        setUser({
            ...user,
            role: user.role == "frentista" ? "normal" : "frentista"
        })
        router.replace('/')
    }


    return (
        <SafeAreaView className="flex-1 bg-[#0d0d0d]">
            <View className="mt-8" />
            <StatusBar />
            <View className="flex-1 m-7">
                {!pageType && (
                    <>
                    {/* <Text className="text-[32px] font-bold text-white mb-4">Menu de <Text className="text-orange-400">Configurações</Text></Text> */}
                    
                    <View className="mb-4 flex flex-row items-center">
                        <Text className="text-[32px] font-bold text-white ml-3">Configuração da <Text className="text-orange-400">Conta</Text></Text>
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
                            <FontAwesome name="user" color={"white"} size={20} />
                            <Text className="text-white ml-4">Informações Pessoais</Text>
                        </Widget>
                    </TouchableOpacity>
                    <TouchableOpacity className="mb-2" onPress={() => setPageType('password')}>
                        <Widget className={"flex flex-row items-center "}>
                            <FontAwesome name="key" color={"white"} size={20} />
                            <Text className="text-white ml-4">Mudar Senha</Text>
                        </Widget>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={logout} className="mb-2">
                        <Widget className={"flex flex-row items-center "}>
                            <FontAwesome name="sign-out" color={"white"} size={20} />
                            <Text className="text-white ml-4">Encerrar Sessão</Text>
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