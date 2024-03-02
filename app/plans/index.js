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
import { getPlanos } from "../db/service"
import { Stack, useRouter } from "expo-router"
import { PlanosContext } from "../context/PlanosContext"

const AdminPlans = () => {
    const [user, setUser] = useContext(UserContext)
    const router = useRouter()
    const [plans, setPlans] = useState([])
    const [backup, setBackup] = useState([])
    useEffect(() => {
        async function getData() {
            const response = await getPlanos()
            setPlans(response)
            setBackup(response)
        }
        getData()
    }, [])

    const handleSearch = (text) => {
        setPlans(backup.filter((item) => item.nome.toLowerCase().includes(text.toLowerCase())))
    }

    return (
        <SafeAreaView className="flex-1 bg-[#fefefe]">
            <StatusBar />
            <View className="mt-8" />
            <Stack.Screen options={{headerShown: false}} />
            <View className="flex-1 m-7">

                    <View className="flex flex-row mb-10">
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" color={"#0f0d3c"} size={30} />
                        </TouchableOpacity>
                        <Text className="text-[#0f0d3c] ml-3 text-[28px]">Planos</Text>
                    </View>

                {user.role === "admin" && (
                    <TouchableOpacity onPress={() => router.push("/create/planos")}>
                        <Widget variant={"filled"} className={"mb-3"}>
                            <Text className="text-[15px] text-white">Criar</Text>
                            <Text className="font-bold text-white text-[30px]">Plano de Assinatura</Text>
                        </Widget>
                    </TouchableOpacity>
                )}
        
                    <View>
                        <TextInput onChangeText={handleSearch} placeholder="Pesquisar pelo nome" className="bg-[#262626] mb-3 px-6 py-3 rounded-[10px] font-semibold text-[#0f0d3c]" placeholderTextColor={"#EDEDED"} />
                    </View>

                    {plans.map((plan) => (
                        <TouchableOpacity key={plan.id} onPress={() => router.push({pathname: '/plan', params: {...plan}})}>
                            <Widget className={"flex flex-row items-center justify-between"} variant={"filled"}>
                                <MaterialIcons color={"white"} name="wallet-giftcard" size={25} />
                                <View className="flex ml-5 flex-row justify-between items-center grow">
                                    <View>
                                        <Text className="font-bold text-white">{plan.nome}</Text>
                                        <Text className=" text-white">{plan.days} Dias</Text>
                                    </View>
                                    <View>
                                        <Text className="font-bold text-white">Ver</Text>
                                    </View>
                                </View>
                            </Widget>
                        </TouchableOpacity>
                    ))}
            </View>
        </SafeAreaView>
    )
}

export default AdminPlans