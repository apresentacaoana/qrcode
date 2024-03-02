import { Stack, useRouter } from "expo-router"
import { ScrollView } from "react-native"
import Widget from "../components/Widget"
import { SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { StatusBar } from "react-native"
import { View } from "react-native"
import { TouchableOpacity } from "react-native"
import { Text } from "react-native"
import { useContext, useEffect, useState } from "react"
import { excluirBonus, getAllBonus, getBonusById, getTermo, updateUser } from "../db/service"
import moment from "moment/moment"
import { getTimestamp } from "../actions/time"
import { UserContext } from "../context/UserContext"

const MyBonus = () => {
    const [user, setUser] = useContext(UserContext);
    const [pendingBonus, setPendingBonus] = useState({});
    const [activeBonus, setActiveBonus] = useState(false)
    const router = useRouter()

    function getMonthName(date) {
        const traducaoMeses = {
            "January": "janeiro",
            "February": "fevereiro",
            "March": "março",
            "April": "abril",
            "May": "maio",
            "June": "junho",
            "July": "julho",
            "August": "agosto",
            "September": "setembro",
            "October": "outubro",
            "November": "novembro",
            "December": "dezembro"
          };
        return traducaoMeses[moment(date, "DD/MM/YYYY").format("MMMM")]
    }
    

    const verificarDiferencaEExcluir = async (createdAt, dias, responseBonus, responseUser) => {
        let userBonus = await getBonusById(responseUser.bonusId)
        const dataCriacao = moment(getTimestamp(createdAt)).format('L');
        const dataAtual = moment().format('L');
        const diferencaEmDias = moment(dataAtual, 'L').diff(moment(dataCriacao, 'L'), 'days');

        
        function verificarBonus(usuario, bonus) {
            try {
                if (!usuario || !bonus) {
                    console.log('Parâmetros inválidos:', usuario, bonus);
                    return false;
                }
        
                const usuarioMesNascimento = getMonthName(usuario.nascimento);
                const bonusMes = bonus.mes;
        
                const mesIgual = bonusMes === usuarioMesNascimento || bonusMes === 'qualquer um';
                const generoIgual = bonus.genero === usuario.genero || bonus.genero === 'Ambos';
        
                return mesIgual && generoIgual;
            } catch (error) {
                console.error('Erro na função verificarBonus:', error);
                return false;
            }
        }
        

        if (diferencaEmDias > dias) {
            await excluirBonus(userBonus.docId);
            setUser({ ...responseUser, bonus: 0, bonusAtivo: '', bonusId: '' });
            await updateUser(responseUser.docId, { bonus: 0, bonusAtivo: '', bonusId: '' });
            setActiveBonus({});
        } else {
            if (responseBonus.length > 0) {
                if (verificarBonus(responseUser, responseBonus[0]) && Object.keys(userBonus).length == 0) {
                    setPendingBonus(responseBonus[0]);
                }
            }
    
            if (Object.keys(userBonus).length > 0) {
                setPendingBonus(userBonus);
                setActiveBonus(userBonus);
            }
            
        }

        
    };

    const getBonus = async () => {
        if (user.bonus === 0 && !user.bonusAtivo) {
            const updatedUser = {
                ...user,
                bonus: pendingBonus.litros,
                bonusAtivo: pendingBonus.motivo,
                bonusId: pendingBonus.id,
            };

            setUser(updatedUser);
            await updateUser(user.docId, updatedUser);
            setActiveBonus(true);
            router.back()
        }
    };

    useEffect(() => {
        async function getData() {
            const response = await getAllBonus()
            if(response.length > 0) {
                await verificarDiferencaEExcluir(response[0].createdAt, response[0].dias, response, user)
            }
        }
        getData()
    }, [])
    return (
        <SafeAreaView className="flex-1 bg-[#fefefe]">
            <StatusBar />
            <View className="mt-8" />
            <Stack.Screen options={{headerShown: false}} />
            <ScrollView className="flex-1 flex-col m-7">
                <View className="flex flex-row mb-10">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" color={"#0f0d3c"} size={30} />
                    </TouchableOpacity>
                    <Text className="text-[#0f0d3c] ml-3 text-[28px]">Bônus</Text>
                </View>
                {(Object.keys(pendingBonus).length > 0) ? (
                    <Widget variant={"filled"} className={"flex mb-2"}>
                        <View className={"flex flex-row items-center"}>
                            
                            <Ionicons size={24} name="gift" color={"white"} />
                            <Text className="text-[17px] font-semibold text-white ml-2">{pendingBonus.motivo}</Text>
                        </View>
                        {!user.bonusId && (
                            <TouchableOpacity onPress={getBonus} className="rounded-[4px] mt-2 p-3 bg-[#fcfcfc]">
                                <Text className="text-[#0f0d3c] text-center font-bold">{!activeBonus ? "Resgatar" : "Resgatado"}</Text>
                            </TouchableOpacity>
                        )}
                        {user.bonusId == pendingBonus.id && (
                            <View className="rounded-[4px] mt-2 p-3 bg-[#fcfcfc]">
                                <Text className="text-[#0f0d3c] text-center font-bold">Ativo</Text>
                            </View>
                        )}
                    </Widget>
                ) : (
                    <Text className="text-[#0f0d3c] text-center mt-5 text-[20px]">Por agora não há nenhum bônus ativo.</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default MyBonus