import { Image, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView, StatusBar } from "react-native"
import BottomBar from "../../components/BottomBar"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../context/UserContext"
import { FlatList } from "react-native"
import Widget from "../../components/Widget"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { getLojas, getPlanos } from "../../db/service"
import { getPassedDays } from "../../actions/time"
import { useRouter } from "expo-router"
import { PlanosContext } from "../../context/PlanosContext"
import { ScrollView } from "react-native"
import LOGO from '../../../assets/logo-bg.png'
import Navbar from "../../components/Navbar"
import calcularDistancia from "../../actions/location"

const Plans = () => {

    const router = useRouter()
    const [user, setUser] = useContext(UserContext)
    const [data, setData] = useState([])
    const [reload, setReload] = useState(0)
    const [refreshing, setRefreshing] = useState(false)
    const [planos, setPlanos] = useContext(PlanosContext)
    const [lojas, setLojas] = useState([])

    useEffect(() => {
        async function getData() {
            let response = await getPlanos()
            let responseLojas = await getLojas()
            setData(response)
            setPlanos(response)
            setLojas(responseLojas)
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
                        
                        <Widget variant={'filled'} className='mb-2'>
                            <Text className='text-white text-center'>A cada litro que abastece recebe pontos e com eles você consegue desconto em nossas lojas parceiras!</Text>
                        </Widget>
                        
                        <Widget className={"flex flex-col"}>
                            <Text className="text-[#0f0d3c]">Você possui</Text>
                            <View className="flex flex-row items-end -mt-1">
                                <Text className="text-[#0f0d3c] font-bold text-[42px]">{user.pontos.toFixed(2)}P</Text>
                            </View>
                        </Widget>

                        <TouchableOpacity className='my-4' onPress={() => router.push('/extractloja')}>
                            <Widget variant={"filled"}>
                                <Text className="text-white font-bold text-center">Ver Extrato</Text>
                            </Widget>
                        </TouchableOpacity>
                        
                        <Widget className='mb-2'>
                            <Text className="font-bold text-[24px] text-[#0f0d3c]">Lojas Parceiras</Text>
                        </Widget>
                        {lojas.map((station) => (
                            <TouchableOpacity key={station.nome} onPress={() => router.push(`/loja/${station.id}`)}>
                                <Widget className={"flex flex-row bg-[#F7F7F7] border border-[#262626]"}>
                                    <View>
                                        <Image source={{ uri: station.foto }} className="w-[40px] h-[40px] rounded-[10px]" />
                                    </View>
                                    <View className="flex flex-col ml-5">
                                        <Text className="font-bold text-[#0f0d3c]">{station.nome}</Text>
                                        <Text className="text-[#0f0d3c] font-bold">{calcularDistancia(station.lat, station.lng, user.lat, user.long).km.toFixed(2)}km de distância</Text>
                                    </View>
                                </Widget>
                            </TouchableOpacity>
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