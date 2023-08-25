import { Animated, ViewStyle } from "react-native"
import { styled } from "styled-components/native"
import React, { useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from "react"
import { Directions, Gesture, GestureDetector } from "react-native-gesture-handler"
import { useBackHandler } from "../hooks/useBackHandler"

const FullFilterOverlayWrapper = styled(Animated.View)`
  position: absolute;
  width: 100%;
  height: 100%;

  top: 0px;
  left: 0px;
`

const SlidingComponentWrapper = styled(Animated.View)`
  position: absolute;
  top: 0px;
`

const OverlayWrapper = styled(Animated.View)`
  width: 100%;
  height: 100%;
  position: absolute;

  top: 0;
  left: 0;
  z-index: 2;
`

const openingAnimationDurationMs = 250;

export type SlidingMenuProps = {
  /** Callback used to unmount the current sliding menu. */
  dismissLayout: () => void,

  /** Main React component. This will be already wrapped inside the sliding layout. */
  children: React.ReactNode,

  /** Where the sliding comes from in each direction. */
  slidingOrigin: "left" | "right",

  /** The outside range of the sliding window. It should be a number that represents in viewport width percentage, how big the sliding window is.
   * This will be used to effectively "slide" the window outside of view, so if an invalid number is given,
   * the sliding will not look smooth or the view may dissapear while still visible in viewport.
   * If unknown, try to use higher numbers like 100, but it may result in sliding too fast.
   */
  menuViewportSize: number,

  /** An optional react node that overlays the whole overlay. i.e. is not part directly of the sliding menu.
  * Use for positionally absolute elements outside the sliding menu */
  overlayedComponent?: React.ReactNode,

  /** Optional callback to override the default functionality (close the sliding window).
   * Return true to mark as handled (prevent normal functionality), return false to allow normal functionality.
   * This will also be called when it is clicked outside the sliding modal, and when the back button is pressed
   */
  onBackCloseTap?: () => boolean,

  contentContainerWrapperStyle?: ViewStyle
}

export interface HorizontalSlidingMenuRef {
  closeOverlay(): void,
}

// could be very easily generalized for verticality, but for now let's keep it horizontal

const HorizontalSlidingMenu = forwardRef<HorizontalSlidingMenuRef, SlidingMenuProps>(function HorizontalSlidingMenu(
  { dismissLayout, overlayedComponent, children, slidingOrigin, menuViewportSize, onBackCloseTap, contentContainerWrapperStyle }, ref) {
  // animation regarding opening progress
  const animOpeningProgress = useRef(new Animated.Value(0)).current;
  const animatedOriginProp = animOpeningProgress.interpolate({ inputRange: [0, 100], outputRange: [`-${menuViewportSize}%`, "0%"] });
  const animatedBackgroundOpacity = animOpeningProgress.interpolate({ inputRange: [0, 100], outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,.8)'] });
  const animDissapearOpacity = animOpeningProgress.interpolate({ inputRange: [0, 100], outputRange: [0, 0.7] });

  useBackHandler(() => {
    if (onBackCloseTap) {
      const handled = onBackCloseTap();
      if (handled)
        return true; // handled
    }

    hideLayoutAnimated();
    return true;
  })

  useEffect(() => {
    Animated.timing(animOpeningProgress, {
      toValue: 100,
      duration: openingAnimationDurationMs,
      useNativeDriver: false,
    }).start(() => {

    });
  })

  const hideLayoutAnimated = useCallback(() => {
    if (onBackCloseTap) {
      const handled = onBackCloseTap();
      if (handled)
        return;
    }

    Animated.timing(animOpeningProgress, {
      toValue: 0,
      duration: openingAnimationDurationMs, // just do reverse
      useNativeDriver: false,
    }).start(() => {
      dismissLayout(); // fully close
    });
  }, [animOpeningProgress, dismissLayout, onBackCloseTap])

  useImperativeHandle(ref, () => ({
    closeOverlay() {
      hideLayoutAnimated();
    },
  }), [hideLayoutAnimated])

  const backgroundTapCloseGesture = Gesture.Tap().onStart(() => {
    hideLayoutAnimated();
  });

  const closeFlingToRightGesture = Gesture.Fling().direction(slidingOrigin === "left" ? Directions.LEFT : Directions.RIGHT).onStart(() => hideLayoutAnimated())
  const backgroundTapAvoidCaptureEmptyTap = Gesture.Tap();

  return (
    <GestureDetector gesture={backgroundTapCloseGesture}>
      <FullFilterOverlayWrapper style={{ backgroundColor: animatedBackgroundOpacity }}>
        <GestureDetector gesture={Gesture.Race(backgroundTapAvoidCaptureEmptyTap, closeFlingToRightGesture)}>
          <SlidingComponentWrapper style={{ [slidingOrigin]: animatedOriginProp, width: `${menuViewportSize}%`, height: "100%", ...contentContainerWrapperStyle }}>
            {children}
          </SlidingComponentWrapper>
        </GestureDetector>

        <OverlayWrapper style={{ opacity: animDissapearOpacity }}>
          {overlayedComponent}
        </OverlayWrapper>
      </FullFilterOverlayWrapper>
    </GestureDetector>
  )
})

export default HorizontalSlidingMenu
