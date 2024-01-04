import { Text } from "react-native"
import Widget from "../../components/Widget"
import { TouchableOpacity } from "react-native"
import { Image } from "react-native"
import { View } from "react-native"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { getPostos, getUserByEmail, getVendasByVendedorId } from "../../db/service"
import calcularDistancia from "../../actions/location"
import { ScrollView } from "react-native"
import { RefreshControl } from "react-native"
import moment from "moment/moment"
import { SafeAreaView } from "react-native"
import { ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"

const HomeFrentista = ({ user, setUser }) => {
    const [stations, setStations] = useState([])
    const [sales, setSales] = useState([])
    const [alreadySold, setAlreadySold] = useState("")
    const [reload, setReload] = useState(0)
    const [refreshing, setRefreshing] = useState(false)
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getData() {
            let responseUser = await getUserByEmail(user.email)
            setUser(responseUser)
            let postos = await getPostos()
            setStations(postos.slice(0, 5))
            let response = await getVendasByVendedorId(user.email)
            setSales(response.filter((item) => item.status == 'pago'))
            let apenasValores = sales.map(item => item.valor)
            let soma = apenasValores.reduce((acc, valor) => acc + valor, 0)
            setAlreadySold(soma)

            setRefreshing(false)
            setLoading(false)
        }
        getData()
    }, [reload])

    function onRefresh() {
        setRefreshing(true)
        setReload(reload + 1)
    }

    return (
        <>
            {loading ? (
                <>
                    <SafeAreaView className="flex-1 justify-center items-center">
                        <ActivityIndicator color={"#fb923c"} size={32} />
                    </SafeAreaView>
                </>
            ) : (
                <ScrollView overScrollMode="never" refreshControl={
                    <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
                }>
                    
                    <View className="w-full flex flex-row pr-3 justify-between items-center">
                                                <Text className="text-white text-[25px] font-semibold">Olá, <Text className="text-orange-400">{user.nome}</Text></Text>
                                                <TouchableOpacity onPress={onRefresh}>
                                                    <Ionicons size={24} name="refresh" color={"white"}  />
                                                </TouchableOpacity>
                                            </View>
                    {Object.keys(user.posto).length != 0 && (
                        <>
                            <Widget className="mb-2 mt-4">
                                <Text className="text-orange-400">Valor vendido</Text>
                                <Text className="text-orange-400 text-[36px] font-extrabold">R${sales.map(item => item.valor).reduce((acc, valor) => acc + valor, 0)}</Text>
                            </Widget>
                            <Widget className={"flex flex-row mb-2"}>
                                <Image source={{uri: user.posto.logo}} className="w-[40px] rounded-[8px] h-[40px]" />
                                <View className="ml-5">
                                    <Text className="text-orange-400 text-[15px] font-bold">{user.posto.nome}</Text>
                                    <Text className="text-white text-[15px]">{user.posto.endereco}, {user.posto.cidade} - {user.posto.cep}</Text>
                                </View>
                            </Widget>
                            <Widget className={"mb-2 grow"}>
                                <View className="flex mb-3 flex-row justify-between items-center">
                                    <Text className="text-orange-400 text-[18px] font-bold">Histórico de Vendas</Text>
                                    <TouchableOpacity onPress={() => router.push("/sales")}>
                                        <Text className="text-orange-400 text-[14px]">Ver tudo</Text>
                                    </TouchableOpacity>
                                </View>
                                    {sales.map((sale) => (
                                        <Widget key={sale.id} className={"flex flex-row items-center justify-between"} variant={"filled"}>
                                            <FontAwesome name="check" size={25} />
                                            <View className="flex ml-5 flex-row justify-between grow">
                                                <View>
                                                    <Text className="font-bold">Cupom {sale.status}  -  #{sale.id}</Text>
                                                    <Text>{moment(sale.createdAt.timestamp).format("DD/MM/YYYY")} - {moment(sale.createdAt.timestamp).format('LT')}</Text>
                                                </View>
                                                <View>
                                                    <Text className="font-bold">R${sale.valor}</Text>
                                                </View>
                                            </View>
                                        </Widget>
                                    ))}
                            </Widget>
                        </>
                    )}
                    {Object.keys(user.posto).length == 0 && (
                        <>
                        <Text className="text-white opacity-70 text-[16px]">Você não está conectado ao posto em que trabalha, escolha o seu posto abaixo e crie uma solicitação</Text>
                        <Widget className={"mt-5"}>
                            <View className="flex flex-row justify-between items-center">
                                <Text className="text-white font-bold text-[26px]">Postos de Gasolina</Text>
                                <TouchableOpacity onPress={() => router.push("/stations")}>
                                    <Text className="text-orange-400 text-[18px]">Ver todos</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="flex flex-col gap-3 mt-2">
                                {stations.map(station => (
                                    
                                    <TouchableOpacity key={station.nome} onPress={() => router.push(`/station/${station.id}`)}>
                                        <Widget className={"flex flex-row bg-[#0D0D0D]"}>
                                            <View>
                                                <Image source={{uri: station.logo}} className="w-[40px] h-[40px] rounded-[10px]" />
                                            </View>
                                            <View className="flex flex-col ml-5">
                                                <Text className="font-bold text-white">{station.nome}</Text>
                                                <Text className="text-orange-400 font-bold">{calcularDistancia(station.lat, station.lng, user.lat, user.long).km.toFixed(2)}km de Distância</Text>
                                            </View>
                                        </Widget>
                                    </TouchableOpacity>
                                ))}
                            </View>
                    </Widget>
                        </>
                    )}
                </ScrollView>
            )}
        </>
    )
}

export default HomeFrentista