import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../utils/redux/store";

export default function RootLayout() {




  useFonts({
    'outfit-regular': require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium': require('./../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold': require('./../assets/fonts/Outfit-Bold.ttf'),

  })




  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
     <Provider store={store}>
       <PersistGate  persistor={persistor}>
          <Stack screenOptions={{
            headerShown: false
          }} >
            <Stack.Screen name="index" options={{ headerShown: false, gestureEnabled: false, }} />
          </Stack>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
