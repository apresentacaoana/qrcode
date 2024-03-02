import { createContext, useEffect, useState } from "react";
import { getAllBonus, getPlanos, getUserByEmail } from "../db/service";

export const PlanosContext = createContext()

export const PlanosProvider = ({ children }) => {
    const [planos, setPlanos] = useState([])

    useEffect(() => {
        async function setData() {
            let response = await getPlanos()
            setPlanos(response)
        }
        setData()
    }, [])

    return (
        <PlanosContext.Provider value={[planos, setPlanos]}>
            {children}
        </PlanosContext.Provider>
    )
}