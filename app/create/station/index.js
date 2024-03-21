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
    const scrollViewRef = useRef()
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

    function formatZipCode(zip) {
        // Aqui você pode implementar a lógica para formatar o CEP
        // Por exemplo, adicionar hífens quando apropriado
        const formattedZip = zip.replace(/\D/g, '').slice(0, 8);
        const firstPart = formattedZip.slice(0, 5);
        const secondPart = formattedZip.slice(5, 8);
        return `${firstPart}-${secondPart}`;
    }

    const handleSearch = async (e) => {
        if(e.length >= 5) {
            axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${e}&language=pt-BR&types=geocode&key=AIzaSyAJsQjlna7aQk-7UPb-h4H0v1holCNxIno`)
            .then((response) => {
                let data = response.data
                setAddresses(data.predictions)
            })
        }
    }

    function extractAddressComponent(components, type) {
        return components.find(component => component.types.includes(type));
    }

    const handleSelect = async (item) => {
        axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&fields=address_components&key=AIzaSyAJsQjlna7aQk-7UPb-h4H0v1holCNxIno`)
        .then((response) => {
            console.log(response.data)
            let {result} = response.data
            let {address_components} = result
            console.log(result["address_components"][5]["long_name"])
             
            const cepComponent = extractAddressComponent(address_components, 'postal_code');
            const enderecoComponent = extractAddressComponent(address_components, 'route');
            const bairroComponent = extractAddressComponent(address_components, 'sublocality_level_1');
            const cidadeComponent = extractAddressComponent(address_components, 'administrative_area_level_2');
            const estadoComponent = extractAddressComponent(address_components, 'administrative_area_level_1');
            const paisComponent = extractAddressComponent(address_components, 'country');

            const cep = cepComponent ? cepComponent.long_name : '';
            const endereco = enderecoComponent ? enderecoComponent.long_name : '';
            const bairro = bairroComponent ? bairroComponent.long_name : '';
            const cidade = cidadeComponent ? cidadeComponent.long_name : '';
            const estado = estadoComponent ? estadoComponent.long_name : '';
            const pais = paisComponent ? paisComponent.long_name : '';

            setCep(cep);
            setCidade(cidade);
            setEndereco(endereco);
            setBairro(bairro);
            setEstado(estado);
            setSelectedAddress(item);
        })
      
      }
      
    function emitAlerta(label) {
        setAlerta(label)
        scrollViewRef.current.scrollToEnd({animated: true})
    }
      

    const handleSubmit = async () => {
        setAlerta("")
        if(!nome || !endereco || !bairro || !cidade || !estado || !cep || combustiveis.length <= 0) {
            return emitAlerta("Preencha todos os campos")
        }
        if(!logo) {
            return emitAlerta("Envie ao menos uma logo")
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
        
        axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=AIzaSyAJsQjlna7aQk-7UPb-h4H0v1holCNxIno`)
        .then(async (response) => {
            console.log("cheguei aq1")
            let data = response.data
            let {results} = data
            


            if (Object.keys(results).length > 0) {
                let { geometry } = results[0];
                let { location } = geometry
                console.log(location)
                axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${nome}+${endereco}+${cidade}&key=AIzaSyAJsQjlna7aQk-7UPb-h4H0v1holCNxIno`)
                .then(async (responseStation) => {
                    console.log("cheguei aq2")
                    
                    let {results} = responseStation.data
                    console.log("cheguei aq3")
                    console.log()
                    let stationPosition = results.find(objeto => String(objeto.name).toLowerCase().includes(nome.toLowerCase()))
                    if(!stationPosition) {
                        return emitAlerta("Posto não encontrado, verifique o nome informado.")
                    }
                    console.log(stationPosition)
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
                        lat: Object.keys(stationPosition).length > 0 ? stationPosition.geometry.location.lat : location.lat,
                        lng: Object.keys(stationPosition).length > 0 ? stationPosition.geometry.location.lng : location.lng
                    });
                    router.replace("/home");
                })  

            } else {
                // console.log("Nenhum resultado no Brasil encontrado.");
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
        <SafeAreaView className="flex-1 bg-[#fefefe]">
            <StatusBar />
            <View className="mt-8" />
            <Stack.Screen options={{headerShown: false}} />
            <ScrollView ref={scrollViewRef} keyboardShouldPersistTaps="handled" overScrollMode="never" className="flex-1 m-7">
                <View className="flex flex-row mb-10">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" color={"#0f0d3c"} size={30} />
                    </TouchableOpacity>
                    <Text className="text-[#0f0d3c] ml-3 text-[28px]">Criar Posto</Text>
                </View>
                <Text className="text-[#0f0d3c] text-[42px] font-bold">Insira as <Text className="text-[#0f0d3c]">Informações</Text></Text>
                
                {alerta && (
                    <Widget variant={"filled"} className={"mt-3"}>
                        <Text className="text-white">{alerta}</Text>
                    </Widget>
                )}
                
                <TouchableOpacity onPress={pickLogo}>
                    {!logo && (
                        <View className="mt-4 w-full rounded-[10px] bg-[#FCFCFC] h-[350px] border-[3px] border-[#A0A0A0] border-dotted items-center justify-center">
                            <Text className="text-[#0f0d3c]">Logo aqui</Text>
                        </View>
                    )}
                    {logo && (
                        <Image source={{ uri: logo }} className="h-[350px] rounded-[10px] w-full mt-4" alt="logo" />
                    )}
                </TouchableOpacity>

                <View className="mb-[12px] mt-2 text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Nome
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            defaultValue={nome}
                            onChangeText={setNome}
                            placeholder="Insira o nome do posto"
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c]"
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        CEP
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            onChangeText={handleSearch}
                            placeholder="Insira o CEP"
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c]"
                        />
                    </View>
                </View>
                {(Object.keys(selectedAddress).length > 0) && (
                    <TouchableOpacity onPress={() => setSelectedAddress({})} className="mb-2">
                        <Widget variant={"filled"}>
                            <Text style={{ fontSize: 15, marginBottom: 8, color: 'white', fontWeight: 'bold' }}>ENDEREÇO SELECIONADO</Text>
                            <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>{selectedAddress ? selectedAddress.terms[0].value : ''}</Text>
                            <Text style={{ fontSize: 15, color: 'white' }}>
                                {selectedAddress ? `${selectedAddress.terms[1].value}, ${selectedAddress.terms[2].value} - ${selectedAddress.terms[3].value}, ${selectedAddress.terms[4].value}` : ''}
                            </Text>
                        </Widget>

                    </TouchableOpacity>
                )}
                {addresses.length > 0 && addresses.map((item) => (
                  <TouchableOpacity key={item.place_id} onPress={() => handleSelect(item)} className="mb-2">
                    <Widget>
                      <Text style={{ fontSize: 18, color: '#0f0d3c', fontWeight: 'bold' }}>{item.structured_formatting.main_text}</Text>
                      <Text style={{ fontSize: 15, color: '#0f0d3c' }}>{item.structured_formatting.secondary_text}</Text>
                    </Widget>
                  </TouchableOpacity>
                ))}
                {/* <View className="mb-[12px] text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Bairro
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            value={bairro}
                            onChangeText={setBairro}
                            placeholder="Insira o bairro"
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c]"
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Cidade
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            value={cidade}
                            onChangeText={setCidade}
                            placeholder="Insira a cidade"
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c]"
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        Estado
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            value={estado}
                            onChangeText={setEstado}
                            placeholder="Insira o estado"
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c]"
                        />
                    </View>
                </View>
                <View className="mb-[12px] text-[#0f0d3c]">
                    <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                        CEP
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            value={cep}
                            onChangeText={setCep}
                            placeholder="Insira o código postal"
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c]"
                        />
                    </View>
                </View> */}
                <View>
                    <View className="flex-row justify-between items-center">
                        
                        <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">Combustíveis</Text>
                        <TouchableOpacity onPress={addCombustivelField}>
                            
                            <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">Adicionar</Text>
                        </TouchableOpacity>
                    </View>

                    {combustiveis.map((item, index) => (
                        <View key={Math.random()} className="flex-row w-full gap-3">
                            
                            <View className="mb-[12px] grow text-[#0f0d3c]">
                                <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                                    Nome
                                </Text>
                                <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                                    <TextInput 
                                        placeholder="Informe um nome"
                                        defaultValue={item.nome}
                                        onChangeText={(text) => {
                                            handleChangeText(text, "nome", index)
                                        }}
                                        placeholderTextColor={"#EDEDED"}
                                        className="w-full text-[#0f0d3c]"
                                    />
                                </View>
                            </View>
                            <View className="mb-[12px] w-[24%] text-[#0f0d3c]">
                                <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                                    Valor
                                </Text>
                                <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                                    <TextInput 
                                        placeholder="R$0.0"
                                        defaultValue={item.precoNormalDebito}
                                        onChangeText={(text) => {
                                            handleChangeText(text, "precoNormalDebito", index)
                                        }}
                                        keyboardType="numeric"  
                                        placeholderTextColor={"#EDEDED"}
                                        className="w-full text-[#0f0d3c]"
                                    />
                                </View>
                            </View>
                            <View className="mb-[12px]  text-[#0f0d3c]">
                                <Text className="text-[16px] text-[#0f0d3c] font-normal my-[8px]">
                                    Valor Desconto
                                </Text>
                                <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                                    <TextInput 
                                        placeholder="R$0.0"
                                        defaultValue={item.precoDebito}
                                        onChangeText={(text) => {
                                            handleChangeText(text, "precoDebito", index)
                                        }}
                                        keyboardType="numeric"  
                                        placeholderTextColor={"#A0A0A0"}
                                        className="w-full text-[#0f0d3c]"
                                    />
                                </View>
                            </View>
                        </View>
                    ))}



                    <TouchableOpacity onPress={removeLastCombustivelField}>
                        
                        <Widget className={"bg-red-500"}>
                            <Text className="font-bold text-white text-center">Excluir</Text>
                        </Widget>
                    </TouchableOpacity>

                    <TouchableOpacity className="mt-10" onPress={handleSubmit}>
                        
                        <Widget variant={"filled"}>
                            <Text className="font-bold text-white text-center">Criar</Text>
                        </Widget>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            
        </SafeAreaView>
    )
}

export default CreateStation