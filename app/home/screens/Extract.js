import { Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native"
import BottomBar from "../../components/BottomBar"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../context/UserContext"
import Widget from "../../components/Widget"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { getVendasByCompradorId, updateUser, updateVenda } from "../../db/service"
import moment from "moment/moment"
import { ScrollView } from "react-native"
import { RefreshControl } from "react-native"
import { getPassedHours, getTimestamp } from "../../actions/time"
import { StatusBar } from "react-native"

const Extract = () => {
    const [user, setUser] = useContext(UserContext)
    const [sales, setSales] = useState([])
    const [reload, setReload] = useState(0)
    const [refreshing, setRefreshing] = useState(false)
    moment.locale()
    useEffect(() => {
        async function getData() {
            let response = await getVendasByCompradorId(user.email)
            setSales(response)

            let pendentes = response.filter((venda) => venda.status == 'pendente' && getPassedHours(venda.createdAt) >= 1)
            pendentes.forEach(async (venda) => {
                await updateVenda(venda.docId, {status: 'expirado'})
                await updateUser(user.docId, {
                    litros: user.litros + venda.detalhes.litrosUsadosNormais,
                    bonus: user.bonus + venda.detalhes.litrosUsadosBonus
                })
                setUser({
                    ...user,
                    litros: user.litros + venda.detalhes.litrosUsadosNormais,
                    bonus: user.bonus + venda.detalhes.litrosUsadosBonus
                })
            })

            setRefreshing(false)
        }
        getData()
    }, [reload])

    function onRefresh() {
        setRefreshing(true)
        setReload(reload + 1)
    }

    function calcularEconomiaTotal(registros) {
        let economiaTotal = 0;
    
        registros.forEach(registro => {
            if (registro.gasolina && registro.gasolina.precoDebito) {
                economiaTotal += Number(registro.gasolina.precoNormalDebito) - Number(registro.gasolina.precoDebito);
            }
        });
    
        return economiaTotal;
    }

    return (
        <SafeAreaView className="flex-1">

<ScrollView refreshControl={
            <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        } className="flex-1 bg-[#0d0d0d]">
         <View className="mt-8" />
            <StatusBar />
            <View className="flex-1 m-7">
                    <Widget className={"flex flex-col"}>
                        <Text className="text-orange-400">Você possui</Text>
                        <View className="flex flex-row items-end -mt-1">
                            <Text className="text-orange-400 font-bold text-[42px]">{user.litros.toFixed(2)}</Text>
                            <Text className="text-orange-400 mb-2 ml-2">Litros</Text>
                        </View>
                        {user.bonus !== 0 && (
                            <View className={"flex flex-row p-2 bg-orange-400 rounded-[10px] min-w-[100px] max-w-[110px] justify-center items-center"}>
                                <Ionicons size={20} name="gift" color={"black"} />
                                <Text className="font-black ml-1 text-[20px]">{user.bonus}L</Text>
                            </View>
                        )}
                        
                    </Widget>
                    <Widget className={"flex mt-2 flex-col"}>
                        <Text className="text-orange-400">Você já economizou</Text>
                        <View className="flex flex-row items-end -mt-1">
                            <Text className="text-orange-400 font-bold text-[42px]">R${calcularEconomiaTotal(sales.filter((item) => item.status == 'pago'))}</Text>
                        </View>
                    </Widget>
                    <Widget className={"my-2"}>
                        <Text className="text-white font-semibold">Movimentação da conta</Text>
                    </Widget>
                    {sales.map((sale) => (
                        <Widget className={"flex mb-2 flex-row items-center justify-between"} variant={"filled"}>
                            <Ionicons name={`${sale.status == 'pendente' ? 'timer' : ''}${sale.status == 'pago' ? 'checkmark-done' : ''}${sale.status == 'expirado' ? 'md-close' : ''}`} size={25} />
                            <View className="flex ml-5 flex-row justify-between grow">
                                <View>
                                    <Text className="font-bold">Cupom {sale.status}  -  #{sale.id.toUpperCase()}</Text>
                                    <Text>{moment(getTimestamp(sale.createdAt)).format("DD/MM/YYYY")} - {moment(getTimestamp(sale.createdAt)).format('LT')}</Text>
                                </View>
                                <View>
                                    <Text className="font-bold">{sale.status == 'expirado' ? "+" : "- "}{sale.litros} L</Text>
                                    <Text className="font-bold">R${sale.valor}</Text>
                                </View>
                            </View>
                        </Widget>
                    ))}
            </View>
        </ScrollView>

        </SafeAreaView>
    )
}

export default Extract