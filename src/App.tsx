import React from 'react';
import MainScreen from './screens/MainScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setIdleTimerDisabled } from 'react-native-idle-timer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import AbilityScreen from './screens/AbilityScreen';

export type RootStackParamList = {
  MainScreen: { preSelectedPokemonId: string | null },
  AbilityScreen: { abilityId: string },
}

export type ScreenNameType = keyof RootStackParamList;

const Stack = createNativeStackNavigator<RootStackParamList>();

const withGestureHandler = <P extends NativeStackScreenProps<RootStackParamList, ScreenNameType>>(Component: React.ComponentType<P>) => (props: P) => <GestureHandlerRootView><Component {...props} /></GestureHandlerRootView>



function App() {

  if (process.env.NODE_ENV === "development")
    setIdleTimerDisabled(true);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="MainScreen">
        <Stack.Screen
          name="MainScreen"
          component={withGestureHandler(MainScreen)}
          initialParams={{ preSelectedPokemonId: null }}
        />
        <Stack.Screen
          name="AbilityScreen"
          component={withGestureHandler(AbilityScreen)}
          options={{
            // presentation: 'transparentModal',
          }}
          initialParams={{ abilityId: 'blaze' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App