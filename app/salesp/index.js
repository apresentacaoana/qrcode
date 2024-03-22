import { Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView, StatusBar } from "react-native"
import BottomBar from "../components/BottomBar"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContext"
import Widget from "../components/Widget"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { getVendasByVendedorId } from "../db/service"
import moment from "moment/moment"
import { Stack, useRouter } from "expo-router"

const SalesPoint = () => {
    const [user, setUser] = useContext(UserContext)
    const [sales, setSales] = useState([])
    const router = useRouter()
    const [alreadySold, setAlreadySold] = useState("")
    useEffect(() => {
        async function getData() {
            let response = await getVendasByVendedorId(user.email)
            setSales(response.filter((item) => item.status == 'pago' && item.tipo == 'pontos'))
            let apenasValores = sales.map(item => item.valor)
            let soma = apenasValores.reduce((acc, valor) => acc + valor, 0)
            setAlreadySold(soma)
        }
        getData()
    }, [])
    return (
        <SafeAreaView className="flex-1 bg-[#fefefe]">
            <StatusBar />
            <View className="mt-8" />
            <Stack.Screen options={{headerShown: true, headerTitle: 'Extrato'}} />
            <View className="flex-1 m-7 -mt-5">

                    {/* <Widget className={"flex flex-col"}>
                        <Text className="text-[#0f0d3c]">Você já vendeu</Text>
                        <View className="flex flex-row items-end -mt-1">
                            <Text className="text-[#0f0d3c] font-bold text-[42px]">R${sales.map(item => item.valor).reduce((acc, valor) => acc + valor, 0)}</Text>
                        </View>
                    </Widget> */}
                    <Widget className={"my-2"}>
                        <Text className="text-[#0f0d3c] font-semibold">Movimentação da conta</Text>
                    </Widget>
                    {sales.map((sale) => (
                        <Widget className={"flex flex-row mb-2 items-center justify-between"} variant={"filled"}>
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
            </View>
        </SafeAreaView>
    )
}

export default SalesPoint