import { useState, useEffect } from 'react'
import { Scene } from '@babylonjs/core'

export const useIsRightCamera = (scene: Scene | null) => {
  const [isRightCamera, setIsRightCamera] = useState(false)

  useEffect(() => {
    if (scene) {
      // Define the callback function to update state based on camera
      const updateCameraSide = (camera) => {
        setIsRightCamera(camera.isRightCamera)
      }

      // Subscribe to the observable to listen for camera changes
      scene.onBeforeCameraRenderObservable.add(updateCameraSide)

      // Cleanup: unsubscribe from the observable when the component unmounts or when scene changes
      return () => scene.onBeforeCameraRenderObservable.remove(updateCameraSide)
    }
  }, [scene])

  return isRightCamera
}
