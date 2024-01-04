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
import { novoAlerta, novoBonus, updateAlerta } from "../../db/service"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"

const EditAlerta = () => {

    const router = useRouter()
    const [titulo, setTitulo] = useState("")
    const [dias, setDias] = useState(0)
    const [motivo, setMotivo] = useState("")
    const [alerta, setAlerta] = useState("")

    const data = useLocalSearchParams()

    useEffect(() => {
        setTitulo(data.titulo)
        setDias(data.dias)
        setMotivo(data.conteudo)
    }, [])

    const gerarId = () => {
        let numeroAleatorio = Math.random()
        let numeroFinal = Math.floor(numeroAleatorio * (9999999 - 1000000 + 1))
        return numeroFinal
    }

    const handleCreate = async () => {
        if(!titulo || !dias || !motivo) return setAlerta("Preencha os campos")
        await updateAlerta(data.docId, {conteudo: motivo,dias,titulo})
        router.replace('/home')
    }

    const setDiasOnlyNumbers = (e) => {
        const apenasNumeros = e.replace(/[^0-9]/g, '')
        setDias(apenasNumeros)
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
                    <Text className="text-white ml-3 text-[28px]">Editar Alerta</Text>
                </View>
                <Text className="text-white text-[42px] mb-2 font-bold">Editar as <Text className="text-orange-400">Informações</Text></Text>
                {alerta && (
                    <Widget variant={"filled"}>
                        <Text className="font-bold">{alerta}</Text>
                    </Widget>
                )}
                <View className="mb-[12px] mt-2 text-white">
                    <Text className="text-[16px] text-white font-normal my-[8px]">
                        Título
                    </Text>
                    <View className="w-full h-[48px] border border-white rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder=""
                            placeholderTextColor={"#FFFFFF"}
                            className="w-full text-white"
                            onChangeText={setTitulo}
                            value={titulo}
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-white">
                    <Text className="text-[16px] text-white font-normal my-[8px]">
                        Texto
                    </Text>
                    <View className="w-full h-[48px] border border-white rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder=""
                            placeholderTextColor={"#FFFFFF"}
                            className="w-full text-white"
                            onChangeText={setMotivo}
                            value={motivo}
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-white">
                    <Text className="text-[16px] text-white font-normal my-[8px]">
                        Irá durar quanto tempo? (Dias)
                    </Text>
                    <View className="w-full h-[48px] border border-white rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder=""
                            placeholderTextColor={"#FFFFFF"}
                            className="w-full text-white"
                            keyboardType="number-pad"
                            onChangeText={setDiasOnlyNumbers}
                            value={dias}
                        />
                    </View>
                </View>
                
                <View>
                    <TouchableOpacity onPress={handleCreate} className="mt-10" >
                        
                        <Widget variant={"filled"}>
                            <Text className="font-bold text-center">Salvar</Text>
                        </Widget>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            
        </SafeAreaView>
    )
}

export default EditAlerta