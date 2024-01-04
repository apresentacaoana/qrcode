import { Ionicons, FontAwesome } from "@expo/vector-icons/build/Icons"
import COLORS from "../constants/colors"
import { useContext } from "react"
import { UserContext } from "../context/UserContext"

const { View, Text, TouchableOpacity } = require("react-native")

const BottomBar = ({ page, navigation, setPageType }) => {

    const [user, setUser] = useContext(UserContext)

    return (
        <View className="absolute bottom-0 w-full flex flex-row justify-between bg-[#1F1F1F] p-5">

            <TouchableOpacity onPress={() => {if(page != "home") {
                setPageType("home")
            }}} className="flex flex-col w-[90px]  gap-1 items-center">
                <FontAwesome size={24} name="home" color={page === "home" ? COLORS.primary : "white"} />
                <Text className={`${page === "home" ? "text-orange-400" : "text-white"}`}>Início</Text>
            </TouchableOpacity>

            {user.role === "normal" && (
                <>
                <TouchableOpacity onPress={() => {if(page != "plans") setPageType("plans")}} className="flex flex-col w-[90px] gap-1 items-center">
                    <FontAwesome size={24} name="ticket" color={page === "plans" ? COLORS.primary : "white"} />
                    <Text className={`${page === "plans" ? "text-orange-400" : "text-white"}`}>Assinatura</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {if(page != "extract") setPageType("extract")}} className="flex flex-col w-[90px]  gap-1 items-center">
                    <FontAwesome size={24} name="money" color={page === "extract" ? COLORS.primary : "white"} />
                    <Text className={`${page === "extract" ? "text-orange-400" : "text-white"}`}>Extrato</Text>
                </TouchableOpacity>
                </>
            )} 

            {(user.role === "frentista" && user.posto) && (
                <TouchableOpacity onPress={() => setPageType("scan")} className="flex flex-col bg-orange-400 rounded-full absolute left-[47.5%] -translate-x-1/2 h-[70px] -top-[70%] justify-center w-[70px] items-center">
                    <FontAwesome size={44} name="qrcode" color={page === "plans" ? COLORS.primary : "white"} />
                </TouchableOpacity>
            )}
            {user.role !== "admin" && (
                <TouchableOpacity onPress={() => {if(page != "config") setPageType("config")}} className="flex flex-col w-[90px]  gap-1 items-center">
                    <FontAwesome size={24} name="user-circle" color={page === "config" ? COLORS.primary : "white"} />
                    <Text className={`${page === "config" ? "text-orange-400" : "text-white"}`}>Perfil</Text>
                </TouchableOpacity>
            )}

        </View>
    )
}
export default BottomBar