import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { ScrollView, TextInput, TouchableOpacity } from "react-native"
import { View } from "react-native"
import { StatusBar } from "react-native"
import { SafeAreaView } from "react-native"
import { Image } from "react-native"
import { Text } from "react-native"
import Widget from "../components/Widget"
import { aceitarRequest, excluirRequest, getRequestById, getUsers } from "../db/service"
import { useEffect, useState } from "react"
import { Stack, useRouter, useSearchParams } from "expo-router"

const LojistasPage = () => {
    const router = useRouter()
    const [data, setData] = useState([])
    const [backup, setBackup] = useState([])

    useEffect(() => {
        async function getData() {
            let response = await getUsers()
            setData(response.filter((user) => user.role === 'lojista'))
            setBackup(response.filter((user) => user.role === 'lojista'))
        }
        getData()
    }, [])

    const handleSearch = async (text) => {
        
        setData(backup.filter((user) => user.nome.toLowerCase().includes(text.toLowerCase())))
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
                    <Text className="text-[#0f0d3c] ml-3 text-[28px]">Lojistas</Text>
                </View>

                
                <TouchableOpacity onPress={() => router.push("/create/lojista")}>
                    <Widget variant={"filled"} className={"mb-3"}>
                        <Text className="text-[15px] text-white">Criar</Text>
                        <Text className="font-bold text-[30px] text-white">Acesso de Lojista</Text>
                    </Widget>
                </TouchableOpacity>

                <View>
                    <TextInput onChangeText={handleSearch} placeholder="Pesquisar" className="bg-[#262626] px-6 py-3 rounded-[10px] font-semibold text-white" placeholderTextColor={"#EDEDED"} />
                </View>
                

                <ScrollView className="flex-1">
                    <View className="mt-3">
                            {data.map((object) => (
                                <TouchableOpacity key={object.docId} className={"mb-2"} onPress={() => router.push(`/edit/lojista/${object.id}`)}>
                                   <Widget className={"flex flex-row mb-1 items-center justify-between"} variant={"filled"}>
                                        <MaterialIcons color={"white"} name="ev-station" size={25} />
                                        <View className="flex ml-5 flex-row justify-between items-center grow">
                                            <View>
                                                <Text className="font-bold text-white">{object.nome}</Text>
                                            </View>
                                            <View>
                                                <Text className="font-bold text-white">Ver</Text>
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

export default LojistasPage