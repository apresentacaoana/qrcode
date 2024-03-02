import { Ionicons } from "@expo/vector-icons"
import { TouchableOpacity } from "react-native"
import { View } from "react-native"
import { StatusBar } from "react-native"
import { SafeAreaView } from "react-native"
import { Image } from "react-native"
import { Text } from "react-native"
import Widget from "../components/Widget"
import { aceitarRequest, demitir, desvincularPosto, excluirRequest, getRequestById, getUserById } from "../db/service"
import { useEffect, useState } from "react"
import { Stack, useRouter, useSearchParams } from "expo-router"

const FrentistaPage = () => {
    const [request, setRequest] = useState({})
    const [loading, setLoading] = useState(true)
    const params = useSearchParams()

    useEffect(() => {
        async function getData() {
            let request = await getUserById(params.id)
            setRequest(request)
            setLoading(false)
        }
        getData()
    }, [])

    const router = useRouter()

    const handleDemitir = async () => {
        await demitir(params.id)
        router.replace('/home')
    }
    const handleDesvincular = async () => {
        await desvincularPosto(params.id)
        router.replace('/home')
    }


    return (
        <SafeAreaView className="flex-1 bg-[#fefefe]">
            <StatusBar />
            <Stack.Screen options={{headerShown: false}} />
            {!loading && (
                <View className="flex-1  m-7">
                    <View className="mt-9" />
                <View className="flex flex-row mb-10">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" color={"#0f0d3c"} size={30} />
                    </TouchableOpacity>
                    <Text className="text-[#0f0d3c] ml-3 text-[28px]">Informações</Text>
                </View>
                <Text className="text-[35px] mb-5 text-[#0f0d3c] font-bold"><Text className="text-[#0f0d3c]">Informações </Text></Text>
                
                <Widget className={"mb-2"}>
                    <Text className="text-[#0f0d3c] font-bold text-[16px]">Informações do Frentista</Text>
                    <Text className="text-[#0f0d3c] text-[16px]">Nome: <Text className="">{request.nome}</Text></Text>
                    <Text className="text-[#0f0d3c] text-[16px]">Email: <Text className="">{request.email}</Text></Text>
                    <Text className="text-[#0f0d3c] text-[16px]">CPF: <Text className="">{request.cpf}</Text></Text>
                    <Text className="text-[#0f0d3c] text-[16px]">Data de Nascimneto: <Text className="">{request.nascimento}</Text></Text>
                    <Text className="text-[#0f0d3c] text-[16px]">Telefone: <Text className="">{request.telefone}</Text></Text>
                </Widget>
                {Object.keys(request.posto).length > 0 && (
                    <TouchableOpacity onPress={() => router.push(`/station/${request.posto.id}`)}>
                        <Widget className={"flex flex-row mb-2"}>
                            <Image source={{uri: request.posto.logo}} className="w-[40px] rounded-[8px] h-[40px]" />
                            <View className="ml-5">
                                <Text className="text-[#0f0d3c] text-[15px] font-bold">{request.posto.nome}</Text>
                                <Text className="text-[#0f0d3c] text-[15px]">{request.posto.endereco}, {request.posto.cidade} - {request.posto.cep}</Text>
                            </View>
                        </Widget>
                    </TouchableOpacity>
                )}
                <View className="grow"></View>
                <View className="flex-row justify-between">
                    <TouchableOpacity onPress={handleDemitir} className="w-[48%]">
                        <Widget className="bg-red-400">
                            <Text className="text-white text-center text-[18px] font-extrabold">Demitir</Text>
                        </Widget>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDesvincular} className="w-[48%]">
                        <Widget className="bg-red-400">
                            <Text className="text-white text-center text-[18px] font-extrabold">Desvincular Posto</Text>
                        </Widget>
                    </TouchableOpacity>
                </View>
            </View>
            )}
        </SafeAreaView>
    )
}

export default FrentistaPage