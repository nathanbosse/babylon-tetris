import React, { useEffect, useState, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { Engine, Scene, useScene } from 'react-babylonjs'
import * as BABYLON from 'babylonjs'
import '@babylonjs/loaders'
import { Vector3, Color3, WebXRDefaultExperience } from '@babylonjs/core'
import { createInitialGameState, updateBlockMeshes, update, GRID_START_POS, GRID_CELL_SIZE } from './TetrisGame'

const App = () => {
  // Initialize the Tetris game logic here, if necessary
  const [gameState, setGameState] = useState(createInitialGameState())
  const [scene, setScene] = useState(null)
  const [isRightCamera, setIsRightCamera] = useState(true)
  const [secondsElapsed, setSecondsElapsed] = useState(0)
  // useEffect(() => {
  //   if (!scene) return

  //   const onBeforeRender = (camera) => {
  //     let isRightCamera = camera.isRightCamera
  //     console.log('isRightCamera', isRightCamera)
  //     setIsRightCamera(isRightCamera)
  //     // Assuming you have a way to access your material here
  //     // This example assumes a global or context-accessible material for demonstration
  //     // globalMaterial.diffuseColor = isRightCamera ? new Color3(0, 0, 1) : new Color3(1, 0, 0);
  //     // Update your game state or perform actions based on the camera
  //     setGameState(
  //   }

  //   scene.onBeforeCameraRenderObservable.add(onBeforeRender)

  //   return () => {
  //     scene.onBeforeCameraRenderObservable.removeCallback(onBeforeRender)
  //   }
  // }, [scene, secondsElapsed, gameState])

  useEffect(() => {
    // Automatic game update, e.g., moving blocks down periodically
    const intervalId = setInterval(() => {
      if (scene) {
        // Assuming isRightCamera can be determined or managed via React state

        setGameState((prevGameState) => {
          let newGameState = update(prevGameState, scene, true) // Assuming isRightCamera can be determined or managed via React state
          newGameState = updateBlockMeshes(newGameState, scene, true)
          return newGameState // This now correctly bases the new state on the previous state
        })
      }
    }, 1000) // Adjust timing as needed

    return () => clearInterval(intervalId)
  }, [scene])

  // }, [gameState, secondsElapsed])

  // console.log(isRightCamera)

  return (
    <Engine antialias adaptToDeviceRatio canvasId="babylon-canvas">
      <Scene
        onSceneMount={({ scene }) => {
          setScene(scene)
        }}>
        <arcRotateCamera name="camera" alpha={-Math.PI / 2} beta={Math.PI / 2} radius={10} target={Vector3.Zero()} />
        <hemisphericLight name="light" direction={new Vector3(1, 1, 0)} intensity={0.7} />
        {/* Render grid boundaries using react-babylonjs components */}
        <vrExperienceHelper webVROptions={{ createDeviceOrientationCamera: false }} enableInteractions={true} />
        <CreateGridBoundary />
        <CreateTetrisBlocks tetrisGame={gameState} />
      </Scene>
    </Engine>
  )
}

const CreateTetrisBlocks = ({ tetrisGame }) => {
  const scene = useScene()
  const meshRefs = useRef([])

  // useEffect(() => {
  //   if (scene) {
  //     const onBeforeCameraRender = (camera) => {
  //       const isRightCamera = camera.isRightCamera

  //       // Update mesh visibility directly
  //       meshRefs.current.forEach((mesh) => {
  //         if (mesh) {
  //           mesh.isVisible = isRightCamera
  //         }
  //       })
  //     }


  //     scene.onBeforeCameraRenderObservable.add(onBeforeCameraRender)

  //     // Clean-up function to remove the observable on component unmount
  //     return () => scene.onBeforeCameraRenderObservable.remove(onBeforeCameraRender)
  //   }
  // }, [scene])

  useEffect(() => {
    // Clean up old meshes if they exist
    return () => meshRefs.current.forEach((mesh) => mesh.dispose())
  }, []) // Run once on mount

  return (
    <>
      {tetrisGame.currentBlock.blocks.map((block, index) => (
        <Box
          keby={index}
          name={`block-${index}`}
          size={GRID_CELL_SIZE}
          isVisible={true} // Control visibility based on state
          position={new Vector3(GRID_START_POS.x + block.x * GRID_CELL_SIZE, GRID_START_POS.y - block.y * GRID_CELL_SIZE, 0)}
          color={Color3.Random()}
        />
      ))}
    </>
  )
}

const CreateGridBoundary = () => {
  const thickness = 0.1 // Thickness of the boundary lines
  const height = GRID_CELL_SIZE * 20 // Assuming 20 rows, each GRID_CELL_SIZE units tall
  const width = GRID_CELL_SIZE * 10 // Assuming 10 columns, each GRID_CELL_SIZE units wide

  // Positions are adjusted based on your earlier specifications
  const topPositionY = GRID_START_POS.y + GRID_CELL_SIZE / 2
  const bottomPositionY = GRID_START_POS.y - height - GRID_CELL_SIZE / 2
  const leftPositionX = GRID_START_POS.x - GRID_CELL_SIZE / 2
  const rightPositionX = GRID_START_POS.x + width - GRID_CELL_SIZE / 2

  return (
    <>
      {/* Top Boundary */}
      <box
        name="topBoundary"
        width={width}
        height={thickness}
        depth={1}
        position={new Vector3(GRID_START_POS.x + width / 2 - GRID_CELL_SIZE / 2, topPositionY, 0)}
        color={new Color3(1, 0, 0)}
      />

      {/* Bottom Boundary */}
      <box
        name="bottomBoundary"
        width={width}
        height={thickness}
        depth={1}
        position={new Vector3(GRID_START_POS.x + width / 2 - GRID_CELL_SIZE / 2, bottomPositionY, 0)}
        color={new Color3(1, 0, 0)}
      />

      {/* Left Boundary */}
      <box
        name="leftBoundary"
        width={thickness}
        height={height + GRID_CELL_SIZE}
        depth={1}
        position={new Vector3(leftPositionX, GRID_START_POS.y - height / 2, 0)}
        color={new Color3(1, 0, 0)}
      />

      {/* Right Boundary */}
      <box
        name="rightBoundary"
        width={thickness}
        height={height + GRID_CELL_SIZE}
        depth={1}
        position={new Vector3(rightPositionX, GRID_START_POS.y - height / 2, 0)}
        color={new Color3(1, 0, 0)}
      />
    </>
  )
}

export default CreateGridBoundary

// Render your app
const rootElement = document.getElementById('root')
if (rootElement) {
  const root = createRoot(rootElement)
  root.render(<App />)
}
