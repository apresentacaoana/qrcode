import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native"
import Widget from "../components/Widget"
import { Image } from "react-native"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContext"
import { getPostos } from "../db/service"
import { ScrollView } from "react-native"
import calcularDistancia from "../actions/location"
import { PostosContext } from "../context/PostosContext"
import { Stack, useRouter } from "expo-router"

const Stations = () => {
    const [user, setUser] = useContext(UserContext)
    const [data, setData] = useState([])
    const [backup, setBackup] = useState([])
    const router = useRouter()

    useEffect(() => {
        async function getData() {
            const response = await getPostos()
            setData(response)
            setBackup(response)
        }
        getData()
    }, [])

    const handleSearch = (text) => {
        let search = String(text)
        if(search.trim().length > 0) {
            let filterData = backup.filter((item) => item.nome.toLowerCase().includes(search.toLowerCase()))
            setData(filterData)
        } else setData(backup)
        
        
    }


    return (
        <SafeAreaView className="flex-1 bg-[#fefefe]">
        <View className="mt-8" />
            <StatusBar />
            <Stack.Screen options={{ headerShown: false }} />
            <View className="flex-1 m-7">
                <View className="flex flex-row mb-10">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" color={"#0f0d3c"} size={30} />
                    </TouchableOpacity>
                    <Text className="text-[#0f0d3c] ml-3 text-[28px]">Postos Disponíveis</Text>
                </View>

                {user.role === "admin" && (
                    <TouchableOpacity onPress={() => router.push("/create/station")}>
                        <Widget variant={"filled"} className={"mb-3"}>
                            <Text className="text-[15px] text-white">Criar</Text>
                            <Text className="font-bold text-[30px] text-white">Postos de Gasolina</Text>
                        </Widget>
                    </TouchableOpacity>
                )}

                <View>
                    <TextInput onChangeText={handleSearch} placeholder="Pesquisar pelo nome" className="bg-[#262626] px-6 py-3 rounded-[10px] font-semibold text-white" placeholderTextColor={"#EDEDED"} />
                </View>
                

                <ScrollView className="flex-1">
                    <View className="mt-3">
                            {data.map((station) => (
                                <TouchableOpacity key={station.nome} className={"mb-2"} onPress={() => router.push(`/station/${station.id}`)}>
                                    <Widget className={"flex flex-row bg-[#F7F7F7] border border-[#262626]"}>
                                        <View>
                                            <Image source={{ uri: station.logo }} className="w-[40px] h-[40px] rounded-[10px]" />
                                        </View>
                                        <View className="flex flex-col ml-5">
                                            <Text className="font-bold text-[#0f0d3c]">{station.nome}</Text>
                                            <Text className="text-[#0f0d3c] font-bold">{calcularDistancia(station.lat, station.lng, user.lat, user.long).km.toFixed(2)}km de distância</Text>
                                            <View className="flex flex-row gap-3">
                                                {station.combustiveis.map((comb) => (
                                                    <View key={comb.nome} className="flex flex-col gap-1 items-center">
                                                        <Text className="text-[#0f0d3c] text-[12px]">{comb.nome}</Text>
                                                        <Text className="px-2 py-1 text-[12px] text-[#0f0d3c] border rounded-full border-[#0f0d3c]">R$ {comb.precoDebito}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    </Widget>
                                </TouchableOpacity>
                            ))}
                    </View>
                </ScrollView>

            </View>
        </SafeAreaView>
    )
}

export default Stations