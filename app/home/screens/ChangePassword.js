import { useContext, useEffect, useState } from "react"
import { TextInput, TouchableOpacity } from "react-native"
import { Text, View } from "react-native"
import { UserContext } from "../../context/UserContext"
import Widget from "../../components/Widget"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { getUserByEmail, updateUser } from "../../db/service"

const ChangePassword = ({ setPageType, navigation }) => {
    const [user, setUser] = useContext(UserContext)
    const [password, setPassword] = useState("")
    const [newPassword,  setNewPassword] = useState("")
    const [confirmNewPassword,  setConfirmNewPassword] = useState("")
    const [alerta, setAlerta] = useState("")

    useEffect(() => {
        
    }, [])

    const handleSubmit = async () => {
        setAlerta("")
        if(user.senha != password) return setAlerta("Senha incorreta")
        if(newPassword != confirmNewPassword) return setAlerta("As senhas precisam ser iguais")
        
        await updateUser(user.docId, {
            senha: newPassword
        })
        setUser({
            ...user,
            senha: password
        })
        setPageType("")
    }

    return (
        <>
            <View className="mb-4 flex flex-row items-center">
                <TouchableOpacity onPress={() => setPageType("")}>
                    <Ionicons name="arrow-back" size={25} color={"white"} />
                </TouchableOpacity>
                <Text className="text-[32px] font-bold text-white ml-3">Suas <Text className="text-orange-400">Informações</Text></Text>
            </View>
                {alerta && (
                    <Widget variant={"filled"}>
                        <Text className="font-bold">{alerta}</Text>
                    </Widget>
                )}
                <View className="mb-[12px] mt-3 text-white">
                    
                    <Text className="text-[16px] text-white font-normal my-[8px]">
                        Senha Atual
                    </Text>
                    <View className="w-full h-[48px] border border-white rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder="Informe sua senha"
                            placeholderTextColor={"#FFFFFF"}
                            secureTextEntry={true}
                            value={password}
                            onChangeText={setPassword}
                            className="w-full text-white"
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-white">
                    
                    <Text className="text-[16px] text-white font-normal my-[8px]">
                        Nova Senha
                    </Text>
                    <View className="w-full h-[48px] border border-white rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder="Nova senha"
                            placeholderTextColor={"#FFFFFF"}
                            secureTextEntry={true}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            className="w-full text-white"
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-white">
                    
                    <Text className="text-[16px] text-white font-normal my-[8px]">
                        Confirmar Senha
                    </Text>
                    <View className="w-full h-[48px] border border-white rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            placeholder="Repita a nova senha"
                            placeholderTextColor={"#FFFFFF"}
                            secureTextEntry={true}
                            value={confirmNewPassword}
                            onChangeText={setConfirmNewPassword}
                            className="w-full text-white"
                        />
                    </View>
                </View>
                <TouchableOpacity onPress={handleSubmit}>
                    <Widget variant={"filled"} className={"mt-2"}>
                        <Text className="text-[16px] text-center font-bold">Mudar Senha</Text>
                    </Widget>
                </TouchableOpacity>
            </>
    )
}

export default ChangePassword