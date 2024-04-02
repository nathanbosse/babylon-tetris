import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Engine, Scene } from 'react-babylonjs'
import * as BABYLON from 'babylonjs'
import '@babylonjs/loaders'
import { Vector3 } from '@babylonjs/core'
import { createInitialGameState, updateBlockMeshes, update } from './TetrisGame'
import { CreateTetrisBlocks } from './CreateTetrisBlocks'
import { CreateGridBoundary } from './CreateGridBoundary'

const LEFT_EYE_LAYER = 0x10000000 // Bitmask for the left eye layer
const RIGHT_EYE_LAYER = 0x20000000 // Bitmask for the right eye layer
const UI_GAME_BOARD_LAYER = 0x40000000 // Bitmask for UI/game board layer
const App = () => {
  const [gameState, setGameState] = useState(createInitialGameState())
  const [scene, setScene] = useState(null)
  const [isRightCamera, setIsRightCamera] = useState(true)

  useEffect(() => {
    if (!scene) return

    const onBeforeRender = scene.onBeforeCameraRenderObservable.add((camera) => {
      if (camera.isRightCamera) {
        camera.layerMask = RIGHT_EYE_LAYER | UI_GAME_BOARD_LAYER
      } else {
        camera.layerMask = LEFT_EYE_LAYER | UI_GAME_BOARD_LAYER
      }
    })
    return () => {
      scene.onBeforeCameraRenderObservable.removeCallback(onBeforeRender)
    }
  }, [scene, gameState])

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (scene) {
        setGameState((prevGameState) => {
          let newGameState = update(prevGameState, scene, true)
          newGameState = updateBlockMeshes(newGameState, scene, true)
          return newGameState
        })
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [scene])

  return (
    <Engine antialias adaptToDeviceRatio canvasId="babylon-canvas">
      <Scene
        onSceneMount={({ scene }) => {
          setScene(scene)
        }}>
        <arcRotateCamera name="camera" alpha={-Math.PI / 2} beta={Math.PI / 2} radius={10} target={Vector3.Zero()} />
        <hemisphericLight name="light" direction={new Vector3(1, 1, 0)} intensity={0.7} />
        <vrExperienceHelper webVROptions={{ createDeviceOrientationCamera: false }} enableInteractions={true} />
        <CreateGridBoundary />
        <CreateTetrisBlocks tetrisGame={gameState} isRightCamera={isRightCamera} />
      </Scene>
    </Engine>
  )
}

const rootElement = document.getElementById('root')
if (rootElement) {
  const root = createRoot(rootElement)
  root.render(<App />)
}
