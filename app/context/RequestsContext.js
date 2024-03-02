import { createContext, useEffect, useState } from "react";
import { getAllBonus, getPlanos, getPostos, getRequests, getUserByEmail, getVendas } from "../db/service";

export const RequestsContext = createContext()

export const RequestsProvider = ({ children }) => {
    const [requests, setRequests] = useState([])

    useEffect(() => {
        async function setData() {
            let response = await getRequests()
            setRequests(response)
        }
        setData()
    }, [])

    return (
        <RequestsContext.Provider value={[requests, setRequests]}>
            {children}
        </RequestsContext.Provider>
    )
}