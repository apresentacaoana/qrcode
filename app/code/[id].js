import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native"
import Widget from "../components/Widget"
import { useContext, useEffect, useState } from "react"
import COLORS from "../constants/colors"
import { UserContext } from "../context/UserContext"
import { getPostoById, getVendas, getVendasById, novaVenda, updateUser, updateVenda } from "../db/service"
import { Stack, useLocalSearchParams, useRouter, useSearchParams } from "expo-router"

const CODEPage = () => {

    const router = useRouter()
    const [object, setObject] = useState({})
    const [station, setStation] = useState({})
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useContext(UserContext)
    let [economia, setEconomia] = useState(0)

    const params = useSearchParams()

    async function cancel() {
        const response = await getVendasById(params.id)
        if(response.status == 'pendente') {
            await updateVenda(response.docId, {status: 'expirado'})
            await updateUser(user.docId, {
                litros: user.litros + object.detalhes.litrosUsadosNormais,
                bonus: user.bonus + object.detalhes.litrosUsadosBonus
            })
            setUser({
                ...user,
                litros: user.litros + object.detalhes.litrosUsadosNormais,
                bonus: user.bonus + object.detalhes.litrosUsadosBonus
            })
        }
        router.replace()
    }

    useEffect(() => {
        async function getData() {
            let response = await getVendasById(params.id)
            let responsePosto = await getPostoById(response.posto)
            setObject(response)
            setStation(responsePosto)
            let precoDebito = (Number(response.litros) * Number(response.gasolina.precoDebito)).toFixed(2)
            let precoNormalDebito = (Number(response.litros) * Number(response.gasolina.precoNormalDebito)).toFixed(2)
            setEconomia(precoNormalDebito - precoDebito)
            setLoading(false)
        }
        getData()
    }, [])


    return (
        <SafeAreaView className="flex-1 bg-[#fefefe]">
            <StatusBar />
            <Stack.Screen options={{headerShown: false}} />
            <ScrollView overScrollMode="never" className="flex-1 m-7">
                <View className="flex flex-row mb-10 mt-7">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" color={"#0f0d3c"} size={30} />
                    </TouchableOpacity>
                    <Text className="text-[#0f0d3c] ml-3 text-[28px]">Informações</Text>
                </View>
                {!loading && (
                    <View className="items-center">
                    
                    <Widget variant={"filled"} className={"flex w-full flex-row items-center justify-center"}>
                        <FontAwesome name="clock-o" color={"white"} size={20} />
                        <Text className="text-[18px] ml-2 text-white">Expira em <Text className="font-bold">1 HORA</Text></Text>
                    </Widget>
                    <Text className="text-[#0f0d3c] uppercase font-bold mt-4 text-[18px]">{station.nome}</Text>
                    <Text className="text-[#0f0d3c] uppercase mb-5 text-[16px]">{station.endereco} - {station.cidade} - {station.cep}</Text>
                        

                    <Image source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${object.id}`}} className="w-[200px] border border-gray-600 h-[200px]" />
                    <Widget className={"w-full mt-4 items-center mt-10"}>
                        <Text className="text-[#0f0d3c] font-extrabold text-[25px]">{object.id.toUpperCase()}</Text>
                    </Widget>
                    <Widget className={"mt-1 w-full items-center"}>
                        <Text className="text-[#0f0d3c] font-extrabold text-[35px]">{object.litros} Litros</Text>
                        <Text className="text-[#0f0d3c] text-[20px]">{station.nome}</Text>
                        <Text className="text-[#0f0d3c] font-extrabold text-[25px]">Valor: <Text className="text-[25px]">R${object.valor}</Text></Text>
                        <Text className="text-[#0f0d3c] text-[20px]">Economia de R${economia}</Text>
                    </Widget>
                    <TouchableOpacity onPress={cancel} className="mt-5">
                        <Widget variant={"filled"} className="flex items-center justify-center w-full">
                            <Text className='text-center text-white'>Cancelar Cupom</Text>
                        </Widget>
                    </TouchableOpacity>
                </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default CODEPage