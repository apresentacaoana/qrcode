const { Text } = require("react-native")
const { TouchableOpacity } = require("react-native")
const { default: COLORS } = require("../constants/colors")

const Button = (props) => {
    const filledBgColor = props.color || COLORS.primary
    const outlinedColor = "#FFFFFF"
    return (
        <TouchableOpacity
            style={props.style}
            className={`pb-[16px] py-[7px] rounded-[12px] items-center justify-center ${props.filled && "bg-[#0f0d3c]"}`}
            onPress={props.onPress}
        >
            <Text className={`text-[18px] ${props.filled && "text-white"}`}>{props.title}</Text>
        </TouchableOpacity>
    )
}

export default Button