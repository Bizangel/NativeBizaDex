import { useEffect } from "react"
import { BackHandler } from "react-native"

export function useBackHandler(handler: () => boolean) {
  useEffect(() => {
    const backhandler = BackHandler.addEventListener('hardwareBackPress', handler)

    return () => backhandler.remove();
  }, [handler])
}
