import React, { useEffect, useRef } from 'react'
import { useScene } from 'react-babylonjs'
import { Vector3, MeshBuilder } from '@babylonjs/core'
import * as BABYLON from 'babylonjs'
import { UI_GAME_BOARD_LAYER } from './constants'

const VRController = ({ scene, controllerInput }) => {
  const controllerMeshRef = useRef(null)
  const layerMask = UI_GAME_BOARD_LAYER
  const [XREnabled, setXREnabled] = React.useState(false)

  const debouncedDown = useRef(rateLimit(() => controllerInput('down'), 500)).current
  const debouncedLeft = useRef(rateLimit(() => controllerInput('left'), 500)).current
  const debouncedRight = useRef(rateLimit(() => controllerInput('right'), 500)).current
  const upFired = useRef(false)

  useEffect(() => {
    if (scene && !XREnabled) {
      const setupXR = async () => {
        const xr = await scene.createDefaultXRExperienceAsync({})
        console.log('WebXR initialized successfully:', xr)
        const xrCamera = xr.baseExperience.camera
        xr.baseExperience.sessionManager.onXRSessionInit.add(() => {
          setXREnabled(true)
          xr.baseExperience.camera.position = new BABYLON.Vector3(0, 5, -10)
        })

        xr.baseExperience.sessionManager.onXRSessionEnded.add(() => {
          setXREnabled(false)
          console.log('XR Session Ended')
        })

        xr.input.onControllerAddedObservable.add((controller) => {
          controller.onMotionControllerInitObservable.add((motionController) => {
            if (motionController.handedness === 'right') {
              const rightJoystick = motionController.getComponent('xr-standard-thumbstick')
              if (rightJoystick) {
                rightJoystick.onAxisValueChangedObservable.clear()
                rightJoystick.onAxisValueChangedObservable.add((values) => {
                  handleRightJoystickInput(values)
                })
              }
            } else if (motionController.handedness === 'left') {
              const leftJoystick = motionController.getComponent('xr-standard-thumbstick')
              if (leftJoystick) {
                leftJoystick.onAxisValueChangedObservable.add((values) => {
                  handleLeftJoystickMovement(values, xr.baseExperience.camera)
                })
              }
            }
          })
        })
      }

      setupXR().catch(console.error)
    }
  }, [scene, controllerInput, debouncedDown, debouncedLeft, debouncedRight])

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
    if (values.y > -0.5) {
      debouncedDown()
      upFired.current = false
    } else if (values.y < 0.5) {
      if (!upFired.current) {
        controllerInput('up')
        upFired.current = true
      }
    } else {
      upFired.current = false
    }

    if (values.x < -0.5) {
      debouncedLeft()
    } else if (values.x > 0.5) {
      debouncedRight()
    }
  }

  return null
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
