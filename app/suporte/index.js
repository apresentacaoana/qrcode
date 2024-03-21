import { Stack, useRouter } from 'expo-router'
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Widget from '../components/Widget'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import { UserContext } from '../context/UserContext'
import { newMessage } from '../db/service'
import moment from 'moment/moment'

const Suporte = () => {

  const router = useRouter()
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState('')
  const [user, setUser] = useContext(UserContext)
  const scrollViewRef = useRef()

  async function send() {
    await newMessage({message: content, from: user.docId, to: 'admin'})
    setContent('')
  }

  
  useEffect(() => {
    scrollViewRef.current.scrollToEnd({animated: true})
  }, [messages])

  useLayoutEffect(() => {
    const msgQuery = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'asc')
    )
    const unsubscribe = onSnapshot(msgQuery, (querySnap) => {
      const upMsg = querySnap.docs.map((doc) => doc.data())
      setMessages(upMsg)
    })
    return unsubscribe
  }, [])
  
  const admin = (message) => (
    <View className='self-start mt-2'>
      <View key={message.id} className=' flex flex-col w-fit self-start p-3 rounded-[20px] rounded-bl-none px-5 border border-gray-300 bg-gray-200 '>
        <Text className=' uppercase self-start text-black font-semibold text-[13px]'>Suporte</Text>
        <Text className=' text-[19px] text-gray-500'>{message.message}</Text>
      </View>
      <Text className=' uppercase self-end text-gray-600'>{moment(message.createdAt.seconds * 1000).format('HH:mm A')}</Text>
    </View>
  )

  const eu = (message) => (
    <>
    <View className='self-end mt-2'>
      
      <View key={message.id} className=' flex flex-col w-fit self-end p-3 rounded-[20px] rounded-br-none px-5 border border-gray-300 bg-yellow-100 '>
        <View className='flex flex-row justify-between w-full items-center'>
        </View>
        <Text className=' text-[19px] text-gray-500'>{message.message}</Text>
      </View>
      <Text className=' uppercase ml-2 text-gray-600'>{moment(message.createdAt.seconds * 1000).format('HH:mm A')}</Text>
    </View>
    </>
  )

  return (
    <SafeAreaView className="flex-1 bg-[#fefefe]">
    <StatusBar />
        <View className="mt-8" />
        <Stack.Screen options={{headerShown: false}} />
        <View className='flex-1 m-7'>
          
          <View className="flex flex-row mb-10">
              <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="arrow-back" color={"#0f0d3c"} size={30} />
              </TouchableOpacity>
              <Text className="text-[#0f0d3c] ml-3 text-[28px]">Suporte</Text>
          </View>

          <View className="flex flex-col w-full items-center mb-3">
              <Widget className='w-full text-center -mt-5'>
                <Text className='text-center'>Fale sobre seu problema/dúvida e iremos ajudá-lo com isso.</Text>
              </Widget>
          </View>

          <ScrollView ref={scrollViewRef}>
            {messages.length > 0 && messages.map((message) => {
              if(message.from == user.docId) {
                return eu(message)
              } else if (message.to == user.docId) {
                return admin(message)
              }
            })}
          </ScrollView>

          <View className='bg-white pt-4 flex flex-row justify-between items-center'>
            <Widget className='w-[80%]'>
              <TextInput value={content} onChangeText={(e) => {
                setContent(e)
                console.log(content)
              }}  placeholder={`O que está havendo?`} />
            </Widget>
            <TouchableOpacity disabled={!content} onPress={send}>
              <Widget variant={'filled'}>
                <Ionicons name='send' color={'white'} size={30} />
              </Widget>
            </TouchableOpacity>
          </View>

        </View>
    </SafeAreaView>
  )
}

export default Suporte
