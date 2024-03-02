import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { View } from "react-native"
import { ScrollView } from "react-native"
import { Text } from "react-native"
import { TouchableOpacity } from "react-native"
import { TextInput } from "react-native"
import { StatusBar } from "react-native"
import { SafeAreaView } from "react-native"
import Widget from "../../components/Widget"
import { Touchable } from "react-native"
import * as ImagePicker from 'expo-image-picker'
import { novoPlano } from "../../db/service"
import { Stack, useRouter } from "expo-router"

const CreatePlan = () => {

    const router = useRouter()
    const [nome, setNome] = useState("")
    const [descricao, setDescricao] = useState("")
    const [valor, setValor] = useState(0)
    const [dias, setDias] = useState(0)
    const [litros, setLitros] = useState(0)
    const [alerta, setAlerta] = useState("")

    function gerarCodigoAleatorio(tamanho) {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let codigo = '';
      
        for (let i = 0; i < tamanho; i++) {
          const indice = Math.floor(Math.random() * caracteres.length);
          codigo += caracteres.charAt(indice);
        }
      
        return codigo;
    }

    const handleCreate = async () => {
        setAlerta("")
        if(!nome || !descricao || !valor || !dias || !litros) return setAlerta("Preencha todos os campos")
        await novoPlano({id: gerarCodigoAleatorio(7), litros, nome, descricao, price: Number(valor.replace(',', '.')), days: Number(dias)})
        router.replace("/home")
    }

    return (
        <SafeAreaView className="flex-1 bg-[#fefefe]">
            <StatusBar />
            <View className="mt-8" />
            <Stack.Screen options={{headerShown: false}} />
            <ScrollView overScrollMode="never" className="flex-1 m-7">
                <View className="flex flex-row mb-10">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" color={"#0f0d3c"} size={30} />
                    </TouchableOpacity>
                    <Text className="text-[#0f0d3c] ml-3 text-[28px]">Criar Plano</Text>
                </View>
                <Text className="text-[#0f0d3c] text-[42px] font-bold">Insira as <Text className="text-[#0f0d3c]">Informações</Text></Text>
                {alerta && (
                    <Widget variant={"filled"}>
                        <Text className="font-bold">{alerta}</Text>
                    </Widget>
                )}
                <View className="mb-[12px] mt-2 text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Nome
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder="Insira o nome do plano"
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c]"
                            onChangeText={setNome}
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Descrição do Plano
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder="Insira uma descrição"
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c]"
                            onChangeText={setDescricao}
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Valor
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder="Insira o valor"
                            placeholderTextColor={"#A0A0A0"}
                            keyboardType="decimal-pad"
                            className="w-full text-[#0f0d3c]"
                            onChangeText={setValor}
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Duração da Assinatura (Dias)
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder="Insira a duração da assinatura"
                            placeholderTextColor={"#A0A0A0"}
                            keyboardType="decimal-pad"
                            className="w-full text-[#0f0d3c]"
                            onChangeText={setDias}
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Litros
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder="Insira quantos litros essa assinatura irá prover"
                            placeholderTextColor={"#A0A0A0"}
                            keyboardType="decimal-pad"
                            className="w-full text-[#0f0d3c]"
                            onChangeText={setLitros}
                        />
                    </View>
                </View>
                <View>
                    <TouchableOpacity className="mt-10" onPress={handleCreate}>
                        
                        <Widget variant={"filled"}>
                            <Text className="font-bold text-center text-white">Criar</Text>
                        </Widget>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            
        </SafeAreaView>
    )
}

export default CreatePlan