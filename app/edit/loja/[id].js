import { Ionicons } from "@expo/vector-icons"
import { useEffect, useRef, useState } from "react"
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
import { criarLoja, editLoja, getLojaById, novoPosto } from "../../db/service"
import { app } from "../../firebase"
import axios from "axios"
import { Image } from "react-native"
import { Stack, useRouter, useSearchParams } from "expo-router"

const EditLoja = () => {

    const [logo, setLogo] = useState("")
    const scrollViewRef = useRef()
    const router = useRouter()
    const params = useSearchParams()

    const [nome, setNome] = useState("")
    const [endereco, setEndereco] = useState("")
    const [bairro, setBairro] = useState("")
    const [cidade, setCidade] = useState("")
    const [estado, setEstado] = useState("")
    const [cep, setCep] = useState("")
    const [addresses, setAddresses] = useState([])
    const [selectedAddress, setSelectedAddress] = useState({})

    const [loja, setLoja] = useState({})

    const [alerta, setAlerta] = useState("")
    
    const getId = () => {
        const numeroAleatorio = Math.floor(Math.random() * 99999) + 1000
        return numeroAleatorio
    }

    useEffect(() => {
        async function getData() {
            let response = await getLojaById(params.id)
            setLoja(response)
            setNome(response.nome)
            setLogo(response.foto)
            setEstado(response.estado)
            setBairro(response.bairro)
            setCidade(response.cidade)
            setEndereco(response.endereco)
            setCep(response.cep)
            setSelectedAddress({
                cep: response.cep,
                bairro: response.bairro,
                estado: response.estado,
                endereco: response.endereco,
                cidade: response.cidade
            })
        }
        getData()
    }, [])


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
        if(!nome || !endereco || !bairro || !cidade || !estado || !cep) {
            return emitAlerta("Preencha todos os campos")
        }
        if(!logo) {
            return emitAlerta("Envie ao menos uma foto")
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
        const filename = `/lojas/${id}/${getId()}.jpg`
        const storageRef = ref(storage, filename)
        await uploadBytes(storageRef, blob)
        const photoURL = await getDownloadURL(storageRef)
        blob.close()
        
        axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=AIzaSyAJsQjlna7aQk-7UPb-h4H0v1holCNxIno`)
        .then(async (response) => {
            let data = response.data
            let {results} = data
            


            if (Object.keys(results).length > 0) {
                let { geometry } = results[0];
                let { location } = geometry
                console.log(location)
                axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${nome}+${cep}&key=AIzaSyAJsQjlna7aQk-7UPb-h4H0v1holCNxIno`)
                .then(async (responseStation) => {
                    
                    let {results} = responseStation.data
                    console.log()
                    let stationPosition = results.find(objeto => String(objeto.name).toLowerCase().includes(nome.toLowerCase()))
                    if(!stationPosition) {
                        return emitAlerta("Local não encontrado, verifique o nome informado.")
                    }
                    await editLoja(loja.docId, {
                        nome,
                        foto: photoURL,
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
                    <Text className="text-[#0f0d3c] ml-3 text-[28px]">Editar Loja</Text>
                </View>
                <Text className="text-[#0f0d3c] text-[42px] font-bold">Atualize as <Text className="text-[#0f0d3c]">Informações</Text></Text>
                
                {alerta && (
                    <Widget variant={"filled"} className={"mt-3"}>
                        <Text className="text-white">{alerta}</Text>
                    </Widget>
                )}
                
                <TouchableOpacity onPress={pickLogo}>
                    {!logo && (
                        <View className="mt-4 w-full rounded-[10px] bg-[#FCFCFC] h-[400px] border-[3px] border-[#A0A0A0] border-dotted items-center justify-center">
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
                        Endereço
                    </Text>
                    <View className="w-full h-[48px] border border-[#A0A0A0] rounded-[8px] items-center justify-center pl-[22px]">
                        <TextInput 
                            onChangeText={handleSearch}
                            placeholder="Insira o Endereço + CEP"
                            placeholderTextColor={"#A0A0A0"}
                            className="w-full text-[#0f0d3c]"
                        />
                    </View>
                </View>
                {(Object.keys(selectedAddress).length > 0) && (
                    <TouchableOpacity onPress={() => setSelectedAddress({})} className="mb-2">
                        <Widget variant={"filled"}>
                            <Text style={{ fontSize: 15, marginBottom: 8, color: 'white', fontWeight: 'bold' }}>ENDEREÇO SELECIONADO</Text>
                            <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>{selectedAddress ? selectedAddress.cep : ''}</Text>
                            <Text style={{ fontSize: 15, color: 'white' }}>
                                {selectedAddress ? `${selectedAddress.endereco}, ${selectedAddress.cidade} - ${selectedAddress.estado}` : ''}
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
                <View>
                    <TouchableOpacity className="mt-10" onPress={handleSubmit}>
                        <Widget className='bg-red-500'>
                            <Text className="font-bold text-white text-center">Excluir</Text>
                        </Widget>
                    </TouchableOpacity>
                    <TouchableOpacity className="mt-10" onPress={handleSubmit}>
                        <Widget variant={"filled"}>
                            <Text className="font-bold text-white text-center">Salvar</Text>
                        </Widget>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            
        </SafeAreaView>
    )
}

export default EditLoja