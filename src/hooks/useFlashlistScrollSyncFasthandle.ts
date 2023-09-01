import { useCallback } from "react"
import { clamp } from "../util/utils";
import { GestureUpdateEvent, PanGestureHandlerEventPayload } from "react-native-gesture-handler";
import { Pokemon } from "../types/Pokemon";
import { FlashList } from "@shopify/flash-list";
import { useWindowDimensions, Animated, NativeSyntheticEvent, NativeScrollEvent } from "react-native"
import { topBarHeightPx } from "../common/common";

export function useFlashlistScrollSyncFasthandle(
  flashListRef: React.RefObject<FlashList<Pokemon>>,
  isDraggingFastScroll: boolean,
  draggableScrollbarHeight: number,
  valueToSync: Animated.Value,
  listLength: number,
) {
  const { height: screenHeight } = useWindowDimensions();

  const onDraggableFastScrollHandlePan = useCallback((e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
    const scrollVal = clamp(e.absoluteY, topBarHeightPx, screenHeight - draggableScrollbarHeight) - topBarHeightPx; // from 0 - scrollview height

    const scrollProgress = scrollVal / (screenHeight - draggableScrollbarHeight - topBarHeightPx);

    const scrollToIndex = Math.round(scrollProgress * (listLength - 1));

    valueToSync.setValue(scrollVal + topBarHeightPx);

    flashListRef.current?.scrollToIndex({ animated: false, index: scrollToIndex })
  }, [draggableScrollbarHeight, flashListRef, listLength, valueToSync, screenHeight])

  const onFlashlistScroll = useCallback((ev: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isDraggingFastScroll) // no need to sync
      return;


    const scrollProgress = ev.nativeEvent.contentOffset.y / (ev.nativeEvent.contentSize.height - ev.nativeEvent.layoutMeasurement.height);
    valueToSync.setValue(scrollProgress * (ev.nativeEvent.layoutMeasurement.height - draggableScrollbarHeight) + topBarHeightPx);
  }, [isDraggingFastScroll, valueToSync, draggableScrollbarHeight])

  return { onDraggableFastScrollHandlePan, onFlashlistScroll }
}