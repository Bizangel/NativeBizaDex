import { styled } from "styled-components/native"
import DirectionalSlidingMenu from "../../common/DirectionalSlidingMenu"


const DetailsWrapper = styled.View`
  width: 100%;
  height: 100%;

  background-color: green;
`


export type PokedexDetailsMenuProps = {
  dissmiss: () => void,
}

export function PokedexDetailsMenu({ dissmiss }: PokedexDetailsMenuProps) {

  return <DirectionalSlidingMenu
    dismissLayout={dissmiss}
    menuViewportSize={60}
    slidingOrigin="bottom"
  >
    <DetailsWrapper />
  </DirectionalSlidingMenu>
}