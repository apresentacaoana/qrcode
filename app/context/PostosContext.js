import { createContext, useEffect, useState } from "react";
import { getAllBonus, getPlanos, getPostos, getUserByEmail } from "../db/service";

export const PostosContext = createContext()

export const PostosProvider = ({ children }) => {
    const [postos, setPostos] = useState([])

    useEffect(() => {
        async function setData() {
            let response = await getPostos()
            setPostos(response)
        }
        setData()
    }, [])

    return (
        <PostosContext.Provider value={[postos, setPostos]}>
            {children}
        </PostosContext.Provider>
    )
}