import React from 'react';
import MainScreen from './components/MainScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setIdleTimerDisabled } from 'react-native-idle-timer';

function App() {

  if (process.env.NODE_ENV === "development")
    setIdleTimerDisabled(true);

  return (
    <GestureHandlerRootView>
      <MainScreen />
    </GestureHandlerRootView>
  );
}

export default App