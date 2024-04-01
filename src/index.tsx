import React, { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import * as BABYLON from 'babylonjs'
import 'babylonjs-loaders'
import '@babylonjs/core/Debug/debugLayer'
import '@babylonjs/inspector'
import { Scene } from '@babylonjs/core'

import { TetrisGame, GRID_START_POS, GRID_CELL_SIZE } from './TetrisGame'

const App = () => {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current) {
      const engine = new BABYLON.Engine(canvasRef.current, true)
      engineRef.current = engine

      const scene: BABYLON.Scene = new BABYLON.Scene(engine)
      const camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2, 5, new BABYLON.Vector3(0, 1, 0), scene)
      camera.attachControl(canvasRef.current, true)
      const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0), scene)

      // VR Experience
      const vrHelper = scene.createDefaultVRExperience({ createDeviceOrientationCamera: false })
      vrHelper.enableInteractions()

      // Box Mesh
      // const box = BABYLON.MeshBuilder.CreateBox('box', { size: 1 }, scene)
      const material = new BABYLON.StandardMaterial('boxMat', scene)
      // box.material = material

      const tetrisGame = new TetrisGame()

      engine.runRenderLoop(() => {
        scene.render()
        tetrisGame.update() // Move the current block down
        // Update block meshes based on the new game state
      })

      // Call this function after initializing your scene and before starting the game loop
      createGridBoundary(scene)

      // Alternate color based on the camera (eye) rendering the frame
      scene.onBeforeCameraRenderObservable.add((camera) => {
        let isRightCamera = camera.isRightCamera
        console.log('isRightCamera ', isRightCamera)
        material.diffuseColor = isRightCamera ? new BABYLON.Color3(0, 0, 1) : new BABYLON.Color3(1, 0, 0)
        // Example: Creating a mesh for the current Tetris block
        // tetrisGame.currentBlock.shape.forEach(([x, y]) => {
        //   const box = BABYLON.MeshBuilder.CreateBox('block', { size: 1 }, scene)
        //   box.position.x = x + tetrisGame.currentBlock.position.x
        //   box.position.y = !isRightCamera ? y + tetrisGame.currentBlock.position.y : -1000
        //   box.isVisible = !isRightCamera ? true : false
        //   // Adjust materials or visibility based on game state and VR eye rendering
        // })
        tetrisGame.currentBlock.blocks.forEach((block) => {
          const mesh = BABYLON.MeshBuilder.CreateBox('block', { size: 1 }, scene)
          // Translate grid coordinates (block.x, block.y) to world space
          mesh.position.x = GRID_START_POS.x + block.x * GRID_CELL_SIZE
          mesh.position.y = GRID_START_POS.y - block.y * GRID_CELL_SIZE // Assuming y=0 is at the top of the grid
          mesh.position.z = 0
          mesh.isVisible = !isRightCamera ? true : false
        })
      })

      engine.runRenderLoop(() => {
        scene.render()
        tetrisGame.update() // Move the current block down

        tetrisGame.updateBlockMeshes(scene)
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

function createGridBoundary(scene) {
  const thickness = 0.1 // Thickness of the boundary lines
  const height = GRID_CELL_SIZE * 20 // Assuming 20 rows
  const width = GRID_CELL_SIZE * 10 // Assuming 10 columns

  // Calculate positions based on GRID_START_POS and grid size
  const topPositionY = GRID_START_POS.y + GRID_CELL_SIZE
  const bottomPositionY = GRID_START_POS.y - height
  const leftPositionX = GRID_START_POS.x - GRID_CELL_SIZE * 0.5
  const rightPositionX = GRID_START_POS.x + width - GRID_CELL_SIZE * 0.5

  // Top boundary
  BABYLON.MeshBuilder.CreateBox(
    'topBoundary',
    {
      width: width + GRID_CELL_SIZE, // Slightly wider to cover corners
      height: thickness,
      depth: GRID_CELL_SIZE
    },
    scene
  ).position = new BABYLON.Vector3(GRID_START_POS.x + width / 2 - GRID_CELL_SIZE / 2, topPositionY, 0)

  // Bottom boundary
  BABYLON.MeshBuilder.CreateBox(
    'bottomBoundary',
    {
      width: width + GRID_CELL_SIZE, // Slightly wider to cover corners
      height: thickness,
      depth: GRID_CELL_SIZE
    },
    scene
  ).position = new BABYLON.Vector3(GRID_START_POS.x + width / 2 - GRID_CELL_SIZE / 2, bottomPositionY, 0)

  // Left boundary
  BABYLON.MeshBuilder.CreateBox(
    'leftBoundary',
    {
      width: thickness,
      height: height + GRID_CELL_SIZE, // Slightly taller to cover corners
      depth: GRID_CELL_SIZE
    },
    scene
  ).position = new BABYLON.Vector3(leftPositionX, GRID_START_POS.y - height / 2 + GRID_CELL_SIZE / 2, 0)

  // Right boundary
  BABYLON.MeshBuilder.CreateBox(
    'rightBoundary',
    {
      width: thickness,
      height: height + GRID_CELL_SIZE, // Slightly taller to cover corners
      depth: GRID_CELL_SIZE
    },
    scene
  ).position = new BABYLON.Vector3(rightPositionX, GRID_START_POS.y - height / 2 + GRID_CELL_SIZE / 2, 0)
}
