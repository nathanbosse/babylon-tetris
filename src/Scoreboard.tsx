import * as React from 'react'
import { Plane, AdvancedDynamicTexture, StackPanel, Rectangle, Button, TextBlock } from 'react-babylonjs'
import { Vector3 } from '@babylonjs/core'
import { UI_GAME_BOARD_LAYER } from './constants'

export const Scoreboard = ({ gameState }) => {
  const { linesCleared } = gameState
  const onStart = () => {
    alert('onStart')
  }
  const onReset = () => {
    alert('onReset')
  }
  let layerMask = UI_GAME_BOARD_LAYER

  return (
    <Plane
      name="scoreboard-plane"
      size={5} // Ensure this is large enough to accommodate your GUI elements
      position={new Vector3(-7, 3, 0)} // Adjust position to ensure visibility
      layerMask={layerMask}>
      <AdvancedDynamicTexture name="scoreboard-texture" createForParentMesh={true}>
        <Rectangle
          name="scoreboard-rect"
          heightInPixels={550} // Using heightInPixels and widthInPixels ensures direct pixel control
          widthInPixels={500}
          thickness={2}
          cornerRadius={20}
          background="green">
          <StackPanel widthInPixels={1000} heightInPixels={350} isVertical={true}>
            <Button name="scoreButton" widthInPixels={320} heightInPixels={100} background="black">
              <TextBlock text={`Score: ${linesCleared}`} color="white" fontSize={24} />
            </Button>
            <Button name="resetButton" widthInPixels={320} heightInPixels={100} background="red" onPointerDownObservable={onReset}>
              <TextBlock text="Reset" color="white" fontSize={24} />
            </Button>
            <Button name="startButton" widthInPixels={320} heightInPixels={100} background="blue" onPointerDownObservable={onStart}>
              <TextBlock text="Start" color="white" fontSize={24} />
            </Button>
          </StackPanel>
        </Rectangle>
      </AdvancedDynamicTexture>
    </Plane>
  )
}
