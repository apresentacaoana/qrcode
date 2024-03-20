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
import { excluirBonus, novoBonus, updateBonus } from "../../db/service"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"

const EditBonusPage = () => {
    const [litros, setLitros] = useState(0)
    const [dias, setDias] = useState(0)
    const [motivo, setMotivo] = useState("")
    const [genero, setGenero] = useState("Ambos")
    const [alerta, setAlerta] = useState("")
    const [mes, setMes] = useState("")

    const router = useRouter()
    const bonus = useLocalSearchParams()

    const handleCreate = async () => {
        if(!litros || !dias || !motivo) return setAlerta("Preencha os campos")
        await updateBonus(bonus.docId, {litros: Number(litros), dias: Number(dias), motivo, genero, mes})
        router.push('/home')
    }

    const setDiasOnlyNumbers = (e) => {
        const apenasNumeros = e.replace(/[^0-9]/g, '')
        setDias(apenasNumeros)
    }
    const handleDelete = async () => {
        await excluirBonus(bonus.docId)
        router.replace('/home')
    }

    useEffect(() => {
        setDias(bonus.dias)
        setMotivo(bonus.motivo)
        setGenero(bonus.genero)
        setLitros(bonus.litros)
        setMes(bonus.mes)
    }, [])


    return (
        <SafeAreaView className="flex-1 bg-[#fefefe]">
            <StatusBar />
            <View className="mt-8" />
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView overScrollMode="never" className="flex-1 m-7">
                <View className="flex flex-row mb-10">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" color={"#0f0d3c"} size={30} />
                    </TouchableOpacity>
                    <Text className="text-[#0f0d3c] ml-3 text-[28px]">Editar Bônus</Text>
                </View>
                <Text className="text-[#0f0d3c] text-[42px] mb-2 font-bold">Editar as <Text className="text-[#0f0d3c]">Informações</Text></Text>
                {alerta && (
                    <Widget variant={"filled"}>
                        <Text className="font-bold">{alerta}</Text>
                    </Widget>
                )}
                <View className="mb-[12px] mt-2 text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Quantidade de Litros Bônus
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder=""
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c]"
                            keyboardType="number-pad"
                            onChangeText={setLitros}
                            defaultValue={String(litros)}
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Motivo
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder=""
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c]"
                            onChangeText={setMotivo}
                            defaultValue={String(motivo)}
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Irá durar quanto tempo? (Dias)
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder=""
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c]"
                            keyboardType="number-pad"
                            onChangeText={setDiasOnlyNumbers}
                            defaultValue={String(dias)}
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Para quem quer que seja esse bônus?
                    </Text>
                    <RadioButtons
                        options={["Ambos", "Homem", "Mulher", "Outro"]}
                        selectedOption={genero}
                        renderOption={(option) => (
                            <TouchableOpacity onPress={() => setGenero(option)} className={`px-5 py-3 mb-2 rounded-[8px] border ${genero == option ? "border-[#0f0d3c] bg-[#0f0d3c] text-white" : "border-[#A0A0A0]"}`}>
                                <Text className={`${genero == option ? "text-white" : "text-[#0f0d3c]"} text-[16px]`}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        )}

                    />
                </View>
                <View className="mb-[12px] text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Quero que esse bonus se aplique para pessoas nascidas em
                    </Text>
                    <RadioButtons
                        options={["Qualquer um", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" ]}
                        selectedOption={mes}
                        renderOption={(option) => (
                            <TouchableOpacity onPress={() => setMes(option.toLowerCase())} className={`px-5 py-3 mb-2 rounded-[8px] border ${mes == option.toLowerCase() ? "border-[#0f0d3c] bg-[#0f0d3c] text-white" : "border-[#A0A0A0]"}`}>
                                <Text className={`${mes == option.toLowerCase() ? "text-white" : "text-[#0f0d3c]"} text-[16px]`}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        )}

                    />
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

export default EditBonusPage