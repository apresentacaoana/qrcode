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
import { excluirPlano, novoPlano, updatePlano } from "../../db/service"
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

    const handleDelete = async () => {
        await excluirPlano(plano.docId)
        router.replace('/home')
    }

    useEffect(() => {
        setNome(plano.nome)
        setDescricao(plano.descricao)
        setValor(plano.price)
        setDias(plano.days)
        setLoading(false)
    }, [])

    return (
        <SafeAreaView className="flex-1 bg-[#fefefe]">
            <StatusBar />
            <View className="mt-8" />
            <Stack.Screen options={{headerShown: false}} />
            {!loading && (
                <ScrollView overScrollMode="never" className="flex-1 m-7">
                <View className="flex flex-row mb-10">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" color={"#0f0d3c"} size={30} />
                    </TouchableOpacity>
                    <Text className="text-[#0f0d3c] ml-3 text-[28px]">Editar Plano</Text>
                </View>
                <Text className="text-[#0f0d3c] text-[42px] font-bold">Editar as <Text className="text-[#0f0d3c]">Informações</Text></Text>
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
                            defaultValue={nome}
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
                            defaultValue={descricao}
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
                            defaultValue={String(valor)}
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
                            defaultValue={String(dias)}
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
                            defaultValue={String(litros)}
                        />
                    </View>
                </View>
                <View>
                    <TouchableOpacity onPress={handleDelete} className="mt-10" >
                        
                        <Widget className={"bg-red-500"}>
                            <Text className="font-bold text-center">Excluir</Text>
                        </Widget>
                    </TouchableOpacity>
                    <TouchableOpacity className="mt-5" onPress={handleSubmit}>
                        
                        <Widget variant={"filled"}>
                            <Text className="font-bold text-center text-white">Salvar</Text>
                        </Widget>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            )}
            
        </SafeAreaView>
    )
}

export default EditPlan