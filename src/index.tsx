import React, { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import * as BABYLON from 'babylonjs'
import 'babylonjs-loaders'
import '@babylonjs/core/Debug/debugLayer'
import '@babylonjs/inspector'

const App = () => {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current) {
      const engine = new BABYLON.Engine(canvasRef.current, true)
      engineRef.current = engine

      const scene = new BABYLON.Scene(engine)
      const camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2, 5, new BABYLON.Vector3(0, 1, 0), scene)
      camera.attachControl(canvasRef.current, true)
      const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0), scene)

      // VR Experience
      const vrHelper = scene.createDefaultVRExperience({ createDeviceOrientationCamera: false })
      vrHelper.enableInteractions()

      // Box Mesh
      const box = BABYLON.MeshBuilder.CreateBox('box', { size: 2 }, scene)
      const material = new BABYLON.StandardMaterial('boxMat', scene)
      box.material = material

      // Alternate color based on the camera (eye) rendering the frame
      scene.onBeforeCameraRenderObservable.add((camera) => {
        let isRightCamera = camera.isRightCamera
        material.diffuseColor = isRightCamera ? new BABYLON.Color3(0, 0, 1) : new BABYLON.Color3(1, 0, 0)
      })

      engine.runRenderLoop(() => {
        scene.render()
      })

      return () => {
        engine.dispose()
      }
    }
  }, [])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }}></canvas>
}

// Render your app
//@ts-ignore
const root = createRoot(document.getElementById('root'))
//@ts-ignore
root.render(<App />)
