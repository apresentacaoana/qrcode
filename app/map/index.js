import { Ionicons } from "@expo/vector-icons"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import { Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView, StatusBar } from "react-native"
import MapView, {Marker} from "react-native-maps"

const Map = () => {
    const router = useRouter()
    const params = useLocalSearchParams()
    let {lat, lng} = params
    return (
        <SafeAreaView className="flex-1 bg-[#0d0d0d]">
            <StatusBar />
            <View className="mt-8" />
            <Stack.Screen options={{headerShown: false}} />
            <View className="m-7">
                <View className="flex flex-row">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" color={"#FFF"} size={30} />
                    </TouchableOpacity>
                    <Text className="text-white ml-3 text-[28px]">Localização</Text>
                </View>
            </View>
            <View className="flex-1">
                <MapView
                  style={{flex: 1}}
                  minZoomLevel={16}
                  initialRegion={{
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                />
            </View>
        </SafeAreaView>
    )
}

export default Map