import React, { useEffect, useRef } from 'react'
import { useScene } from 'react-babylonjs'
import { Vector3, MeshBuilder } from '@babylonjs/core'
import * as BABYLON from 'babylonjs'
import { UI_GAME_BOARD_LAYER } from './constants'

const VRController = ({ scene, controllerInput }) => {
  const controllerMeshRef = useRef(null)
  const layerMask = UI_GAME_BOARD_LAYER
  const [XREnabled, setXREnabled] = React.useState(false)
  useEffect(() => {
    if (scene && !XREnabled) {
      const setupXR = async () => {
        const xr = await scene.createDefaultXRExperienceAsync({})
        console.log('WebXR initialized successfully:', xr)
        const xrCamera = xr.baseExperience.camera
        xr.baseExperience.sessionManager.onXRSessionInit.add(() => {
          // Adjustments right when the XR session starts
          setXREnabled(true) // Assuming you pass a setter or manage state at a higher level
          xr.baseExperience.camera.position = new BABYLON.Vector3(0, 5, -10)
        })

        xr.baseExperience.sessionManager.onXRSessionEnded.add(() => {
          // This event indicates XR is ending
          setXREnabled(false) // Update state accordingly
          console.log('XR Session Ended')
        })

        xr.input.onControllerAddedObservable.add((controller) => {
          controller.onMotionControllerInitObservable.add((motionController) => {
            if (motionController.handedness === 'right') {
              // Handle custom right joystick input (for actions other than camera movement)
              const rightJoystick = motionController.getComponent('xr-standard-thumbstick')
              if (rightJoystick) {
                rightJoystick.onAxisValueChangedObservable.clear()
                rightJoystick.onAxisValueChangedObservable.add((values) => {
                  handleRightJoystickInput(values)
                })
              }
            } else if (motionController.handedness === 'left') {
              // Handle locomotion with the left joystick
              const leftJoystick = motionController.getComponent('xr-standard-thumbstick')
              if (leftJoystick) {
                leftJoystick.onAxisValueChangedObservable.add((values) => {
                  handleLeftJoystickMovement(values, xr.baseExperience.camera)
                })
              }
            }

            // controller.onFrameObservable.add(() => {
            //   if (controllerMeshRef.current) {
            //     controllerMeshRef.current.position = controller.pointer.position
            //   }
            // })
          })
        })
      }

      setupXR().catch(console.error)
    }
  }, [scene, controllerInput])

  function handleLeftJoystickMovement(values, camera) {
    const speed = 0.05
    let forward = new BABYLON.Vector3(Math.sin(camera.rotation.y) * speed * values.y, 0, Math.cos(camera.rotation.y) * speed * values.y)
    let right = new BABYLON.Vector3(
      Math.sin(camera.rotation.y + Math.PI / 2) * speed * values.x,
      0,
      Math.cos(camera.rotation.y + Math.PI / 2) * speed * values.x
    )
    camera.position.addInPlace(forward.addInPlace(right))
  }

  const handleRightJoystickInput = (values) => {
    const debouncedDown = rateLimit(() => controllerInput('down'), 500) // Fire down event at most twice per second
    const debouncedLeft = rateLimit(() => controllerInput('left'), 500) // Fire left event at most twice per second
    const debouncedRight = rateLimit(() => controllerInput('right'), 500) // Fire right event at most twice per second
    let upFired = false // State to track if 'up' has been fired

    const fireOnceUp = () => {
      if (!upFired) {
        controllerInput('up')
        upFired = true
      }
    }

    const resetUp = () => {
      upFired = false
    }

    if (values.y < -0.5) {
      // Down
      debouncedDown()
      resetUp() // Reset 'up' when moving in any other direction
    } else if (values.y > 0.5) {
      // Up
      fireOnceUp()
    } else {
      // Neutral position, reset the 'up' fire state
      resetUp()
    }

    if (values.x < -0.5) {
      // Left
      debouncedLeft()
    } else if (values.x > 0.5) {
      // Right
      debouncedRight()
    }
  }

  return null // This component does not render any React elements
}

export { VRController }

function rateLimit(func, interval) {
  let lastExecuted = 0
  return function () {
    const now = Date.now()
    if (now - lastExecuted > interval) {
      func.apply(this, arguments)
      lastExecuted = now
    }
  }
}
