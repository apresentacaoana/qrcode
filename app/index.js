import hero1 from '../assets/hero1.jpg'
import hero2 from '../assets/hero2.jpg'
import hero3 from '../assets/hero3.jpg'
import Button from "./components/Button"
import { useContext, useEffect, useState } from "react"
import * as Location from 'expo-location'
import { Stack, useRouter } from "expo-router"
import { Text, Image, Pressable, View, ScrollView, StatusBar } from "react-native"
import { UserContext } from "./context/UserContext"
import { getUserByEmail } from "./db/service"
import AsyncStorage from "@react-native-async-storage/async-storage"

const Welcome = () => {
    const router = useRouter()
    const [user, setUser] = useContext(UserContext)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        async function execData() {
            if(Object.keys(user).length != 0) {
                let {status} = await Location.requestBackgroundPermissionsAsync();
                if(status == "granted") {
                    let location = await Location.getCurrentPositionAsync()
                    let {coords} = location
                    let {latitude, longitude} = coords


                    if(user.lat !== latitude || user.long !== longitude) {
                        await updateUser(user.docId, {"lat": latitude, "long": longitude})
                    }
                }
                router.replace('/home')
                setLoading(false)
            } else {
                let response = await getUserByEmail(await AsyncStorage.getItem("email"))
                if(response) router.replace('/home')
                setUser(response)
                setLoading(false)
            }
            setLoading(false)
        }
        execData()
    }, [])

    return (
        <View
            className={"flex-1  bg-[#FEFEFE]"}
        >
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar />
            {!loading && (
                <View className={"flex-1"}>
                <View className={"top-[40px]"}>
                    <Image source={hero1} className={"h-[100px] w-[100px] rounded-[20px] absolute top-[10px] left-[30px] trasnlate-x-[20px] translate-y-[50px] rotate-[-15deg]"} />
                    <Image source={hero3} className={"h-[100px] w-[100px] rounded-[20px] absolute top-[-30px] left-[150px] trasnlate-x-[50px] translate-y-[50px] rotate-[-5deg]"} />
                    <Image source={hero3} className={"h-[100px] w-[100px] rounded-[20px] absolute top-[150px] left-[60px] trasnlate-x-[50px] translate-y-[50px] rotate-[15deg]"} />
                    <Image source={hero2} className={"h-[200px] w-[200px] rounded-[20px] absolute top-[70px] left-[200px] trasnlate-x-[50px] translate-y-[50px] rotate-[-15deg]"} />
                </View>
                <ScrollView
                    className="px-[22px] absolute top-[400px] flex-grow  w-full"
                >
                    <Text className="text-[32px] mt-2 font-extrabold text-[#0f0d3c]">Bem vindo aos</Text>
                    <Text className="text-[46px] -mt-3 font-extrabold text-[#0f0d3c]">Postos Kotinski!</Text>
                    <View className="my-[10px] mt-[6px]">
                        <Text className="text-[16px] text-[#0f0d3c] my-[4px]">
                            Abasteça seu veículo pelo menor preço da sua região
                        </Text>
                        <Text className="text-[16px] text-[#0f0d3c]">
                            Encontre os postos de gasolina mais baratos e próximos de você!
                        </Text>
                    </View>
                    <Button 
                        title="Criar Conta"
                        filled={true}
                        onPress={() => router.push('/register')}
                        className={`mt-[18px] py-[20px] w-full`}
                    />

                    <View className="flex flex-row mt-[10px] justify-center">
                        <Text className="text-[16px] text-[#0f0d3c]">Você já possui uma conta?</Text>
                        <Pressable onPress={() => router.push('/login')}>
                            <Text className="text-[16px] font-bold text-[#0f0d3c] ml-[4px]">Entrar</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </View>
            )}
        </View>
    )
}

export default Welcome