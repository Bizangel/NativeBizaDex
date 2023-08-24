import { styled } from "styled-components/native";
import { colorPalette, types2color } from "../styles/styles";
import { PokeType } from "../types/Pokemon";
import { useEffect, useRef } from "react";
import { Animated } from "react-native"

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

export const OpacitySpawn = ({ children, duration }: { children: React.ReactNode, duration: number }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: duration,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, duration]);

  return (<Animated.View>
    {children}
  </Animated.View>)
}