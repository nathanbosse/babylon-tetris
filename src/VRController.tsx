import React, { useEffect, useRef } from 'react'
import { useScene, WebXRDefaultExperience } from 'react-babylonjs'
import { Vector3, Color3 } from '@babylonjs/core'
import * as BABYLON from 'babylonjs'
import { UI_GAME_BOARD_LAYER } from './constants'

const VRController = ({ scene }) => {
  const controllerMeshRef = useRef(null)
  const layerMask = UI_GAME_BOARD_LAYER
  useEffect(() => {
    if (scene) {
      const setupXR = async () => {
        const xr = await scene.createDefaultXRExperienceAsync({
          // Floor meshes or other configuration options can be defined here
        })

        xr.input.onControllerAddedObservable.add((controller) => {
          // Create a visual representation for the controller
          if (!controllerMeshRef.current) {
            controllerMeshRef.current = MeshBuilder.CreateSphere('controllerSphere', { diameter: 0.1 }, scene)
            controllerMeshRef.current.layerMask = layerMask
          }

          // Update the position of the controller visual each frame
          controller.onFrameObservable.add(() => {
            if (controllerMeshRef.current) {
              controllerMeshRef.current.position = controller.pointer.position
            }
          })
        })
      }

      setupXR().catch(console.error)
    }
  }, [scene, layerMask])

  return null // This component does not render any React elements
}
export { VRController } //VRController;
