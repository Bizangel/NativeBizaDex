import React from 'react';
import MainScreen from './components/MainScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
  return (
    <GestureHandlerRootView>
      <MainScreen />
    </GestureHandlerRootView>
  );
}

export default App