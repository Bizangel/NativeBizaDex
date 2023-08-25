import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { styled } from "styled-components/native";
import { RootStackParamList } from "../App";


const AllAbilitiesWrapper = styled.View`
  width: 100%;
  height: 100%;

  background-color: blue;
`

function AllAbilitiesScreen({ route }: NativeStackScreenProps<RootStackParamList, 'AllAbilitiesScreen'>) {
  return (
    <AllAbilitiesWrapper>

    </AllAbilitiesWrapper>
  )
}

export default AllAbilitiesScreen;
