import { Ionicons } from "@expo/vector-icons"
import { TouchableOpacity } from "react-native"
import { View } from "react-native"
import { StatusBar } from "react-native"
import { SafeAreaView } from "react-native"
import { Image } from "react-native"
import { Text } from "react-native"
import Widget from "../components/Widget"
import { aceitarRequest, excluirRequest, getRequestById } from "../db/service"
import { useEffect, useState } from "react"
import { Stack, useRouter, useSearchParams } from "expo-router"

const Request = () => {

    const [request, setRequest] = useState({})
    const [loading, setLoading] = useState(true)
    const params = useSearchParams()
    console.log(params)

    useEffect(() => {
        async function getData() {
            let request = await getRequestById(params.id)
            setRequest(request)
            setLoading(false)
        }
        getData()
    }, [])

    const router = useRouter()

    let handleDeny = async () => {
        await excluirRequest(request.docId)
        router.push(`/home`)
    }
    let handleAccept = async () => {
        await aceitarRequest(request.docId)
        router.push(`/home`)
    }
    return (
        <SafeAreaView className="flex-1 bg-[#0d0d0d]">
            <StatusBar />
            <Stack.Screen options={{headerShown: false}} />
            {!loading && (
                <View className="flex-1 m-7">
                <View className="flex flex-row mb-10">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" color={"#FFF"} size={30} />
                    </TouchableOpacity>
                    <Text className="text-white ml-3 text-[28px]">Solicitação</Text>
                </View>
                <Text className="text-[35px] mb-5 text-white font-bold"><Text className="text-orange-400">Informações </Text></Text>
                
                <Widget className={"mb-2"}>
                    <Text className="text-orange-400 font-bold text-[16px]">Informações do Cliente</Text>
                    <Text className="text-white text-[16px]">Nome: <Text className="">{request.user.nome}</Text></Text>
                    <Text className="text-white text-[16px]">Email: <Text className="">{request.user.email}</Text></Text>
                    <Text className="text-white text-[16px]">CPF: <Text className="">{request.user.cpf}</Text></Text>
                    <Text className="text-white text-[16px]">Data de Nascimneto: <Text className="">{request.user.nascimento}</Text></Text>
                    <Text className="text-white text-[16px]">Telefone: <Text className="">{request.user.telefone}</Text></Text>
                </Widget>
                <TouchableOpacity onPress={() => router.push(`/station/${request.posto.id}`)}>
                    <Widget className={"flex flex-row mb-2"}>
                        <Image source={{uri: request.posto.logo}} className="w-[40px] rounded-[8px] h-[40px]" />
                        <View className="ml-5">
                            <Text className="text-orange-400 text-[15px] font-bold">{request.posto.nome}</Text>
                            <Text className="text-white text-[15px]">{request.posto.endereco}, {request.posto.cidade} - {request.posto.cep}</Text>
                        </View>
                    </Widget>
                </TouchableOpacity>
                <View className="grow"></View>
                <View className="flex-row justify-between">
                    <TouchableOpacity onPress={handleAccept} className="w-[48%]">
                        <Widget className="bg-green-400">
                            <Text className="text-green-600 text-center text-[18px] font-extrabold">Aceitar</Text>
                        </Widget>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDeny} className="w-[48%]">
                        <Widget className="bg-red-400">
                            <Text className="text-red-600 text-center text-[18px] font-extrabold">Recusar</Text>
                        </Widget>
                    </TouchableOpacity>
                </View>
            </View>
            )}
        </SafeAreaView>
    )
}

export default Request