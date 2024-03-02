import { createContext, useEffect, useState } from "react";
import { getAllBonus, getUserByEmail } from "../db/service";

export const BonusContext = createContext()

export const BonusProvider = ({ children }) => {
    const [bonus, setBonus] = useState([])

    useEffect(() => {
        async function setData() {
            let response = await getAllBonus()
            setBonus(response)
        }
        setData()
    }, [])

    return (
        <BonusContext.Provider value={[bonus, setBonus]}>
            {children}
        </BonusContext.Provider>
    )
}