import { Stack } from "expo-router";
import { UserProvider } from "./context/UserContext";
import { PostosProvider } from "./context/PostosContext";
import { BonusProvider } from "./context/BonusContext";
import { VendasProvider } from "./context/VendasContext";
import { PlanosContext, PlanosProvider } from "./context/PlanosContext";
import { RequestsProvider } from "./context/RequestsContext";

export default function Layout() {
    return (
        <UserProvider>
            <RequestsProvider>
                <PostosProvider>
                    <BonusProvider>
                        <VendasProvider>
                            <PlanosProvider>
                                <Stack />
                            </PlanosProvider>
                        </VendasProvider>
                    </BonusProvider>
                </PostosProvider>
            </RequestsProvider>
        </UserProvider>
    )
}