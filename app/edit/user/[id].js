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
import { excluirAlerta, getUserById, novoAlerta, novoBonus, updateAlerta, updateUser } from "../../db/service"
import { Stack, useLocalSearchParams, useRouter, useSearchParams } from "expo-router"
import moment from "moment/moment"
import DateTimePickerModal  from "react-native-modal-datetime-picker"

const EditUser = () => {
    
    const router = useRouter()
    const params = useSearchParams()
    const [alerta, setAlerta] = useState('')
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [pontos, setPontos] = useState(0)
    const [litros, setLitros] = useState(0)
    const [litrosBonus, setLitrosBonus] = useState(0)
    const [genero, setGenero] = useState('')
    const [dataDeNascimento, setDataDeNascimento] = useState('')
    const [cpf, setCpf] = useState('')
    const [telefone, setTelefone] = useState('')
    const [dateOpen, setDateOpen] = useState(false)
    const [user, setUser] = useState({})

    useEffect(() => {
        async function getData() {
            
            let response = await getUserById(params.id)
            setUser(response)
            setNome(response.nome)
            setEmail(response.email)
            setLitros(String(response.litros))
            setPontos(response.pontos)
            setLitrosBonus(String(response.bonus))
            setGenero(response.genero)
            setDataDeNascimento(response.nascimento)
            setCpf(response.cpf)
            setTelefone(response.telefone)
        }
        getData()
    }, [])

    async function save() {
        setAlerta('')
        if(!nome || !email || !genero || !dataDeNascimento || !cpf || !telefone) {
            return setAlerta('Não pode haver campos vazios')
        }
        await updateUser(user.docId, {
            nome, pontos, email, litros: Number(litros), bonus: Number(litrosBonus), genero, nascimento: dataDeNascimento, cpf, telefone
        })
        return router.back()
    }

    function handleConfirm(e) {
        setDataDeNascimento(moment(e).format('DD/MM/YYYY'))
        hideDatePicker()
    }

    const showDatePicker = () => {
        setDateOpen(true);
    };
    
    const hideDatePicker = () => {
        setDateOpen(false);
    };

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
                        Nome
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder=""
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c]"
                            onChangeText={setNome}
                            defaultValue={nome}
                        />
                    </View>
                </View>
                <View className="mb-[12px] mt-2 text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Email
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder=""
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c]"
                            onChangeText={setEmail}
                            defaultValue={email}
                        />
                    </View>
                </View>
                <View className="mb-[12px] mt-2 text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Litros
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c]"
                            onChangeText={setLitros}
                            keyboardType="decimal-pad"
                            defaultValue={litros}
                        />
                    </View>
                </View>
                <View className="mb-[12px] mt-2 text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Litros Bônus
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c]"
                            onChangeText={setLitrosBonus}
                            keyboardType="decimal-pad"
                            defaultValue={litrosBonus}
                        />
                    </View>
                </View>
                <View className="mb-[12px] mt-2 text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Pontos
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c]"
                            onChangeText={setPontos}
                            keyboardType="decimal-pad"
                            defaultValue={pontos}
                        />
                    </View>
                </View>
                <View className="mb-[12px] mt-2 text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        CPF
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder=""
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c]"
                            onChangeText={setCpf}
                            defaultValue={cpf}
                        />
                    </View>
                </View>
                <View className="mb-[12px] mt-2 text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Gênero
                    </Text>
                    <RadioButtons
                        options={["Homem", "Mulher", "Outro"]}
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
                <View className="mb-[12px] mt-2 text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Telefone
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder=""
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c]"
                            onChangeText={setTelefone}
                            defaultValue={telefone}
                        />
                    </View>
                </View>
                <TouchableOpacity onPress={showDatePicker}>
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Data de Nascimento
                    </Text>
                    <View className="w-full mb-[12px] h-[48px] border border-[#A0A0A0] rounded-[8px] justify-center pl-[22px]">
                        <Text className="text-[#0f0d3c] text-start">{dataDeNascimento ? dataDeNascimento : "Data de nascimento"}</Text>
                    </View>
                </TouchableOpacity>
                <DateTimePickerModal 
                    isVisible={dateOpen}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
                
                <View>
                    <TouchableOpacity onPress={save} className="mt-5" >
                        
                        <Widget variant={"filled"}>
                            <Text className="font-bold text-center text-white">Salvar</Text>
                        </Widget>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            
        </SafeAreaView>
    )
}

export default EditUser