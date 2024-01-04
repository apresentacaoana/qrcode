import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native"
import BottomBar from "../components/BottomBar"
import { Ionicons } from "@expo/vector-icons"
import { StatusBar } from "react-native"
import { useContext, useEffect, useState } from "react"
import Widget from "../components/Widget"
import { UserContext } from "../context/UserContext"
import calcularDistancia from "../actions/location"
import { getPostoById, getRequests, novoRequest } from "../db/service"
import { Stack, useRouter, useSearchParams } from "expo-router"

const Station = () => {
    const router = useRouter()
    const [payType, setPayType] = useState("debit")
    const [alreadyRequest, setAlreadyRequest] = useState(false)
    const [user, setUser] = useContext(UserContext)
    const [station, setStation] = useState({})
    const [loading, setLoading] = useState(true)
    const params = useSearchParams()

    useEffect(() => {
        async function getData() {
            let posto = await getPostoById(params.id)
            let requests = await getRequests()
            setStation(posto)
            requests.forEach(request => {
                if(request.user.uid == user.uid && request.posto.nome == posto.nome) {
                    setAlreadyRequest(true)
                }
            })
            setLoading(false)
        }
        getData()
    }, [])

    async function handleRequest() {
        await novoRequest({user, posto: station})
        router.push('home')
    }

    return (    
        <SafeAreaView className="flex-1 bg-[#0D0D0D]">
        <View className="mt-8" />
        <Stack.Screen options={{headerShown: false}} />
        <StatusBar />
            {!loading && (
                <ScrollView className="flex-1 m-7">
                <View className="flex flex-row mb-10">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" color={"#FFF"} size={30} />
                    </TouchableOpacity>
                    <Text className="text-white ml-3 text-[28px]">Informações</Text>
                </View>
                <View className="flex flex-col w-full items-center">
                    <Image source={{ uri: station.logo }} className="w-[100px] h-[100px] rounded-[10px]" />
                    <Text className="text-orange-400 uppercase font-bold mt-4 text-[18px]">{station.nome}</Text>
                    <Text className="text-white uppercase text-[16px]">{station.endereco} - {station.cidade} - {station.cep}</Text>
                    <Text className="text-orange-400 font-bold mb-4 uppercase text-[16px]">{calcularDistancia(station.lat, station.lng, user.lat, user.long).km.toFixed(2)}KM de distância</Text>
                    

                    {user.role == 'normal' && (
                        <>
                            <View className="bg-[#262626] rounded-[5px] flex flex-row p-2">
                            <TouchableOpacity onPress={() => setPayType("debit")} className={`grow rounded-[3px] ${payType == "debit" && "bg-orange-400"} p-2 items-center`}>
                                <Text className={`${payType != "debit" && "text-orange-400"} font-semibold`}>Dinheiro/Pix/Débito</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity onPress={() => setPayType("credit")} className={`grow rounded-[3px] ${payType == "credit" && "bg-orange-400"} p-2 items-center`}>
                                <Text className={`${payType != "credit" && "text-orange-400"} font-semibold`}>Crédito</Text>
                            </TouchableOpacity> */}
                        </View>

                        <Widget className={"w-full items-center mt-3"}>
                            <Text className="text-orange-400">Selecione o Combustível</Text>
                        </Widget>

                        <Widget className={"w-full mt-1 items-center"}>
                            <View className="flex flex-row gap-3">
                                {station.combustiveis.map(comb => (
                                    <TouchableOpacity key={comb.nome} onPress={() => {
                                        if(((Number(user.bonus) + Number(user.litros)) - Number(comb.precoDebito) >= 0)) {
                                            router.push({pathname: "/pay", params: {
                                                ...station,
                                                nomePosto: station.nome,
                                                ...comb
                                            }})
                                        }
                                    }} className="flex flex-col gap-1 items-center">
                                        <Text className="text-white text-[12px]">{comb.nome}</Text>
                                        <Text className="text-red-600 text-[12px] line-through">R$ {comb.precoNormalDebito}</Text>
                                        <Text className="px-2 py-1 text-[12px] text-orange-400 border rounded-full border-orange-400">R$ {comb.precoDebito}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </Widget>
                        </>
                    )}
                {((user.role == "frentista" && Object.keys(user.posto).length == 0) && !alreadyRequest) && (
                    <TouchableOpacity onPress={handleRequest} className="mt-1 w-full">
                        <Widget className={"bg-green-500"}>
                            <Text className="font-semibold text-white text-center">Solicitar Entrada</Text>
                        </Widget>
                    </TouchableOpacity>
                )}
                {user.role == "admin" && (
                    <TouchableOpacity onPress={() => router.push(`/edit/station/${station.id}`)} className="mt-1 w-full">
                        <Widget className={"bg-green-500"}>
                            <Text className="font-semibold text-white text-center">Editar</Text>
                        </Widget>
                    </TouchableOpacity>
                )}
                </View>
                
                {/* <TouchableOpacity onPress={() => router.push({pathname: '/map', params: {lat: station.lat, lng: station.lng}})} className="mt-4">
                    <Widget variant={"filled"}>
                        <Text className="font-semibold text-center">VER NO MAPA</Text>
                    </Widget>
                </TouchableOpacity> */}
            </ScrollView>
            )}
        </SafeAreaView>
    )
}

export default Station