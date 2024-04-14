import React, { useEffect, useRef } from 'react'
import { useScene } from 'react-babylonjs'
import { Vector3, MeshBuilder } from '@babylonjs/core'
import { UI_GAME_BOARD_LAYER } from './constants'

const VRController = ({ scene, controllerInput }) => {
  const controllerMeshRef = useRef(null)
  const layerMask = UI_GAME_BOARD_LAYER

  useEffect(() => {
    if (scene) {
      const setupXR = async () => {
        const xr = await scene.createDefaultXRExperienceAsync({
          // Additional options can be specified here
        })

        xr.input.onControllerAddedObservable.add((controller) => {
          controller.onMotionControllerInitObservable.add((motionController) => {
            if (!controllerMeshRef.current) {
              controllerMeshRef.current = MeshBuilder.CreateSphere('controllerSphere', { diameter: 0.1 }, scene)
              controllerMeshRef.current.layerMask = layerMask
              controllerMeshRef.current.material = new BABYLON.StandardMaterial('controllerMat', scene)
              controllerMeshRef.current.material.diffuseColor = new BABYLON.Color3(1, 0, 0)
            }

            const joystick = motionController.getComponent('xr-standard-thumbstick')
            joystick.onAxisValueChangedObservable.add((values) => {
              if (values.y < -0.5) {
                // Down
                controllerInput('down')
              } else if (values.y > 0.5) {
                // Up
                controllerInput('up')
              }

              if (values.x < -0.5) {
                // Left
                controllerInput('left')
              } else if (values.x > 0.5) {
                // Right
                controllerInput('right')
              }
            })

            controller.onFrameObservable.add(() => {
              if (controllerMeshRef.current) {
                controllerMeshRef.current.position = controller.pointer.position
              }
            })
          })
        })
      }

      setupXR().catch(console.error)
    }
  }, [scene, controllerInput])

  return null // This component does not render any React elements
}

export { VRController }
