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
import RadioButtons from "react-native-radio-buttons"
import { excluirAlerta, novoAlerta, novoBonus, updateAlerta } from "../../db/service"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"

const EditAlerta = () => {

    const router = useRouter()
    const [titulo, setTitulo] = useState("")
    const [dias, setDias] = useState('')
    const [motivo, setMotivo] = useState("")
    const [alerta, setAlerta] = useState("")

    const data = useLocalSearchParams()

    useEffect(() => {
        console.log(data)
        setTitulo(data.titulo)
        setDias(`${data.vezes}`)
        setMotivo(data.conteudo)
    }, [])

    const gerarId = () => {
        let numeroAleatorio = Math.random()
        let numeroFinal = Math.floor(numeroAleatorio * (9999999 - 1000000 + 1))
        return numeroFinal
    }

    const handleDelete = async () => {
        await excluirAlerta(data.docId)
        router.replace('/home')
    }

    const handleCreate = async () => {
        if(!titulo || !dias || !motivo) return setAlerta("Preencha os campos")
        await updateAlerta(data.docId, {conteudo: motivo,vezes: dias,titulo})
        router.replace('/home')
    }

    const setDiasOnlyNumbers = (e) => {
        const apenasNumeros = e.replace(/[^0-9]/g, '')
        setDias(apenasNumeros)
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
                    <Text className="text-[#0f0d3c] ml-3 text-[28px]">Editar Alerta</Text>
                </View>
                <Text className="text-[#0f0d3c] text-[42px] mb-2 font-bold">Editar as <Text className="text-[#0f0d3c]">Informações</Text></Text>
                {alerta && (
                    <Widget variant={"filled"}>
                        <Text className="font-bold">{alerta}</Text>
                    </Widget>
                )}
                <View className="mb-[12px] mt-2 text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Título
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder=""
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c]"
                            onChangeText={setTitulo}
                            defaultValue={titulo}
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Texto
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder=""
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c]"
                            onChangeText={setMotivo}
                            defaultValue={motivo}
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Irá se repetir quantas vezes?
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder=""
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c]"
                            keyboardType="number-pad"
                            onChangeText={setDiasOnlyNumbers}
                            defaultValue={dias}
                        />
                    </View>
                </View>
                
                <View>
                    <TouchableOpacity onPress={handleDelete} className="mt-10" >
                        
                        <Widget className={"bg-red-500"}>
                            <Text className="font-bold text-center">Excluir</Text>
                        </Widget>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCreate} className="mt-5" >
                        
                        <Widget variant={"filled"}>
                            <Text className="font-bold text-center text-white">Salvar</Text>
                        </Widget>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            
        </SafeAreaView>
    )
}

export default EditAlerta