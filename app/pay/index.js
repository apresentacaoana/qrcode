import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native"
import Widget from "../components/Widget"
import { useContext, useEffect, useState } from "react"
import COLORS from "../constants/colors"
import { UserContext } from "../context/UserContext"
import { getVendasById, novaVenda, updateUser } from "../db/service"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"

const GenerateQR = () => {

    const router = useRouter()
    const [error, setError] = useState("");
    const [code, setCode] = useState("")
    let [litros, setLitros] = useState(0)
    const [user, setUser] = useContext(UserContext)
    let [reais, setReais] = useState("")
    let [economia, setEconomia] = useState(0)
    const params = useLocalSearchParams();
    let station = params

    useEffect(() => {
        setError('')
    }, [])


    const handleRealChange = (text) => {
                // Remova todos os caracteres não numéricos do texto
            const numericText = text.replace(/[^0-9]/g, '');


            // Calcule o valor em centavos
            const cents = parseInt(numericText) || 0;

            // Formate o valor em reais e centavos
            const formattedValue = (cents / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            });

            setLitros(`${((cents / 100) / Number(station.precoDebito)).toFixed(2)}L`)

            setReais(formattedValue);
    };

    const handleLitrosChange = (text) => {
        const numericText = text.replace(/[^0-9]/g, '');
        setLitros(`${numericText}`)
        setReais(`R$${(new Number(numericText) * Number(station.precoDebito)).toFixed(2)}`)
        setEconomia(new Number(numericText) * Number(station.precoNormalDebito).toFixed(2))
    }

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
        
        
        const litrosParaGastar = Number(litros.replace('L', '').replace('l', '').replace(',', '.'))

        let codigo = gerarCodigoAleatorio(6)
        setCode(codigo)

        let litrosUsadosBonus = 0;
        let litrosUsadosNormais = 0;

        if (user.bonus >= litrosParaGastar) {
            litrosUsadosBonus = litrosParaGastar;
        } else {
            litrosUsadosBonus = user.bonus;
            litrosUsadosNormais = litrosParaGastar - litrosUsadosBonus;
        }

        

        await updateUser(user.docId, {
            litros: user.litros - litrosUsadosNormais,
            bonus: user.bonus - litrosUsadosBonus,
        });
        setUser({
            ...user,
            litros: user.litros - litrosUsadosNormais,
            bonus: user.bonus - litrosUsadosBonus,
        })

        await novaVenda(codigo, {
            posto: station.id, 
            comprador: user, 
            valor: Number(reais.replace('R$', '').replace(',', '.')),
            litros: Number(litros.replace('L', '').replace('l', '').replace(',', '.')),
            gasolina: {
                nome: station.nome,
                precoDebito: station.precoDebito,
                precoNormalDebito: station.precoNormalDebito
            },
            status: 'pendente',
            detalhes: {
                litrosUsadosNormais,
                litrosUsadosBonus
            }
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
                    <Text className="text-[#0f0d3c] ml-3 text-[28px]">Abastecer</Text>
                </View>
                {code ? (
                    <View className="items-center">
                        
                        <Widget variant={"filled"} className={"flex w-full flex-row items-center justify-center"}>
                            <FontAwesome name="clock-o" size={20} />
                            <Text className="text-[18px] ml-2 text-white">Expira em <Text className="font-bold">1 HORA</Text></Text>
                        </Widget>
                        <Text className="text-[#0f0d3c] uppercase font-bold mt-4 text-[18px]">{station.nomePosto}</Text>
                        <Text className="text-[#0f0d3c] uppercase mb-5 text-[16px]">{station.endereco} - {station.cidade} - {station.cep}</Text>
                            

                        <Image source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${code}`}} className="w-[200px] h-[200px]" />
                        <Widget className={"w-full mt-4 items-center"}>
                            <Text className="text-[#0f0d3c] font-extrabold text-[25px]">{code.toUpperCase()}</Text>
                        </Widget>
                        <Widget className={"mt-1 w-full items-center"}>
                            <Text className="text-[#0f0d3c] font-extrabold text-[35px]">{litros} Litros</Text>
                            <Text className="text-[#0f0d3c] text-[20px]">{station.nome}</Text>
                            <Text className="text-[#0f0d3c] font-extrabold text-[25px]">Valor: <Text className="text-[25px]">{reais}</Text></Text>
                            <Text className="text-[#0f0d3c] text-[20px]">Economia de R${economia}</Text>
                        </Widget>
                    </View>
                ) : (
                    
                        <View className="flex flex-1 h-full flex-col w-full items-center">
                            <Image source={{uri: station.logo}} className="w-[100px] h-[100px] rounded-[10px]" />
                            <Text className="text-[#0f0d3c] uppercase font-bold mt-4 text-[18px]">{station.nomePosto}</Text>
                            <Text className="text-[#0f0d3c] uppercase text-[16px]">{station.endereco} - {station.cidade} - {station.cep}</Text>
                        
                            {error && (
                                <View className="rounded-[8px] bg-red-500 p-5 mt-10 w-full mb-[15px]">
                                    <Text className="text-white">{error}</Text>
                                </View>
                            )}

                            <View className="mt-5 w-full">
                                <Text className="text-[#0f0d3c]">Valor (Reais)</Text>
                                <TextInput keyboardType="numeric" value={reais} onChangeText={(text) => handleRealChange(text)} placeholder="R$0,00" placeholderTextColor={"#EDEDED"} className="border-b-[2px] border-b-gray-500 w-full text-[50px] text-[#0f0d3c]" />
                                <Text className="text-[#0f0d3c] mt-1">Preço do Combustível: R${station.precoDebito}</Text>
                            </View>

                            <Text className="text-[#0f0d3c] font-bold text-[25px] my-10">OU</Text>

                            <View className=" w-full">
                                <Text className="text-[#0f0d3c]">Quantidade (Litros)</Text>
                                <TextInput keyboardType="numeric" value={litros} onChangeText={(text) => handleLitrosChange(text)} placeholder="50" placeholderTextColor={"#EDEDED"} className="border-b-[2px] border-b-gray-500 w-full text-[50px] text-[#0f0d3c]" />
                                {/* <Text className="text-[#0f0d3c] mt-1">Seu saldo: {user.litros + user.bonus.toFixed(2)} Litros</Text> */}
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