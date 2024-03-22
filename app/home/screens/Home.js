
import { Image, RefreshControl, ScrollView, TouchableOpacity } from "react-native"
import { useContext, useEffect, useState } from "react"
import { Text } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage/"
import Widget from "../../components/Widget"
import { View } from "react-native"
import { Ionicons } from "@expo/vector-icons/build/Icons"
import { UserContext } from "../../context/UserContext"
import { excluirAlerta, excluirBonus, getAlertas, getAllBonus, getBonusById, getPostos, getUserByEmail, updateUser } from "../../db/service"
import HomeFrentista from "./HomeFrentista"
import HomeAdmin from "./HomeAdmin"
import calcularDistancia from "../../actions/location"
import * as Location from 'expo-location'
import moment from "moment/moment"
import { SafeAreaView } from "react-native"
import { ActivityIndicator } from "react-native"
import { Stack, useRouter } from "expo-router"
import { PostosContext } from "../../context/PostosContext"
import { BonusContext } from "../../context/BonusContext"
import { StatusBar } from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { Alert } from "react-native"
import Navbar from "../../components/Navbar"
import LOGO from '../../../assets/logo-bg.png'
import HomeLojista from "./HomeLojista"


const Home = () => {
    const [user, setUser] = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeBonus, setActiveBonus] = useState({});
    const [stations, setStations] = useState([]);
    const [reload, setReload] = useState(0);
    const router = useRouter();
    const [pendingBonus, setPendingBonus] = useState({});

    const onRefresh = () => {
        setRefreshing(true);
        setReload(reload + 1);
    };

    function getTimestamp(createdAt) {
        const timestampEmMilissegundos = createdAt.seconds * 1000 +
        createdAt.nanoseconds / 1e6;
        return timestampEmMilissegundos
    }
    
    function getMonthName(date) {
        moment.locale("pt-BR")
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
            setActiveBonus(pendingBonus);
        }
    };

    const updateLocation = async () => {
        const userEmail = await AsyncStorage.getItem("email");
        const responseUser = await getUserByEmail(userEmail);

        if (Object.keys(responseUser).length !== 0) {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status === "granted") {
                const location = await Location.getCurrentPositionAsync();
                const { coords } = location;
                const { latitude, longitude } = coords;

                if (responseUser.lat !== latitude || responseUser.long !== longitude) {
                    await updateUser(responseUser.docId, { "lat": latitude, "long": longitude });
                    setUser({ ...responseUser, lat: latitude, long: longitude });
                }
            }
        }
    };

    const handleAlerts = async (alertas) => {
        const alertaVistoId = await AsyncStorage.getItem("viewed");
        alertas.forEach(async (alerta, index) => {
            
            let alertaVisto = await AsyncStorage.getItem('viewed')
            let alert;

            if(alertaVisto) {
                alert = alertaVisto.split(';')
                await AsyncStorage.setItem('viewed', `${alert[0]};${(Number(alert[1]) + 1)}`)
                console.log(`Vezes que o alerta deve aparecer: ${alerta.vezes}`)
                console.log(`Vezes que o alerta apareceu: ${alert[1]}`)
                if(alerta.vezes >= Number(alert[1])) {
                    Alert.alert(alerta.titulo, alerta.conteudo, [{ text: "Ok", onPress: () => console.log("Alerta clicado") }]);
                }
            } else {
                await AsyncStorage.setItem("viewed", `${alerta.docId};0`);
                Alert.alert(alerta.titulo, alerta.conteudo, [{ text: "Ok", onPress: () => console.log("Alerta clicado") }]);
            }

            
        });
    };

    // const verificarDiferencaEExcluir = async (createdAt, dias, responseBonus, responseUser) => {
    //     let userBonus = await getBonusById(responseUser.bonusId)
    //     const dataCriacao = moment(getTimestamp(createdAt)).format('L');
    //     const dataAtual = moment().format('L');
    //     const diferencaEmDias = moment(dataAtual, 'L').diff(moment(dataCriacao, 'L'), 'days');


    //     if (diferencaEmDias > dias) {
    //         await excluirBonus(userBonus.docId);
    //         setUser({ ...responseUser, bonus: 0, bonusAtivo: '', bonusId: '' });
    //         await updateUser(responseUser.docId, { bonus: 0, bonusAtivo: '', bonusId: '' });
    //         setActiveBonus({});
    //     }

        
    // };

    useEffect(() => {
        const getData = async () => {
            try {
                const userEmail = await AsyncStorage.getItem("email");
                const stationsResponse = await getPostos();
                const responseUser = await getUserByEmail(userEmail);


                // await getAllBonus().then(async (response) => {
                //     if(response.length > 0) {
                //         console.log("passei aq")
                //         await verificarDiferencaEExcluir(response[0].createdAt, Number(response[0].dias), response, responseUser)
                //     }
                // })

                stationsResponse.sort((postoA, postoB) => {
                    const distanciaA = calcularDistancia(postoA.lat, postoA.lng, responseUser.lat, responseUser.long).km;
                    const distanciaB = calcularDistancia(postoB.lat, postoB.lng, responseUser.lat, responseUser.long).km;
                    return distanciaA - distanciaB;
                })
                setStations(stationsResponse.slice(0, 5));
                
                setUser(responseUser);
                
                // let userBonus = await getBonusById(responseUser.bonusId)
                // if(Object.keys(userBonus).length == 0) {
                //     setUser({ ...responseUser, bonus: 0, bonusAtivo: '', bonusId: '' });
                //     await updateUser(responseUser.docId, { bonus: 0, bonusAtivo: '', bonusId: '' });
                // }

                await updateLocation();

                setLoading(false);
                setRefreshing(false);

                const alertas = await getAlertas();
                if (alertas) {
                    handleAlerts(alertas);
                }
            } catch (error) {
                console.error("Erro durante a execução assíncrona:", error);
            }
        };

        getData();
    }, [reload]);


    return (
        <>
            <View className="mt-8" />
            <Stack.Screen options={{ headerShown: false}} />
            <StatusBar />
            {loading && (
                <>
                    <SafeAreaView className="flex-1 justify-center items-center">
                        <ActivityIndicator color={"#0f0d3c"} size={32} />
                    </SafeAreaView>
                </>
            )}

            {!loading && (
                <>
                <View className="w-full flex items-center -mb-3  mt-5  flex-row">
                    <Image source={LOGO} className={"w-[30px] h-[30px] ml-7"}/>
                    <Text className="font-bold text-[18px] text-[#0f0d3c]">Postos Kotinski</Text>
                </View>
                <ScrollView  refreshControl={
                                    <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
                                }
                    overScrollMode="never" className="m-7 flex-1"> 
                       {user.role === "normal" && (
                                <View className="flex flex-col flex-1 gap-3">
                                    {(Object.keys(pendingBonus).length > 0) && (
                                        <Widget variant={"filled"} className={"flex mb-2"}>
                                            <View className={"flex flex-row items-center"}>
                                                
                                                <Ionicons size={24} name="gift" color={"white"} />
                                                <Text className="text-[17px] font-semibold text-white ml-2">{pendingBonus.motivo}</Text>
                                            </View>
                                            {!user.bonusId && (
                                                <TouchableOpacity onPress={getBonus} className="rounded-[4px] mt-2 p-3 bg-[#fcfcfc]">
                                                    <Text className="text-[#0f0d3c] text-center font-bold">Resgatar</Text>
                                                </TouchableOpacity>
                                            )}
                                        </Widget>
                                    )}
                                    <View className="w-full flex flex-row pr-3 justify-between items-center">
                                        <View className="flex-row w-full items-center justify-between">
                                            <Text className="text-black text-[25px] font-semibold">Olá, <Text className="text-[#0f0d3c]">{user.nome}</Text></Text>
                                            {/**
                                            <TouchableOpacity onPress={() => router.push('/mybonus')}>
                                                <FontAwesome name="gift" color={"#0f0d3c"} size={30} />
                                            </TouchableOpacity>
                                            */}
                                        </View>
                                        <TouchableOpacity onPress={() => setReload(reload + 1)}>
                                            <Ionicons size={24}  name="refresh" color={"white"}  />
                                        </TouchableOpacity>
                                    </View>
                                    {/* <Widget className={"flex flex-col"}>
                                        <Text className="text-[#0f0d3c]">Você possui</Text>
                                        <View className="flex flex-row items-end -mt-1">
                                            <Text className="text-[#0f0d3c] font-bold text-[42px]">{user.litros.toFixed(2)}</Text>
                                            <Text className="text-[#0f0d3c] mb-2 ml-2">Litros</Text>
                                        </View>
                                        {(user.bonus != 0) && (
                                            <View className={"flex flex-row p-2 bg-[#0f0d3c] rounded-[10px] min-w-[100px] max-w-[110px] justify-center items-center"}>
                                                <Ionicons size={20} name="gift" color={"white"} />
                                                <Text className="font-black ml-1 text-white text-[20px]">{user.bonus.toFixed(2)}L</Text>
                                            </View>
                                        )}
                                    </Widget> */}
                                    <Widget>
                                        <View className="flex flex-row justify-between items-center">
                                            <Text className="text-[#0f0d3c] font-bold text-[26px]">Postos de Gasolina</Text>
                                            <TouchableOpacity onPress={() => router.push("/stations")}>
                                                <Text className="text-[#0f0d3c] text-[14px]">Ver todos</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View className="flex flex-col gap-3 mt-2">
                                            {stations.map((station) => (
                                                <TouchableOpacity key={station.nome} onPress={() => router.push(`/station/${station.id}`)}>
                                                    <Widget className={"flex flex-row bg-[#F7F7F7] border border-[#262626]"}>
                                                        <View>
                                                            <Image source={{ uri: station.logo }} className="w-[40px] h-[40px] rounded-[10px]" />
                                                        </View>
                                                        <View className="flex flex-col ml-5">
                                                            <Text className="font-bold text-[#0f0d3c]">{station.nome}</Text>
                                                            <Text className="text-[#0f0d3c] font-bold">{calcularDistancia(station.lat, station.lng, user.lat, user.long).km.toFixed(2)}km de distância</Text>
                                                            <View className="flex flex-row gap-3 flex-wrap">
                                                                {station.combustiveis.map((comb) => (
                                                                    <View key={comb.nome} className="flex flex-col gap-1 items-center">
                                                                        <Text className="text-[#0f0d3c] text-[12px]">{comb.nome}</Text>
                                                                        <Text className="px-2 py-1 text-[12px] text-[#0f0d3c] border rounded-full border-[#0f0d3c]">R$ {comb.precoDebito}</Text>
                                                                    </View>
                                                                ))}
                                                            </View>
                                                        </View>
                                                    </Widget>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </Widget>
                                </View>
                       )} 
                       {user.role === "frentista" && (
                        <HomeFrentista user={user} setUser={setUser} navigation={router} />
                       )}
                       {user.role === "admin" && (
                        <HomeAdmin user={user} setUser={setUser} navigation={router} />
                       )}
                       {user.role === "lojista" && (
                        <HomeLojista user={user} setUser={setUser} navigation={router} />
                       )}

                    </ScrollView>
                </>
            )}
        </>
    )
}

export default Home