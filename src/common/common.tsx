import { styled } from "styled-components/native";
import { colorPalette, types2color } from "../styles/styles";
import { PokeType } from "../types/Pokemon";

export const TypeDisplay = styled.Text<{ type: PokeType }>`
  width: 80px;

  text-transform: uppercase;

  background-color: ${p => types2color[p.type]};
  color: ${colorPalette.textWhite};
  text-shadow: 1px 1px 2px rgba(0,0,0,.7);
  text-align: center;

  border-radius: 4px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 16px;

  padding-top: 2px;
  padding-bottom: 2px;

  margin-right: 5px;
`