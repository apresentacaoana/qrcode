import { useContext, useEffect, useState } from "react"
import { TextInput, TouchableOpacity } from "react-native"
import { Text, View } from "react-native"
import { UserContext } from "../../context/UserContext"
import Widget from "../../components/Widget"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { updateUser } from "../../db/service"
import { ScrollView } from "react-native"

const ChangeProfile = ({ setPageType, navigation }) => {
    const [user, setUser] = useContext(UserContext)
    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [cpf, setCPF] = useState("")
    const [alerta, setAlerta] = useState("")

    useEffect(() => {
        setNome(user.nome)
        setEmail(user.email)
        setCPF(user.cpf)
    }, [])

    const handleSubmit = async () => {
        setAlerta("")
        if(!nome || !email || !cpf) return setAlerta("Não pode haver nenhum campo vazio")
        await updateUser(user.docId, {
            nome,
            email,
            cpf
        })
        
        setUser({
            ...user,
            nome,
            email,
            cpf
        })
        setPageType("")
    }

    return (
        <ScrollView>
        <View className="mb-4 flex flex-row items-center">
            <TouchableOpacity onPress={() => setPageType("")}>
                <Ionicons name="arrow-back" size={25} color={"#0f0d3c"} />
            </TouchableOpacity>
            <Text className="text-[32px] font-bold text-[#0f0d3c] ml-3">Suas <Text className="text-[#0f0d3c]">Informações</Text></Text>
        </View>
                {alerta && (
                    <Widget variant={"filled"}>
                        <Text className="font-bold">{alerta}</Text>
                    </Widget>
                )}
                <View className="mb-[12px] mt-3 text-[#0f0d3c]">
                    
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Nome Completo
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder="Informe seu email"
                            placeholderTextColor={"#A0A0A0"}
                            defaultValue={nome}
                            onChangeText={setNome}
                            keyboardType="email-address"
                            className="w-full text-[#0f0d3c]"
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-[#0f0d3c]">
                    
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Email
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder="Informe seu email"
                            placeholderTextColor={"#A0A0A0"}
                            defaultValue={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            className="w-full text-[#0f0d3c]"
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-[#0f0d3c]">
                    
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        CPF
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder="Informe seu CPF"
                            placeholderTextColor={"#A0A0A0"}
                            defaultValue={cpf}
                            onChangeText={setCPF}
                            keyboardType="decimal-pad"
                            className="w-full text-[#0f0d3c]"
                        />
                    </View>
                </View>
                <TouchableOpacity onPress={handleSubmit}>
                    <Widget variant={"filled"} className={"mt-2"}>
                        <Text className="text-[16px] text-white text-center font-bold">Alterar</Text>
                    </Widget>
                </TouchableOpacity>
            </ScrollView>
    )
}

export default ChangeProfile