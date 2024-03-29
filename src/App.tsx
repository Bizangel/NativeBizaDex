import React from 'react';
import MainScreen from './screens/MainScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setIdleTimerDisabled } from 'react-native-idle-timer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import AbilityScreen from './screens/AbilityScreen';
import AllAbilitiesScreen from './screens/AllAbilitiesScreen';
import TypeChartScreen from './screens/TypeChartScreen';
import TeamBuilderScreen from './screens/TeamBuilderScreen';
import { SelectPokedexScreen } from './screens/SelectPokedexScreen';
import ExportImportScreen from './screens/ExportImportScreen';

export type RootStackParamList = {
  MainScreen: { preSelectedPokemonId: string | null },
  AbilityScreen: { abilityId: string },
  AllAbilitiesScreen: {},
  TypeChartScreen: {},
  TeamBuilderScreen: {},
  SelectPokedexScreen: {},
  ExportImportScreen: {},
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
        <Stack.Screen
          name="AllAbilitiesScreen"
          component={withGestureHandler(AllAbilitiesScreen)}
        />
        <Stack.Screen
          name="TypeChartScreen"
          component={withGestureHandler(TypeChartScreen)}
        />
        <Stack.Screen
          name="TeamBuilderScreen"
          component={withGestureHandler(TeamBuilderScreen)}
        />
        <Stack.Screen
          name="SelectPokedexScreen"
          component={withGestureHandler(SelectPokedexScreen)}
        />
        <Stack.Screen
          name="ExportImportScreen"
          component={withGestureHandler(ExportImportScreen)}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App