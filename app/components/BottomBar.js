import { Ionicons, FontAwesome } from "@expo/vector-icons/build/Icons"
import COLORS from "../constants/colors"
import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import { router } from "expo-router"

const { View, Text, TouchableOpacity } = require("react-native")

const BottomBar = ({ page, navigation, setPageType }) => {

    const [user, setUser] = useContext(UserContext)

    return (
        <View className="absolute bottom-0 w-full flex flex-row justify-between bg-[#f2f2f2] p-5">

            <TouchableOpacity onPress={() => {if(page != "home") {
                setPageType("home")
            }}} className="flex flex-col w-[90px]  gap-1 items-center">
                <FontAwesome size={24} name="home" color={page === "home" ? COLORS.primary : "#A0A0A0"} />
                <Text className={`${page === "home" ? "text-[#0f0d3c]" : "text-[#A0A0A0]"}`}>Início</Text>
            </TouchableOpacity>

            {user.role === "normal" && (
                <>
                <TouchableOpacity onPress={() => {if(page != "plans") setPageType("plans")}} className="flex flex-col w-[90px] gap-1 items-center">
                    <FontAwesome size={24} name="ticket" color={page === "plans" ? COLORS.primary : "#A0A0A0"} />
                    <Text className={`${page === "plans" ? "text-[#0f0d3c]" : "text-[#A0A0A0]"}`}>Pontos</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {if(page != "extract") setPageType("extract")}} className="flex flex-col w-[90px]  gap-1 items-center">
                    <FontAwesome size={24} name="money" color={page === "extract" ? COLORS.primary : "#A0A0A0"} />
                    <Text className={`${page === "extract" ? "text-[#0f0d3c]" : "text-[#A0A0A0]"}`}>Extrato</Text>
                </TouchableOpacity>
                </>
            )} 

            {(user.role === "frentista" && Object.keys(user.posto).length > 0) && (
                <TouchableOpacity onPress={() => setPageType("scan")} className="flex flex-col bg-[#0f0d3c] rounded-full absolute left-[47.5%] -translate-x-1/2 h-[70px] -top-[70%] justify-center w-[70px] items-center">
                    <FontAwesome size={44} name="qrcode" color={page === "plans" ? COLORS.primary : "#FFFFFF"} />
                </TouchableOpacity>
            )}

            
            {(user.role === "lojista" && user.loja) && (
                <TouchableOpacity onPress={() => router.push("/scanlojas")} className="flex flex-col bg-[#0f0d3c] rounded-full absolute left-[47.5%] -translate-x-1/2 h-[70px] -top-[70%] justify-center w-[70px] items-center">
                    <FontAwesome size={44} name="qrcode" color={page === "plans" ? COLORS.primary : "#FFFFFF"} />
                </TouchableOpacity>
            )}
            
            {user.role !== "admin" && (
                <>
                
                <TouchableOpacity onPress={() => {if(page != "config") setPageType("config")}} className="flex flex-col w-[90px]  gap-1 items-center">
                    <FontAwesome size={24} name="user-circle" color={page === "config" ? COLORS.primary : "#A0A0A0"} />
                    <Text className={`${page === "config" ? "text-[#0f0d3c]" : "text-[#A0A0A0]"}`}>Perfil</Text>
                </TouchableOpacity>
                </>
            )}

        </View>
    )
}
export default BottomBar