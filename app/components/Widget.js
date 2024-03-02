const { View } = require("react-native")

const Widget = ({children, variant, style}) => {
    return (
        <View className={`${variant == "filled" ? "bg-[#0f0d3c]" : "bg-[#f2f2f2] "} rounded-[10px] p-5`} style={style}>
            {children}
        </View>
    )
}

export default Widget