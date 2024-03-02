import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import { getUserByEmail } from "../db/service";

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({})

    useEffect(() => {
        async function setData() {
            let email = await AsyncStorage.getItem('email')
            if(email) {
                let responseUser = await getUserByEmail(email)
                setUser(responseUser)
            }
        }
        setData()
    }, [])

    return (
        <UserContext.Provider value={[user, setUser]}>
            {children}
        </UserContext.Provider>
    )
}