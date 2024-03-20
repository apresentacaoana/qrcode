import { View } from "react-native"
import { StatusBar } from "react-native"
import { SafeAreaView } from "react-native"
import Widget from "../components/Widget"
import { Text } from "react-native"
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons"
import { TouchableOpacity } from "react-native"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContext"
import { TextInput } from "react-native"
import { getRequests } from "../db/service"
import { RequestsContext } from "../context/RequestsContext"
import { Stack, useRouter } from "expo-router"

const Requests = () => {
    const [user, setUser] = useContext(UserContext)
    const router = useRouter()
    const [backup, setBackup] = useState([])
    const [data, setData] = useState([])

    useEffect(() => {
        async function getData() {
            
            const response = await getRequests()
            setData(response)
            setBackup(response)
        }
        getData()
    }, [])

    const handleSearch = (e) => {
        setData(backup.filter((item) => item.user.nome.toLowerCase().includes(e.toLowerCase()) || item.posto.nome.toLowerCase().includes(e.toLowerCase())))
    }

    return (
        <SafeAreaView className="flex-1 bg-[#fefefe]">
            <StatusBar />
            <Stack.Screen options={{headerShown: false}} />
            <View className="flex-1 m-7">

                    <View className="flex flex-row mb-5 mt-7">
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" color={"#0f0d3c"} size={30} />
                        </TouchableOpacity>
                        <Text className="text-[#0f0d3c] ml-3 text-[28px]">Solicitações</Text>
                    </View>

                    <View>
                        <TextInput placeholder="Pesquisar pelo nome" onChangeText={handleSearch} className="bg-[#262626] mb-3 px-6 py-3 rounded-[10px] font-semibold text-white" placeholderTextColor={"#EDEDED"} />
                    </View>

                    {data.map(request => (
                        <TouchableOpacity key={request.nome} onPress={() => router.push(`/request/${request.id}`)}>
                            <Widget className={"flex flex-row items-center justify-between"} variant={"filled"}>
                            <FontAwesome name="user-circle-o" size={25} />
                            <View className="flex ml-5 flex-row justify-between items-center grow">
                                <View>
                                    <Text className="font-bold">{request.user.nome}</Text>
                                    <Text>{request.posto.nome}</Text>
                                </View>
                                <View>
                                    <Text className="font-bold">Ver</Text>
                                </View>
                            </View>
                        </Widget>
                        </TouchableOpacity>
                    ))}
            </View>
        </SafeAreaView>
    )
}

export default Requests