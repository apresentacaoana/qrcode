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
import { getLojaById, getLojas, getPostos, getUserById, novoBonus, registrarComEmailESenha, registrarLojista, updateUser } from "../../db/service"
import { Stack, useRouter, useSearchParams } from "expo-router"
import Container from "../../components/Container"

const EditLojista = () => {

    const router = useRouter()
    const params = useSearchParams()
    const [user, setUser] = useState({})
    const [alerta, setAlerta] = useState('')
    const [email, setEmail] = useState('')
    const [nome, setNome] = useState('')
    const [senha, setSenha] = useState('')
    const [loja, setLoja] = useState('')
    const [lojas, setLojas] = useState([])

    useEffect(() => {
      async function getData() {
        let responseUser = await getUserById(params.id)
        let response = await getLojas()
        let responseLoja = await getLojaById(responseUser.loja)
        setUser(responseUser)
        setLojas(response)
        setLoja(responseLoja)
        setEmail(responseUser.email)
        setNome(responseUser.nome)
        setSenha(responseUser.senha)
      } getData()
    }, [])

    async function handleCreate() {
        setAlerta('')
        if(!nome || !email || !senha || !loja) return setAlerta("Preencha todas as informações.")
        await updateUser(user.docId, {
            nome,
            email,
            senha,
            loja: loja.id
        })
        router.replace('/home')
    }

    return (
        <Container title={"Lojista"}>
            <Text className="text-[#0f0d3c] text-[42px] mb-2 font-bold">Insira as <Text className="text-[#0f0d3c]">Informações</Text></Text>
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
                <View className="mb-[12px] text-[#0f0d3c]">
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
                <View className="mb-[12px] text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Senha
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder=""
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c]"
                            onChangeText={setSenha}
                            defaultValue={senha}
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Quero vincular esta loja com essa conta:
                    </Text>
                    {lojas.map((item) => (
                        <TouchableOpacity onPress={() => setLoja(item)} className={`px-5 py-3 mb-2 rounded-[8px] border ${loja.nome == item.nome ? "border-[#0f0d3c] bg-[#0f0d3c] text-white" : "border-[#A0A0A0]"}`}>
                            <Text className={`${loja.nome == item.nome ? "text-white" : "text-[#0f0d3c]"} text-[16px]`}>
                                {item.nome}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View>
                    <TouchableOpacity onPress={handleCreate} className="mt-10" >
                        <Widget variant={"filled"}>
                            <Text className="font-bold text-center text-white">Salvar</Text>
                        </Widget>
                    </TouchableOpacity>
                </View>
        </Container>
    )
}

export default EditLojista