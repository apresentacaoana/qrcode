import { Ionicons } from "@expo/vector-icons"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import { useContext, useEffect, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView, StatusBar } from "react-native"
import MapView, {Marker} from "react-native-maps"
import MapViewDirections from "react-native-maps-directions"
import { UserContext } from "../context/UserContext"
import { MapViewRoute } from "react-native-maps-routes"

const Map = () => {
    const router = useRouter()
    const params = useLocalSearchParams()
    const [user, setUser] = useContext(UserContext)
    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)
    useEffect(() => {
        async function getData() {
            setLatitude(Number(params.lat))
            setLongitude(Number(params.lng))
        }
        getData()
    }, [])
    let {lat, lng} = params
    return (
        <SafeAreaView className="flex-1 bg-[#fefefe]">
            <StatusBar />
            <View className="mt-8" />
            <Stack.Screen options={{headerShown: false}} />
            <View className="m-7">
                <View className="flex flex-row">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" color={"#0f0d3c"} size={30} />
                    </TouchableOpacity>
                    <Text className="text-[#0f0d3c] ml-3 text-[28px]">Localização</Text>
                </View>
            </View>
            <View className="flex-1">
                <MapView
                  style={{flex: 1}}
                  minZoomLevel={19}
                  
                  initialRegion={{
                    latitude: Number(lat),
                    longitude: Number(lng),
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >   
                    <Marker coordinate={{latitude, longitude}}  />
                    <Marker coordinate={{latitude: user.lat, longitude: user.long}}  />
                    <MapViewDirections
                        origin={{latitude: user.lat, longitude: user.long}}
                        destination={{latitude: latitude, longitude: longitude}}
                        apikey="AIzaSyAJsQjlna7aQk-7UPb-h4H0v1holCNxIno"
                        strokeWidth={7}
                        strokeColor="blue"
                    />
                </MapView>
            </View>
        </SafeAreaView>
    )
}

export default Map