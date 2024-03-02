import { Image, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView, StatusBar } from "react-native"
import BottomBar from "../../components/BottomBar"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../context/UserContext"
import { FlatList } from "react-native"
import Widget from "../../components/Widget"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { getPlanos } from "../../db/service"
import { getPassedDays } from "../../actions/time"
import { useRouter } from "expo-router"
import { PlanosContext } from "../../context/PlanosContext"
import { ScrollView } from "react-native"
import LOGO from '../../../assets/logo-bg.png'
import Navbar from "../../components/Navbar"

const Plans = () => {

    const router = useRouter()
    const [user, setUser] = useContext(UserContext)
    const [data, setData] = useState([])
    const [reload, setReload] = useState(0)
    const [refreshing, setRefreshing] = useState(false)
    const [planos, setPlanos] = useContext(PlanosContext)

    useEffect(() => {
        async function getData() {
            let response = await getPlanos()
            setData(response)
            setPlanos(response)
            setRefreshing(false)
        }
        getData()
    }, [reload])

    
    function onRefresh() {
        setRefreshing(true)
        setReload(reload + 1)
    }


    return (
        <SafeAreaView className="flex-1 w-full  bg-[#fefefe]">
            <StatusBar />

                {(!user.plan && !user.subscription_date) ? (
                    <>
                    <StatusBar />
                    <View className="w-full flex items-center mt-[52px] -mb-[50px]  flex-row">
                    <Image source={LOGO} className={"w-[30px] h-[30px] ml-7"}/>
                        <Text className="font-bold text-[18px] text-[#0f0d3c]">Postos Kotinski</Text>
                    </View>
                    <ScrollView className=" mx-7 my-20">
                        {data.map((item) => (
                            
                            <Widget className={`mb-10 self-center justify-self-center w-full`}>
                                <View className="flex flex-row justify-between items-center">
                                    <View>
                                        
                                    <Text className="text-[#0f0d3c] font-bold text-[25px]">{item.nome}</Text>
                                    <Text className="text-[#0f0d3c]">{item.litros} Litros</Text>
                                    </View>
                                    <Text className="text-[#0f0d3c] text-[18px]">{item.days} dias</Text>
                                </View>
                                <Text  className="text-[16px] my-4 mt-7 text-justify opacity-80 text-[#0f0d3c]">{item.descricao}</Text>
                                <Text className="font-bold -mt-3 text-[#0f0d3c] text-center text-[60px]">R$ {new String(item.price.toFixed(2)).replace('.', ',')}</Text>
                                <TouchableOpacity onPress={() => router.push({pathname: "/checkout", params: {userId: user.email, planoId: item.id}})} className="mt-4">
                                    <Widget className={"bg-white py-3"}>
                                        <Text className="text-center font-bold">Assinar</Text>
                                    </Widget>
                                </TouchableOpacity>
                            </Widget>
                        ))}
                    </ScrollView>
                    </>
                    
                ): (
                    <>
                    <Navbar />
                    <View className="grow m-7">
                        <Widget className={"flex flex-row mb-2 items-center"} variant={"filled"}>
                            <FontAwesome name="clock-o" size={20}  />
                            <Text className="ml-2">Faltam <Text className="font-bold">{user.plan.days - getPassedDays(user.subscription_date)} dias</Text> para a sua assinatura acabar</Text>
                        </Widget>
                        <Widget className={"mb-2"}>
                            <Text className="text-[25px] text-[#0f0d3c]"><Text className="text-[#0f0d3c] font-bold">{user.plan.nome}</Text></Text>
                        </Widget>
                        <Widget>
                            <Text className="text-[19px] text-[#0f0d3c]">Sobre o seu plano</Text>
                            <Text className="text-[#0f0d3c] opacity-80 mt-2">
                                {user.plan.descricao}
                            </Text>
                        </Widget>
                    </View>
                    <View className="m-7 mb-[120px]">   
                    </View>
                    </>
                )}
            
        </SafeAreaView>
    )
}

export default Plans