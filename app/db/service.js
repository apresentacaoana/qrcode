import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


const {db } = require("../firebase");
const { addDoc, collection, query, getDocs, where, getDoc, updateDoc, doc, orderBy, deleteDoc, arrayUnion } = require("firebase/firestore");

const getId = () => {
    const numeroAleatorio = Math.floor(Math.random() * 99999) + 1000
    return numeroAleatorio
}

function gerarCodigoAleatorio(tamanho) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let codigo = '';
  
    for (let i = 0; i < tamanho; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      codigo += caracteres.charAt(indice);
    }
  
    return codigo;
}

const loginComEmailESenha = async (email, senha, setAlert, navigation, setUser) => {
    
    try {
        let responseUser = await getUserByEmail(email.replace(' ', ''))
        console.log(email.trim())
        if(!responseUser) return setAlert("Usuário não encontrado")
        if(responseUser.senha != senha) return setAlert("Senha incorreta")
        if(!responseUser.active) return setAlert("Foi enviado para o seu email um link de confirmação.")
        else {
            setUser(responseUser)
            await AsyncStorage.setItem("email", email)
            navigation.push('/home')
        }
    } catch (e) {
        console.log(e)
    }

    
}

const registrarLojista = async({nome, email, loja, senha, lat = "", telefone = "", nascimento = "", long = "", role = "lojista", cpf = "", genero = "", canChange = false}) => {
    try {
        let id = gerarCodigoAleatorio(32)
        await addDoc(collection(db, "users"), {
            id,
            active: true,
            nome,
            senha,
            telefone,
            nascimento,
            email,
            lat,
            pontos: 0,
            long,
            role,
            bonusId: "",
            cpf,
            canChange,
            genero,
            plan: "",
            bonusAtivo: '',
            subscription_date: "",
            litros: 100,
            bonus: 0,
            loja,
            descontos: []
        })

        
    } catch(e) {console.log(e)}
}


const registrarComEmailESenha = async({nome, email, senha, lat = "", telefone = "", nascimento = "", long = "", role = "normal", cpf = "", genero = "", canChange = false}, navigation) => {
    try {
        let id = gerarCodigoAleatorio(32)
        await addDoc(collection(db, "users"), {
            id,
            active: false,
            nome,
            senha,
            telefone,
            nascimento,
            email,
            lat,
            long,
            role,
            bonusId: "",
            cpf,
            canChange,
            genero,
            plan: "",
            bonusAtivo: '',
            subscription_date: "",
            litros: 100,
            bonus: 0,
            pontos: 0,
            posto: {},
            loja: '',
            descontos: [],
        }).then(async () => {
            console.log('usuário criado, o id é: ' + id)
            const dados = {
                email: id,
                nome,
                sendType: 'confirm'
            };
            
            const url = `https://master--frochap.netlify.app/api/sendemail`;
            await axios.post(url, dados)
            .then(response => {
                console.log(response.data)
                navigation.push({pathname: "/login", params: {aviso: "Verifique seu email e ative sua conta!"}})
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
            });
        })

        
    } catch(e) {console.log(e)}
}

const getUserById = async (id) => {
    try {
        const usersRef = collection(db, "users")
        const docs = await getDocs(query(usersRef, where("id", "==", id)))
        let response;
        docs.forEach((doc) => {
            if(doc.data().id == id) {
                response = {
                    ...doc.data(),
                    docId: doc.id
                }
            }
        })
        return response
    } catch(e) {console.log(e)}
}

const recuperarSenha = async (email, setAlert) => {
    try {
        const dados = {
            email,
            nome: "Não sei",
            sendType: 'change'
        };
        
        const url = `https://master--frochap.netlify.app/api/sendemail`;

        axios.post(url, dados)
            .then(response => {
                console.log(response.data)
                setAlert("O link de redefinir senha foi enviado ao email")
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
            });

    } catch(e) {console.log(e)}
}

const logout = () => {
}

const entrarComGoogle = async (lat, long, role = "normal") => {
    try {
    } catch(e) {}
}

const newMessage = async ({message, from, to}) => {
    try {
        let messagesREF = collection(db, 'messages')
        await addDoc(messagesREF, {
            message,
            from,
            to,
            id: getId(),
            createdAt: new Date()
        })
    } catch(e) {console.log(e)}
}

const getAllMessages = async () => {
    try {
        let messagesRef = collection(db, 'messages')
        let q = query(messagesRef, orderBy('createdAt', 'desc'))
        let response = []
        let docs = await getDocs(q)
        docs.docs.forEach((doc) => {
            response.push({
                ...doc.data(),
                docId: doc.id
            })
        })
        return response
    } catch(e) {console.log(e)}
}

const getMessagesFromSenderId = async (id) => {
    try {
        let messagesRef = collection(db, 'messages')
        let q = query(messagesRef, orderBy('createdAt', 'desc'))
        let response = []
        let docs = await getDocs(q)
        docs.docs.forEach((doc) => {
            if(doc.data().from == id) {
                response.push({
                    ...doc.data(),
                    docId: doc.id
                })
            }
        })
        return response
    } catch(e) {console.log(e)}
}

const getMessagesFromReceiverId = async (id) => {
    try {
        let messagesRef = collection(db, 'messages')
        let q = query(messagesRef, orderBy('createdAt', 'desc'))
        let response = []
        let docs = await getDocs(q)
        docs.docs.forEach((doc) => {
            if(doc.data().to == id) {
                response.push({
                    ...doc.data(),
                    docId: doc.id
                })
            }
        })
        return response
    } catch(e) {console.log(e)}
}

const getMessagesFromBothId = async (from, to) => {
    try {
        let messagesRef = collection(db, 'messages')
        let q = query(messagesRef, orderBy('createdAt', 'desc'))
        let response = []
        let docs = await getDocs(q)
        docs.docs.forEach((doc) => {
            if(doc.data().from == from && doc.data().to == to) {
                response.push({
                    ...doc.data(),
                    docId: doc.id
                })
            }
        })
        return response
    } catch(e) {console.log(e)}
}

const getUserByEmail = async (email) => {
    try {
        const usersRef = collection(db, "users")
        let q = query(usersRef, orderBy('email', 'desc'))
        const docs = await getDocs(q)
        let response;
        docs.forEach((doc) => {
            if(doc.data().email == email) {
                response = {
                    ...doc.data(),
                    docId: doc.id
                }
            }
        })
        return response
    } catch(e) {console.log(e)}
}


const getUserByCPF = async (cpf) => {
    try {
        const usersRef = collection(db, "users")
        const docs = await getDocs(query(usersRef, where("cpf", "==", cpf)))
        let response;
        docs.forEach((doc) => {
            if(doc.data().cpf == cpf) {
                response = {
                    ...doc.data(),
                    docId: doc.id
                }
            }
        })
        return response
    } catch(e) {console.log(e)}
}

const updateUser = async (docId, data) => {
    try {
        await updateDoc(doc(db, "users", docId), {
            ...data
        })
    } catch(e) {console.log(e)}
}

const updateVenda = async (docId, data) => {
    try {
        await updateDoc(doc(db, "vendas", docId), {
            ...data
        })
    } catch(e) {console.log(e)}
}

const novaVenda = async (id, {posto = {}, pontos = 0, comprador = {}, vendedor = {}, loja = {}, gasolina = {}, detalhes = {}, valor = 0, litros = 0, tipo = "litros", status = "pendente"}) => {
    try {
        const vendaRef = collection(db, "vendas")
        await addDoc(vendaRef, {
            id,
            posto,
            loja,
            comprador,
            vendedor,
            gasolina,
            valor,
            litros,
            detalhes,
            status,
            pontos,
            tipo,
            pontos,
            createdAt: new Date()
        })
    } catch(e) {console.log(e)}
}

const getVendas = async () => {
    try {
        let vendaRef = collection(db, "vendas")
        let q = query(vendaRef, orderBy("createdAt", "asc"))
        let response = []
        let docs = await getDocs(q)
        docs.forEach(doc => {
            response.push({
                ...doc.data(),
                docId: doc.id
            })
        }) 
        return response
    } catch(e) {console.log(e)}
}

const getVendasById = async (id) => {
    try {
        let vendasRef = collection(db, "vendas")
        let q = query(vendasRef, where("id", "==", id))
        let vendas = await getDocs(q)
        let response = {}
        vendas.forEach(doc => {
            response = {
                ...doc.data(),
                docId: doc.id
            }
        })
        return response
    } catch(e) {console.log(e)}
}


const getPostoById = async (id) => {
    try {
        let vendasRef = collection(db, "postos")
        let q = query(vendasRef, where("id", "==", id))
        let vendas = await getDocs(q)
        let response = {}
        vendas.forEach(doc => {
            response = {
                ...doc.data(),
                docId: doc.id
            }
        })
        return response
    } catch(e) {console.log(e)}
}


const getVendasByCompradorId = async (email) => {
    try {
        let vendasRef = collection(db, "vendas")
        let q = query(vendasRef, orderBy('createdAt', 'desc'))
        let vendas = await getDocs(q)
        let response = []
        vendas.forEach(doc => {
            if(doc.data().comprador.email == email) {
                let object = {
                    ...doc.data(),
                    docId: doc.id
                }
                response.push(object)
            }
        })
        response.sort((a, b) => b.createdAt - a.createdAt);
        return response
    } catch(e) {console.log(e)}
}

const getVendasByVendedorId = async (email) => {
    try {
        console.log(email)
        let vendasRef = collection(db, "vendas")
        let q = query(vendasRef, orderBy('createdAt', 'desc'))
        let vendas = await getDocs(q)
        let response = []
        vendas.forEach(doc => {
            if(doc.data().vendedor.email == email) {
                let object = {
                    ...doc.data(),
                    docId: doc.id
                }
                response.push(object)
            }
        })
        return response
    } catch(e) {console.log(e)}
}

const novoBonus = async (id, litros, dias, motivo, genero, mes) => {
    try {
        let bonusRef = collection(db, "bonus")
        await addDoc(bonusRef, {
            id,
            litros,
            dias,
            motivo,
            genero,
            mes,
            createdAt: new Date()
        })
    } catch(e) {console.log(e)}
}

const getAllBonus = async () => {
    try {
        let bonusRef = collection(db, "bonus")
        let q = query(bonusRef, orderBy("createdAt", "desc"))
        let docs = await getDocs(q)
        let response = []
        docs.forEach((doc) => {
            response.push({
                ...doc.data(),
                docId: doc.id
            })
        })
        return response
    } catch(e) {console.log(e)}
}

const getBonusById = async (id) => {
    try {
        let bonusRef = collection(db, "bonus")
        let q = query(bonusRef, where("id", "==", id))
        let bonus = await getDocs(q)
        let response = {}
        bonus.forEach(doc => {
            response = {
                ...doc.data(),
                docId: doc.id
            }
        })
        return response
    } catch(e) {console.log(e)}
}


const getRequestById = async (id) => {
    try {
        let bonusRef = collection(db, "requests")
        let q = query(bonusRef, where("id", "==", id))
        let bonus = await getDocs(q)
        let response = {}
        bonus.forEach(doc => {
            response = {
                ...doc.data(),
                docId: doc.id
            }
        })
        return response
    } catch(e) {console.log(e)}
}

const updateBonus = async (docId, data) => {
    try {
        let docRef = doc(db, "bonus", docId)
        await updateDoc(docRef, {
            ...data
        })
    } catch(e) {console.log(e)}
}

const deleteBonus = async (docId) => {
    try {
        let docRef = doc(db, "bonus", docId)
        await deleteDoc(docRef)
    } catch(e) {console.log(e)}
}


const novoPosto = async ({nome, logo, combustiveis, descricao, frentistas = [], endereco, bairro, cidade, estado, cep, lat, lng}) => {
    try {
        let postosRef = collection(db, "postos")
        await addDoc(postosRef, {
            nome,
            combustiveis,
            id: gerarCodigoAleatorio(11),
            descricao,
            frentistas,
            endereco,
            bairro,
            cidade,
            estado,
            cep,
            logo,
            lat,
            lng,
            createdAt: new Date()
        })
    } catch(e) {console.log(e)}
}

const getPostos = async () => {
    try {
        let postosRef = collection(db, "postos")
        let q = query(postosRef, orderBy("createdAt", "asc"))
        let response = []
        let docs = await getDocs(q)
        docs.forEach(doc => {
            response.push({
                ...doc.data(),
                docId: doc.id
            })
        })
        return response
    } catch(e) {console.log(e)}
}

const updatePosto = async (docId, data) => {
    try {
        let docRef = doc(db, "postos", docId)
        await updateDoc(docRef, {
            ...data
        })
    } catch(e) {console.log(e)}
}

const excluirPosto = async (docId) => {
    try {
        let docRef = doc(db, "postos", docId)
        await deleteDoc(docRef)
    } catch(e) {console.log(e)}
}

const novoPlano = async ({id, nome, descricao, price, days, litros}) => {
    try {
        let planosRef = collection(db, "planos")
        await addDoc(planosRef, {
            id,
            nome,
            descricao,
            price,
            days,
            litros,
            createdAt: new Date()
        })
    } catch(e) {console.log(e)}
}

const getPlanos = async () => {
    try {
        let planosRef = collection(db, "planos")
        let q = query(planosRef, orderBy("createdAt", "asc"))
        let response = []
        let docs = await getDocs(q)
        docs.forEach(doc => {
            response.push({
                ...doc.data(),
                docId: doc.id
            })
        })
        return response
    } catch(e) {console.log(e)}
}

const updatePlano = async (docId, data) => {
    try {
        let docRef = doc(db, "planos", docId)
        await updateDoc(docRef, {
            ...data
        })
    } catch(e) {console.log(e)}
}

const excluirPlano = async (docId) => {
    try {
        let docRef = doc(db, "planos", docId)
        await deleteDoc(docRef)
    } catch(e) {console.log(e)}
}

const excluirBonus = async (docId) => {
    try {
        let docRef = doc(db, "bonus", docId)
        await deleteDoc(docRef)
    } catch(e) {console.log(e)}
}

const novoRequest = async ({user, posto}) => {
    try {
        let requestRef = collection(db, "requests")
        await addDoc(requestRef, {
            id: gerarCodigoAleatorio(12),
            user,
            posto,
            createdAt: new Date()
        })

    } catch(e) {console.log(e)}
}

const novoAlerta = async ({conteudo, titulo, vezes}) => {
    try {
        let requestRef = collection(db, "alertas")
        await addDoc(requestRef, {
            id: gerarCodigoAleatorio(12),
            conteudo,
            vezes,
            titulo,
            createdAt: new Date()
        })

    } catch(e) {console.log(e)}
}

const novoTermo = async ({texto}) => {
    try {
        let requestRef = collection(db, "termo")
        await addDoc(requestRef, {
            id: gerarCodigoAleatorio(12),
            texto,
            createdAt: new Date()
        })
    } catch(e) {console.log(e)}
}

const updateTermo = async (docId, data) => {
    try {
        let docRef = doc(db, "termo", docId)
        await updateDoc(docRef, {
            ...data
        })
    } catch(e) {console.log(e)}
}

const getTermo = async () => {
    try {
        let requestRef = collection(db, "termo")
        let q = query(requestRef, orderBy("createdAt", "asc"))
        let response = []
        let docs = await getDocs(q)
        docs.forEach(doc => {
            response.push({
                ...doc.data(),
                docId: doc.id
            })
        })
        return response
    } catch(e) {console.log(e)}
}

const getAlertas = async () => {
    try {
        let requestRef = collection(db, "alertas")
        let q = query(requestRef, orderBy("createdAt", "desc"))
        let response = []
        let docs = await getDocs(q)
        docs.forEach(doc => {
            response.push({
                ...doc.data(),
                docId: doc.id
            })
        })
        return response
    } catch(e) {console.log(e)}
}

const excluirAlerta = async (docId) => {
    try {
        let docRef = doc(db, "alertas", docId)
        await deleteDoc(docRef)
    } catch(e) {console.log(e)}
}

const updateAlerta = async (docId, data) => {
    try {
        let docRef = doc(db, "alertas", docId)
        await updateDoc(docRef, {
            ...data
        })
    } catch(e) {console.log(e)}
}

const getRequests = async () => {
    try {
        let requestRef = collection(db, "requests")
        let q = query(requestRef, orderBy("createdAt", "asc"))
        let response = []
        let docs = await getDocs(q)
        docs.forEach(doc => {
            response.push({
                ...doc.data(),
                docId: doc.id
            })
        })
        return response
    } catch(e) {console.log(e)}
}

const excluirRequest = async (docId) => {
    try {
        let docRef = doc(db, "requests", docId)
        await deleteDoc(docRef)
    } catch(e) {console.log(e)}
}

const getUsers = async () => {
    try {
        let requestRef = collection(db, "users")
        let q = query(requestRef, orderBy("nome", "asc"))
        let response = []
        let docs = await getDocs(q)
        docs.forEach(doc => {
            response.push({
                ...doc.data(),
                docId: doc.id
            })
        })
        return response
    } catch(e) {console.log(e)}
}

const aceitarRequest = async (docId) => {
    try {
        let data = await getDoc(doc(db, "requests", docId))
        if(data.exists()) {
            let dados = data.data()
            let frentista = {[dados.user.email]: {
                ...dados.user
            }}
            await updateUser(dados.user.docId, {
                posto: dados.posto
            })
            await updatePosto(dados.posto.docId, {
                frentistas: arrayUnion(frentista)
            })
            await excluirRequest(docId)
        }

    } catch(e) {console.log(e)}
}

const desvincularPosto = async (docId) => {
    try {
        let data = await getDoc(db, "users", docId)
        if(data.exists()) {
            let user = data.data();
            delete user.posto.frentistas[user.email]
            await updateUser(user.docId, {
                posto: {}
            })
            await updatePosto(user.posto.docId, {
                frentistas: user.posto.frentistas
            })
        }
    } catch(e) {console.log(e)}
}

const criarLoja = async ({nome, foto, endereco, bairro, cep, estado, lat, lng}) => {
    try {
        const lojaRef = collection(db, 'lojas')
        await addDoc(lojaRef, {
            nome,
            foto,
            endereco,
            bairro,
            cep,
            estado,
            id: gerarCodigoAleatorio(32),
            lat,
            lng,
            createdAt: new Date()
        })
    } catch(e) {console.log(e)}
}

const editLoja = async (docId, data) => {
    try {
        const lojaRef = doc(db, "lojas", docId)
        await updateDoc(lojaRef, {
            ...data
        })
    } catch(e) {console.log(e)}
}

const getLojas = async () => {
    try {
        const lojaRef = collection(db, "lojas")
        const q = query(lojaRef, orderBy('createdAt', 'asc'))
        const docs = await getDocs(q)
        let response = []
        docs.docs.forEach((doc) => {
            response.push({
                ...doc.data(),
                docId: doc.id
            })
        })
        return response
    } catch(e) {console.log(e)}
}

const getLojaById = async (id) => {
    try {
        const lojaRef = collection(db, "lojas")
        const q = query(lojaRef, orderBy('createdAt', 'asc'))
        const docs = await getDocs(q)
        let response = {}
        docs.docs.forEach((doc) => {
            if(doc.data().id == id) {
                response = {
                    ...doc.data(),
                    docId: doc.id
                }
            }
        })
        return response
    } catch(e) {console.log(e)}
}

const deleteLoja = async (docId) => {
    try {
        const lojaRef = doc(db, "lojas", docId)
        await deleteDoc(lojaRef)
    } catch(e) {console.log(e)}
}

const demitir = async (docId) => {
    try {
        let data = await getDoc(db, "users", docId)
        if(data.exists()) {
            let user = data.data();
            delete user.posto.frentistas[user.email]
            await updateUser(user.docId, {
                posto: {},
                role: 'normal',
                canChange: false
            })
            await updatePosto(user.posto.docId, {
                frentistas: user.posto.frentistas
            })
        }
    } catch(e) {console.log(e)}
}

export {logout, entrarComGoogle, criarLoja, editLoja, getLojaById, getLojas, deleteLoja, getMessagesFromBothId, registrarLojista, newMessage, getMessagesFromSenderId, getAllMessages, getMessagesFromReceiverId, novoTermo, desvincularPosto, demitir, getUsers, updateTermo, getTermo, getRequestById, novoAlerta, updateAlerta, excluirAlerta, getAlertas, getUserByCPF, excluirBonus, updateVenda, getPostoById, updatePosto, getVendas, getVendasByCompradorId, getAllBonus, novoBonus, getVendasById, getVendasByVendedorId, aceitarRequest, updatePlano, updateBonus, excluirRequest, getRequests, novoRequest, deleteBonus, excluirPlano, novoPlano, getPlanos, excluirPosto, getPostos, novoPosto, getBonusById, getUserById,  novaVenda, updateUser, getUserByEmail, loginComEmailESenha, recuperarSenha, registrarComEmailESenha}