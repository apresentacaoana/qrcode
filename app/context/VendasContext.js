import { createContext, useEffect, useState } from "react";
import { getAllBonus, getPlanos, getPostos, getUserByEmail, getVendas } from "../db/service";

export const VendasContext = createContext()

export const VendasProvider = ({ children }) => {
    const [vendas, setVendas] = useState([])

    useEffect(() => {
        async function setData() {
            let response = await getVendas()
            setVendas(response)
        }
        setData()
    }, [])

    return (
        <VendasContext.Provider value={[vendas, setVendas]}>
            {children}
        </VendasContext.Provider>
    )
}