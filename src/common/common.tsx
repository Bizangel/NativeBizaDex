import { styled } from "styled-components/native";
import { colorPalette, types2color } from "../styles/styles";
import { PokeType } from "../types/Pokemon";
import { useEffect, useRef } from "react";
import { Animated, ViewStyle, StyleSheet, TextInputProps } from "react-native"
import { useOnKeyboardHide } from "../hooks/useKeyboardHooks";
import { TextInput } from "react-native-gesture-handler";


export enum LocalStorageKeys {
  STORED_POKEDEX = "storedPokedex",
}


export const TypeDisplay = styled.Text<{ type: PokeType }>`
  min-width: 80px;

  text-transform: uppercase;

  background-color: ${p => types2color[p.type]};
  color: ${colorPalette.textWhite};
  text-shadow: 1px 1px 2px rgba(0,0,0,.7);
  text-align: center;

  border-radius: 4px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 15px;

  padding-top: 2px;
  padding-bottom: 2px;

  margin-right: 5px;
`

export const HorizontalBottomRule = styled.View`
  width: 85%;
  border-color: ${colorPalette.textWhite};

  margin: 5px 0px;
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
`

export const OpacitySpawn = ({ children, spawnDuration, style }: { children: React.ReactNode, spawnDuration: number, style?: ViewStyle }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: spawnDuration,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, spawnDuration]);

  return (<Animated.View style={[style, { opacity: fadeAnim }]}>
    {children}
  </Animated.View>)
}

/** Textinput wrapper that removes focus properly when keyboard is dismissed. */
export const TextInputWithBlurOnHide = (props: TextInputProps) => {
  const inputref = useRef<TextInput>(null);

  useOnKeyboardHide(() => {
    inputref.current?.blur();
  })

  return <TextInput {...props} ref={inputref} />

}