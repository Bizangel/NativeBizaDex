import { styled } from "styled-components/native"
import { colorPalette } from "../../styles/styles"
import { Pokemon } from "../../types/Pokemon"

const DexNameAndDescriptionWrapper = styled.View`
  background-color: ${colorPalette.backgroundBlack70};
  width: 90%;
  padding: 15px;

  border-radius: 10px;
`

const PokeName = styled.Text`
  font-size: 24px;
  color: ${colorPalette.textWhite};
`

const PokedexEntry = styled.Text`
  color: ${colorPalette.textWhite};
`

export function DexNameAndDescription({ pokemon }: { pokemon: Pokemon }) {
  return (
    <DexNameAndDescriptionWrapper>
      <PokeName>
        {pokemon.displayName}
      </PokeName>
      <PokedexEntry>
        {pokemon.pokedexEntryDescription}
      </PokedexEntry>
    </DexNameAndDescriptionWrapper>)
}