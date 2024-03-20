import { Ionicons } from "@expo/vector-icons"
import { useContext, useEffect, useState } from "react"
import { View } from "react-native"
import { Text } from "react-native"
import { TouchableOpacity } from "react-native"
import { StatusBar } from "react-native"
import { SafeAreaView } from "react-native"
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useIsFocused } from "@react-navigation/native"
import Widget from "../components/Widget"
import { getVendasById, updateVenda } from "../db/service"
import { UserContext } from "../context/UserContext"
import { Stack, useRouter } from "expo-router"

const Scan = ({setPageType}) => {
    const [data, setData] = useState("")
    const isFocused = useIsFocused();
    const [user, setUser] = useContext(UserContext)
    const [venda, setVenda] = useState(null)
    const router = useRouter()

    useEffect(() => {
        const getBarCodeScannerPermission = async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync()
            if(status != 'granted') return router.push("/home")
        }
        getBarCodeScannerPermission()
        if(data) {
            async function getVendaData() {
                let vendaResponse = await getVendasById(data)
                setVenda(vendaResponse)
            }
            getVendaData()
        }
    }, [data])


    const handleConfirm = async () => {
        if(venda) {
            await updateVenda(venda.docId, {
                status: "pago",
                vendedor: user
            })
            router.replace("/home")
        }
    }



    return (
        <SafeAreaView className="flex-1 bg-[#fefefe]">
            <StatusBar />
            <View className="mt-8" />
            <Stack.Screen options={{headerShown: false}} />
            <View className="flex-1 m-7">
                <View className="flex flex-row">
                    <TouchableOpacity onPress={() => setPageType("home")}>
                        <Ionicons name="arrow-back" color={"#0f0d3c"} size={30} />
                    </TouchableOpacity>
                    <Text className="text-[#0f0d3c] ml-3 text-[28px]">Confirmar QR</Text>
                </View>
                {(isFocused && !data && !venda) && (
                    <BarCodeScanner
                        onBarCodeScanned={(data) => setData(data.data)}
                        className={"flex-1  rounded-[40px]"}
                    />
                )}
                {(data && venda) && (
                    <>
                        {Object.keys(venda).length != 0 ? (
                            <>
                                {
                                    venda.status == 'pago' ? (

                                        <Widget variant={"filled"} className={"mt-5 mb-2"}>
                                            <Text className="text-center text-[20px] font-bold text-white">O QRCode que acaba de verificar já foi pago.</Text>
                                        </Widget>

                                    ) : (
                                        <>
                                            <Widget className={"mt-5 mb-2"}>
                                                <Text className="text-[#0f0d3c] text-center text-[20px] font-bold">#{venda.id}</Text>
                                            </Widget>
                                            <Widget className={"mb-2"}>
                                                <Text className="text-[#0f0d3c] font-bold text-[16px]">Informações do Cliente</Text>
                                                <Text className="text-[#0f0d3c] text-[16px]">Nome: <Text className="">{venda.comprador.nome}</Text></Text>
                                                <Text className="text-[#0f0d3c] text-[16px]">Email: <Text className="">{venda.comprador.email}</Text></Text>
                                                <Text className="text-[#0f0d3c] text-[16px]">CPF: <Text className="">{venda.comprador.cpf}</Text></Text>
                                            </Widget>
                                            <Widget className={"mb-2"}>
                                                <Text className="text-[#0f0d3c] font-bold text-[16px]">Informações do Combustível</Text>
                                                <Text className="text-[#0f0d3c] text-[16px]">{venda.gasolina.nome}</Text>
                                                <Text className="text-[#0f0d3c] text-[16px]">{venda.gasolina.precoDebito}</Text>
                                            </Widget>
                                            <Widget className={"mb-2"}>
                                                <Text className="text-[#0f0d3c] font-bold text-[16px]">Quantidade</Text>
                                                <Text className="text-[#0f0d3c] text-[16px]">{venda.litros}</Text>
                                            </Widget>
                                            <Widget className={"mb-2"}>
                                                <Text className="text-[#0f0d3c] font-bold text-[16px]">Valor</Text>
                                                <Text className="text-[#0f0d3c] font-extrabold text-[42px]">R$ {venda.valor}</Text>
                                            </Widget>
                                            <TouchableOpacity onPress={handleConfirm} className>
                                                <Widget variant={"filled"}>
                                                    <Text className="font-bold text-center text-white">Confirmar</Text>
                                                </Widget>
                                            </TouchableOpacity>
                                        </>
                                    )
                                }
                         </>
                        ): (
                            <Widget variant={"filled"} className={"mt-5 mb-2"}>
                                <Text className="text-center text-[20px] font-bold text-white">O QRCode que acaba de verificar não consta em nosso sistema.</Text>
                            </Widget>
                        )}
                    </>
                )}
            </View>
        </SafeAreaView>
    )
}

export default Scan