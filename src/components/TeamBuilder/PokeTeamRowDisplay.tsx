import { styled } from "styled-components/native";
import { Pokemon } from "../../types/Pokemon";
import { Image } from "react-native";
import pokeImages from "../../assets/pokeImages";


const RowWrapper = styled.View`

  height: 100%;
  width: 100%;

  background-color: green;

  border-radius: 15px;

  display: flex;
  flex-direction: row;
`

const PokePreviewWrapper = styled.View`
  background-color: blue;

  width: 50px;
  height: 50px;

  border-radius: 50px;


`

function PokeTeamRowDisplay({ team }: { team: Pokemon[] }) {
  return (
    <RowWrapper>
      {team.map(poke =>
        <PokePreviewWrapper key={poke.id}>
          <Image source={pokeImages[poke.id]} resizeMode="contain" style={{ flex: 1, width: undefined, height: undefined }} />
        </PokePreviewWrapper>
      )}

    </RowWrapper>
  )
}

export default PokeTeamRowDisplay;