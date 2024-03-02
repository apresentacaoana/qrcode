
import { Image, Text, View } from 'react-native'
import LOGO from '../../assets/logo-bg.png'
const Navbar = () => {
    return (
        <View className="w-full flex items-center top-[10%] -mb-3  flex-row">
            <Image source={LOGO} className={"w-[60px] h-[60px] ml-3"}/>
            <Text className="font-bold text-[18px] text-[#0f0d3c]">Postos Kotinski</Text>
        </View>
    )
}

export default Navbar