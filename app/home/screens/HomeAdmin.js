import { Text } from "react-native"
import Widget from "../../components/Widget"
import { View } from "react-native"
import { EvilIcons, FontAwesome, MaterialIcons } from "@expo/vector-icons"
import { TouchableOpacity } from "react-native"
import { useContext, useEffect, useMemo, useState } from "react"
import { getAlertas, getAllBonus, getLojas, getPlanos, getPostos, getRequests, getUserByEmail, getUsers } from "../../db/service"
import { ScrollView } from "react-native"
import { RefreshControl } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { SafeAreaView } from "react-native"
import { ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { RequestsContext } from "../../context/RequestsContext"
import { PlanosContext } from "../../context/PlanosContext"
import { BonusContext } from "../../context/BonusContext"
import { PostosContext } from "../../context/PostosContext"

const HomeAdmin = ({ user, setUser }) => {

    const [stations, setStations] = useState([])
    const router = useRouter()
    const [planos, setPlanos] = useState([])
    const [requests, setRequests] = useState([])
    const [lojistas, setLojistas] = useState([])
    const [bonus, setBonus] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [alertas, setAlertas] = useState([])
    const [requestsContext, setRequestsContext] = useContext(RequestsContext)
    const [planosContext, setPlanosContext] = useContext(PlanosContext)
    const [bonusContext, setBonusContext] = useContext(BonusContext)
    const [postosContext, setPostosContext] = useContext(PostosContext)
    const [frentistas, setFrentistas] = useState([])
    const [usuarios, setUsuarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [lojas, setLojas] = useState([])

    const [reload, setReload] = useState(0)


    useMemo(() => {
        async function getData() {
            let responseUser = await getUserByEmail(user.email)
            let postos = await getPostos()
            let alertas = await getAlertas()
            let requests = await getRequests()
            let planos = await getPlanos()
            let bonus = await getAllBonus()
            let lojas = await getLojas()
            const users = await getUsers()
            setPlanos(planos.slice(0, 5))
            setBonus(bonus.slice(0, 5))
            setRequests(requests.slice(0, 5))
            setStations(postos.slice(0, 5))
            setAlertas(alertas)
            setRequestsContext(requests)
            setPlanosContext(planos)
            setPostosContext(postos)
            setBonusContext(bonus)
            setFrentistas(users.filter((user) => user.role == 'frentista').slice(0, 3))
            setUsuarios(users.filter((user) => user.role == 'normal').slice(0, 3))
            setLojistas(users.filter((user) => user.role == 'lojista').slice(0, 3))
            setLojas(lojas.slice(0, 5))

            setUser(responseUser)
            setLoading(false)
        }
        getData()
        setRefreshing(false)
    }, [reload])

    function onRefresh() {
        async function getData() {
        setRefreshing(true)
        let responseUser = await getUserByEmail(user.email)
        let postos = await getPostos()
        let alertas = await getAlertas()
        let requests = await getRequests()
        let planos = await getPlanos()
        let bonus = await getAllBonus()
        setPlanos(planos.slice(0, 5))
        setBonus(bonus.slice(0, 5))
        setRequests(requests.slice(0, 5))
        setStations(postos.slice(0, 5))
        setAlertas(alertas)
        setRequestsContext(requests)
        setPlanosContext(planos)
        setPostosContext(postos)
        setBonusContext(bonus)

        setUser(responseUser)
        setRefreshing(false)
        }
        getData()
    }

    
    async function logout() {
        await AsyncStorage.removeItem("email")
        setUser({})
        router.replace('/')
    }

    return (
        <>
            {loading ? (
                <SafeAreaView className="flex-1 justify-center items-center">
                    <ActivityIndicator color={"#0f0d3c"} size={32} />
                </SafeAreaView>
            ) : (
                <ScrollView refreshControl={
                    <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
                }>
                    <View className="flex-row justify-between mb-3 items-center">
                        <Text className="text-[30px] mb-2 text-[#0f0d3c] font-bold">Olá <Text className="text-[#0f0d3c]">{user.nome}</Text></Text>
                        <View className="flex-row items-center">
                            <TouchableOpacity onPress={logout} className="mr-5">
                                <FontAwesome color={"#0f0d3c"} name="sign-out" size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onRefresh}>
                                <FontAwesome color={"#0f0d3c"} name="spinner" size={25} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Widget variant={"filled"} className={"mb-2"}>
                        <Text className="text-[15px] text-white">Você está logado como</Text>
                        <Text className="font-bold text-white text-[30px]">Admin</Text>
                    </Widget>
                    <TouchableOpacity onPress={() => router.push('chats')}>
                        <Widget variant={"filled"} className={"mb-2"}>
                            <Text className="text-[15px] text-white">Suporte</Text>
                            <Text className="font-bold text-white text-[30px]">Ver chats</Text>
                        </Widget>
                    </TouchableOpacity>
                    <Widget className={"mb-2"}>
                        <View className="flex mb-3 flex-row justify-between items-center">
                            <Text className="text-[#0f0d3c] text-[18px] font-bold">Solicitações</Text>
                            <TouchableOpacity onPress={() => {router.push("/requests")}}>
                                <Text className="text-[#0f0d3c] text-[14px]">Ver tudo</Text>
                            </TouchableOpacity>
                        </View>
                        
                        {requests.map((request) => (
                            
                            <TouchableOpacity key={request.user.nome} onPress={() => router.push(`/request/${request.id}`)}>
                                <Widget className={"flex flex-row mb-1 items-center justify-between"} variant={"filled"}>
                                    <FontAwesome name="user-circle-o" color={"white"} size={25} />
                                    <View className="flex ml-5 flex-row justify-between items-center grow">
                                        <View>
                                            <Text className="font-bold  text-white" >{request.user.nome}</Text>
                                            <Text className="text-white">{request.posto.nome}</Text>
                                        </View>
                                        <View>
                                            <Text className="font-bold text-white">Ver</Text>
                                        </View>
                                    </View>
                                </Widget>
                            </TouchableOpacity>
                        ))}
        
                    </Widget>
                    <Widget className={"mb-2"}>
                        <View className="flex mb-3 flex-row justify-between items-center">
                            <Text className="text-[#0f0d3c] text-[18px] font-bold">Postos</Text>
                            <TouchableOpacity onPress={() => router.push('/stations')}>
                                <Text className="text-[#0f0d3c] text-[14px]">Ver tudo</Text>
                            </TouchableOpacity>
                        </View>
                        
        
                        {stations.map((station) => (
        
                            <TouchableOpacity key={station.nome} onPress={() => router.push(`/station/${station.id}`)}>
                                <Widget className={"flex flex-row mb-1 items-center justify-between"} variant={"filled"}>
                                    <MaterialIcons color={"white"} name="ev-station" size={25} />
                                    <View className="flex ml-5 flex-row justify-between items-center grow">
                                        <View>
                                            <Text className="font-bold text-white">{station.nome}</Text>
                                            <Text className=" text-white">{station.endereco}</Text>
                                        </View>
                                        <View>
                                            <Text className="font-bold text-white">Ver</Text>
                                        </View>
                                    </View>
                                </Widget>
                            </TouchableOpacity>
                        ))}
        
        
        
                    </Widget>
                    <Widget className={"mb-2"}>
                        <View className="flex mb-3 flex-row justify-between items-center">
                            <Text className="text-[#0f0d3c] text-[18px] font-bold">Lojas</Text>
                            <TouchableOpacity onPress={() => router.push('/lojas')}>
                                <Text className="text-[#0f0d3c] text-[14px]">Ver tudo</Text>
                            </TouchableOpacity>
                        </View>
                        
        
                        {lojas.map((station) => (
        
                            <TouchableOpacity key={station.nome} onPress={() => router.push(`/edit/loja/${station.id}`)}>
                                <Widget className={"flex flex-row mb-1 items-center justify-between"} variant={"filled"}>
                                    <MaterialIcons color={"white"} name="store" size={25} />
                                    <View className="flex ml-5 flex-row justify-between items-center grow">
                                        <View>
                                            <Text className="font-bold text-white">{station.nome}</Text>
                                            <Text className=" text-white">{station.endereco}</Text>
                                        </View>
                                        <View>
                                            <Text className="font-bold text-white">Ver</Text>
                                        </View>
                                    </View>
                                </Widget>
                            </TouchableOpacity>
                        ))}
        
        
        
                    </Widget>
                    {/* <Widget className={"mb-2"}>
                        <View className="flex mb-3 flex-row justify-between items-center">
                            <Text className="text-[#0f0d3c] text-[18px] font-bold">Planos</Text>
                            <TouchableOpacity onPress={() => router.push("/plans")}>
                                <Text className="text-[#0f0d3c] text-[14px]">Ver tudo</Text>
                            </TouchableOpacity>
                        </View>
                        {planos.map((plano) => (
                            
                            <TouchableOpacity key={plano.id} onPress={() => router.push({pathname: '/plan', params: {...plano}})}>
                                <Widget className={"flex flex-row mb-1 items-center justify-between"} variant={"filled"}>
                                    <MaterialIcons color={"white"} name="wallet-giftcard" size={25} />
                                    <View className="flex ml-5 flex-row justify-between items-center grow">
                                        <View>
                                            <Text className="font-bold text-white">{plano.nome}</Text>
                                            <Text className=" text-white">{plano.days} Dias</Text>
                                        </View>
                                        <View>
                                            <Text className="font-bold text-white">Ver</Text>
                                        </View>
                                    </View>
                                </Widget>
                            </TouchableOpacity>
                        ))}
                    </Widget> */}
                    <Widget className={"mb-2"}>
                        <View className="flex mb-3 flex-row justify-between items-center">
                            <Text className="text-[#0f0d3c] text-[18px] font-bold">Bônus Ativos</Text>
                            <TouchableOpacity onPress={() => router.push("/allbonus")}>
                                <Text className="text-[#0f0d3c] text-[14px]">Ver tudo</Text>
                            </TouchableOpacity>
                        </View>
                        {bonus.map(item => (
                            <TouchableOpacity key={item.motivo} onPress={() => router.push({pathname: "/bonus", params: {...item}})}>
                                <Widget className={"flex flex-row mb-1 items-center justify-between"} variant={"filled"}>
                                    <FontAwesome name="gift" color={"white"} size={25} />
                                    <View className="flex ml-5 flex-row justify-between items-center grow">
                                        <View>
                                            <Text className="font-bold text-white">{item.litros}L</Text>
                                            <Text className=" text-white">{item.motivo}</Text>
                                        </View>
                                        <View>
                                            <Text className="font-bold text-white">Ver</Text>
                                        </View>
                                    </View>
                                </Widget>
                            </TouchableOpacity>
                        ))}
                    </Widget>
                    <Widget className={"mb-2"}>
                        <View className="flex mb-3 flex-row justify-between items-center">
                            <Text className="text-[#0f0d3c] text-[18px] font-bold">Alertas</Text>
                            <TouchableOpacity onPress={() => router.push("/create/alerta")}>
                                <Text className="text-[#0f0d3c] text-[14px]">Criar</Text>
                            </TouchableOpacity>
                        </View>
                        {alertas.map(item => (
                            <TouchableOpacity key={item.conteudo} onPress={() => router.push({pathname: "/edit/alerta", params: {...item}})}>
                                <Widget className={"flex flex-row mb-1 items-center justify-between"} variant={"filled"}>
                                    <FontAwesome name="exclamation-circle" size={25} color={"white"} />
                                    <View className="flex ml-5 flex-row justify-between items-center grow">
                                        <View>
                                            <Text className="font-bold text-white">{item.titulo}</Text>
                                        </View>
                                        <View>
                                            <Text className="font-bold text-white">Editar</Text>
                                        </View>
                                    </View>
                                </Widget>
                            </TouchableOpacity>
                        ))}
                    </Widget>
                    <Widget className={"mb-2"}>
                        <View className="flex mb-3 flex-row justify-between items-center">
                            <Text className="text-[#0f0d3c] text-[18px] font-bold">Frentistas</Text>
                            <TouchableOpacity onPress={() => router.push("/frentistas")}>
                                <Text className="text-[#0f0d3c] text-[14px]">Ver</Text>
                            </TouchableOpacity>
                        </View>
                        {frentistas.map(item => (
                            <TouchableOpacity key={item.id} onPress={() => router.push(`/edit/user/${item.id}`)}>
                                <Widget className={"flex flex-row mb-1 items-center justify-between"} variant={"filled"}>
                                    <FontAwesome name="exclamation-circle" size={25} color={"white"} />
                                    <View className="flex ml-5 flex-row justify-between items-center grow">
                                        <View>
                                            <Text className="font-bold text-white">{item.nome}</Text>
                                        </View>
                                        <View>
                                            <Text className="font-bold text-white">Editar</Text>
                                        </View>
                                    </View>
                                </Widget>
                            </TouchableOpacity>
                        ))}
                    </Widget>
                    <Widget className={"mb-2"}>
                        <View className="flex mb-3 flex-row justify-between items-center">
                            <Text className="text-[#0f0d3c] text-[18px] font-bold">Usuários</Text>
                            <TouchableOpacity onPress={() => router.push("/users")}>
                                <Text className="text-[#0f0d3c] text-[14px]">Ver</Text>
                            </TouchableOpacity>
                        </View>
                        {usuarios.map(item => (
                            <TouchableOpacity key={item.id} onPress={() => router.push(`/edit/user/${item.id}`)}>
                                <Widget className={"flex flex-row mb-1 items-center justify-between"} variant={"filled"}>
                                    <FontAwesome name="exclamation-circle" size={25} color={"white"} />
                                    <View className="flex ml-5 flex-row justify-between items-center grow">
                                        <View>
                                            <Text className="font-bold text-white">{item.nome}</Text>
                                        </View>
                                        <View>
                                            <Text className="font-bold text-white">Editar</Text>
                                        </View>
                                    </View>
                                </Widget>
                            </TouchableOpacity>
                        ))}
                    </Widget>
                    <Widget className={"mb-2"}>
                        <View className="flex mb-3 flex-row justify-between items-center">
                            <Text className="text-[#0f0d3c] text-[18px] font-bold">Lojistas</Text>
                            <TouchableOpacity onPress={() => router.push("/lojistas")}>
                                <Text className="text-[#0f0d3c] text-[14px]">Ver</Text>
                            </TouchableOpacity>
                        </View>
                        {lojistas.map(item => (
                            <TouchableOpacity key={item.id} onPress={() => router.push(`/edit/lojista/${item.id}`)}>
                                <Widget className={"flex flex-row mb-1 items-center justify-between"} variant={"filled"}>
                                    <FontAwesome name="exclamation-circle" size={25} color={"white"} />
                                    <View className="flex ml-5 flex-row justify-between items-center grow">
                                        <View>
                                            <Text className="font-bold text-white">{item.nome}</Text>
                                        </View>
                                        <View>
                                            <Text className="font-bold text-white">Editar</Text>
                                        </View>
                                    </View>
                                </Widget>
                            </TouchableOpacity>
                        ))}
                    </Widget>
                    <Widget className={"mb-2"}>
                        <View className="flex mb-3 flex-row justify-between items-center">
                            <Text className="text-[#0f0d3c] text-[18px] font-bold">Termos e Condições</Text>
                            <TouchableOpacity onPress={() => router.push("/edit/terms")}>
                                <Text className="text-[#0f0d3c] text-[14px]">Editar</Text>
                            </TouchableOpacity>
                        </View>
                    </Widget>
                </ScrollView>
            )}
        </>
    )
}

export default HomeAdmin