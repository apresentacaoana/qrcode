import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContext"
import Home from "./screens/Home"
import BottomBar from "../components/BottomBar"
import { useRouter } from "expo-router"
import { View } from "react-native"
import Plans from "./screens/Plans"
import Extract from "./screens/Extract"
import Config from "./screens/Config"
import { getUserByEmail, updateUser } from "../db/service"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Scan from "../scan"
import { BarCodeScanner } from "expo-barcode-scanner"
import * as Location from 'expo-location'

const MainHomePage = () => {
    const [user, setUser] = useContext(UserContext)
    const [pageType, setPageType] = useState("home")
    const router = useRouter()
    useEffect(() => {

        async function getData() {
            let email = await AsyncStorage.getItem("email")
            let responseUser = await getUserByEmail(email)
            

            setUser(responseUser)
        }
        getData()
    }, [])


    return (
        <View className={"flex-1  bg-[#fefefe]"} >

            {pageType == "home" && <Home />}
            {pageType == "plans" && <Plans />}
            {pageType == "extract" && <Extract />}
            {pageType == "config" && <Config />}
            {pageType == "scan" && <Scan setPageType={setPageType} />}

            {user.role !== "admin" && (
                <BottomBar page={pageType} setPageType={setPageType} navigation={router} />
            )}
        </View>
    )
}

export default MainHomePage