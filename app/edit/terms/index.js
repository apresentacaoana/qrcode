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
import { getTermo, novoAlerta, novoBonus, updateAlerta, updateTermo } from "../../db/service"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"

const EditAlerta = () => {

    const router = useRouter()
    const [texto, setTexto] = useState("")
    const [alerta, setAlerta] = useState("")
    const [termo, setTermo] = useState({})

    const data = useLocalSearchParams()

    useEffect(() => {
        async function getData() {
            let data = await getTermo()
            setTermo(data[0])
            setTexto(data[0].texto)
        }
        getData()
    }, [])


    const handleCreate = async () => {
        if(!texto) return setAlerta("Preencha os campos")
        await updateTermo(termo.docId, {texto})
        router.replace('/home')
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
                    <Text className="text-[#0f0d3c] ml-3 text-[28px]">Editar Termos</Text>
                </View>
                <Text className="text-[#0f0d3c] text-[42px] mb-2 font-bold">Editar as <Text className="text-[#0f0d3c]">Informações</Text></Text>
                {alerta && (
                    <Widget variant={"filled"}>
                        <Text className="font-bold">{alerta}</Text>
                    </Widget>
                )}
                <View className="mb-[12px] mt-2 text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Texto
                    </Text>
                    <View className="w-full h-[300px] border border-[#A0A0A0] rounded-[8px] text-start p-[22px]">
                        <TextInput 
                            placeholder=""
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c] text-start"
                            
                            onChangeText={setTexto}
                            defaultValue={texto}
                            numberOfLines={30}
                            multiline={true}
                        />
                    </View>
                </View>
                
                <View>
                    <TouchableOpacity onPress={handleCreate} className="mt-10" >
                        
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