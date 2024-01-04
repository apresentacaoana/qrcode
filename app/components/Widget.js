const { View } = require("react-native")

const Widget = ({children, variant, style}) => {
    return (
        <View className={`${variant == "filled" ? "bg-orange-400" : "bg-[#1F1F1F] "} rounded-[10px] p-5`} style={style}>
            {children}
        </View>
    )
}

export default Widget