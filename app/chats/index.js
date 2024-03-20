import { Stack, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import Widget from '../components/Widget'
import { getAllMessages, getUsers } from '../db/service'

const Chats = () => {
  const router = useRouter()
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    async function getData() {
      
      let responseMessages = await getAllMessages()
      let responseUsers = await getUsers()
      setMessages(responseMessages)
      setUsers(responseUsers)
    }
    getData()
  }, [])

  return (
    <SafeAreaView className="flex-1 bg-[#fefefe]">
        <View className="mt-8" />
        <Stack.Screen options={{headerShown: false}} />
        <StatusBar />
        <View className='flex-1 m-7'>

          <View className="flex flex-row mb-10 bg-white">
              <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="arrow-back" color={"#0f0d3c"} size={30} />
              </TouchableOpacity>
              <Text className="text-[#0f0d3c] ml-3 text-[28px]">Chats</Text>
          </View>

          <ScrollView>
            {users.map((user) => 
              {
                if(messages.filter((message) => message.from == user.docId).length > 0) {
                  return (

                    <TouchableOpacity onPress={() => router.push(`/suporte/${user.id}`)}>
                      <Widget className='border border-gray-300 mb-2'>
                        <Text className=''>{user.nome}</Text>
                        <Text>{messages.filter((message) => message.from == user.docId).length} mensagem</Text>
                      </Widget>
                    </TouchableOpacity>
                    )
                }
              }
          )}
          </ScrollView>

        </View>
    </SafeAreaView>
  )
}

export default Chats
