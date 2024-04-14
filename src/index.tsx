/* eslint-disable */

import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Engine, Scene } from 'react-babylonjs'
import * as BABYLON from 'babylonjs'
import '@babylonjs/loaders'
import '@babylonjs/gui' // Make sure to import the GUI

import { Vector3 } from '@babylonjs/core'
import { createInitialGameState, update, moveBlock, rotateBlock } from './TetrisGame'
import { CreateTetrisBlocks } from './CreateTetrisBlocks'
import { CreateGridBoundary } from './CreateGridBoundary'
import { VRController } from './VRController'
import { Scoreboard } from './Scoreboard'
import { LEFT_EYE_LAYER, RIGHT_EYE_LAYER, UI_GAME_BOARD_LAYER } from './constants'
// @ts-nocheck
const initialState = createInitialGameState()
const App = () => {
  const [gameState, setGameState] = useState(initialState)
  const [scene, setScene] = useState(null)

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
  const handleKeyPress = (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        // Attempt to move the block left
        setGameState((currentGameState) => moveBlock(currentGameState, -1, 0))
        break
      case 'ArrowRight':
        // Attempt to move the block right
        setGameState((currentGameState) => moveBlock(currentGameState, 1, 0))
        break
      case 'ArrowDown':
        // Attempt to move the block down faster
        setGameState((currentGameState) => update(currentGameState))
        break
      case 'ArrowUp':
        // Attempt to move the block down faster
        setGameState((currentGameState) => rotateBlock(currentGameState))
        break
      default:
        break
    }
  }

  useEffect(() => {
    // Add event listener when the component mounts
    window.addEventListener('keydown', handleKeyPress)

    return () => {
      // Remove event listener when the component unmounts
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  //@ts-ignore
  return (
    <Engine antialias adaptToDeviceRatio canvasId="babylon-canvas">
      <Scene
        onSceneMount={({ scene }) => {
          setScene(scene)
        }}>
        <arcRotateCamera name="camera" alpha={-Math.PI / 2} beta={Math.PI / 2} radius={25} target={Vector3.Zero()} />
        <hemisphericLight name="light" direction={new Vector3(1, 1, 0)} intensity={0.7} />
        <vrExperienceHelper webVROptions={{ createDeviceOrientationCamera: false }} enableInteractions={true} />
        <Scoreboard gameState={gameState} />
        <CreateGridBoundary />
        <VRController scene={scene} />
        <CreateTetrisBlocks gameState={gameState} />
      </Scene>
    </Engine>
  )
}

const rootElement = document.getElementById('root')
if (rootElement) {
  const root = createRoot(rootElement)
  // @ts-ignore
  root.render(<App />)
}
