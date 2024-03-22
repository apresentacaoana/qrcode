import { Text } from "react-native"
import Widget from "../../components/Widget"
import { TouchableOpacity } from "react-native"
import { Image } from "react-native"
import { View } from "react-native"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { getLojaById, getPostoById, getPostos, getUserByEmail, getVendasByVendedorId, updateUser } from "../../db/service"
import calcularDistancia from "../../actions/location"
import { ScrollView } from "react-native"
import { RefreshControl } from "react-native"
import moment from "moment/moment"
import { SafeAreaView } from "react-native"
import { ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"

const HomeLojista = ({ user, setUser }) => {
    const [sales, setSales] = useState([])
    const [reload, setReload] = useState(0)
    const [refreshing, setRefreshing] = useState(false)
    const [soma, setSoma] = useState(0)
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getData() {
            try {
                let responseUser = await getUserByEmail(user.email)
                let specificPosto = await getLojaById(responseUser.loja)
                
                setUser(responseUser)
                if(Object.keys(specificPosto).length == 0) {
                    setUser({
                        ...user,
                        loja: ''
                    })
                    await updateUser(user.docId, {
                        posto: ''
                    })
                } else {
                    setUser({
                        ...user,
                        loja: specificPosto
                    })
                    
                }

                let response = await getVendasByVendedorId(user.email)
                setSales(response.filter((item) => item.status == 'pago' && item.tipo == 'pontos'))
                let apenasValores = sales.map(item => item.pontos)
                let soma = apenasValores.reduce((acc, valor) => acc + valor, 0)
                setSoma(soma)

                setRefreshing(false)
                setLoading(false)
            } catch(err) {console.log(err)
            } finally {setLoading(false)}

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
                        <ActivityIndicator color={"#0f0d3c"} size={32} />
                    </SafeAreaView>
                </>
            ) : (
                
                <ScrollView overScrollMode="never" refreshControl={
                    <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
                }>
                    
                    <View className="w-full flex flex-row pr-3 justify-between items-center">
                        <Text className="text-[#0f0d3c] text-[25px] font-semibold">Olá, <Text className="text-[#0f0d3c]">{user.nome}</Text></Text>
                        <TouchableOpacity onPress={onRefresh}>
                            <Ionicons size={24} name="refresh" color={"white"}  />
                        </TouchableOpacity>
                    </View>
                    {user.loja && (
                        <>
                            <Widget className={"flex mt-2 flex-row mb-2"}>
                                <Image source={{uri: user.loja.foto}} className="w-[40px] rounded-[8px] h-[40px]" />
                                <View className="ml-5">
                                    <Text className="text-[#0f0d3c] text-[15px] font-bold">{user.loja.nome}</Text>
                                    <Text className="text-[#0f0d3c] text-[15px]">{user.loja.endereco}, {user.loja.cidade} - {user.loja.cep}</Text>
                                </View>
                            </Widget>
                            <Widget className={"mb-2 grow"}>
                                <View className="flex mb-3 flex-row justify-between items-center">
                                    <Text className="text-[#0f0d3c] text-[18px] font-bold">Histórico de Vendas</Text>
                                    <TouchableOpacity onPress={() => router.push("/salesp")}>
                                        <Text className="text-[#0f0d3c] text-[14px]">Ver tudo</Text>
                                    </TouchableOpacity>
                                </View>
                                    {sales.map((sale) => (
                                        <Widget key={sale.id} className={"flex flex-row mb-2 items-center justify-between"} variant={"filled"}>
                                            <FontAwesome color={"white"} name="check" size={25} />
                                            <View className="flex ml-5 flex-row justify-between grow">
                                                <View>
                                                    <Text className="font-bold text-white">Cupom {sale.status}  -  #{sale.id}</Text>
                                                    <Text className="text-white">{moment(sale.createdAt.timestamp).format("DD/MM/YYYY")} - {moment(sale.createdAt.timestamp).format('LT')}</Text>
                                                </View>
                                                <View>
                                                    <Text className="font-bold text-white">{sale.pontos}P</Text>
                                                </View>
                                            </View>
                                        </Widget>
                                    ))}
                            </Widget>
                        </>
                        )}
                </ScrollView>
            )}
        </>
    )
}

export default HomeLojista