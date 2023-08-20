import { styled } from "styled-components/native"
import { colorPalette } from "../../styles/styles"
import { Pokemon } from "../../types/Pokemon"
import { TypeDisplay } from "../../common/common"

const DexNameAndDescriptionWrapper = styled.View`
  background-color: ${colorPalette.backgroundBlack70};
  width: 90%;
  padding: 15px;

  border-radius: 10px;
`

const DexNameAndTypeWrapperRow = styled.View`
  display: flex;
  flex-direction: row;

  align-items: center;

  justify-content: space-around;

  flex-wrap: wrap;
`

const PokeNumberAndPokeNameWrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;

  flex-wrap: wrap;
`

const PokeDexNumber = styled.Text`
  font-size: 26px;
  color: ${colorPalette.textWhite};
  margin-right: 5px;
  opacity: 0.5;
`

const PokeName = styled.Text`
  font-size: 26px;
  color: ${colorPalette.textWhite};
`

const PokeSpecies = styled.Text`
  font-size: 16px;
  color: ${colorPalette.textWhite};

  font-style: italic;
`

const PokedexEntry = styled.Text`
  margin-top: 10px;
  color: ${colorPalette.textWhite};
`

const DoubleTypeWrapper = styled.View`
  display: flex;
  flex-direction: row;
`

export function DexNameAndDescription({ pokemon }: { pokemon: Pokemon }) {
  return (
    <DexNameAndDescriptionWrapper>
      <DexNameAndTypeWrapperRow>
        <PokeNumberAndPokeNameWrapper>
          <PokeDexNumber>
            #{pokemon.nationalDexNumber.toString().padStart(3, '0')}
          </PokeDexNumber>
          <PokeName>
            {pokemon.displayName}
          </PokeName>

        </PokeNumberAndPokeNameWrapper>

        <DoubleTypeWrapper>
          {pokemon.type.map(e =>
            <TypeDisplay type={e} key={e}>{e}</TypeDisplay>
          )}
        </DoubleTypeWrapper>
      </DexNameAndTypeWrapperRow>

      <PokeSpecies>
        {pokemon.species}
      </PokeSpecies>

      <PokedexEntry>
        {pokemon.pokedexEntryDescription}
      </PokedexEntry>
    </DexNameAndDescriptionWrapper>)
}