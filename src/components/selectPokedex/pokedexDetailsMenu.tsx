import { styled } from "styled-components/native"
import HorizontalSlidingMenu from "../../common/HorizontalSlidingMenu"


const DetailsWrapper = styled.View`
  width: 100%;
  height: 100%;

  background-color: green;
`


export type PokedexDetailsMenuProps = {
  dissmiss: () => void,
}

export function PokedexDetailsMenu({ dissmiss }: PokedexDetailsMenuProps) {

  return <HorizontalSlidingMenu
    dismissLayout={dissmiss}
    menuViewportSize={60}
    slidingOrigin="left"
  >
    <DetailsWrapper />
  </HorizontalSlidingMenu>
}