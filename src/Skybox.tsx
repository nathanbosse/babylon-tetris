import React, { useEffect } from 'react'
import { useScene } from 'react-babylonjs'
import { SkyMaterial } from '@babylonjs/materials/sky'
import { Vector3, MeshBuilder, Quaternion, Color3 } from '@babylonjs/core'
import '@babylonjs/materials' // This might be needed for SkyMaterial
import { UI_GAME_BOARD_LAYER } from './constants'
const Skybox = ({ scene }) => {
  useEffect(() => {
    if (scene) {
      const skyMaterial = new SkyMaterial('skyMaterial', scene)
      skyMaterial.backFaceCulling = false

      // Adjust properties of the SkyMaterial as needed
      skyMaterial.backFaceCulling = false
      skyMaterial.turbidity = 5 // Controls the horizon appearance
      skyMaterial.luminance = 1 // Overall brightness
      skyMaterial.rayleigh = 2 // Controls the atmospheric scattering
      skyMaterial.mieCoefficient = 0.005 // Amount of directional scattering
      skyMaterial.mieDirectionalG = 0.8 // The directionality of the scattering
      const skybox = MeshBuilder.CreateBox('skyBox', { size: 1000.0 }, scene)
      skybox.position = Vector3.Zero() // Position the skybox at the scene origin

      // Rotate the skybox by 180 degrees around the Y-axis to face the camera
      const rotationQuaternion = Quaternion.RotationAxis(Vector3.Forward(), Math.PI)
      skybox.rotationQuaternion = rotationQuaternion

      skybox.material = skyMaterial
      skybox.infiniteDistance = true
      skybox.layerMask = UI_GAME_BOARD_LAYER
    }
  }, [scene])

  return null // Since this component does not render any JSX
}

export { Skybox } // Export the SkyboxComponent;
