import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
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
import { novoPlano, updatePlano } from "../../db/service"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"

const EditPlan = () => {

    const plano = useLocalSearchParams()

    const router = useRouter()
    const [nome, setNome] = useState(plano.nome)
    const [descricao, setDescricao] = useState(plano.descricao)
    const [valor, setValor] = useState(Number(plano.price.replace(',', '.')))
    const [dias, setDias] = useState(Number(plano.days))
    const [litros, setLitros] = useState(Number(plano.litros))
    const [alerta, setAlerta] = useState("")
    const [loading, setLoading] = useState(true)

    const handleSubmit = async () => {
        setAlerta("")
        if(!nome || !descricao || !valor || !dias) return setAlerta("Preencha todos os campos")
        await updatePlano(plano.docId, {nome, descricao, price: Number(valor.replace(`,`, `.`)), days: Number(dias), litros})
        router.push("/home")
    }

    useEffect(() => {
        console.log(plano)
        setNome(plano.nome)
        setDescricao(plano.descricao)
        setValor(plano.price)
        setDias(plano.days)
        setLoading(false)
    }, [])

    return (
        <SafeAreaView className="flex-1 bg-[#0d0d0d]">
            <StatusBar />
            <View className="mt-8" />
            <Stack.Screen options={{headerShown: false}} />
            {!loading && (
                <ScrollView overScrollMode="never" className="flex-1 m-7">
                <View className="flex flex-row mb-10">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" color={"#FFF"} size={30} />
                    </TouchableOpacity>
                    <Text className="text-white ml-3 text-[28px]">Editar Plano</Text>
                </View>
                <Text className="text-white text-[42px] font-bold">Editar as <Text className="text-orange-400">Informações</Text></Text>
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
                            value={nome}
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
                            value={descricao}
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
                            value={String(valor)}
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
                            value={String(dias)}
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
                            value={String(litros)}
                        />
                    </View>
                </View>
                <View>
                    <TouchableOpacity className="mt-10" onPress={handleSubmit}>
                        
                        <Widget variant={"filled"}>
                            <Text className="font-bold text-center">Salvar</Text>
                        </Widget>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            )}
            
        </SafeAreaView>
    )
}

export default EditPlan