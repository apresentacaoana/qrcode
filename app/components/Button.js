const { Text } = require("react-native")
const { TouchableOpacity } = require("react-native")
const { default: COLORS } = require("../constants/colors")

const Button = (props) => {
    const filledBgColor = props.color || COLORS.primary
    const outlinedColor = "#FFFFFF"
    return (
        <TouchableOpacity
            style={props.style}
            className={`pb-[16px] py-[10px] border-[2px] border-orange-400 rounded-[12px] items-center justify-center ${props.filled && "bg-orange-400"}`}
            onPress={props.onPress}
        >
            <Text className={`text-[18px] ${props.filled && "text-black"}`}>{props.title}</Text>
        </TouchableOpacity>
    )
}

export default Button