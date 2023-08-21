import { useEffect } from "react";
import { Keyboard } from "react-native";


export function useOnKeyboardShow(callback: () => void) {
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', callback);

    return () => {
      keyboardDidShowListener.remove();
    };
  }, [callback]);
}

export function useOnKeyboardHide(callback: () => void) {
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', callback);

    return () => {
      keyboardDidHideListener.remove();
    };
  }, [callback]);
}

