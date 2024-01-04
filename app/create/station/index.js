import { Ionicons } from "@expo/vector-icons"
import { useRef, useState } from "react"
import { View } from "react-native"
import { ScrollView } from "react-native"
import { Text } from "react-native"
import { TouchableOpacity } from "react-native"
import { TextInput } from "react-native"
import { StatusBar } from "react-native"
import { SafeAreaView } from "react-native"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import Widget from "../../components/Widget"
import { Touchable } from "react-native"
import * as ImagePicker from 'expo-image-picker'
import { novoPosto } from "../../db/service"
import { app } from "../../firebase"
import axios from "axios"
import { Image } from "react-native"
import { Stack, useRouter } from "expo-router"

const CreateStation = () => {

    const [images, setImages] = useState([])
    const [logo, setLogo] = useState("")
    const textInputRef = useRef();
    const router = useRouter()

    const [nome, setNome] = useState("")
    const [endereco, setEndereco] = useState("")
    const [bairro, setBairro] = useState("")
    const [cidade, setCidade] = useState("")
    const [estado, setEstado] = useState("")
    const [cep, setCep] = useState("")
    const [addresses, setAddresses] = useState([])
    const [selectedAddress, setSelectedAddress] = useState({})

    const [alerta, setAlerta] = useState("")
    
    const getId = () => {
        const numeroAleatorio = Math.floor(Math.random() * 99999) + 1000
        return numeroAleatorio
    }

    const handleSearch = async (e) => {
        axios.get(`https://api.geoapify.com/v1/geocode/autocomplete?text=${e}}&apiKey=fb9f181a103b4fe688ba54b1665a40d2`)
        .then((response) => {
            let data = response.data
            setAddresses(data.features)
            console.log(data.features)
        })
    }

    const handleSelect = async (item) => {
        setCep(item.properties.postcode.replace('-', ''))
        setCidade(item.properties.city)
        setEndereco(item.properties.street)
        setBairro(item.properties.suburb)
        setEstado(item.properties.state)
        setSelectedAddress(item)
    }

    const handleSubmit = async () => {
        setAlerta("")
        if(!nome || !endereco || !bairro || !cidade || !estado || !cep || combustiveis.length <= 0) {
            setAlerta("Preencha todos os campos")
            return
        }
        if(!logo) {
            setAlerta("Envie ao menos a logo")
            return
        }

        let id = getId()
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.onload = function () {
                resolve(xhr.response)
            }
            xhr.onerror = function (e) {
                reject(new TypeError("Problema de rede"))
            }
            xhr.responseType = "blob"
            xhr.open("GET", logo, true)
            xhr.send(null)
        })

        const storage = getStorage(app)
        const filename = `/stations/${id}/${getId()}.jpg`
        const storageRef = ref(storage, filename)
        await uploadBytes(storageRef, blob)
        const photoURL = await getDownloadURL(storageRef)
        blob.close()
        
        axios.get(`https://api.tomtom.com/search/2/geocode/${cep}.json?key=dmyasSSGylyNOd3gN7DuSlNuVKI2hc4u`)
        .then(async (response) => {
            let data = response.data
            let {results} = data
            let resultsInBrazil = results.filter(result => {
                return result.address.countryCode === "BR";
            });

            if (resultsInBrazil.length > 0) {
                let { position } = resultsInBrazil[0];
                await novoPosto({
                    nome,
                    logo: photoURL,
                    combustiveis,
                    descricao: "",
                    bairro,
                    cidade,
                    estado,
                    endereco,
                    cep,
                    lat: position.lat,
                    lng: position.lon
                });
                router.replace("/home");
            } else {
                console.log("Nenhum resultado no Brasil encontrado.");
            }
        })

    }

    const [combustiveis, setCombustiveis] = useState([
        {
            nome: "",
            precoNormalDebito: 0.0,
            precoDebito: 0.0,
        }
    ])

    const pickLogo = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
          });
      
      
          if (!result.canceled) {
            setLogo(result.assets[0].uri);
          }

    }

    const addCombustivelField = () => {
        let newObject = {
            nome: "",
            precoNormalDebito: 0.0,
            precoDebito: 0.0,
        }
        setCombustiveis([...combustiveis, newObject])
    }

    const removeLastCombustivelField = () => {
        let newCombustiveis = combustiveis.slice(0, -1)
        setCombustiveis(newCombustiveis)
    }

    const handleChangeText = (text, field, index) => {
        const newCombustiveis = combustiveis;
        newCombustiveis[index][field] = text;
        setCombustiveis(newCombustiveis);
      };


    return (
        <SafeAreaView className="flex-1 bg-[#0d0d0d]">
            <StatusBar />
            <View className="mt-8" />
            <Stack.Screen options={{headerShown: false}} />
            <ScrollView keyboardShouldPersistTaps="handled" overScrollMode="never" className="flex-1 m-7">
                <View className="flex flex-row mb-10">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" color={"#FFF"} size={30} />
                    </TouchableOpacity>
                    <Text className="text-white ml-3 text-[28px]">Criar Posto</Text>
                </View>
                <Text className="text-white text-[42px] font-bold">Insira as <Text className="text-orange-400">Informações</Text></Text>
                
                {alerta && (
                    <Widget variant={"filled"} className={"mt-3"}>
                        <Text>{alerta}</Text>
                    </Widget>
                )}
                
                <TouchableOpacity onPress={pickLogo}>
                    {!logo && (
                        <View className="mt-4 w-full rounded-[10px] bg-[#1F1F1F] h-[350px] border-[3px] border-orange-400 border-dotted items-center justify-center">
                            <Text className="text-orange-400">Logo aqui</Text>
                        </View>
                    )}
                    {logo && (
                        <Image source={{ uri: logo }} className="h-[350px] rounded-[10px] w-full mt-4" alt="logo" />
                    )}
                </TouchableOpacity>

                <View className="mb-[12px] mt-2 text-white">
                    <Text className="text-[16px] text-white font-normal my-[8px]">
                        Nome
                    </Text>
                    <View className="w-full h-[48px] border border-white rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            value={nome}
                            onChangeText={setNome}
                            placeholder="Insira o nome do posto"
                            placeholderTextColor={"#FFFFFF"}
                            className="w-full text-white"
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-white">
                    <Text className="text-[16px] text-white font-normal my-[8px]">
                        Endereço
                    </Text>
                    <View className="w-full h-[48px] border border-white rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            onChangeText={handleSearch}
                            placeholder="Insira o endereço"
                            placeholderTextColor={"#FFFFFF"}
                            className="w-full text-white"
                        />
                    </View>
                </View>
                {(addresses.length > 0 && Object.keys(selectedAddress).length == 0) && addresses.map((item) => (
                    <>
                        {(item["properties"]["suburb"] && item["properties"]["city"] && item["properties"]["state_code"] && item["properties"]["postcode"] && item["properties"]["country"]) && (
                            
                            <TouchableOpacity onPress={() => handleSelect(item)} className="mb-2">
                                <Widget variant={"filled"}>
                                    <Text className="text-[18px] text-black font-bold">{item["properties"]["street"]}</Text>
                                    <Text className="text-[15px] text-black">{item["properties"]["suburb"]}, {item["properties"]["city"]} - {item["properties"]["state_code"]}, {item["properties"]["postcode"]}, {item["properties"]["country"]}</Text>
                                </Widget>
                            </TouchableOpacity>
                        )}
                    </>
                ))}
                {(Object.keys(selectedAddress).length > 0) && (
                    <TouchableOpacity className="mb-2">
                    <Widget variant={"filled"}>
                        <Text className="text-[18px] text-black font-bold">{selectedAddress["properties"]["street"]}</Text>
                        <Text className="text-[15px] text-black">{selectedAddress["properties"]["suburb"]}, {selectedAddress["properties"]["city"]} - {selectedAddress["properties"]["state_code"]}, {selectedAddress["properties"]["postcode"]}, {selectedAddress["properties"]["country"]}</Text>
                    </Widget>
                    </TouchableOpacity>
                )}
                {/* <View className="mb-[12px] text-white">
                    <Text className="text-[16px] text-white font-normal my-[8px]">
                        Bairro
                    </Text>
                    <View className="w-full h-[48px] border border-white rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            value={bairro}
                            onChangeText={setBairro}
                            placeholder="Insira o bairro"
                            placeholderTextColor={"#FFFFFF"}
                            className="w-full text-white"
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-white">
                    <Text className="text-[16px] text-white font-normal my-[8px]">
                        Cidade
                    </Text>
                    <View className="w-full h-[48px] border border-white rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            value={cidade}
                            onChangeText={setCidade}
                            placeholder="Insira a cidade"
                            placeholderTextColor={"#FFFFFF"}
                            className="w-full text-white"
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-white">
                    <Text className="text-[16px] text-white font-normal my-[8px]">
                        Estado
                    </Text>
                    <View className="w-full h-[48px] border border-white rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            value={estado}
                            onChangeText={setEstado}
                            placeholder="Insira o estado"
                            placeholderTextColor={"#FFFFFF"}
                            className="w-full text-white"
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-white">
                    <Text className="text-[16px] text-white font-normal my-[8px]">
                        CEP
                    </Text>
                    <View className="w-full h-[48px] border border-white rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            value={cep}
                            onChangeText={setCep}
                            placeholder="Insira o código postal"
                            placeholderTextColor={"#FFFFFF"}
                            className="w-full text-white"
                        />
                    </View>
                </View> */}
                <View>
                    <View className="flex-row justify-between items-center">
                        
                        <Text className="text-[16px] text-white font-normal my-[8px]">Combustíveis</Text>
                        <TouchableOpacity onPress={addCombustivelField}>
                            
                            <Text className="text-[16px] text-orange-400 font-normal my-[8px]">Adicionar</Text>
                        </TouchableOpacity>
                    </View>

                    {combustiveis.map((item, index) => (
                        <View key={Math.random()} className="flex-row w-full gap-3">
                            
                            <View className="mb-[12px] grow text-white">
                                <Text className="text-[16px] text-white font-normal my-[8px]">
                                    Nome
                                </Text>
                                <View className="w-full h-[48px] border border-white rounded-[8px] items-center justify-center pl-[22px]">
                                    <TextInput 
                                        placeholder="Informe um nome"
                                        defaultValue={item.nome}
                                        onChangeText={(text) => {
                                            handleChangeText(text, "nome", index)
                                        }}
                                        placeholderTextColor={"#EDEDED"}
                                        className="w-full text-white"
                                    />
                                </View>
                            </View>
                            <View className="mb-[12px] w-[24%] text-white">
                                <Text className="text-[16px] text-white font-normal my-[8px]">
                                    Valor
                                </Text>
                                <View className="w-full h-[48px] border border-white rounded-[8px] items-center justify-center pl-[22px]">
                                    <TextInput 
                                        placeholder="R$0.0"
                                        value={item.precoNormalDebito}
                                        onChangeText={(text) => {
                                            handleChangeText(text, "precoNormalDebito", index)
                                        }}
                                        keyboardType="numeric"  
                                        placeholderTextColor={"#EDEDED"}
                                        className="w-full text-white"
                                    />
                                </View>
                            </View>
                            <View className="mb-[12px]  text-white">
                                <Text className="text-[16px] text-white font-normal my-[8px]">
                                    Valor Desconto
                                </Text>
                                <View className="w-full h-[48px] border border-white rounded-[8px] items-center justify-center pl-[22px]">
                                    <TextInput 
                                        placeholder="R$0.0"
                                        value={item.precoDebito}
                                        onChangeText={(text) => {
                                            handleChangeText(text, "precoDebito", index)
                                        }}
                                        keyboardType="numeric"  
                                        placeholderTextColor={"#FFFFFF"}
                                        className="w-full text-white"
                                    />
                                </View>
                            </View>
                        </View>
                    ))}



                    <TouchableOpacity onPress={removeLastCombustivelField}>
                        
                        <Widget className={"bg-red-500"}>
                            <Text className="font-bold text-center">Excluir</Text>
                        </Widget>
                    </TouchableOpacity>

                    <TouchableOpacity className="mt-10" onPress={handleSubmit}>
                        
                        <Widget variant={"filled"}>
                            <Text className="font-bold text-center">Criar</Text>
                        </Widget>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            
        </SafeAreaView>
    )
}

export default CreateStation