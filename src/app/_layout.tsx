import { Stack } from 'expo-router'
import {
    useFonts,
    Rubik_600SemiBold,
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_700Bold
} from '@expo-google-fonts/rubik'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { colors } from '@/styles/theme'
import Loading from '@/components/loading'

export default function Layout() {
    const [fontsLoaded] = useFonts({
        Rubik_600SemiBold,
        Rubik_400Regular,
        Rubik_500Medium,
        Rubik_700Bold
    })

    if (!fontsLoaded) {
        return <Loading />
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: colors.gray[100]
                }
            }}>

            </Stack>
        </GestureHandlerRootView>
    )
}