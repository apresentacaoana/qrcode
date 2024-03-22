import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native"
import Widget from "../components/Widget"
import { useContext, useEffect, useState } from "react"
import COLORS from "../constants/colors"
import { UserContext } from "../context/UserContext"
import { getLojaById, getVendasByCompradorId, getVendasById, novaVenda, updateUser } from "../db/service"
import { Stack, useLocalSearchParams, useRouter, useSearchParams } from "expo-router"
import { getPassedHours } from "../actions/time"

const GenerateQR = () => {

    const router = useRouter()
    const [error, setError] = useState("");
    const [code, setCode] = useState("")
    const [user, setUser] = useContext(UserContext)
    const [station, setStation] = useState({})
    const [pontos, setPontos] = useState(0)
    const params = useSearchParams()
    const [vendas, setVendas] = useState([])
    const [canBuy, setCanBuy] = useState(false)

    useEffect(() => {
        async function getData() {
            let response = await getLojaById(params.id)
            let responseVendas = await getVendasByCompradorId(user.email)
            let vendasPagasOuPendentes = responseVendas.filter((item) => (item.status == 'pendente' || item.status == 'pago'))
            let vendasDessaLoja = vendasPagasOuPendentes.filter((item) => item.loja == response.id)
            let vendasDePontos = vendasDessaLoja.filter((item) => item.tipo == 'pontos')
            let ultimaCompraMinha = {...vendasDePontos[0]}
            
            if (Object.keys(ultimaCompraMinha).length === 0 || getPassedHours(ultimaCompraMinha.createdAt) >= 24) {
                setCanBuy(true);
            }

            setStation(response)
        } getData()
        setError('')
    }, [])


    function gerarCodigoAleatorio(tamanho) {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let codigo = '';
      
        for (let i = 0; i < tamanho; i++) {
          const indice = Math.floor(Math.random() * caracteres.length);
          codigo += caracteres.charAt(indice);
        }
      
        return codigo;
    }

    const generateCode = async () => {
        
        let codigo = gerarCodigoAleatorio(6)
        setCode(codigo)


        

        await updateUser(user.docId, {
            pontos: user.pontos - pontos
        });

        setUser({
            ...user,
            pontos: user.pontos - pontos
        })

        await novaVenda(codigo, {
            comprador: user,
            loja: station.id,
            pontos,
            tipo: "pontos"
        })

    }

    return (
        <SafeAreaView className="flex-1 bg-[#fefefe]">
            <StatusBar />
            <Stack.Screen options={{headerShown: false}} />
            <ScrollView overScrollMode="never" className="flex-1 m-7">
                <View className="flex flex-row mb-10 mt-7">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" color={"#0f0d3c"} size={30} />
                    </TouchableOpacity>
                    <Text className="text-[#0f0d3c] ml-3 text-[28px]">Pontos</Text>
                </View>
                {code ? (
                    <View className="items-center">
                        
                        <Widget variant={"filled"} className={"flex w-full flex-row items-center justify-center"}>
                            <FontAwesome name="clock-o" color={"white"} size={20} />
                            <Text className="text-[18px] ml-2 text-white">Expira em <Text className="font-bold">1 HORA</Text></Text>
                        </Widget>

                        <Text className="text-[#0f0d3c] uppercase font-bold mt-4 text-[18px]">{station.nome}</Text>
                        <Text className="text-[#0f0d3c] uppercase mb-5 text-[16px]">{station.endereco} - {station.cidade} - {station.cep}</Text>

                        <Image source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${code}`}} className="w-[200px] h-[200px]" />
                        <Widget className={"w-full mt-4 items-center"}>
                            <Text className="text-[#0f0d3c] font-extrabold text-[25px]">{code.toUpperCase()}</Text>
                        </Widget>
                        <Widget className={"mt-1 w-full items-center"}>
                            <Text className="text-[#0f0d3c] text-[20px]">{station.nome}</Text>
                            <Text className="text-[#0f0d3c] font-extrabold text-[35px]">{pontos}P ({0.1 * pontos}% OFF)</Text>
                        </Widget>
                    </View>
                ) : (
                    
                        <View className="flex flex-1 h-full flex-col w-full items-center">
                            <Image source={{uri: station.foto}} className="w-[100px] h-[100px] rounded-[10px]" />
                            <Text className="text-[#0f0d3c] uppercase font-bold mt-4 text-[18px]">{station.nome}</Text>
                            <Text className="text-[#0f0d3c] uppercase text-[16px]">{station.endereco} - {station.cidade} - {station.cep}</Text>
                        
                            {error && (
                                <Widget variant={"filled"} className='w-full mt-3'>
                                    <Text className="text-white text-center">{error}</Text>
                                </Widget>
                            )}

                        <Widget className={"flex mt-4 flex-col w-full"}>
                            <Text className="text-[#0f0d3c]">Você possui</Text>
                            <View className="flex flex-row items-end -mt-1">
                                <Text className="text-[#0f0d3c] font-bold text-[42px]">{user.pontos.toFixed(2)}P</Text>
                                {/* <Text className="text-[#0f0d3c] mb-2 ml-2">Pontos</Text> */}
                            </View>
                        </Widget>

                            <View className="flex mt-5 flex-row justify-between w-full">
                                <TouchableOpacity disabled={user.pontos < 50 || !canBuy} className='w-[49%]' onPress={() => setPontos(50)}>
                                    <Widget variant={pontos == 50 && "filled"}>
                                        <Text className={`text-center text-[24px] text-[#0f0d3c] font-bold ${pontos == 50 && 'text-white'}`}>5% OFF</Text>
                                        <Text className={`text-center text-[#0f0d3c] ${pontos == 50 && 'text-white'}`}>50 Pontos</Text>
                                    </Widget>
                                </TouchableOpacity>
                                <TouchableOpacity disabled={user.pontos < 100 || !canBuy} className='w-[49%]' onPress={() => setPontos(100)}>
                                    <Widget variant={pontos == 100 && "filled"}>
                                        <Text className={`text-center text-[#0f0d3c] text-[24px] font-bold ${pontos == 100 && 'text-white'}`}>10% OFF</Text>
                                        <Text className={`text-center text-[#0f0d3c] ${pontos == 100 && 'text-white'}`}>100 Pontos</Text>
                                    </Widget>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity onPress={generateCode} className={"mt-10 w-full"}>
                                <Widget variant={"filled"}>
                                    <Text className="font-bold text-center text-white text-[20px]">GERAR CUPOM</Text>
                                </Widget>
                            </TouchableOpacity>
                        </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default GenerateQR