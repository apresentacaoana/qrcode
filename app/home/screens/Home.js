
import { Image, RefreshControl, ScrollView, TouchableOpacity } from "react-native"
import { useContext, useEffect, useState } from "react"
import { Text } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage/"
import Widget from "../../components/Widget"
import { View } from "react-native"
import { Ionicons } from "@expo/vector-icons/build/Icons"
import { UserContext } from "../../context/UserContext"
import { excluirAlerta, excluirBonus, getAlertas, getAllBonus, getPostos, getUserByEmail, updateUser } from "../../db/service"
import HomeFrentista from "./HomeFrentista"
import HomeAdmin from "./HomeAdmin"
import calcularDistancia from "../../actions/location"
import * as Location from 'expo-location'
import moment from "moment/moment"
import { SafeAreaView } from "react-native"
import { ActivityIndicator } from "react-native"
import { Stack, useRouter } from "expo-router"
import { PostosContext } from "../../context/PostosContext"
import { BonusContext } from "../../context/BonusContext"
import { StatusBar } from "react-native"
import { getMonthName, getPassedDays, getTimestamp } from "../../actions/time"
import { Alert } from "react-native"


const Home = () => {
    const [user, setUser] = useContext(UserContext)
    const [logged, setLogged] = useState({})
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [postos, setPostos] = useContext(PostosContext)
    const [bonus, setBonus] = useContext(BonusContext)
    const [activeBonus, setActiveBonus] = useState({})
    const [stations, setStations] = useState([])
    const [reload, setReload] = useState(0)
    const router = useRouter()

    
    function onRefresh() {
        setRefreshing(true)
        setReload(reload + 1)
    }

    useEffect(() => {
        async function getData() {
            let userEmail = await AsyncStorage.getItem("email")
            let stationsResponse = await getPostos()
            let responseBonus = await getAllBonus()
            setStations(stationsResponse.slice(0, 5))
            setPostos(stationsResponse)
            setBonus(responseBonus)
            let responseUser = await getUserByEmail(userEmail)
            setUser(responseUser)
            const alertas = await getAlertas()

            // if(Object.keys(responseUser).length != 0) {
            //     let {status} = await Location.requestBackgroundPermissionsAsync();
            //     console.log(status)
            //     if(status == "granted") {
            //         let location = await Location.getCurrentPositionAsync()
            //         let {coords} = location
            //         let {latitude, longitude} = coords
    
            //         if(responseUser.lat !== latitude || responseUser.long !== longitude) {
            //             await updateUser(responseUser.docId, {"lat": latitude, "long": longitude})
            //             setUser({
            //                 ...responseUser,
            //                 lat: latitude,
            //                 long: longitude
            //             })
            //         }
            //     }

            // } else {
            //     let response = await getUserByEmail(await AsyncStorage.getItem("email"))
            //     setUser(response)
            // }

            async function verificarDiferencaEExcluir(createdAt, dias) {
                const dataCriacao = moment(getTimestamp(createdAt)).format('L')
                const dataAtual = moment().format('L')
                console.log(getMonthName(responseUser.nascimento))
                const diferencaEmDias = moment(dataAtual, 'L').diff(moment(dataCriacao, 'L'), 'days')
                const isBonusActivationValid = (
                    (responseBonus[0].genero == "Ambos" || responseBonus[0].genero == responseUser.genero) &&
                    (getMonthName(responseUser.nascimento) == responseBonus[0].mes || responseBonus[0].mes == "qualquer um")
                );
                if(diferencaEmDias > dias) {
                    await excluirBonus(responseBonus[0].docId)
                    await updateUser(responseUser.docId, {
                        bonus: 0,
                        bonusAtivo: ''
                    })
                    setUser({
                        ...user,
                        bonus: 0,
                        bonusAtivo: ''
                    })
                    setActiveBonus(null)
                    setLoading(false)
                } else {
                    
                    await updateUser(responseUser.docId, {
                        bonus: 0,
                        bonusAtivo: ''
                    }) 
                    setUser({
                        ...responseUser,
                        bonus: 0,
                        bonusAtivo: ''
                    })
                    setActiveBonus(null)
                    
                    if(isBonusActivationValid) {
                        setActiveBonus(responseBonus[0])
                        if(responseUser.bonus == 0 && !responseUser.bonusAtivo) {
                            await updateUser(responseUser.docId, {
                                bonus: responseBonus[0].litros,
                                bonusAtivo: responseBonus[0].motivo
                            })
                            setUser({
                                ...responseUser,
                                bonus: responseBonus[0].litros,
                                bonusAtivo: responseBonus[0].motivo
                            })
                        }
                    } 
                    
                }
                
            }
            if(responseBonus[0]) {
                await verificarDiferencaEExcluir(responseBonus[0].createdAt, Number(responseBonus[0].dias))
            }
            setLoading(false)
            setRefreshing(false)
            
            if(alertas) {
                const alertaVistoId = await AsyncStorage.getItem("viewed")
                alertas.forEach(async(alerta, index) => {
                    const dataCriacao = moment(getTimestamp(alerta.createdAt)).format('L')
                    const dataAtual = moment().format('L')
                    const diferencaEmDias = moment(dataAtual, 'L').diff(moment(dataCriacao, 'L'), 'days')
                    if(diferencaEmDias > Number(alerta.dias)) {
                        await excluirAlerta(alerta.docId)
                    } else {
                        if(index == 0 && (alertaVistoId != alerta.docId)) {
                            await AsyncStorage.setItem("viewed", alerta.docId)
                            Alert.alert(alerta.titulo, alerta.conteudo, [
                                {
                                    text: "Ok",
                                    onPress: () => console.log("Aleasdasdrta clicado")
                                }
                            ])
                        }
                    }
                })
            }
        }
        getData()
    }, [reload])



    return (
        <>
            <View className="mt-8" />
            <Stack.Screen options={{ headerShown: false}} />
            <StatusBar />
            {loading && (
                <>
                    <SafeAreaView className="flex-1 justify-center items-center">
                        <ActivityIndicator color={"#fb923c"} size={32} />
                    </SafeAreaView>
                </>
            )}

            {!loading && (
                <>
                    <ScrollView  refreshControl={
                                    <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
                                }
                    overScrollMode="never" className="m-7 flex-1"> 
                       {user.role === "normal" && (
                                <View className="flex flex-col flex-1 gap-3">
                                    {(activeBonus !== null && Object.keys(activeBonus).length > 0) && (
                                        <Widget variant={"filled"} className={"flex mb-2 flex-row items-center"}>
                                            <Ionicons size={24} name="gift" />
                                            <Text className="text-[17px] font-semibold ml-2">{activeBonus.motivo}</Text>
                                        </Widget>
                                    )}
                                    <View className="w-full flex flex-row pr-3 justify-between items-center">
                                        <Text className="text-white text-[25px] font-semibold">Olá, <Text className="text-orange-400">{user.nome}</Text></Text>
                                        <TouchableOpacity onPress={() => setReload(reload + 1)}>
                                            <Ionicons size={24}  name="refresh" color={"white"}  />
                                        </TouchableOpacity>
                                    </View>
                                    <Widget className={"flex flex-col"}>
                                        <Text className="text-orange-400">Você possui</Text>
                                        <View className="flex flex-row items-end -mt-1">
                                            <Text className="text-orange-400 font-bold text-[42px]">{user.litros.toFixed(2)}</Text>
                                            <Text className="text-orange-400 mb-2 ml-2">Litros</Text>
                                        </View>
                                        {(activeBonus !== null && Object.keys(activeBonus).length > 0) && (
                                            <View className={"flex flex-row p-2 bg-orange-400 rounded-[10px] min-w-[100px] max-w-[110px] justify-center items-center"}>
                                                <Ionicons size={20} name="gift" color={"black"} />
                                                <Text className="font-black ml-1 text-[20px]">{user.bonus}L</Text>
                                            </View>
                                        )}
                                    </Widget>
                                    <Widget>
                                        <View className="flex flex-row justify-between items-center">
                                            <Text className="text-white font-bold text-[26px]">Postos de Gasolina</Text>
                                            <TouchableOpacity onPress={() => router.push("/stations")}>
                                                <Text className="text-orange-400 text-[18px]">Ver todos</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View className="flex flex-col gap-3 mt-2">
                                            {stations.map((station) => (
                                                <TouchableOpacity key={station.nome} onPress={() => router.push(`/station/${station.id}`)}>
                                                    <Widget className={"flex flex-row bg-[#0D0D0D] border border-[#262626]"}>
                                                        <View>
                                                            <Image source={{ uri: station.logo }} className="w-[40px] h-[40px] rounded-[10px]" />
                                                        </View>
                                                        <View className="flex flex-col ml-5">
                                                            <Text className="font-bold text-white">{station.nome}</Text>
                                                            <Text className="text-orange-400 font-bold">{calcularDistancia(station.lat, station.lng, user.lat, user.long).km.toFixed(2)}km de distância</Text>
                                                            <View className="flex flex-row gap-3 flex-wrap">
                                                                {station.combustiveis.map((comb) => (
                                                                    <View key={comb.nome} className="flex flex-col gap-1 items-center">
                                                                        <Text className="text-white text-[12px]">{comb.nome}</Text>
                                                                        <Text className="px-2 py-1 text-[12px] text-orange-400 border rounded-full border-orange-400">R$ {comb.precoDebito}</Text>
                                                                    </View>
                                                                ))}
                                                            </View>
                                                        </View>
                                                    </Widget>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </Widget>
                                </View>
                       )} 
                       {user.role === "frentista" && (
                        <HomeFrentista user={user} setUser={setUser} navigation={router} />
                       )}
                       {user.role === "admin" && (
                        <HomeAdmin user={user} setUser={setUser} navigation={router} />
                       )}

                    </ScrollView>
                </>
            )}
        </>
    )
}

export default Home