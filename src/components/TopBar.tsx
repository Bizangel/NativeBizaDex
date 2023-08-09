import { useState } from "react"
import { View, StyleSheet, TextInput, Image, Keyboard } from "react-native";
import { styled } from "styled-components/native";


const TopbarWrapper = styled.View`
  background-color: rgba(0,0,0, 0.7);

  height: 50px;
  width: 100%;

  display: flex;
  flex-direction: row;

  align-items: center;
  justify-content: space-between;

  padding: 0px 20px;
`

const SearchBarWrapper = styled.View`
  width: 75%;
  background-color: rgba(0,0,0,.7);

  border-radius: 20px;
  margin: 5px 0px;
`

const SearchInput = styled.TextInput`
  font-size: 16px;
  padding-left: 15px;
`


export type TopBarProps = {
  currentSearch: string,
  setCurrentSearch: (x: string) => void,
}

function TopBar({ currentSearch, setCurrentSearch }: TopBarProps) {

  return (
    <TopbarWrapper>
      <SearchBarWrapper>
        <SearchInput
          placeholder="Search"
          onChangeText={(x) => setCurrentSearch(x)}
          value={currentSearch}
          defaultValue={""}
        />
      </SearchBarWrapper>


      <Image source={require('../icons/filter.png')} style={{ width: 40, height: 40 }} />
    </TopbarWrapper>
  )
}

export default TopBar