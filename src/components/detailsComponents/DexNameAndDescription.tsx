import { styled } from "styled-components/native"
import { colorPalette, types2color } from "../../styles/styles"
import { PokeType, Pokemon } from "../../types/Pokemon"

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

const TypeDisplay = styled.Text<{ type: PokeType }>`
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