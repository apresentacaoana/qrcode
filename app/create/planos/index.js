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
        <SafeAreaView className="flex-1 bg-[#0d0d0d]">
            <StatusBar />
            <View className="mt-8" />
            <Stack.Screen options={{headerShown: false}} />
            <ScrollView overScrollMode="never" className="flex-1 m-7">
                <View className="flex flex-row mb-10">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" color={"#FFF"} size={30} />
                    </TouchableOpacity>
                    <Text className="text-white ml-3 text-[28px]">Criar Plano</Text>
                </View>
                <Text className="text-white text-[42px] font-bold">Insira as <Text className="text-orange-400">Informações</Text></Text>
                {alerta && (
                    <Widget variant={"filled"}>
                        <Text className="font-bold">{alerta}</Text>
                    </Widget>
                )}
                <View className="mb-[12px] mt-2 text-white">
                    <Text className="text-[16px] text-white font-normal my-[8px]">
                        Nome
                    </Text>
                    <View className="w-full h-[48px] border border-white rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder="Insira o nome do plano"
                            placeholderTextColor={"#FFFFFF"}
                            className="w-full text-white"
                            onChangeText={setNome}
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-white">
                    <Text className="text-[16px] text-white font-normal my-[8px]">
                        Descrição do Plano
                    </Text>
                    <View className="w-full h-[48px] border border-white rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder="Insira uma descrição"
                            placeholderTextColor={"#FFFFFF"}
                            className="w-full text-white"
                            onChangeText={setDescricao}
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-white">
                    <Text className="text-[16px] text-white font-normal my-[8px]">
                        Valor
                    </Text>
                    <View className="w-full h-[48px] border border-white rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder="Insira o valor"
                            placeholderTextColor={"#FFFFFF"}
                            keyboardType="decimal-pad"
                            className="w-full text-white"
                            onChangeText={setValor}
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-white">
                    <Text className="text-[16px] text-white font-normal my-[8px]">
                        Duração da Assinatura (Dias)
                    </Text>
                    <View className="w-full h-[48px] border border-white rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder="Insira a duração da assinatura"
                            placeholderTextColor={"#FFFFFF"}
                            keyboardType="decimal-pad"
                            className="w-full text-white"
                            onChangeText={setDias}
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-white">
                    <Text className="text-[16px] text-white font-normal my-[8px]">
                        Litros
                    </Text>
                    <View className="w-full h-[48px] border border-white rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder="Insira quantos litros essa assinatura irá prover"
                            placeholderTextColor={"#FFFFFF"}
                            keyboardType="decimal-pad"
                            className="w-full text-white"
                            onChangeText={setLitros}
                        />
                    </View>
                </View>
                <View>
                    <TouchableOpacity className="mt-10" onPress={handleCreate}>
                        
                        <Widget variant={"filled"}>
                            <Text className="font-bold text-center">Criar</Text>
                        </Widget>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            
        </SafeAreaView>
    )
}

export default CreatePlan