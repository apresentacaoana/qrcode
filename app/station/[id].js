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
import openMap from 'react-native-open-maps';

const Station = () => {
    const router = useRouter()
    const [payType, setPayType] = useState("debit")
    const [alreadyRequest, setAlreadyRequest] = useState(false)
    const [user, setUser] = useContext(UserContext)
    const [station, setStation] = useState({})
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const params = useSearchParams()

    useEffect(() => {
        async function getData() {
            
            setError("")
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

    const goMap = () => {
        openMap({latitude: station.lat, longitude: station.lng, zoom: 18})
    }

    async function handleRequest() {
        await novoRequest({user, posto: station})
        router.push('home')
    }

    return (    
        <SafeAreaView className="flex-1 bg-[#fefefe]">
        <View className="mt-8" />
        <Stack.Screen options={{headerShown: false}} />
        <StatusBar />
            {!loading && (
                <ScrollView className="flex-1 m-7">
                <View className="flex flex-row mb-10">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" color={"#0f0d3c"} size={30} />
                    </TouchableOpacity>
                    <Text className="text-[#0f0d3c] ml-3 text-[28px]">Informações</Text>
                </View>
                <View className="flex flex-col w-full items-center">
                    <Image source={{ uri: station.logo }} className="w-[100px] h-[100px] rounded-[10px]" />
                    <Text className="text-[#0f0d3c] uppercase font-bold mt-4 text-[18px]">{station.nome}</Text>
                    <Text className="text-[#0f0d3c] uppercase text-[16px]">{station.endereco} - {station.cidade} - {station.cep}</Text>
                    <Text className="text-[#0f0d3c] font-bold mb-4 uppercase text-[16px]">{calcularDistancia(station.lat, station.lng, user.lat, user.long).km.toFixed(2)}KM de distância</Text>
                    

                    {user.role == 'normal' && (
                        <>
                            <View className="bg-[#0f0d3c] rounded-[5px] flex flex-row p-2">
                            <TouchableOpacity onPress={() => setPayType("debit")} className={`grow rounded-[3px] ${payType == "debit" && "bg-[#0f0d3c]"} p-2 items-center`}>
                                <Text className={`${payType != "debit" && "text-white"} font-semibold text-white`}>Dinheiro/Pix/Débito</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity onPress={() => setPayType("credit")} className={`grow rounded-[3px] ${payType == "credit" && "bg-orange-400"} p-2 items-center`}>
                                <Text className={`${payType != "credit" && "text-[#0f0d3c]"} font-semibold`}>Crédito</Text>
                            </TouchableOpacity> */}
                        </View>


                        <Widget className={"w-full items-center mt-3"}>
                            <Text className="text-[#0f0d3c]">Selecione o Combustível</Text>
                        </Widget>

                        <Widget className={"w-full mt-1 items-center"}>
                            <View className="flex flex-row gap-3">
                                {station.combustiveis.map(comb => (
                                    <TouchableOpacity key={comb.nome} onPress={() => {
                                        router.push({pathname: "/pay", params: {
                                            ...station,
                                            nomePosto: station.nome,
                                            ...comb
                                        }})
                                    }} className="flex flex-col gap-1 items-center">
                                        <Text className="text-[#0f0d3c] text-[12px]">{comb.nome}</Text>
                                        <Text className="text-red-600 text-[12px] line-through">R$ {comb.precoNormalDebito}</Text>
                                        <Text className="px-2 py-1 text-[12px] text-[#0f0d3c] border rounded-full border-[#0f0d3c]">R$ {comb.precoDebito}</Text>
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
                
                <TouchableOpacity onPress={goMap} className="mt-4">
                    <Widget variant={"filled"}>
                        <Text className="font-semibold text-white text-center">Ver no Mapa</Text>
                    </Widget>
                </TouchableOpacity>
            </ScrollView>
            )}
        </SafeAreaView>
    )
}

export default Station