import { Image, ScrollView, TextInput } from "react-native"
import COLORS from "../../constants/colors"
import { LinearGradient } from "expo-linear-gradient"
import { TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import Checkbox from "expo-checkbox"
import Button from "../../components/Button"
import { getUserByCPF, getUserByEmail, registrarComEmailESenha } from "../../db/service"
import RadioButtons from "react-native-radio-buttons"
import DateTimePickerModal  from "react-native-modal-datetime-picker"

import {Text, View, StatusBar} from 'react-native'
import { Stack, useRouter } from "expo-router"
import { validaCPF } from "../../actions/data"
import moment from "moment/moment"

const Register = () => {
    const [isPasswordShown, setIsPasswordShown] = useState(false)
    const [isCheck, setIsChecked] = useState(false)
    const [alert, setAlert] = useState("")
    const [genero, setGenero] = useState("")
    const [cpf, setCPF] = useState("")
    const [terms, setTerms] = useState(false)
    const router = useRouter()
    const [dateOpen, setDateOpen] = useState(false)

    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [confirmarSenha, setConfirmarSenha] = useState("")
    const [nome, setNome] = useState("")
    const [telefone, setTelefone] = useState("")
    const [nascimento, setNascimento] = useState("")

    function handleConfirm(e) {
        setNascimento(moment(e).format('DD/MM/YYYY'))
        hideDatePicker()
    }

    const showDatePicker = () => {
        setDateOpen(true);
    };
    
    const hideDatePicker = () => {
        setDateOpen(false);
    };

    const handleTelefoneChange = (input) => {
        let numeroLimpo = input.replace(/\D/g, '');
    
        if (numeroLimpo.length >= 2) {
          numeroLimpo = `(${numeroLimpo.substring(0, 2)}) ${numeroLimpo.substring(2)}`;
        }
    
        if (numeroLimpo.length >= 13) {
          numeroLimpo = `${numeroLimpo.substring(0, 10)}-${numeroLimpo.substring(10)}`;
        }
    
        setTelefone(numeroLimpo);
    };

    const handleSubmit = async () => {
        setAlert("")
        let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        if(!email || !senha || !confirmarSenha || !nome || !cpf || !genero || !telefone || !nascimento) return setAlert("Todos os campos são obrigatórios")
        if(!emailRegex.test(email)) return setAlert("Informe um email válido")
        if(senha.length < 6) return setAlert("A senha precisa ter ao menos 6 caracteres")
        if(senha !== confirmarSenha) return setAlert("As senhas precisam ser iguais")
        let user = await getUserByEmail(email.toLowerCase())
        if(user) return setAlert("Este email já está sendo utilizado")
        if(!validaCPF(cpf)) return setAlert("Informe um CPF válido")
        let userByCpf = await getUserByCPF(cpf)
        if(userByCpf) return setAlert("Este CPF já está sendo utilizado")
        if(!terms) return setAlert("Aceite os termos e condições para continuar")
        await registrarComEmailESenha({nome, email: email.toLowerCase(), senha, telefone, nascimento, lat: 12, long: 12, role: "frentista", cpf, genero}, router)
    }

    const handleOnlyNumber =  (e) => {
        return e.replace(/[^0-9]/g, '');
    }

    return (
        <View 
            className={"flex-1  bg-[#fefefe]"}
        >
            
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar />
            <ScrollView className="flex-1 mx-[22px]">
                <View className="my-[42px]">
                    <Text className="text-[32px] font-bold my-[12px] text-[#0f0d3c]">Criar Conta</Text>
                    <Text className="text-[16px] text-[#0f0d3c]">Crie uma conta como frentista!</Text>
                </View>
                
                <View className="mb-[12px] text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Nome
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            onChangeText={setNome}
                            defaultValue={nome}
                            placeholder="Insira seu nome completo"
                            placeholderTextColor={"#A0A0A0"}
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
                            onChangeText={setEmail}
                            defaultValue={email}
                            placeholder="Insira seu endereço de email"
                            placeholderTextColor={"#A0A0A0"}
                            keyboardType="email-address"
                            className="w-full text-[#0f0d3c]"
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Telefone
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            onChangeText={(e) => handleTelefoneChange(e)}
                            defaultValue={telefone}
                            placeholder="Insira seu telefone celular"
                            placeholderTextColor={"#A0A0A0"}
                            maxLength={15}
                            keyboardType="decimal-pad"
                            className="w-full text-[#0f0d3c]"
                        />
                    </View>
                </View>
                <TouchableOpacity onPress={showDatePicker}>
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Data de Nascimento
                    </Text>
                    <View className="w-full mb-[12px] h-[48px] border border-[#A0A0A0] rounded-[8px] justify-center pl-[22px]">
                        <Text className="text-[#0f0d3c] text-start">{nascimento ? nascimento : "Data de nascimento"}</Text>
                    </View>
                </TouchableOpacity>
                <DateTimePickerModal 
                    isVisible={dateOpen}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
                <View className="mb-[12px] text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        CPF
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            onChangeText={(e) => setCPF(handleOnlyNumber(e))}
                            defaultValue={cpf}
                            placeholder="Insira seu CPF"
                            maxLength={11}
                            placeholderTextColor={"#A0A0A0"}
                            keyboardType="decimal-pad"
                            className="w-full text-[#0f0d3c]"
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Senha
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            onChangeText={setSenha}
                            defaultValue={senha}
                            placeholder="Informe uma senha"
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c]"
                            secureTextEntry={!isPasswordShown}
                        />
                        <TouchableOpacity
                            onPress={() => setIsPasswordShown(!isPasswordShown)}
                            className="absolute right-[12px]"
                        >
                            <Ionicons name={`${isPasswordShown ? "eye" : "eye-off"}`} size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="mb-[12px] text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Confirmar Senha
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            onChangeText={setConfirmarSenha}
                            defaultValue={confirmarSenha}
                            placeholder="Insira a mesma senha novamente"
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c]"
                            secureTextEntry={!isPasswordShown}
                        />

                        <TouchableOpacity
                            onPress={() => setIsPasswordShown(!isPasswordShown)}
                            className="absolute right-[12px]"
                        >
                            <Ionicons name={`${isPasswordShown ? "eye" : "eye-off"}`} size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="mb-[12px] text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Eu sou
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
                {alert && (
                    <View className="rounded-[8px] bg-red-500 p-5 mb-[17px]">
                        <Text className="text-white">{alert}</Text>
                    </View>
                )}

                <View className="flex items-center flex-row mb-[6px] mt-3">
                    <Checkbox 
                        className="mr-[8px]"
                        value={terms}
                        onValueChange={setTerms}
                        style={{width: 30, height: 30}}
                        color={terms ? COLORS.primary : undefined}
                    />
                    <TouchableOpacity onPress={() => router.push('/terms')}>
                        <Text className="text-[#0f0d3c]">Aceito os <Text className="font-extrabold">Termos e Condições</Text></Text>
                    </TouchableOpacity>
                </View>

                <Button 
                    title="Criar"
                    onPress={handleSubmit}
                    filled
                    className="mt-[18px] mb-[4px] py-[15px]"
                />


            </ScrollView>
        </View>
    )
}

export default Register