import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import Widget from "../components/Widget"
import * as Location from 'expo-location'
import { BarCodeScanner } from "expo-barcode-scanner"
import { Stack, useRouter } from "expo-router"
import { useState } from "react"

const NoPermission = () => {
    const router = useRouter()
    let [statusLocation, setStatusLocation] = useState("")
    let [statusBarcode, setStatusBarcode] = useState("")
    const requestPermission = async () => {

        let {status} = await Location.requestForegroundPermissionsAsync()
        const barcode = await BarCodeScanner.requestPermissionsAsync()
        setStatusLocation(status)
        setStatusBarcode(barcode.status)
        if(status === "granted" && barcode.status === 'granted') {
            router.replace("/home")
            return
        }
        
    }

    
    if(statusLocation === "granted" && statusBarcode === 'granted') {
        router.replace("/home")
        return
    }

    return (
        <SafeAreaView className="flex-1 bg-[#fefefe]">
            <StatusBar />
            <Stack.Screen options={{headerShown: false}} />
            <View className="flex-1 m-7 items-center justify-center">
                <Text className="text-[#0f0d3c] mb-3 text-center text-[17px]">Para a aplicação funcionar é necessário que você permita o acesso a sua localização e câmera.</Text>
                <TouchableOpacity onPress={requestPermission}>
                    <Widget variant={"filled"} className={"py-3"}>
                        <Text className="font-bold text-[16px]">Permitir</Text>
                    </Widget>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default NoPermission