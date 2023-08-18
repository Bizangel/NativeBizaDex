import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, ViewStyle, Animated } from "react-native";


export const ProgressiveElement = <T,>({ Component, item, onRender, idx }: { Component: (x: T, idx: number) => React.ReactNode, item: T, onRender?: () => void, idx: number }) => {
  useEffect(() => {
    const timeout = setTimeout(() => { if (onRender) onRender(); }, 0);
    return () => {
      clearTimeout(timeout);
    }
  }, [onRender])

  return Component(item, idx)
}

export const ProgressiveElementAnimated = <T,>({ Component, item, onRender, animDuration, idx }: {
  Component: (x: T, idx: number) => React.ReactNode, item: T, onRender?: () => void, animDuration: number, idx: number,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: animDuration,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, animDuration]);

  useEffect(() => {
    const timeout = setTimeout(() => { if (onRender) onRender(); }, 0);
    return () => {
      clearTimeout(timeout);
    }
  }, [onRender])

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {Component(item, idx)}
    </Animated.View>
  )
}

export const ProgressiveElementMemod = React.memo(ProgressiveElement) as typeof ProgressiveElement;
export const ProgressiveElementAnimatedMemod = React.memo(ProgressiveElementAnimated) as typeof ProgressiveElementAnimated;

export type ProgressiveRendererRenderItem<T> = (x: T, idx: number) => React.ReactNode
export function ProgressiveRenderer<T>({ style, fullData, renderItem, animatedOpacitySpawnDuration, initHeight }: {
  style?: ViewStyle, fullData: readonly T[],
  renderItem: ProgressiveRendererRenderItem<T>, animatedOpacitySpawnDuration?: number, initHeight?: number
}) {
  const [toDisplay, setToDisplay] = useState<readonly T[]>([]);
  const [passThroughData, setPassThroughData] = useState(false); // initially it uses todisplay, but then just becomes passthrough
  const eleStyle = passThroughData ? style : { ...style, height: initHeight };

  useEffect(() => {
    if (toDisplay.length === fullData.length && !passThroughData) {
      // it has full elements, let it recalculate height as it was previously defined.
      setPassThroughData(true);
    }
  }, [toDisplay, passThroughData, fullData])

  useEffect(() => {
    if (fullData.length > 0 && toDisplay.length === 0) {
      setToDisplay([fullData[0]])
    }
  }, [setToDisplay, fullData, toDisplay])

  const addToList = useCallback(() => {
    setToDisplay((prev) => {
      if (prev.length >= fullData.length)
        return prev;

      return [...prev, fullData[prev.length]];
    })
  }, [fullData])


  const toRender = passThroughData ? fullData : toDisplay;

  if (animatedOpacitySpawnDuration)
    return (
      <View style={eleStyle}>
        {toRender.map((e, idx) =>
          <ProgressiveElementAnimatedMemod Component={renderItem} item={e} onRender={passThroughData ? undefined : addToList}
            key={idx} animDuration={animatedOpacitySpawnDuration} idx={idx} />
        )}
      </View>
    )

  return (
    <View style={eleStyle}>
      {toRender.map((e, idx) =>
        <ProgressiveElementMemod Component={renderItem} item={e} onRender={passThroughData ? undefined : addToList} key={idx} idx={idx} />
      )}
    </View>
  )
}