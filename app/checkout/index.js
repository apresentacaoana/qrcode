import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import { SafeAreaView } from "react-native"
import WebView from "react-native-webview"

const Checkout = () => {
    const {planoId, userId} = useLocalSearchParams()
    const router = useRouter()
    const onShouldStartLoadWithRequest = (event) => {
        if (event.url.includes('/result')) {
            router.replace("plans")
            return false;
        }
        return true;
      };

    return (
        <>
            <Stack.Screen options={{headerTitle: "Pagamento"}} />
            <WebView 
                source={{ uri: `https://frochap.vercel.app/?planoId=${planoId}&userId=${userId}`}}
                onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
            />
        </>
    )
}

export default Checkout